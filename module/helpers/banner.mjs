import { aaLog, aaVerbose } from "./logger.mjs";

/**
 * Startup banner for the F12 console (plain ASCII — matches brand wordmark layout).
 * String array only; no template literals in the art itself.
 */
const BANNER_ART = [
  "     _        _        ___        _               _ _ ",
  "    / \\   ___| |__    ( _ )      / \\   _ ____   _(_) |",
  "   / _ \\ / __| '_ \\   / _ \\/\\   / _ \\ | '_ \\ \\ / / | |",
  "  / ___ \\\\__ \\ | | | | (_>  <  / ___ \\| | | \\ V /| | |",
  " /_/   \\_\\___/_| |_|_|  \\___/\\/ /_/   \\_\\_| |_|\\_/ |_|_|",
  " / |___| |_  | ____|__| (_) |_(_) ___  _ __           ",
  " | / __| __| |  _| / _` | | __| |/ _ \\| '_ \\          ",
  " | \\__ \\ |_  | |__| (_| | | |_| | (_) | | | |         ",
  " |_|___/\\__| |_____\\__,_|_|\\__|_|\\___/|_| |_|         ",
].join("\n");

const BORDER = "============================================================";

const STYLES = {
  banner: "color: #e85d04; font-weight: bold; font-family: monospace;",
  title: "color: #f0ebe3; font-weight: bold;",
  meta: "color: #9d9d9d;",
};

/**
 * Print the startup banner to the F12 console (always shown once per load).
 */
export function printStartupBanner() {
  const system = game.system;
  const foundryVersion = game.version;
  const subtitle = `${system.title} | EmberWolf Games`;
  const meta = `ESModule loaded · System v${system.version} · Foundry v${foundryVersion}`;

  console.log(`%c${BORDER}`, STYLES.banner);
  for (const line of BANNER_ART.split("\n")) {
    console.log(`%c${line}`, STYLES.banner);
  }
  console.log(`%c${BORDER}`, STYLES.banner);
  console.log(`%c${subtitle}`, STYLES.title);
  console.log(`%c${meta}`, STYLES.meta);

  aaVerbose("Startup banner displayed.");
}

/**
 * Print a concise ready summary; verbose mode adds diagnostic detail.
 */
export function printReadySummary() {
  aaLog("System ready.");

  aaVerbose("World", {
    id: game.world.id,
    title: game.world.title,
    rulesProfile: game.settings.get("ash-and-anvil", "rulesProfile"),
    automationEnabled: game.settings.get("ash-and-anvil", "automationEnabled"),
  });

  const registered = CONFIG.ASH_ANVIL?.registeredTypes ?? {};
  aaVerbose("Registered actor types", registered.actors ?? []);
  aaVerbose("Registered item types", registered.items ?? []);
}
