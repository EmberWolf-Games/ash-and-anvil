import {
  ABILITY_KEYS,
  MAX_TOTAL_LEVEL,
  SAVE_KEYS,
  SKILL_KEYS,
} from "../../rules/constants.mjs";
import { EQUIPMENT_SLOT_IDS } from "../../config/equipment-slots.mjs";

const { NumberField, SchemaField, HTMLField, StringField, BooleanField, ArrayField } =
  foundry.data.fields;

function abilityFields() {
  return Object.fromEntries(
    ABILITY_KEYS.map((key) => [
      key,
      new SchemaField({
        value: new NumberField({ integer: true, initial: 10, min: 0, max: 50 }),
        mod: new NumberField({ integer: true, initial: 0 }),
      }),
    ])
  );
}

function saveFields() {
  return Object.fromEntries(
    SAVE_KEYS.map((key) => [
      key,
      new SchemaField({
        trained: new BooleanField({ initial: false }),
        misc: new NumberField({ integer: true, initial: 0 }),
        total: new NumberField({ integer: true, initial: 0 }),
      }),
    ])
  );
}

function skillEntryFields() {
  return Object.fromEntries(
    SKILL_KEYS.map((key) => [
      key,
      new SchemaField({
        spRanks: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.SkillSpRanks" }),
        moneyRanks: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.SkillMoneyRanks" }),
        misc: new NumberField({ integer: true, initial: 0 }),
        bonus: new NumberField({ integer: true, initial: 0 }),
        custom: new BooleanField({ initial: false }),
      }),
    ])
  );
}

/** Shared biography / identity fields on the Biography tab. */
function biographyFields() {
  return {
    alignment: new StringField({ initial: "", label: "ASHANVIL.BioAlignment" }),
    faith: new StringField({ initial: "", label: "ASHANVIL.BioFaith" }),
    gender: new StringField({ initial: "", label: "ASHANVIL.BioGender" }),
    lifestyle: new StringField({ initial: "", label: "ASHANVIL.BioLifestyle" }),
    eyeColor: new StringField({ initial: "", label: "ASHANVIL.BioEyeColor" }),
    hairColor: new StringField({ initial: "", label: "ASHANVIL.BioHairColor" }),
    skinColor: new StringField({ initial: "", label: "ASHANVIL.BioSkinColor" }),
    height: new StringField({ initial: "", label: "ASHANVIL.BioHeight" }),
    weight: new StringField({ initial: "", label: "ASHANVIL.BioWeight" }),
    age: new StringField({ initial: "", label: "ASHANVIL.BioAge" }),
    ideals: new HTMLField({ initial: "", label: "ASHANVIL.BioIdeals" }),
    bonds: new HTMLField({ initial: "", label: "ASHANVIL.BioBonds" }),
    flaws: new HTMLField({ initial: "", label: "ASHANVIL.BioFlaws" }),
    fears: new HTMLField({ initial: "", label: "ASHANVIL.BioFears" }),
    quirks: new HTMLField({ initial: "", label: "ASHANVIL.BioQuirks" }),
    personalityTraits: new HTMLField({ initial: "", label: "ASHANVIL.BioPersonalityTraits" }),
    appearance: new HTMLField({ initial: "", label: "ASHANVIL.BioAppearance" }),
    backstory: new HTMLField({ initial: "", label: "ASHANVIL.BioBackstory" }),
    lineage: new StringField({ initial: "", label: "ASHANVIL.Lineage" }),
    lineageNotes: new HTMLField({ initial: "", label: "ASHANVIL.LineageNotes" }),
    isVampire: new BooleanField({ initial: false, label: "ASHANVIL.HeritageVampire" }),
    isLycanthrope: new BooleanField({ initial: false, label: "ASHANVIL.HeritageLycanthrope" }),
  };
}

function equipmentSlotFields() {
  return Object.fromEntries(
    EQUIPMENT_SLOT_IDS.map((id) => [id, new StringField({ initial: "" })])
  );
}

export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      attributes: new SchemaField({
        primaryClassLevel: new NumberField({
          integer: true,
          initial: 1,
          min: 0,
          max: MAX_TOTAL_LEVEL,
          label: "ASHANVIL.PrimaryClassLevel",
        }),
        secondaryClassLevel: new NumberField({
          integer: true,
          initial: 0,
          min: 0,
          max: MAX_TOTAL_LEVEL,
          label: "ASHANVIL.SecondaryClassLevel",
        }),
        classLevel: new NumberField({
          integer: true,
          initial: 1,
          min: 1,
          max: MAX_TOTAL_LEVEL,
          label: "ASHANVIL.ClassLevel",
        }),
        totalLevel: new NumberField({
          integer: true,
          initial: 1,
          min: 1,
          max: MAX_TOTAL_LEVEL,
          label: "ASHANVIL.TotalLevel",
        }),
        level: new NumberField({
          integer: true,
          initial: 1,
          min: 1,
          max: MAX_TOTAL_LEVEL,
          label: "ASHANVIL.Level",
        }),
        health: new SchemaField({
          value: new NumberField({ integer: true, initial: 10, min: 0, label: "ASHANVIL.HealthValue" }),
          max: new NumberField({ integer: true, initial: 10, min: 0, label: "ASHANVIL.HealthMax" }),
          temp: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.HealthTemp" }),
        }),
        quickness: new NumberField({ integer: true, initial: 0, label: "ASHANVIL.Quickness" }),
        deathSaves: new SchemaField({
          successes: new NumberField({ integer: true, initial: 0, min: 0, max: 3 }),
          failures: new NumberField({ integer: true, initial: 0, min: 0, max: 3 }),
          stabilized: new BooleanField({ initial: false, label: "ASHANVIL.DeathSaveStabilized" }),
          isDead: new BooleanField({ initial: false, label: "ASHANVIL.DeathSaveDead" }),
        }),
        favor: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.Favor" }),
        experience: new SchemaField({
          value: new NumberField({
            integer: true,
            initial: 0,
            min: 0,
            label: "ASHANVIL.Experience",
          }),
        }),
      }),
      abilities: new SchemaField(abilityFields(), { label: "ASHANVIL.Abilities" }),
      saves: new SchemaField(saveFields(), { label: "ASHANVIL.SavingThrows" }),
      skills: new SchemaField({
        pointsAvailable: new NumberField({ integer: true, initial: 16, min: 0 }),
        maxRanks: new NumberField({ integer: true, initial: 4, min: 0 }),
        classSkills: new ArrayField(new StringField(), { label: "ASHANVIL.ClassSkills" }),
        entries: new SchemaField(skillEntryFields()),
        custom: new ArrayField(
          new SchemaField({
            id: new StringField({ required: true }),
            label: new StringField({ required: true }),
            ability: new StringField({ initial: "mnd" }),
            spRanks: new NumberField({ integer: true, initial: 0, min: 0 }),
            moneyRanks: new NumberField({ integer: true, initial: 0, min: 0 }),
            misc: new NumberField({ integer: true, initial: 0 }),
            bonus: new NumberField({ integer: true, initial: 0 }),
          })
        ),
      }),
      proficiency: new SchemaField({
        edge: new NumberField({ integer: true, initial: 2, label: "ASHANVIL.Edge" }),
      }),
      speed: new SchemaField({
        baseWalk: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.SpeedBaseWalk" }),
        walk: new NumberField({ integer: true, initial: 30, min: 0, label: "ASHANVIL.SpeedWalk" }),
        fly: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.SpeedFly" }),
        hover: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.SpeedHover" }),
        swim: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.SpeedSwim" }),
        climb: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.SpeedClimb" }),
        burrow: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.SpeedBurrow" }),
      }),
      defense: new SchemaField({
        armorCategory: new StringField({ initial: "none", label: "ASHANVIL.ArmorCategory" }),
        ac: new SchemaField({
          base: new NumberField({ integer: true, initial: 10 }),
          armor: new NumberField({ integer: true, initial: 0 }),
          shield: new NumberField({ integer: true, initial: 0 }),
          misc: new NumberField({ integer: true, initial: 0 }),
          total: new NumberField({ integer: true, initial: 10 }),
        }),
        touchAc: new NumberField({ integer: true, initial: 10 }),
      }),
      defenses: new SchemaField({
        resistances: new ArrayField(new StringField()),
        immunities: new ArrayField(new StringField()),
        vulnerabilities: new ArrayField(new StringField()),
        conditionImmunities: new ArrayField(new StringField()),
      }),
      proficiencies: new SchemaField({
        armorLight: new BooleanField({ initial: false, label: "ASHANVIL.ProfArmorLight" }),
        armorMedium: new BooleanField({ initial: false, label: "ASHANVIL.ProfArmorMedium" }),
        armorHeavy: new BooleanField({ initial: false, label: "ASHANVIL.ProfArmorHeavy" }),
        weapons: new ArrayField(new StringField()),
        tools: new ArrayField(new StringField()),
        languages: new ArrayField(new StringField()),
        gameSets: new ArrayField(new StringField()),
        notes: new StringField({ initial: "" }),
      }),
      currency: new SchemaField({
        value: new NumberField({
          integer: true,
          initial: 0,
          min: 0,
          label: "ASHANVIL.CurrencyValue",
        }),
      }),
      resources: new SchemaField({
        mana: new SchemaField({
          value: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.ResourceManaValue" }),
          max: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.ResourceManaMax" }),
          bonus: new NumberField({ integer: true, initial: 0, label: "ASHANVIL.ResourceBonus" }),
        }),
        focus: new SchemaField({
          value: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.ResourceFocusValue" }),
          max: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.ResourceFocusMax" }),
          bonus: new NumberField({ integer: true, initial: 0, label: "ASHANVIL.ResourceBonus" }),
        }),
        favor: new SchemaField({
          value: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.ResourceFavorValue" }),
          max: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.ResourceFavorMax" }),
          bonus: new NumberField({ integer: true, initial: 0, label: "ASHANVIL.ResourceBonus" }),
        }),
      }),
      equipment: new SchemaField(equipmentSlotFields(), { label: "ASHANVIL.Equipment" }),
      inventory: new SchemaField({
        totalWeight: new NumberField({ initial: 0, min: 0, label: "ASHANVIL.TotalWeight" }),
        notes: new StringField({ initial: "", label: "ASHANVIL.InventoryNotes" }),
        encumbrance: new SchemaField({
          tier: new StringField({ initial: "normal" }),
          attackBane: new NumberField({ integer: true, initial: 0 }),
          current: new NumberField({ initial: 0, min: 0 }),
          max: new NumberField({ initial: 0, min: 0 }),
          lightThreshold: new NumberField({ initial: 0, min: 0 }),
          heavyThreshold: new NumberField({ initial: 0, min: 0 }),
          bodyWeight: new NumberField({ initial: 0, min: 0 }),
          wornWeight: new NumberField({ initial: 0, min: 0 }),
          carriedWeight: new NumberField({ initial: 0, min: 0 }),
          effectiveWalk: new NumberField({ integer: true, initial: 30, min: 0 }),
          baseWalk: new NumberField({ integer: true, initial: 30, min: 0 }),
        }),
      }),
      details: new SchemaField({
        ancestryId: new StringField({ initial: "", label: "ASHANVIL.Ancestry" }),
        secondaryAncestryId: new StringField({ initial: "", label: "ASHANVIL.SecondaryAncestry" }),
        classId: new StringField({ initial: "", label: "ASHANVIL.Class" }),
        secondaryClassId: new StringField({ initial: "", label: "ASHANVIL.SecondaryClass" }),
        backgroundId: new StringField({ initial: "", label: "ASHANVIL.Background" }),
        subrace: new StringField({ initial: "", label: "ASHANVIL.Subrace" }),
        primarySubclass: new StringField({ initial: "", label: "ASHANVIL.PrimarySubclass" }),
        secondarySubclass: new StringField({ initial: "", label: "ASHANVIL.SecondarySubclass" }),
        ...biographyFields(),
      }),
      chargen: new SchemaField({
        buildComplete: new BooleanField({ initial: false, label: "ASHANVIL.BuildComplete" }),
        buildVersion: new StringField({ initial: "", label: "ASHANVIL.BuildVersion" }),
      }),
      conditions: new SchemaField({
        active: new ArrayField(new StringField()),
      }),
    };
  }
}
