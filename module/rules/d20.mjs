import { aaRules } from "../helpers/logger.mjs";

/**
 * @typedef {object} D20CheckInput
 * @property {number} modifier
 * @property {number} [dc]
 * @property {number} [boon] net boon/bane: 1 boon, -1 bane, 0 neutral
 * @property {string} [label]
 */

/**
 * @typedef {object} D20CheckResult
 * @property {number} d20
 * @property {number} d20Second
 * @property {number} total
 * @property {number|null} dc
 * @property {boolean|null} success
 * @property {string} formula
 */

/**
 * Resolve boon/bane on two d20 rolls.
 * @param {number} a
 * @param {number} b
 * @param {number} boon
 * @returns {number}
 */
export function resolveBoonBane(a, b, boon) {
  if (boon > 0) return Math.max(a, b);
  if (boon < 0) return Math.min(a, b);
  return a;
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
    total: mod,
    dc,
    success: null,
    formula: `1d20 + ${mod}${dc !== null ? ` vs ${dc}` : ""}`,
  };
}

/**
 * Roll a d20 check with optional boon/bane.
 * @param {D20CheckInput} input
 * @returns {Promise<D20CheckResult>}
 */
export async function rollD20Check(input) {
  const mod = Number(input.modifier) || 0;
  const boon = Number(input.boon) || 0;
  const dc = input.dc ?? null;
  const rollOpts = { flavor: input.label ?? "" };

  let d20;
  let d20Second = 0;

  if (boon !== 0) {
    const r = await new Roll("2d20").evaluate(rollOpts);
    const terms = r.dice[0]?.results?.map((res) => res.result) ?? [10, 10];
    d20 = terms[0];
    d20Second = terms[1];
    d20 = resolveBoonBane(d20, d20Second, boon);
  } else {
    const r = await new Roll("1d20").evaluate(rollOpts);
    d20 = r.total;
  }

  const total = d20 + mod;
  const success = dc !== null ? total >= dc : null;
  const formula = `1d20 + ${mod}${dc !== null ? ` vs ${dc}` : ""}`;

  const result = { d20, d20Second, total, dc, success, formula };
  aaRules("d20 check", result);
  return result;
}
