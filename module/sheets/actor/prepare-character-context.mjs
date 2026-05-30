import { ABILITIES, ABILITY_KEYS, SKILL_DEFINITIONS, SKILL_KEYS } from "../../rules/constants.mjs";

import { getCharacterSheetParams } from "../../config/sheet-params.mjs";
import {
  ALIGNMENT_OPTIONS,
  GENDER_OPTIONS,
  LIFESTYLE_OPTIONS,
  localizeOptions,
} from "../../config/character-options.mjs";

import { prepareDetailsTabContext } from "./prepare-details-context.mjs";

import { prepareEffectsTabContext } from "./prepare-effects-context.mjs";

import { prepareEquipmentTabContext } from "./prepare-equipment-context.mjs";

import { prepareInventoryTabContext } from "./prepare-inventory-context.mjs";

import { preparePowersTabContext } from "./prepare-powers-context.mjs";

import { itemRow, itemSummary } from "./prepare-sheet-items.mjs";



/**

 * @param {Actor} actor

 * @param {object} [options]

 * @param {boolean} [options.editable]

 * @returns {object}

 */

export function prepareCharacterSheetContext(actor, options = {}) {

  const system = actor.system;

  const editable = options.editable ?? actor.isOwner;

  const sheetParams = getCharacterSheetParams(actor);



  const buildItem = (type) => actor.items.find((i) => i.type === type) ?? null;



  const ancestryItem = buildItem("ancestry");

  const classItem = buildItem("class");

  const backgroundItem = buildItem("background");



  const abilityRows = ABILITY_KEYS.map((key) => ({

    key,

    ability: system.abilities?.[key] ?? { value: 10, mod: 0 },

    label: game.i18n.localize(ABILITIES[key].label),

    short: ABILITIES[key].abbr,

  }));



  const skillRows = SKILL_KEYS.map((key) => ({

    key,

    label: game.i18n.localize(SKILL_DEFINITIONS[key].label),

    abilityKey: SKILL_DEFINITIONS[key].ability,

    abilityLabel: game.i18n.localize(ABILITIES[SKILL_DEFINITIONS[key].ability]?.label ?? key),

    skill: system.skills?.entries?.[key] ?? { ranks: 0, bonus: 0 },

  }));



  const skillGroups = ABILITY_KEYS.map((abilityKey) => ({

    abilityKey,

    abilityLabel: game.i18n.localize(ABILITIES[abilityKey].label),

    skills: skillRows.filter((row) => row.abilityKey === abilityKey),

  })).filter((group) => group.skills.length > 0);



  const features = actor.items.filter((i) => i.type === "feature");

  const gear = actor.items.filter((i) => i.type === "gear");

  const spells = actor.items.filter((i) => i.type === "spell");



  const level = system.attributes?.level ?? 1;

  const health = system.attributes?.health ?? { value: 0, max: 0, temp: 0 };

  const initiative = system.attributes?.initiative?.mod ?? 0;

  const edge = system.proficiency?.edge ?? 2;

  const hitDie = classItem?.system?.hitDie ?? null;



  const base = {

    sheetParams,

    layout: sheetParams.layout,

    tabs: sheetParams.tabs,

    subTabs: sheetParams.subTabs,

    activeTab: sheetParams.tabs.find((t) => t.default)?.id ?? sheetParams.tabs[0]?.id ?? "details",



    bio: {

      alignment: system.details?.alignment ?? "",

      faith: system.details?.faith ?? "",

      gender: system.details?.gender ?? "",
      lifestyle: system.details?.lifestyle ?? "",

      eyeColor: system.details?.eyeColor ?? "",

      hairColor: system.details?.hairColor ?? "",

      skinColor: system.details?.skinColor ?? "",

      height: system.details?.height ?? "",

      weight: system.details?.weight ?? "",

      age: system.details?.age ?? "",

      ideals: system.details?.ideals ?? "",

      bonds: system.details?.bonds ?? "",

      flaws: system.details?.flaws ?? "",

      fears: system.details?.fears ?? "",

      quirks: system.details?.quirks ?? "",

      personalityTraits: system.details?.personalityTraits ?? "",

      appearance: system.details?.appearance ?? "",

      backstory: system.details?.backstory ?? system.details?.biography ?? "",

    },



    buildComplete: system.chargen?.buildComplete ?? false,

    buildVersion: system.chargen?.buildVersion ?? "",

    editable,

    bioOptions: {
      genders: localizeOptions(GENDER_OPTIONS),
      alignments: localizeOptions(ALIGNMENT_OPTIONS),
      lifestyles: localizeOptions(LIFESTYLE_OPTIONS),
    },

    sheetEditMode: options.sheetEditMode ?? false,
    canAdjustResources: options.canAdjustResources ?? options.editable ?? false,
    isGM: game.user.isGM,
    changeLog: options.changeLog ?? [],



    identity: {

      ancestry: itemSummary(ancestryItem),

      class: itemSummary(classItem),

      background: itemSummary(backgroundItem),

    },



    combat: {

      level,

      health,

      initiative,

      edge,

      hitDie,

      hpDisplay: `${health.value ?? 0}${health.temp ? ` (+${health.temp})` : ""} / ${health.max ?? 0}`,

    },



    abilityRows,

    skillRows,

    skillGroups,



    items: {

      features: features.map(itemRow),

      gear: gear.map(itemRow),

      spells: spells.map(itemRow),

      build: {

        ancestry: itemSummary(ancestryItem),

        class: itemSummary(classItem),

        background: itemSummary(backgroundItem),

      },

    },



    /** Legacy flat keys — existing templates; remove after layout pass */

    edge,

    ancestryName: ancestryItem?.name ?? "—",

    className: classItem?.name ?? "—",

    backgroundName: backgroundItem?.name ?? "—",

  };



  const detailsCtx = prepareDetailsTabContext(actor, base);

  const inventoryCtx = prepareInventoryTabContext(actor, {
    openContainerId: options.openContainerId ?? null,
  });

  const equipmentCtx = prepareEquipmentTabContext(actor);

  const powersCtx = preparePowersTabContext(actor);

  const effectsCtx = prepareEffectsTabContext(actor);



  return {

    ...base,

    ...detailsCtx,

    ...inventoryCtx,

    ...equipmentCtx,

    ...powersCtx,

    ...effectsCtx,

    combat: { ...base.combat, ...detailsCtx.combat },

  };

}

