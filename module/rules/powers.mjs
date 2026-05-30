import {
  divineRank,
  effectiveCasterLevel,
  getClassLevelAllocations,
  maxSpellLevelForEffectiveLevel,
} from "./caster-resources.mjs";

/** @type {Readonly<Record<string, string>>} */
export const POWER_POOL_TO_TAB = {
  mana: "spellcasting",
  focus: "psionics",
  divine: "divineGifts",
};

/** @type {Readonly<Record<string, string>>} */
export const POWER_TAB_TRADITION = {
  spellcasting: "arcane",
  psionics: "psionic",
  divineGifts: "divine",
};

/** @type {Readonly<Record<string, string>>} */
export const POWER_TAB_EMPTY_HINT = {
  spellcasting: "ASHANVIL.NoSpellsArcane",
  psionics: "ASHANVIL.NoSpellsPsionic",
  divineGifts: "ASHANVIL.NoSpellsDivine",
};

/**
 * @param {number} level
 * @param {string} [tabId]
 * @returns {string}
 */
export function spellLevelLabel(level, tabId = "spellcasting") {
  const n = Math.max(0, Math.floor(Number(level) || 0));
  if (n === 0) {
    if (tabId === "psionics") return game.i18n.localize("ASHANVIL.PowerLevelTalent");
    if (tabId === "divineGifts") return game.i18n.localize("ASHANVIL.PowerLevelOrison");
    return game.i18n.localize("ASHANVIL.SpellLevelCantrip");
  }
  return game.i18n.format("ASHANVIL.SpellLevelOrdinal", { level: n });
}

/**
 * @param {Actor} actor
 * @returns {Record<string, { enabled: boolean, maxLevel: number }>}
 */
export function computePowerTabAvailability(actor) {
  /** @type {Record<string, { enabled: boolean, maxLevel: number }>} */
  const tabs = {
    spellcasting: { enabled: false, maxLevel: 0 },
    psionics: { enabled: false, maxLevel: 0 },
    divineGifts: { enabled: false, maxLevel: 0 },
  };

  for (const allocation of getClassLevelAllocations(actor)) {
    const pool = allocation.item.system?.powerPool ?? "none";
    const progression = allocation.item.system?.casterProgression ?? "none";
    if (pool === "none" || allocation.level <= 0) continue;

    const tabId = POWER_POOL_TO_TAB[pool];
    if (!tabId) continue;

    tabs[tabId].enabled = true;
    const eff = effectiveCasterLevel(allocation.level, progression);
    const scaledEff = Math.max(1, eff);
    const maxLevel =
      pool === "divine"
        ? divineRank(scaledEff)
        : maxSpellLevelForEffectiveLevel(scaledEff);
    tabs[tabId].maxLevel = Math.max(tabs[tabId].maxLevel, maxLevel);
  }

  return tabs;
}

/**
 * @param {object[]} spells
 * @param {number} maxLevel
 * @param {string} tabId
 * @param {string} emptyHintKey
 */
export function buildSpellLevelGroups(spells, maxLevel, tabId, emptyHintKey) {
  const prepared = spells.filter((s) => s.prepared);
  /** @type {object[]} */
  const groups = [];

  for (let level = 0; level <= maxLevel; level += 1) {
    const levelSpells = prepared
      .filter((s) => s.spellLevel === level)
      .sort((a, b) => a.name.localeCompare(b.name));
    groups.push({
      level,
      label: spellLevelLabel(level, tabId),
      spells: levelSpells,
      emptyHint: game.i18n.localize(emptyHintKey),
    });
  }

  return groups;
}

/**
 * @param {Actor} actor
 * @param {Item} spell
 * @returns {number}
 */
export function spellAttackBonus(actor, spell) {
  const abilityKey = spell.system?.castingAbility ?? "mnd";
  const abilityMod = actor.system.abilities?.[abilityKey]?.mod ?? 0;
  const edge = actor.system.proficiency?.edge ?? 0;
  const misc = spell.system?.attackMisc ?? 0;
  return abilityMod + edge + misc;
}

/**
 * @param {Actor} actor
 * @param {Item} spell
 * @returns {number}
 */
export function spellSaveDc(actor, spell) {
  const explicit = Number(spell.system?.saveDC) || 0;
  if (explicit > 0) return explicit;
  const abilityKey = spell.system?.castingAbility ?? "mnd";
  const abilityMod = actor.system.abilities?.[abilityKey]?.mod ?? 0;
  const level = Math.max(0, Number(spell.system?.level) || 0);
  return 10 + level + abilityMod;
}

/**
 * @param {string} formula
 * @param {number} misc
 * @returns {string}
 */
export function damageRollFormula(formula, misc = 0) {
  const base = String(formula ?? "").trim();
  if (!base) return "";
  const mod = Number(misc) || 0;
  if (!mod) return base;
  return mod > 0 ? `${base} + ${mod}` : `${base} - ${Math.abs(mod)}`;
}

/**
 * @param {string} damageOnSave
 * @param {boolean|null} saveFailed
 * @returns {number}
 */
export function damageMultiplier(damageOnSave, saveFailed) {
  const mode = damageOnSave ?? "none";
  if (mode === "full") return 1;
  if (saveFailed === null) return 1;
  if (saveFailed) return 1;
  return mode === "half" ? 0.5 : 0;
}
