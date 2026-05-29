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
const match = (await page.evaluate(() =>
  [...document.querySelector("select").options].map((o) => ({ v: o.value, t: o.text.trim() }))
)).find((o) => o.t.includes("cursor-test-gm"));
await page.selectOption("select", match.v);
await page.fill('input[name="password"]', cfg.password);
await page.click('button:has-text("JOIN GAME SESSION")');
await page.waitForFunction(() => globalThis.game?.ready === true, { timeout: 120000 });
const settings = await page.evaluate(() => {
  const keys = [
    "verboseLogging",
    "rulesProfile",
    "automationEnabled",
    "debugRules",
    "statMethod",
    "pointBuyTotal",
    "standardArray",
    "autoApplyDerived",
  ];
  const values = {};
  for (const key of keys) {
    try {
      values[key] = game.settings.get("ash-and-anvil", key);
    } catch (e) {
      values[key] = `error: ${e.message}`;
    }
  }
  return { values, systemId: game.system.id };
});
console.log(JSON.stringify(settings, null, 2));
await browser.close();
