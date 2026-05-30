import { applyAbilityMods } from "./ability.mjs";

import { ABILITY_KEYS, MAX_TOTAL_LEVEL, SKILL_KEYS } from "./constants.mjs";

import { getRulesConfig } from "./config.mjs";

import { migrateLegacyCurrency } from "./currency.mjs";

import { deriveDefense } from "./defense.mjs";

import { totalCarriedWeight } from "./inventory.mjs";

import { edgeBonus } from "./proficiency.mjs";

import { deriveSaves } from "./saves.mjs";

import { defaultSkillPoints, deriveSkills, ensureSkillEntries } from "./skills.mjs";

import { aaRules } from "../helpers/logger.mjs";

import { EQUIPMENT_SLOT_IDS } from "../config/equipment-slots.mjs";



const SYSTEM_ID = "ash-and-anvil";



/**

 * Guard early document init when TypeDataModel defaults are not applied yet.

 * @param {object} system

 */

export function ensureCharacterStructure(system) {

  system.attributes ??= {};

  system.attributes.primaryClassLevel ??= system.attributes.classLevel ?? 1;

  system.attributes.secondaryClassLevel ??= 0;

  system.attributes.classLevel ??= 1;

  system.attributes.totalLevel ??= system.attributes.level ?? 1;

  system.attributes.level = system.attributes.totalLevel;

  system.attributes.health ??= { value: 10, max: 10, temp: 0 };

  system.attributes.quickness ??= 0;

  system.attributes.deathSaves ??= { successes: 0, failures: 0 };

  system.attributes.favor ??= 0;

  system.proficiency ??= {};

  system.proficiency.edge ??= 2;

  system.details ??= {};

  system.chargen ??= { buildComplete: false, buildVersion: "" };

  system.abilities ??= {};

  for (const key of ABILITY_KEYS) {

    system.abilities[key] ??= { value: 10, mod: 0 };

  }

  ensureSkillEntries(system);

  system.skills.pointsAvailable ??= defaultSkillPoints(system.attributes.totalLevel);

  system.speed ??= { walk: 30, fly: 0, hover: 0, swim: 0, climb: 0, burrow: 0 };

  system.proficiencies ??= {

    armorLight: false,

    armorMedium: false,

    armorHeavy: false,

    weapons: "",

    tools: "",

    languages: "",

    gameSets: "",

    notes: "",

  };

  system.defense ??= {

    armorCategory: "none",

    ac: { base: 10, armor: 0, shield: 0, misc: 0, total: 10 },

    touchAc: 10,

  };

  system.defenses ??= {

    resistances: "",

    immunities: "",

    vulnerabilities: "",

    conditionImmunities: "",

  };

  if (system.currency?.pp != null || system.currency?.gp != null) {

    system.currency = { value: migrateLegacyCurrency(system.currency) };

  }

  system.currency ??= { value: 0 };

  system.currency.value ??= 0;

  system.inventory ??= { totalWeight: 0, notes: "" };

  system.equipment ??= {};

  for (const slotId of EQUIPMENT_SLOT_IDS) {

    system.equipment[slotId] ??= "";

  }

  system.saves ??= {};

}



/**

 * @param {object} system

 */

function syncClassLevels(system) {
  let primary = Math.max(0, Number(system.attributes.primaryClassLevel) || 0);
  let secondary = Math.max(0, Number(system.attributes.secondaryClassLevel) || 0);
  if (primary + secondary > MAX_TOTAL_LEVEL) {
    secondary = Math.max(0, MAX_TOTAL_LEVEL - primary);
  }
  const totalLevel = Math.min(MAX_TOTAL_LEVEL, Math.max(1, primary + secondary || 1));
  if (!primary && !secondary) primary = 1;
  system.attributes.primaryClassLevel = primary || totalLevel;
  system.attributes.secondaryClassLevel = secondary;
  system.attributes.totalLevel = totalLevel;
  system.attributes.level = totalLevel;
  system.attributes.classLevel = totalLevel;
}



/**

 * @param {object} system

 */

function applyHeritageModifiers(system) {

  const vampire = system.details?.isVampire ?? false;

  const lycanthrope = system.details?.isLycanthrope ?? false;

  system.heritage ??= {};

  system.heritage.active = vampire ? "vampire" : lycanthrope ? "lycanthrope" : "none";

}



/**

 * @param {Actor} actor

 * @param {object} system

 */

function deriveInventory(actor, system) {

  system.inventory.totalWeight = totalCarriedWeight(actor);

}



/**

 * @param {Actor} actor

 */

export function deriveCharacter(actor) {

  if (actor.type !== "character") return;

  const system = actor.system;

  ensureCharacterStructure(system);



  applyAbilityMods(system.abilities);

  syncClassLevels(system);



  const totalLevel = system.attributes.totalLevel;

  const edge = edgeBonus(totalLevel);

  system.proficiency.edge = edge;

  system.attributes.quickness = (system.abilities?.agi?.mod ?? 0) + edge;



  deriveSaves(system);

  deriveDefense(system);

  deriveSkills(system);

  applyHeritageModifiers(system);

  deriveInventory(actor, system);



  const autoDerived = game.settings.get(SYSTEM_ID, "autoApplyDerived") ?? true;

  if (autoDerived) {

    system.skills.pointsAvailable = defaultSkillPoints(totalLevel);

    system.skills.maxRanks = Math.max(1, totalLevel + 3);

  }



  const rules = getRulesConfig();

  const classItems = actor.items.filter((i) => i.type === "class");

  const primaryClass =

    classItems.find((i) => i.id === system.details?.classId || i.uuid === system.details?.classId) ??

    classItems[0];

  const hitDie = primaryClass?.system?.hitDie ?? 8;

  const vitMod = system.abilities?.vit?.mod ?? 0;

  const perLevel = rules.grittyHp ? Math.max(1, Math.floor(hitDie / 2)) : Math.max(1, Math.floor(hitDie / 2) + vitMod);

  const maxHp = Math.max(1, hitDie + vitMod + perLevel * Math.max(0, totalLevel - 1));



  system.attributes.health ??= { value: maxHp, max: maxHp, temp: 0 };

  if (autoDerived || system.chargen?.buildComplete) {

    system.attributes.health.max = maxHp;

    if (system.attributes.health.value > maxHp) system.attributes.health.value = maxHp;

  } else if (!system.attributes.health.max) {

    system.attributes.health.max = maxHp;

    system.attributes.health.value = maxHp;

  }



  aaRules(`derive ${actor.name}`, {

    edge,

    maxHp,

    totalLevel,

    quickness: system.attributes.quickness,

    touchAc: system.defense.touchAc,

  });

}



/** @deprecated use ensureSkillEntries */

export function ensureSkillStructure(system) {

  ensureSkillEntries(system);

}



/**

 * Apply ancestry ability adjustments from linked item(s).

 * @param {object} system

 * @param {Item|null} ancestryItem

 * @param {Item|null} [secondaryAncestryItem]

 */

export function applyAncestryAdjustments(system, ancestryItem, secondaryAncestryItem = null) {

  for (const item of [ancestryItem, secondaryAncestryItem]) {

    if (!item?.system?.abilityAdjustments) continue;

    for (const key of ABILITY_KEYS) {

      const delta = item.system.abilityAdjustments[key] ?? 0;

      if (!delta) continue;

      system.abilities[key].value = Math.min(50, (system.abilities[key].value ?? 10) + delta);

    }

  }

  applyAbilityMods(system.abilities);

}

