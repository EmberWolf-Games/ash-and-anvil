import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(__dirname, "local-foundry-test.json"), "utf8"));
const screenshotDir = join(__dirname, "playtest-screenshots");

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext()).newPage();
const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => consoleErrors.push(String(e)));

await page.goto(`${cfg.baseUrl}/join`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(3000);

const selects = await page.evaluate(() =>
  [...document.querySelectorAll("select")].map((s) => ({
    name: s.name,
    options: [...s.options].map((o) => ({ v: o.value, t: o.text.trim() })),
  }))
);

const userSelect = page.locator("select").first();
const options = selects[0]?.options ?? [];
const match = options.find(
  (o) => o.t === cfg.username || o.v === cfg.username || o.t.includes(cfg.username)
);

const report = {
  loginStatus: "unknown",
  userExists: match != null,
  userOptions: options.map((o) => o.t),
  url: page.url(),
  consoleErrors: [],
};

if (!match) {
  report.loginStatus = "user_not_in_dropdown";
  await page.screenshot({ path: join(screenshotDir, "login-no-user.png"), fullPage: true });
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  process.exit(0);
}

await userSelect.selectOption(match.v);
await page.locator('input[name="password"]').first().fill(cfg.password);
await page.locator('button:has-text("JOIN GAME SESSION")').click();
await page.waitForTimeout(8000);

report.url = page.url();
const body = await page.locator("body").innerText();
report.loginStatus =
  /#sidebar|ui-left|game\.ready/i.test(page.url()) ||
  (await page.locator("#sidebar, #ui-left").count()) > 0
    ? "success"
    : /invalid|incorrect|failed|denied|password/i.test(body)
      ? "failed_bad_password"
      : "unknown_after_submit";

report.inGame = (await page.locator("#sidebar, #ui-left").count()) > 0;
report.consoleErrors = consoleErrors;
await page.screenshot({ path: join(screenshotDir, "login-result.png"), fullPage: true });
console.log(JSON.stringify(report, null, 2));
await browser.close();
