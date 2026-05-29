import { ABILITY_KEYS, SKILL_KEYS } from "../../rules/constants.mjs";

const { NumberField, SchemaField, HTMLField, StringField, BooleanField } = foundry.data.fields;

/** Shared biography / identity fields on the Biography tab. */
function biographyFields() {
  return {
    alignment: new StringField({ initial: "", label: "ASHANVIL.BioAlignment" }),
    faith: new StringField({ initial: "", label: "ASHANVIL.BioFaith" }),
    gender: new StringField({ initial: "", label: "ASHANVIL.BioGender" }),
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
  };
}

export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const abilityFields = Object.fromEntries(
      ABILITY_KEYS.map((key) => [
        key,
        new SchemaField({
          value: new NumberField({ integer: true, initial: 10, min: 3, max: 20 }),
          mod: new NumberField({ integer: true, initial: 0 }),
        }),
      ])
    );

    const skillFields = Object.fromEntries(
      SKILL_KEYS.map((key) => [
        key,
        new SchemaField({
          trained: new BooleanField({ initial: false }),
          bonus: new NumberField({ integer: true, initial: 0 }),
        }),
      ])
    );

    return {
      attributes: new SchemaField({
        level: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          positive: true,
          initial: 1,
          label: "ASHANVIL.Level",
        }),
        health: new SchemaField({
          value: new NumberField({ integer: true, initial: 10, min: 0, label: "ASHANVIL.HealthValue" }),
          max: new NumberField({ integer: true, initial: 10, min: 0, label: "ASHANVIL.HealthMax" }),
          temp: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.HealthTemp" }),
        }),
        initiative: new SchemaField({
          mod: new NumberField({ integer: true, initial: 0, label: "ASHANVIL.InitiativeMod" }),
        }),
      }),
      abilities: new SchemaField(abilityFields, { label: "ASHANVIL.Abilities" }),
      skills: new SchemaField(skillFields, { label: "ASHANVIL.Skills" }),
      proficiency: new SchemaField({
        edge: new NumberField({ integer: true, initial: 2, label: "ASHANVIL.Edge" }),
      }),
      details: new SchemaField({
        ancestryId: new StringField({ initial: "", label: "ASHANVIL.Ancestry" }),
        classId: new StringField({ initial: "", label: "ASHANVIL.Class" }),
        backgroundId: new StringField({ initial: "", label: "ASHANVIL.Background" }),
        ...biographyFields(),
      }),
      chargen: new SchemaField({
        buildComplete: new BooleanField({ initial: false, label: "ASHANVIL.BuildComplete" }),
        buildVersion: new StringField({ initial: "", label: "ASHANVIL.BuildVersion" }),
      }),
    };
  }
}
