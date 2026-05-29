import { ABILITY_KEYS, POINT_BUY_COSTS, STANDARD_ARRAY } from "../rules/constants.mjs";
import { getRulesConfig } from "../rules/config.mjs";

/**
 * @param {number[]} scores
 * @returns {boolean}
 */
export function isValidStandardArrayAssignment(scores) {
  const expected = [...getRulesConfig().standardArray].sort((a, b) => a - b);
  const actual = [...scores].sort((a, b) => a - b);
  return expected.length === 6 && expected.every((v, i) => v === actual[i]);
}

/**
 * @param {Record<string, number>} scores
 * @returns {{ valid: boolean, spent: number, total: number }}
 */
export function validatePointBuy(scores) {
  const rules = getRulesConfig();
  let spent = 0;
  for (const key of ABILITY_KEYS) {
    const score = scores[key] ?? 8;
    spent += POINT_BUY_COSTS[score] ?? 99;
  }
  return { valid: spent <= rules.pointBuyTotal, spent, total: rules.pointBuyTotal };
}

/**
 * @returns {Record<string, number>}
 */
export function defaultAbilityScores() {
  return Object.fromEntries(ABILITY_KEYS.map((k) => [k, 10]));
}

/**
 * @param {string} method
 * @returns {Record<string, number|null>}
 */
export function emptyAssignmentSlots(method) {
  if (method === "standardArray") {
    return Object.fromEntries(ABILITY_KEYS.map((k) => [k, null]));
  }
  return defaultAbilityScores();
}
