import { ABILITY_KEYS } from "../../rules/constants.mjs";

const { NumberField, SchemaField, HTMLField, StringField } = foundry.data.fields;

export class NpcData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const abilityFields = Object.fromEntries(
      ABILITY_KEYS.map((key) => [
        key,
        new SchemaField({
          value: new NumberField({ integer: true, initial: 10, min: 0, max: 30 }),
          mod: new NumberField({ integer: true, initial: 0 }),
        }),
      ])
    );

    return {
      attributes: new SchemaField({
        health: new SchemaField({
          value: new NumberField({ integer: true, initial: 10, min: 0 }),
          max: new NumberField({ integer: true, initial: 10, min: 0 }),
        }),
        cr: new StringField({ initial: "", label: "ASHANVIL.Challenge" }),
      }),
      abilities: new SchemaField(abilityFields),
      details: new SchemaField({
        biography: new HTMLField({ label: "ASHANVIL.Biography" }),
      }),
    };
  }
}
