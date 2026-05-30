import { MAX_TOTAL_LEVEL, SKILL_DEFINITIONS, SKILL_KEYS } from "./constants.mjs";

/**
 * @param {object} system
 */
export function ensureSkillEntries(system) {
  system.skills ??= {};
  system.skills.entries ??= {};
  for (const key of SKILL_KEYS) {
    system.skills.entries[key] ??= { ranks: 0, misc: 0, bonus: 0, custom: false };
  }
  system.skills.custom ??= [];
}

/**
 * @param {object} system
 */
export function deriveSkills(system) {
  ensureSkillEntries(system);
  const totalLevel = system.attributes?.totalLevel ?? system.attributes?.level ?? 1;
  const maxRanks = Math.max(1, totalLevel + 3);

  for (const key of SKILL_KEYS) {
    const def = SKILL_DEFINITIONS[key];
    const entry = system.skills.entries[key];
    const ranks = Math.min(maxRanks, Math.max(0, entry.ranks ?? 0));
    entry.ranks = ranks;
    const abilityMod = system.abilities?.[def.ability]?.mod ?? 0;
    entry.bonus = ranks + abilityMod + (entry.misc ?? 0);
  }

  for (const custom of system.skills.custom ?? []) {
    const abilityMod = system.abilities?.[custom.ability]?.mod ?? 0;
    const ranks = Math.min(maxRanks, Math.max(0, custom.ranks ?? 0));
    custom.ranks = ranks;
    custom.bonus = ranks + abilityMod + (custom.misc ?? 0);
  }

  system.skills.maxRanks = maxRanks;
}

/**
 * @param {number} totalLevel
 * @returns {number}
 */
export function defaultSkillPoints(totalLevel = 1) {
  return Math.max(0, (Math.min(totalLevel, MAX_TOTAL_LEVEL) + 3) * 4);
}

/**
 * @param {object} system
 * @returns {number}
 */
export function spentSkillPoints(system) {
  let spent = 0;
  for (const key of SKILL_KEYS) {
    spent += system.skills?.entries?.[key]?.ranks ?? 0;
  }
  for (const custom of system.skills?.custom ?? []) {
    spent += custom.ranks ?? 0;
  }
  return spent;
}
