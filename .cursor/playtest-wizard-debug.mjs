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

const actorId = await page.evaluate(async () => (await Actor.create({ name: "Debug", type: "character" })).id);
await page.evaluate(async (id) => {
  const { ChargenWizard } = await import("/systems/ash-and-anvil/module/applications/chargen-wizard.mjs");
  await ChargenWizard.show(game.actors.get(id));
}, actorId);
await page.waitForSelector("#ash-anvil-chargen");

const dom = await page.evaluate(() => {
  const root = document.querySelector("#ash-anvil-chargen");
  const radios = root ? [...root.querySelectorAll("input[type=radio]")].map((r) => ({ name: r.name, value: r.value, checked: r.checked })) : [];
  const finish = root?.querySelector('[data-action="finish"]');
  const next = root?.querySelector('[data-action="next"]');
  return {
    rootTag: root?.tagName,
    rootClass: root?.className,
    hasShadow: !!root?.shadowRoot,
    innerForm: root?.querySelector("form")?.className,
    radios: radios.slice(0, 6),
    finishVisible: !!finish,
    nextVisible: !!next,
    htmlSnippet: root?.innerHTML?.slice(0, 400),
  };
});
console.log(JSON.stringify(dom, null, 2));

await page.locator('#ash-anvil-chargen input[name="ancestryId"]').first().check({ force: true });
await page.waitForTimeout(500);
const after = await page.evaluate(() => {
  const root = document.querySelector("#ash-anvil-chargen");
  return [...root.querySelectorAll("input[type=radio]")].map((r) => ({ name: r.name, checked: r.checked }));
});
console.log("after check", after);

await browser.close();
