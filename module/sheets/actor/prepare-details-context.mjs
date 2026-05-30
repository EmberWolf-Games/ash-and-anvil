import {
  ABILITIES,
  ABILITY_KEYS,
  ANCESTRY_FEATURE_LEVELS,
  ARMOR_CATEGORIES,
  MAX_CLASSES,
  MAX_TOTAL_LEVEL,
  SAVE_KEYS,
  SAVES,
  SKILL_DEFINITIONS,
  SKILL_KEYS,
} from "../../rules/constants.mjs";
import { spentSkillPoints } from "../../rules/skills.mjs";

/**
 * @param {Actor} actor
 * @returns {Item[]}
 */
function classItems(actor) {
  return actor.items.filter((i) => i.type === "class");
}

/**
 * @param {Actor} actor
 * @returns {Item[]}
 */
function ancestryItems(actor) {
  return actor.items.filter((i) => i.type === "ancestry");
}

/**
 * @param {Actor} actor
 * @param {object} baseContext
 */
export function prepareDetailsTabContext(actor, baseContext) {
  const system = actor.system;
  const ancestries = ancestryItems(actor);
  const classes = classItems(actor);
  const primaryAncestry = ancestries[0] ?? null;
  const secondaryAncestry = ancestries[1] ?? null;
  const primaryClass = classes[0] ?? null;
  const secondaryClass = classes[1] ?? null;

  const abilityRows = ABILITY_KEYS.map((key) => ({
    key,
    abbr: ABILITIES[key].abbr,
    label: game.i18n.localize(ABILITIES[key].label),
    ability: system.abilities?.[key] ?? { value: 10, mod: 0 },
  }));

  const saveRows = SAVE_KEYS.map((key) => ({
    key,
    abbr: SAVES[key].abbr,
    label: game.i18n.localize(SAVES[key].label),
    save: system.saves?.[key] ?? { trained: false, misc: 0, total: 0 },
  }));

  const skillRows = SKILL_KEYS.map((key) => ({
    key,
    label: game.i18n.localize(SKILL_DEFINITIONS[key].label),
    abilityAbbr: ABILITIES[SKILL_DEFINITIONS[key].ability]?.abbr ?? "",
    entry: system.skills?.entries?.[key] ?? { ranks: 0, misc: 0, bonus: 0 },
  }));

  const customSkillRows = (system.skills?.custom ?? []).map((entry, index) => ({
    index,
    id: entry.id,
    label: entry.label,
    abilityAbbr: ABILITIES[entry.ability]?.abbr ?? entry.ability,
    entry,
  }));

  const prof = system.proficiencies ?? {};
  const speed = system.speed ?? {};
  const defense = system.defense ?? {};
  const defenses = system.defenses ?? {};
  const totalLevel = system.attributes?.totalLevel ?? 1;

  return {
    details: {
      name: actor.name,
      portrait: actor.img,
      ancestry: primaryAncestry?.name ?? "—",
      secondaryAncestry: secondaryAncestry?.name ?? "—",
      ancestryBlended: !!secondaryAncestry,
      className: primaryClass?.name ?? "—",
      secondaryClassName: secondaryClass?.name ?? "—",
      multiClass: classes.length > 1,
      primaryClassLevel: system.attributes?.primaryClassLevel ?? 1,
      secondaryClassLevel: system.attributes?.secondaryClassLevel ?? 0,
      totalLevel,
      maxTotalLevel: MAX_TOTAL_LEVEL,
      maxClasses: MAX_CLASSES,
      lineage: system.details?.lineage ?? "",
      lineageNotes: system.details?.lineageNotes ?? "",
      ancestryFeatureLevels: ANCESTRY_FEATURE_LEVELS,
      buildComplete: baseContext.buildComplete,
    },
    abilityRows,
    saveRows,
    skillRows,
    customSkillRows,
    skillsMeta: {
      pointsAvailable: system.skills?.pointsAvailable ?? 0,
      pointsSpent: spentSkillPoints(system),
      maxRanks: system.skills?.maxRanks ?? 4,
    },
    combat: {
      health: system.attributes?.health ?? { value: 0, max: 0, temp: 0 },
      deathSaves: system.attributes?.deathSaves ?? { successes: 0, failures: 0 },
      favor: system.attributes?.favor ?? 0,
      quickness: system.attributes?.quickness ?? 0,
      edge: system.proficiency?.edge ?? 0,
    },
    defense: {
      ac: defense.ac ?? { base: 10, armor: 0, shield: 0, misc: 0, total: 10 },
      touchAc: defense.touchAc ?? 10,
      armorCategory: defense.armorCategory ?? "none",
      armorCategories: ARMOR_CATEGORIES,
    },
    speed,
    proficiencies: {
      armorLight: prof.armorLight ?? false,
      armorMedium: prof.armorMedium ?? false,
      armorHeavy: prof.armorHeavy ?? false,
      weapons: prof.weapons ?? "",
      tools: prof.tools ?? "",
      languages: prof.languages ?? "",
      gameSets: prof.gameSets ?? "",
      notes: prof.notes ?? "",
    },
    defenses,
    heritage: {
      isVampire: system.details?.isVampire ?? false,
      isLycanthrope: system.details?.isLycanthrope ?? false,
    },
  };
}

/**
 * @param {object} proficienciesForm
 * @returns {object}
 */
export function parseProficiencyLists(proficienciesForm) {
  const split = (val) =>
    String(val ?? "")
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  return {
    weapons: split(proficienciesForm.weapons),
    tools: split(proficienciesForm.tools),
    languages: split(proficienciesForm.languages),
    gameSets: split(proficienciesForm.gameSets),
  };
}
