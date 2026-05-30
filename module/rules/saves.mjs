import { SAVE_KEYS, SAVES } from "./constants.mjs";

/**
 * @param {object} system
 */
export function deriveSaves(system) {
  system.saves ??= {};
  for (const key of SAVE_KEYS) {
    const def = SAVES[key];
    system.saves[key] ??= { trained: false, misc: 0, total: 0 };
    const entry = system.saves[key];
    const abilityMod = system.abilities?.[def.ability]?.mod ?? 0;
    entry.total =
      abilityMod + (entry.trained ? (system.proficiency?.edge ?? 0) : 0) + (entry.misc ?? 0);
  }
}
