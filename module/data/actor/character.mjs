const { NumberField, SchemaField, HTMLField, StringField } = foundry.data.fields;

export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
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
          value: new NumberField({
            integer: true,
            initial: 10,
            min: 0,
            label: "ASHANVIL.HealthValue",
          }),
          max: new NumberField({
            integer: true,
            initial: 10,
            min: 0,
            label: "ASHANVIL.HealthMax",
          }),
        }),
        initiative: new SchemaField({
          mod: new NumberField({
            integer: true,
            initial: 0,
            label: "ASHANVIL.InitiativeMod",
          }),
        }),
      }),
      abilities: new SchemaField(
        Object.fromEntries(
          ["str", "dex", "con", "int", "wis", "cha"].map((key) => [
            key,
            new SchemaField({
              value: new NumberField({ integer: true, initial: 10, min: 0, max: 30 }),
              mod: new NumberField({ integer: true, initial: 0 }),
            }),
          ])
        ),
        { label: "ASHANVIL.Abilities" }
      ),
      details: new SchemaField({
        ancestry: new StringField({ initial: "", label: "ASHANVIL.Ancestry" }),
        class: new StringField({ initial: "", label: "ASHANVIL.Class" }),
        biography: new HTMLField({ label: "ASHANVIL.Biography" }),
      }),
    };
  }
}
