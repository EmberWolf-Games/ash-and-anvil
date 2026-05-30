import { aaRules } from "../helpers/logger.mjs";

/**
 * @typedef {object} D20CheckInput
 * @property {number} modifier
 * @property {number} [dc]
 * @property {number} [boon] net boon/bane: 1 boon, -1 bane, -2 double bane, 0 neutral
 * @property {string} [label]
 */

/**
 * @typedef {object} D20CheckResult
 * @property {number} d20
 * @property {number} d20Second
 * @property {number[]} d20Rolls
 * @property {number} total
 * @property {number|null} dc
 * @property {boolean|null} success
 * @property {string} formula
 */

/**
 * @param {number[]} rolls
 * @param {number} boon
 * @returns {number}
 */
export function resolveBoonBane(rolls, boon) {
  if (!rolls.length) return 0;
  if (boon > 0) return Math.max(...rolls);
  if (boon < 0) return Math.min(...rolls);
  return rolls[0];
}

/**
 * @param {number} boon
 * @returns {number}
 */
export function boonDiceCount(boon) {
  const magnitude = Math.abs(Number(boon) || 0);
  if (!magnitude) return 1;
  return 1 + magnitude;
}

/**
 * Build check result without rolling (for sheet display).
 * @param {D20CheckInput} input
 * @returns {D20CheckResult}
 */
export function buildCheckPreview(input) {
  const mod = Number(input.modifier) || 0;
  const dc = input.dc ?? null;
  return {
    d20: 0,
    d20Second: 0,
    d20Rolls: [],
    total: mod,
    dc,
    success: null,
    formula: `1d20 + ${mod}${dc !== null ? ` vs ${dc}` : ""}`,
  };
}

/**
 * Roll a d20 check with optional boon/bane (including double bane / 3d20).
 * @param {D20CheckInput} input
 * @returns {Promise<D20CheckResult>}
 */
export async function rollD20Check(input) {
  const mod = Number(input.modifier) || 0;
  const boon = Number(input.boon) || 0;
  const dc = input.dc ?? null;
  const rollOpts = { flavor: input.label ?? "" };
  const diceCount = boonDiceCount(boon);

  let d20Rolls = [];
  if (diceCount > 1) {
    const r = await new Roll(`${diceCount}d20`).evaluate(rollOpts);
    d20Rolls = r.dice[0]?.results?.map((res) => res.result) ?? Array(diceCount).fill(10);
  } else {
    const r = await new Roll("1d20").evaluate(rollOpts);
    d20Rolls = [r.total];
  }

  const d20 = resolveBoonBane(d20Rolls, boon);
  const d20Second = d20Rolls[1] ?? 0;
  const total = d20 + mod;
  const success = dc !== null ? total >= dc : null;
  const formula = `1d20 + ${mod}${dc !== null ? ` vs ${dc}` : ""}`;

  const result = { d20, d20Second, d20Rolls, total, dc, success, formula };
  aaRules("d20 check", result);
  return result;
}

/**
 * @deprecated use resolveBoonBane(rolls, boon)
 * @param {number} a
 * @param {number} b
 * @param {number} boon
 * @returns {number}
 */
export function resolveLegacyBoonBanePair(a, b, boon) {
  return resolveBoonBane([a, b], boon);
}
