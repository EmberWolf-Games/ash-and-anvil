import { MAX_TOTAL_LEVEL, SKILL_DEFINITIONS, SKILL_KEYS } from "./constants.mjs";

/** Default SP ranks granted at chargen for class vs edge (background) skills. */
export const CLASS_SKILL_DEFAULT_RANKS = 5;
export const EDGE_SKILL_DEFAULT_RANKS = 3;

/** Base currency cost multiplier for purchased skill ranks (rank N costs N × base). */
export const MONEY_RANK_COST_BASE = 100;

/**
 * @param {object} entry
 * @returns {number}
 */
export function totalSkillRanks(entry) {
  return Math.max(0, entry?.spRanks ?? entry?.ranks ?? 0) + Math.max(0, entry?.moneyRanks ?? 0);
}

/**
 * @param {number} totalLevel
 * @param {boolean} isClassSkill
 * @returns {number}
 */
export function skillMaxRanks(totalLevel, isClassSkill) {
  const level = Math.max(1, Math.min(totalLevel, MAX_TOTAL_LEVEL));
  const classCap = level + 3;
  return isClassSkill ? classCap : Math.max(1, Math.floor(classCap / 2));
}

/**
 * @param {Actor} actor
 * @returns {string[]}
 */
export function resolveEdgeSkills(actor) {
  const background =
    actor.items.find((i) => i.type === "background") ??
    (actor.system.details?.backgroundId
      ? actor.items.find(
          (i) => i.id === actor.system.details.backgroundId || i.uuid === actor.system.details.backgroundId
        )
      : null);
  return background?.system?.trainedSkills ?? [];
}

/**
 * Class skills = union of all embedded class skill lists (3.5e multiclass rule).
 * @param {Actor} actor
 * @returns {Set<string>}
 */
export function resolveClassSkillKeys(actor) {
  const keys = new Set();
  for (const cls of actor.items.filter((i) => i.type === "class")) {
    for (const key of cls.system?.skillPool ?? []) {
      if (SKILL_KEYS.includes(key)) keys.add(key);
    }
  }
  return keys;
}

/**
 * @param {Actor} actor
 * @param {string} skillKey
 * @returns {boolean}
 */
export function isClassSkillForActor(actor, skillKey) {
  return resolveClassSkillKeys(actor).has(skillKey);
}

/**
 * @param {object} system
 * @param {string} skillKey
 * @returns {boolean}
 * @deprecated use isClassSkillForActor
 */
export function isClassSkill(system, skillKey) {
  return (system.skills?.classSkills ?? []).includes(skillKey);
}

/**
 * @param {object} classItem
 * @param {object} system
 * @returns {number}
 */
function perLevelSkillPoints(classItem, system) {
  const base = classItem?.system?.skillPointsPerLevel ?? 2;
  const mndMod = system.abilities?.mnd?.mod ?? 0;
  return Math.max(1, base + mndMod);
}

/**
 * 3.5e-style skill point pool: quadruple first primary level, then +1 per level per class.
 * @param {Actor|null} actor
 * @param {object} system
 * @returns {number}
 */
export function skillPointsAvailable(actor, system) {
  const classes = actor?.items?.filter((i) => i.type === "class") ?? [];
  const primaryLevel = Math.max(0, system.attributes?.primaryClassLevel ?? system.attributes?.level ?? 1);
  const secondaryLevel = Math.max(0, system.attributes?.secondaryClassLevel ?? 0);
  const mndMod = system.abilities?.mnd?.mod ?? 0;
  const fallbackPerLevel = Math.max(1, 2 + mndMod);

  let total = 0;
  const primary = classes[0] ?? null;
  const secondary = classes[1] ?? null;

  if (primary && primaryLevel > 0) {
    const per = perLevelSkillPoints(primary, system);
    total += per * 4 + per * Math.max(0, primaryLevel - 1);
  } else if (primaryLevel > 0) {
    total += fallbackPerLevel * (primaryLevel + 3);
  }

  if (secondary && secondaryLevel > 0) {
    total += perLevelSkillPoints(secondary, system) * secondaryLevel;
  }

  return Math.max(0, total);
}

/**
 * @param {object|null} classItem
 * @param {object} system
 * @returns {number}
 */
export function skillPointsAtFirstLevel(classItem, system) {
  if (!classItem) {
    const mndMod = system.abilities?.mnd?.mod ?? 0;
    return Math.max(0, Math.max(1, 2 + mndMod) * 4);
  }
  return Math.max(0, perLevelSkillPoints(classItem, system) * 4);
}

/** @deprecated use skillPointsAvailable */
export function defaultSkillPoints(totalLevel = 1) {
  return Math.max(0, (Math.min(totalLevel, MAX_TOTAL_LEVEL) + 3) * 4);
}

/**
 * @param {number} rank
 * @returns {number}
 */
export function moneyRankPurchaseCost(rank) {
  return Math.max(1, rank) * MONEY_RANK_COST_BASE;
}

/**
 * @param {number} moneyRanks
 * @returns {number}
 */
export function cumulativeMoneyRankCost(moneyRanks) {
  let total = 0;
  for (let rank = 1; rank <= moneyRanks; rank++) total += moneyRankPurchaseCost(rank);
  return total;
}

/**
 * @param {number} oldRanks
 * @param {number} newRanks
 * @returns {number}
 */
export function moneyRankCostDelta(oldRanks, newRanks) {
  return cumulativeMoneyRankCost(newRanks) - cumulativeMoneyRankCost(oldRanks);
}

/**
 * @param {object} system
 * @param {Actor|null} [actor]
 * @returns {number}
 */
export function spentSkillPoints(system, actor = null) {
  const classSkills = actor ? resolveClassSkillKeys(actor) : new Set(system.skills?.classSkills ?? []);
  let spent = 0;

  for (const key of SKILL_KEYS) {
    const spRanks = system.skills?.entries?.[key]?.spRanks ?? system.skills?.entries?.[key]?.ranks ?? 0;
    spent += classSkills.has(key) ? spRanks : spRanks * 2;
  }

  for (const custom of system.skills?.custom ?? []) {
    const spRanks = custom.spRanks ?? custom.ranks ?? 0;
    spent += spRanks * 2;
  }

  return spent;
}

/**
 * @param {object} entry
 */
function migrateSkillEntry(entry) {
  if (entry.spRanks == null && entry.ranks != null) entry.spRanks = entry.ranks;
  entry.spRanks ??= 0;
  entry.moneyRanks ??= 0;
  entry.misc ??= 0;
  entry.bonus ??= 0;
}

/**
 * @param {object} system
 */
export function ensureSkillEntries(system) {
  system.skills ??= {};
  system.skills.entries ??= {};
  system.skills.classSkills ??= [];
  system.skills.custom ??= [];

  for (const key of SKILL_KEYS) {
    system.skills.entries[key] ??= { spRanks: 0, moneyRanks: 0, misc: 0, bonus: 0, custom: false };
    migrateSkillEntry(system.skills.entries[key]);
  }

  for (const custom of system.skills.custom) migrateSkillEntry(custom);
}

/**
 * @param {object} system
 * @param {string[]} classSkillKeys
 * @param {string[]} edgeSkillKeys
 */
export function applyDefaultSkillRanks(system, classSkillKeys, edgeSkillKeys) {
  ensureSkillEntries(system);

  for (const key of SKILL_KEYS) {
    system.skills.entries[key].spRanks = 0;
    system.skills.entries[key].moneyRanks = 0;
  }

  for (const key of classSkillKeys) {
    if (system.skills.entries[key]) system.skills.entries[key].spRanks = CLASS_SKILL_DEFAULT_RANKS;
  }

  for (const key of edgeSkillKeys) {
    if (classSkillKeys.includes(key)) continue;
    if (system.skills.entries[key]) system.skills.entries[key].spRanks = EDGE_SKILL_DEFAULT_RANKS;
  }
}

/**
 * @param {object} system
 * @param {Actor|null} [actor]
 */
export function deriveSkills(system, actor = null) {
  ensureSkillEntries(system);
  const totalLevel = system.attributes?.totalLevel ?? system.attributes?.level ?? 1;
  const classSkills = actor ? resolveClassSkillKeys(actor) : new Set(system.skills?.classSkills ?? []);

  if (actor) system.skills.classSkills = [...classSkills];

  const defaultMax = Math.max(1, totalLevel + 3);

  for (const key of SKILL_KEYS) {
    const def = SKILL_DEFINITIONS[key];
    const entry = system.skills.entries[key];
    const isClass = classSkills.has(key);
    const maxRanks = skillMaxRanks(totalLevel, isClass);
    const spRanks = Math.min(maxRanks, Math.max(0, entry.spRanks ?? 0));
    const moneyRanks = Math.min(Math.max(0, maxRanks - spRanks), Math.max(0, entry.moneyRanks ?? 0));
    const abilityMod = system.abilities?.[def.ability]?.mod ?? 0;
    entry.spRanks = spRanks;
    entry.moneyRanks = moneyRanks;
    entry.bonus = abilityMod + spRanks + moneyRanks + (entry.misc ?? 0);
  }

  for (const custom of system.skills.custom ?? []) {
    const abilityMod = system.abilities?.[custom.ability]?.mod ?? 0;
    const maxRanks = skillMaxRanks(totalLevel, false);
    const spRanks = Math.min(maxRanks, Math.max(0, custom.spRanks ?? custom.ranks ?? 0));
    const moneyRanks = Math.min(Math.max(0, maxRanks - spRanks), Math.max(0, custom.moneyRanks ?? 0));
    custom.spRanks = spRanks;
    custom.moneyRanks = moneyRanks;
    custom.bonus = abilityMod + spRanks + moneyRanks + (custom.misc ?? 0);
  }

  system.skills.maxRanks = defaultMax;
  system.skills.maxCrossClassRanks = skillMaxRanks(totalLevel, false);
}

/**
 * Apply money-rank currency changes from sheet submit data.
 * @param {Actor} actor
 * @param {object} submitData
 * @returns {{ blocked: boolean }}
 */
export function applySkillMoneyRankSubmit(actor, submitData) {
  const expanded = foundry.utils.expandObject(submitData);
  const system = expanded?.system;
  if (!system?.skills) return { blocked: false };

  let currencyDelta = 0;
  const current = actor.system.skills ?? {};
  const nextEntries = system.skills.entries ?? {};
  const nextCustom = system.skills.custom;

  for (const key of SKILL_KEYS) {
    const nextMoney = Number(nextEntries[key]?.moneyRanks);
    if (Number.isNaN(nextMoney)) continue;
    const oldMoney = current.entries?.[key]?.moneyRanks ?? 0;
    currencyDelta += moneyRankCostDelta(oldMoney, Math.max(0, nextMoney));
  }

  if (Array.isArray(nextCustom)) {
    for (let index = 0; index < nextCustom.length; index++) {
      const nextMoney = Number(nextCustom[index]?.moneyRanks);
      if (Number.isNaN(nextMoney)) continue;
      const oldMoney = current.custom?.[index]?.moneyRanks ?? 0;
      currencyDelta += moneyRankCostDelta(oldMoney, Math.max(0, nextMoney));
    }
  }

  if (currencyDelta === 0) return { blocked: false };

  const balance = actor.system.currency?.value ?? 0;
  if (currencyDelta > 0 && balance < currencyDelta) {
    ui.notifications.warn(
      game.i18n.format("ASHANVIL.MoneyRankInsufficientFunds", {
        cost: currencyDelta,
        balance,
      })
    );
    return { blocked: true };
  }

  foundry.utils.mergeObject(submitData, {
    system: {
      currency: {
        value: Math.max(0, balance - currencyDelta),
      },
    },
  });

  if (currencyDelta < 0) {
    ui.notifications.info(
      game.i18n.format("ASHANVIL.MoneyRankRefund", { amount: Math.abs(currencyDelta) })
    );
  }

  return { blocked: false };
}

/**
 * @param {Actor} actor
 * @param {object} submitData
 * @returns {{ blocked: boolean }}
 */
export function validateSkillPointSubmit(actor, submitData) {
  const draft = foundry.utils.deepClone(actor.system);
  const patch = foundry.utils.expandObject(submitData)?.system ?? {};
  foundry.utils.mergeObject(draft, patch);
  ensureSkillEntries(draft);

  const spent = spentSkillPoints(draft, actor);
  const available = skillPointsAvailable(actor, draft);
  if (spent > available) {
    ui.notifications.warn(
      game.i18n.format("ASHANVIL.SkillPointsOverspent", { spent, available })
    );
    return { blocked: true };
  }
  return { blocked: false };
}
