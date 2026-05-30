import {
  CASTER_PROGRESSION_TYPES,
  POWER_POOL_TYPES,
  SPELLCASTING_ABILITIES,
} from "../../rules/caster-resources.mjs";

const { NumberField, SchemaField, HTMLField, StringField, ArrayField } = foundry.data.fields;

export class ClassData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ label: "ASHANVIL.Description" }),
      hitDie: new NumberField({ integer: true, initial: 8, min: 4, max: 12, label: "ASHANVIL.HitDie" }),
      skillPointsPerLevel: new NumberField({
        integer: true,
        initial: 2,
        min: 1,
        max: 12,
        label: "ASHANVIL.SkillPointsPerLevel",
      }),
      skillChoices: new NumberField({ integer: true, initial: 2, min: 0, label: "ASHANVIL.SkillChoices" }),
      skillPool: new ArrayField(new StringField(), { label: "ASHANVIL.SkillPool" }),
      featureKeys: new ArrayField(new StringField(), { label: "ASHANVIL.FeatureKeys" }),
      casterProgression: new StringField({
        initial: "none",
        choices: Object.fromEntries(CASTER_PROGRESSION_TYPES.map((k) => [k, k])),
        label: "ASHANVIL.CasterProgression",
      }),
      powerPool: new StringField({
        initial: "none",
        choices: Object.fromEntries(POWER_POOL_TYPES.map((k) => [k, k])),
        label: "ASHANVIL.PowerPool",
      }),
      spellcastingAbility: new StringField({
        initial: "mnd",
        choices: Object.fromEntries(SPELLCASTING_ABILITIES.map((k) => [k, k])),
        label: "ASHANVIL.SpellcastingAbility",
      }),
    };
  }
}
