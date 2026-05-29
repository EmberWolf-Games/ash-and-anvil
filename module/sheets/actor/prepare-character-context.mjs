import { SKILLS, SKILL_KEYS, ABILITY_KEYS } from "../../rules/constants.mjs";
import { getCharacterSheetParams } from "../../config/sheet-params.mjs";

const ABILITY_LABEL_KEYS = {
  mgt: "ASHANVIL.AbilityMgt",
  fin: "ASHANVIL.AbilityFin",
  res: "ASHANVIL.AbilityRes",
  ins: "ASHANVIL.AbilityIns",
  foc: "ASHANVIL.AbilityFoc",
  pre: "ASHANVIL.AbilityPre",
};

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
    label: game.i18n.localize(ABILITY_LABEL_KEYS[key] ?? key),
    short: key.toUpperCase(),
  }));

  const skillRows = SKILL_KEYS.map((key) => ({
    key,
    label: game.i18n.localize(SKILLS[key].label),
    abilityKey: SKILLS[key].ability,
    abilityLabel: game.i18n.localize(ABILITY_LABEL_KEYS[SKILLS[key].ability] ?? SKILLS[key].ability),
    skill: system.skills?.[key] ?? { trained: false, bonus: 0 },
  }));

  const skillGroups = ABILITY_KEYS.map((abilityKey) => ({
    abilityKey,
    abilityLabel: game.i18n.localize(ABILITY_LABEL_KEYS[abilityKey] ?? abilityKey),
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

  return {
    sheetParams,
    layout: sheetParams.layout,
    tabs: sheetParams.tabs,
    subTabs: sheetParams.subTabs,
    activeTab: sheetParams.tabs.find((t) => t.default)?.id ?? sheetParams.tabs[0]?.id ?? "details",

    bio: {
      alignment: system.details?.alignment ?? "",
      faith: system.details?.faith ?? "",
      gender: system.details?.gender ?? "",
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
}

/**
 * @param {Item|null} item
 */
function itemSummary(item) {
  if (!item) {
    return { id: null, name: "—", description: "", system: null, type: null };
  }
  const system =
    typeof item.system?.toObject === "function"
      ? item.system.toObject()
      : foundry.utils.deepClone(item.system ?? {});
  return {
    id: item.id,
    uuid: item.uuid,
    name: item.name,
    type: item.type,
    description: system.description ?? "",
    system,
  };
}

/**
 * @param {Item} item
 */
function itemRow(item) {
  const summary = itemSummary(item);
  return {
    ...summary,
    img: item.img,
  };
}
