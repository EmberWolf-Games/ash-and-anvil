import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(__dirname, "local-foundry-test.json"), "utf8"));

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1600, height: 900 } })).newPage();
await page.goto(`${cfg.baseUrl}/join`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
const opts = await page.evaluate(() => [...document.querySelector("select").options].map((o) => ({ v: o.value, t: o.text.trim() })));
const match = opts.find((o) => o.t.includes("cursor-test-gm"));
await page.selectOption("select", match.v);
await page.fill('input[name="password"]', cfg.password);
await page.click('button:has-text("JOIN GAME SESSION")');
await page.waitForFunction(() => globalThis.game?.ready === true, { timeout: 120000 });

const actorId = await page.evaluate(async () => (await Actor.create({ name: "Flow", type: "character" })).id);
await page.evaluate(async (id) => {
  const { ChargenWizard } = await import("/systems/ash-and-anvil/module/applications/chargen-wizard.mjs");
  await ChargenWizard.show(game.actors.get(id));
}, actorId);
await page.waitForSelector("#ash-anvil-chargen");

const log = async (label) => {
  const state = await page.evaluate(() => {
    const root = document.querySelector("#ash-anvil-chargen");
    const active = root?.querySelector(".chargen-steps .step.active")?.textContent?.trim();
    const fd = new foundry.applications.ux.FormDataExtended(root);
    const finish = !!root?.querySelector('[data-action="finish"]');
    return { active, form: fd.object, finish };
  });
  console.log(label, JSON.stringify(state));
};

await log("start");
await page.evaluate(() => {
  const r = document.querySelector('#ash-anvil-chargen input[name="ancestryId"]');
  r.checked = true;
  r.dispatchEvent(new Event("change", { bubbles: true }));
});
await page.waitForTimeout(800);
await log("after ancestry select");
await page.locator('#ash-anvil-chargen [data-action="next"]').click();
await page.waitForTimeout(800);
await log("after next1");

const steps = [
  ["classId", "class"],
  ["backgroundId", "background"],
];
for (const [field, label] of steps) {
  await page.evaluate((f) => {
    const r = document.querySelector(`#ash-anvil-chargen input[name="${f}"]`);
    r.checked = true;
    r.dispatchEvent(new Event("change", { bubbles: true }));
  }, field);
  await page.waitForTimeout(800);
  await log(`after ${label} select`);
  await page.locator('#ash-anvil-chargen [data-action="next"]').click();
  await page.waitForTimeout(800);
  await log(`after next ${label}`);
}

const keys = ["mgt", "fin", "res", "ins", "foc", "pre"];
const scores = [15, 14, 13, 12, 10, 8];
await page.evaluate(({ keys, scores }) => {
  keys.forEach((k, i) => {
    const input = document.querySelector(`#ash-anvil-chargen input[name="abilities.${k}"]`);
    input.value = String(scores[i]);
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}, { keys, scores });
await page.waitForTimeout(800);
const domAbilities = await page.evaluate(() =>
  [...document.querySelectorAll('#ash-anvil-chargen input[name^="abilities"]')].map((i) => ({
    name: i.name,
    value: i.value,
  }))
);
console.log("dom abilities", domAbilities);
const appKeys = await page.evaluate(() => [...foundry.applications.instances.keys()]);
console.log("app instances", appKeys.filter((k) => k.includes("ash") || k.includes("chargen")));
await log("after abilities");
await page.locator('#ash-anvil-chargen [data-action="next"]').click();
await page.waitForTimeout(800);
await log("after next abilities");

await page.evaluate(() => {
  document.querySelectorAll('#ash-anvil-chargen input[type="checkbox"]:not(:disabled)').forEach((cb, i) => {
    if (i < 3) {
      cb.checked = true;
      cb.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
});
await page.waitForTimeout(800);
await log("after skills");
await page.locator('#ash-anvil-chargen [data-action="next"]').click();
await page.waitForTimeout(800);
await log("after next skills");

const finish = page.locator('#ash-anvil-chargen [data-action="finish"]');
console.log("finish count", await finish.count());
if ((await finish.count()) > 0) await finish.click();
await page.waitForTimeout(2000);

const actor = await page.evaluate((id) => {
  const a = game.actors.get(id);
  return {
    buildComplete: a.system.chargen?.buildComplete,
    ancestry: a.items.find((i) => i.type === "ancestry")?.name,
    className: a.items.find((i) => i.type === "class")?.name,
    features: a.items.filter((i) => i.type === "feature").length,
  };
}, actorId);
console.log("actor", actor);

await browser.close();
