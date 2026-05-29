import { aaLog, aaVerbose } from "./logger.mjs";

/** ASCII banner — plain strings only (no template literals; art must not contain backticks). */
const BANNER = [
  "================================================================================",
  "      _    _       _     _       _ _ ",
  "     / \\  | |__   | |   | | __ _| | | ___ _ __ ",
  "    / _ \\ | '_ \\  | |   | |/ _ \\ | |/ _ \\ '__|",
  "   / ___ \\| | | | | |___| | (_| | | |  __/ | ",
  "  /_/   \\_\\_| |_| |_____|_|\\__,_|_|_|\\___|_| ",
  "                    &    A N V I L",
  "================================================================================",
].join("\n");

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

  console.log(`%c${BANNER}`, STYLES.banner);
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

  aaVerbose("Registered actor types", Object.keys(CONFIG.Actor.dataModels ?? {}));
  aaVerbose("Registered item types", Object.keys(CONFIG.Item.dataModels ?? {}));
}
