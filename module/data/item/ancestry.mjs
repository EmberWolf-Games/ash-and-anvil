import { ABILITY_KEYS } from "../../rules/constants.mjs";

const { NumberField, SchemaField, StringField, HTMLField, ArrayField } = foundry.data.fields;

const adjustmentFields = Object.fromEntries(
  ABILITY_KEYS.map((key) => [key, new NumberField({ integer: true, initial: 0 })])
);

export class AncestryData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ label: "ASHANVIL.Description" }),
      size: new StringField({ initial: "med", label: "ASHANVIL.Size" }),
      speed: new NumberField({ integer: true, initial: 30, min: 0, label: "ASHANVIL.Speed" }),
      abilityAdjustments: new SchemaField(adjustmentFields, { label: "ASHANVIL.AbilityAdjustments" }),
      featureKeys: new ArrayField(new StringField(), { label: "ASHANVIL.FeatureKeys" }),
    };
  }
}
