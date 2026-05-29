import { ABILITY_KEYS } from "./constants.mjs";

/**
 * @param {number} score
 * @returns {number}
 */
export function abilityMod(score) {
  return Math.floor((Number(score) - 10) / 2);
}

/**
 * @param {Record<string, { value?: number, mod?: number }>} abilities
 */
export function applyAbilityMods(abilities) {
  if (!abilities) return;
  for (const key of ABILITY_KEYS) {
    const ability = abilities[key];
    if (!ability) continue;
    ability.mod = abilityMod(ability.value ?? 10);
  }
}
