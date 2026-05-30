import {
  ABILITY_KEYS,
  ABILITY_MOD_MAX,
  ABILITY_MOD_MIN,
  ABILITY_MAX,
  ABILITY_MIN,
  LEGACY_ABILITY_MAP,
} from "./constants.mjs";

/**
 * @param {number} score
 * @returns {number}
 */
export function abilityMod(score) {
  const raw = Math.floor((Number(score) - 10) / 2);
  return Math.max(ABILITY_MOD_MIN, Math.min(ABILITY_MOD_MAX, raw));
}

/**
 * @param {Record<string, { value?: number, mod?: number }>} abilities
 */
export function applyAbilityMods(abilities) {
  if (!abilities) return;
  migrateLegacyAbilityKeys(abilities);
  for (const key of ABILITY_KEYS) {
    const ability = abilities[key];
    if (!ability) continue;
    const value = Math.max(ABILITY_MIN, Math.min(ABILITY_MAX, ability.value ?? 10));
    ability.value = value;
    ability.mod = abilityMod(value);
  }
}

/**
 * @param {Record<string, { value?: number, mod?: number }>} abilities
 */
export function migrateLegacyAbilityKeys(abilities) {
  for (const [legacy, modern] of Object.entries(LEGACY_ABILITY_MAP)) {
    if (abilities[legacy] && !abilities[modern]?.value) {
      abilities[modern] ??= { value: 10, mod: 0 };
      abilities[modern].value = abilities[legacy].value ?? 10;
    }
  }
}
