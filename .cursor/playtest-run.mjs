/**
 * One-off local Foundry playtest (not committed). Reads .cursor/local-foundry-test.json
 */
import { readFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(__dirname, "local-foundry-test.json"), "utf8"));
const screenshotDir = join(__dirname, "playtest-screenshots");
mkdirSync(screenshotDir, { recursive: true });

const report = {
  loginStatus: "unknown",
  userExists: null,
  foundryVersion: null,
  systemVersion: null,
  checklist: {},
  consoleErrors: [],
  screenshots: [],
  humanSetupSteps: null,
};

function shot(page, name) {
  const path = join(screenshotDir, `${name}.png`);
  return page.screenshot({ path, fullPage: true }).then(() => {
    report.screenshots.push(path);
    return path;
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") report.consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => report.consoleErrors.push(String(err)));

  const base = cfg.baseUrl.replace(/\/$/, "");

  // --- Join / login ---
  await page.goto(`${base}/join`, { waitUntil: "networkidle", timeout: 60000 });
  await shot(page, "01-join-initial");

  const usernameSel =
    'input[name="username"], input[name="name"], #username, [data-action="login"] ~ input, form.login input[type="text"]';
  const passwordSel = 'input[name="password"], #password, input[type="password"]';

  await page.waitForTimeout(2000);
  const hasUser = (await page.locator(usernameSel).count()) > 0;
  const hasPass = (await page.locator(passwordSel).count()) > 0;

  if (!hasUser || !hasPass) {
    report.loginStatus = "no_login_form";
    report.userExists = null;
    await shot(page, "02-join-no-form");
    await browser.close();
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  await page.locator(usernameSel).first().fill(cfg.username);
  await page.locator(passwordSel).first().fill(cfg.password);

  const joinBtn = page.locator(
    'button[data-action="join"], button[type="submit"], button:has-text("Join Game"), button:has-text("Log In"), button:has-text("Join")'
  );
  if ((await joinBtn.count()) > 0) {
    await joinBtn.first().click();
  } else {
    await page.locator(passwordSel).first().press("Enter");
  }

  await page.waitForTimeout(3000);
  await shot(page, "02-after-login-attempt");

  const bodyText = await page.locator("body").innerText().catch(() => "");
  const url = page.url();

  if (
    /invalid|incorrect|failed|denied|not found|does not exist|unknown user/i.test(bodyText) ||
    /auth/i.test(url) && !/game/i.test(url)
  ) {
    report.loginStatus = "failed";
    report.userExists = false;

    await page.goto(`${base}/setup`, { waitUntil: "networkidle", timeout: 60000 });
    await shot(page, "03-setup-page");
    report.humanSetupSteps = [
      "Open Foundry Setup at http://localhost:30000/setup (admin session required).",
      "Go to Configuration → User Management.",
      `Create user "${cfg.username}" with role Gamemaster and set a password (store it in .cursor/local-foundry-test.json).`,
      "Return to /join and retry login.",
      "Do not guess the setup admin password — use the password you configured when installing Foundry.",
    ];

    await browser.close();
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  // World selection
  const worldTitle = cfg.worldTitle;
  const worldRow = page.locator(`li.world, .world, [data-world]`).filter({ hasText: worldTitle });
  if ((await worldRow.count()) === 0) {
    const anyWorld = page.locator(`text=${worldTitle}`);
    if ((await anyWorld.count()) > 0) {
      await anyWorld.first().click();
    } else {
      report.loginStatus = "logged_in_no_world";
      await shot(page, "03-world-not-found");
      await browser.close();
      console.log(JSON.stringify(report, null, 2));
      return;
    }
  } else {
    await worldRow.first().click();
  }

  const launchBtn = page.locator(
    'button[data-action="launchWorld"], button:has-text("Launch World"), button:has-text("Play")'
  );
  if ((await launchBtn.count()) > 0) await launchBtn.first().click();
  else await page.locator(`text=${worldTitle}`).dblclick().catch(() => {});

  await page.waitForTimeout(5000);
  try {
    await page.waitForSelector("#sidebar, #ui-left, .app.sidebar", { timeout: 120000 });
  } catch {
    await shot(page, "04-game-load-timeout");
    report.loginStatus = "world_launch_timeout";
    await browser.close();
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  report.loginStatus = "success";
  report.userExists = true;
  await shot(page, "04-game-loaded");

  report.foundryVersion = await page.evaluate(() => globalThis.game?.release?.version ?? null);
  report.systemVersion = await page.evaluate(
    () => globalThis.game?.system?.version ?? document.querySelector('meta[name="system-version"]')?.content ?? null
  );

  // --- Minimum chargen smoke ---
  const checklist = report.checklist;

  // Compendiums (quick check)
  try {
    const compCount = await page.evaluate(async () => {
      const packs = ["ash-and-anvil.ancestries", "ash-and-anvil.classes", "ash-and-anvil.backgrounds", "ash-and-anvil.features"];
      const results = {};
      for (const id of packs) {
        const pack = game.packs.get(id);
        if (!pack) {
          results[id] = { found: false, count: 0 };
          continue;
        }
        const docs = await pack.getDocuments();
        results[id] = { found: true, count: docs.length };
      }
      return results;
    });
    checklist.compendiumSeed = compCount;
  } catch (e) {
    checklist.compendiumSeed = { error: String(e) };
  }

  // Create character actor
  try {
    const actorName = `Playtest ${Date.now().toString(36)}`;
    const actorId = await page.evaluate(async (name) => {
      const actor = await Actor.create({ name, type: "character" });
      return actor.id;
    }, actorName);
    checklist.createCharacter = { pass: !!actorId, actorId, actorName };
    await page.waitForTimeout(1500);

    await page.evaluate(async (id) => {
      const actor = game.actors.get(id);
      if (!actor) throw new Error("actor missing");
      await actor.sheet.render(true);
    }, actorId);
    await page.waitForTimeout(2000);
    await shot(page, "05-character-sheet");

    const chargenOpened = await page.evaluate(async (id) => {
      const actor = game.actors.get(id);
      const { ChargenWizard } = await import("/systems/ash-and-anvil/module/applications/chargen-wizard.mjs");
      await ChargenWizard.show(actor);
      return true;
    }, actorId);
    checklist.openChargen = { pass: chargenOpened };
    await page.waitForTimeout(2000);

    const wizard = page.locator(".chargen-wizard, #ash-anvil-chargen");
    if ((await wizard.count()) === 0) {
      await page.locator('[data-action="openChargen"]').first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1500);
    }

    async function clickNext() {
      const next = page.locator('.chargen-wizard [data-action="next"], [data-action="next"]');
      if ((await next.count()) > 0 && (await next.first().isEnabled())) {
        await next.first().click();
        return true;
      }
      return false;
    }

    async function selectFirstRadio() {
      const radio = page.locator('.chargen-wizard input[type="radio"]:not(:checked)').first();
      if ((await radio.count()) > 0) {
        await radio.check().catch(() => radio.click());
        return true;
      }
      return false;
    }

    const steps = [];
    for (let i = 0; i < 8; i++) {
      await selectFirstRadio();
      // class skills step
      const skillCb = page.locator('.chargen-wizard input[type="checkbox"]').first();
      if ((await skillCb.count()) > 0) await skillCb.check().catch(() => skillCb.click());
      await page.waitForTimeout(400);
      const finish = page.locator('[data-action="finish"]');
      if ((await finish.count()) > 0 && (await finish.first().isVisible())) {
        await finish.first().click();
        steps.push("finish");
        break;
      }
      const advanced = await clickNext();
      steps.push(advanced ? `next-${i}` : `stuck-${i}`);
      if (!advanced) break;
      await page.waitForTimeout(600);
    }
    checklist.wizardSteps = steps;
    await page.waitForTimeout(2000);
    await shot(page, "06-after-wizard");

    const sheetState = await page.evaluate((id) => {
      const a = game.actors.get(id);
      if (!a) return { error: "no actor" };
      return {
        buildComplete: a.system.buildComplete,
        ancestry: a.system.ancestry?.name ?? a.items.find((i) => i.type === "ancestry")?.name,
        className: a.system.class?.name ?? a.items.find((i) => i.type === "class")?.name,
        background: a.system.background?.name ?? a.items.find((i) => i.type === "background")?.name,
        abilities: a.system.abilities,
        hp: a.system.attributes?.hp,
        featureCount: a.items.filter((i) => i.type === "feature").length,
      };
    }, actorId);
    checklist.sheetAfterFinish = sheetState;
    checklist.chargenSmoke =
      sheetState.buildComplete && sheetState.ancestry && sheetState.className && sheetState.background
        ? "pass"
        : "partial_or_fail";
  } catch (e) {
    checklist.chargenError = String(e);
    await shot(page, "99-chargen-error");
  }

  // F12 banner check via evaluate
  try {
    const hasGame = await page.evaluate(() => !!globalThis.game?.system?.id);
    checklist.regression = { gameLoaded: hasGame, systemId: await page.evaluate(() => game?.system?.id) };
  } catch (e) {
    checklist.regression = { error: String(e) };
  }

  await browser.close();
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  report.loginStatus = "script_error";
  report.consoleErrors.push(String(e));
  console.log(JSON.stringify(report, null, 2));
  process.exit(1);
});
