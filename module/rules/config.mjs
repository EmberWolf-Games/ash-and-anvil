import { STANDARD_ARRAY } from "./constants.mjs";

const SYSTEM_ID = "ash-and-anvil";

/** @typedef {object} RulesConfig
 * @property {string} rulesProfile
 * @property {boolean} automationEnabled
 * @property {string} statMethod
 * @property {number} pointBuyTotal
 * @property {number[]} standardArray
 * @property {boolean} grittyHp
 */

/**
 * Effective rules parameters for the active world.
 * @returns {RulesConfig}
 */
export function getRulesConfig() {
  const rulesProfile = game.settings.get(SYSTEM_ID, "rulesProfile") ?? "standard";
  const pointBuyByProfile = {
    standard: 27,
    narrative: 28,
    gritty: 25,
  };

  return {
    rulesProfile,
    automationEnabled: game.settings.get(SYSTEM_ID, "automationEnabled") ?? true,
    statMethod: game.settings.get(SYSTEM_ID, "statMethod") ?? "standardArray",
    pointBuyTotal:
      game.settings.get(SYSTEM_ID, "pointBuyTotal") ??
      pointBuyByProfile[rulesProfile] ??
      27,
    standardArray: parseStandardArray(game.settings.get(SYSTEM_ID, "standardArray")),
    grittyHp: rulesProfile === "gritty",
  };
}

/**
 * @param {string} raw
 * @returns {number[]}
 */
function parseStandardArray(raw) {
  if (!raw) return [...STANDARD_ARRAY];
  const parsed = String(raw)
    .split(/[,\s]+/)
    .map((n) => Number.parseInt(n, 10))
    .filter((n) => !Number.isNaN(n));
  return parsed.length === 6 ? parsed : [...STANDARD_ARRAY];
}
