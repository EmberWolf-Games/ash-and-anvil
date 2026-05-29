const { NumberField, SchemaField, HTMLField, StringField } = foundry.data.fields;

export class NpcData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      attributes: new SchemaField({
        health: new SchemaField({
          value: new NumberField({ integer: true, initial: 10, min: 0 }),
          max: new NumberField({ integer: true, initial: 10, min: 0 }),
        }),
        cr: new StringField({ initial: "", label: "ASHANVIL.Challenge" }),
      }),
      details: new SchemaField({
        biography: new HTMLField({ label: "ASHANVIL.Biography" }),
      }),
    };
  }
}
