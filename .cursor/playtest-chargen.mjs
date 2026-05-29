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
};

function trackConsole(page) {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      if (!report.consoleErrors.includes(t)) report.consoleErrors.push(t);
    }
  });
  page.on("pageerror", (err) => report.consoleErrors.push(String(err)));
}

async function shot(page, name) {
  const path = join(screenshotDir, `${name}.png`);
  await page.screenshot({ path, fullPage: true });
  report.screenshots.push(path);
}

async function login(page) {
  await page.goto(`${cfg.baseUrl}/join`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);

  const options = await page.evaluate(() => {
    const sel = document.querySelector("select");
    if (!sel) return [];
    return [...sel.options].map((o) => ({ v: o.value, t: o.text.trim() }));
  });

  const match = options.find(
    (o) => o.t === cfg.username || o.v === cfg.username || o.t.includes(cfg.username)
  );
  report.userExists = !!match;
  if (!match) {
    report.loginStatus = "user_not_in_dropdown";
    await shot(page, "fail-no-user");
    return false;
  }

  await page.locator("select").first().selectOption(match.v);
  await page.locator('input[name="password"]').first().fill(cfg.password);
  await page.locator('button:has-text("JOIN GAME SESSION")').click();
  await page.waitForSelector("#sidebar, #ui-left", { timeout: 120000 });
  await page.waitForFunction(() => globalThis.game?.ready === true, { timeout: 120000 });
  report.loginStatus = "success";
  return true;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await context.newPage();
  trackConsole(page);

  try {
    if (!(await login(page))) {
      await browser.close();
      console.log(JSON.stringify(report, null, 2));
      return;
    }

    await page.waitForTimeout(2000);
    await shot(page, "10-game-loaded");
    report.foundryVersion = await page.evaluate(() => game?.release?.version ?? CONFIG?.version ?? null);
    report.systemVersion = await page.evaluate(() => game?.system?.version ?? null);

    // Compendium seed
    report.checklist.compendiumSeed = await page.evaluate(async () => {
      const ids = [
        "ash-and-anvil.ancestries",
        "ash-and-anvil.classes",
        "ash-and-anvil.backgrounds",
        "ash-and-anvil.features",
      ];
      const out = {};
      for (const id of ids) {
        const pack = game.packs.get(id);
        if (!pack) {
          out[id] = { pass: false, count: 0, reason: "pack missing" };
          continue;
        }
        const docs = await pack.getDocuments();
        const names = docs.map((d) => d.name);
        out[id] = { pass: docs.length >= 3, count: docs.length, sample: names.slice(0, 5) };
      }
      return out;
    });

    // World settings menu presence (evaluate only)
    report.checklist.worldSettings = await page.evaluate(() => {
      const mod = game.modules.get("ash-and-anvil");
      return { moduleActive: !!mod, moduleVersion: mod?.version ?? null };
    });

    const actorName = `Playtest ${Date.now().toString(36)}`;
    const actorId = await page.evaluate(async (name) => {
      const a = await Actor.create({ name, type: "character" });
      return a.id;
    }, actorName);
    report.checklist.createCharacter = { pass: !!actorId, actorName };

    await page.evaluate(async (id) => {
      const actor = game.actors.get(id);
      await actor.sheet.render(true);
    }, actorId);
    await page.waitForTimeout(2000);
    await shot(page, "11-character-sheet");

    await page.evaluate(() => {
      if (game.paused) game.togglePause(false);
    });

    const hasBanner = await page.evaluate((id) => {
      const a = game.actors.get(id);
      return !a.system.chargen?.buildComplete;
    }, actorId);
    report.checklist.buildCharacterBanner = { pass: hasBanner };

    await page.evaluate(async (id) => {
      const actor = game.actors.get(id);
      const { ChargenWizard } = await import(
        "/systems/ash-and-anvil/module/applications/chargen-wizard.mjs"
      );
      await ChargenWizard.show(actor);
    }, actorId);
    await page.waitForSelector("#ash-anvil-chargen, .chargen-wizard", { timeout: 20000 });
    await page.waitForTimeout(1500);
    await shot(page, "12-chargen-open");

    const wizard = page.locator("#ash-anvil-chargen");
    const wizardSteps = [];
    const abilityKeys = ["mgt", "fin", "res", "ins", "foc", "pre"];
    const standardArray = [15, 14, 13, 12, 10, 8];

    async function pickFirstRadio(name) {
      await page.evaluate((field) => {
        const root = document.querySelector("#ash-anvil-chargen");
        const radio = root?.querySelector(`input[type="radio"][name="${field}"]`);
        if (!radio) return;
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
        radio.dispatchEvent(new Event("input", { bubbles: true }));
      }, name);
    }

    async function assignStandardArray() {
      await page.evaluate(({ keys, scores }) => {
        const root = document.querySelector("#ash-anvil-chargen");
        keys.forEach((key, i) => {
          const input = root?.querySelector(`input[name="abilities.${key}"]`);
          if (!input) return;
          input.value = String(scores[i]);
          input.dispatchEvent(new Event("change", { bubbles: true }));
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
      }, { keys: abilityKeys, scores: standardArray });
    }

    async function pickClassSkills() {
      await page.evaluate(() => {
        const root = document.querySelector("#ash-anvil-chargen");
        const boxes = root?.querySelectorAll('input[type="checkbox"]:not(:disabled)') ?? [];
        let n = 0;
        for (const cb of boxes) {
          if (n >= 2) break;
          cb.checked = true;
          cb.dispatchEvent(new Event("change", { bubbles: true }));
          n++;
        }
      });
    }

    async function clickNext(label) {
      const next = wizard.locator('[data-action="next"]');
      if ((await next.count()) === 0) return false;
      await next.click();
      wizardSteps.push(label);
      await page.waitForTimeout(900);
      return true;
    }

    // Ancestry → Class → Background
    const radioSteps = [
      ["ancestryId", "ancestry"],
      ["classId", "class"],
      ["backgroundId", "background"],
    ];
    for (const [field, label] of radioSteps) {
      await pickFirstRadio(field);
      await page.waitForTimeout(400);
      if (!(await clickNext(`next-${label}`))) break;
    }

    await assignStandardArray();
    await page.waitForTimeout(400);
    if (await clickNext("next-abilities")) {
      await pickClassSkills();
      await page.waitForTimeout(400);
      if (await clickNext("next-skills")) {
        await page.waitForTimeout(600);
        const finish = wizard.locator('[data-action="finish"]');
        if ((await finish.count()) > 0 && (await finish.isVisible())) {
          await finish.scrollIntoViewIfNeeded();
          await finish.click();
          wizardSteps.push("finish");
        } else {
          wizardSteps.push("finish-missing");
        }
      }
    }

    await page.waitForTimeout(2000);

    report.checklist.wizardSteps = wizardSteps;
    await page.waitForTimeout(2000);
    await shot(page, "13-after-wizard");

    const sheet = await page.evaluate((id) => {
      const a = game.actors.get(id);
      const ancestry = a.items.find((i) => i.type === "ancestry");
      const cls = a.items.find((i) => i.type === "class");
      const bg = a.items.find((i) => i.type === "background");
      const features = a.items.filter((i) => i.type === "feature");
      const trainedSkills = Object.entries(a.system.skills ?? {})
        .filter(([, s]) => s.trained)
        .map(([k]) => k);
      return {
        buildComplete: a.system.chargen?.buildComplete,
        ancestryName: ancestry?.name ?? null,
        className: cls?.name ?? null,
        backgroundName: bg?.name ?? null,
        abilities: Object.fromEntries(
          Object.entries(a.system.abilities ?? {}).map(([k, v]) => [k, v?.value])
        ),
        edge: a.system.proficiency?.edge,
        hpMax: a.system.attributes?.health?.max,
        classHitDie: cls?.system?.hitDie,
        resilienceMod: a.system.abilities?.res?.mod,
        featureCount: features.length,
        trainedSkills,
      };
    }, actorId);

    report.checklist.sheetAfterFinish = sheet;
    const hpExpected =
      sheet.classHitDie && sheet.resilienceMod != null
        ? sheet.classHitDie + sheet.resilienceMod
        : null;
    report.checklist.chargenSmoke = {
      pass:
        !!sheet.buildComplete &&
        !!sheet.ancestryName &&
        !!sheet.className &&
        !!sheet.backgroundName,
      hpCheck:
        hpExpected != null && sheet.hpMax != null ? sheet.hpMax === hpExpected : "skipped",
      featuresEmbedded: sheet.featureCount > 0,
    };

    report.checklist.regression = {
      systemId: await page.evaluate(() => game.system.id),
      banner: report.consoleErrors.filter((e) => /syntax|ash.and.anvil/i.test(e)).length === 0,
    };

    // Filter resolution warnings from "real" errors for summary
    report.consoleErrorsSignificant = report.consoleErrors.filter(
      (e) => !/screen resolution of 1366px/i.test(e)
    );
  } catch (e) {
    report.loginStatus = report.loginStatus === "unknown" ? "script_error" : report.loginStatus;
    report.checklist.fatalError = String(e);
    await shot(page, "99-fatal").catch(() => {});
  }

  await browser.close();
  console.log(JSON.stringify(report, null, 2));
}

main();
