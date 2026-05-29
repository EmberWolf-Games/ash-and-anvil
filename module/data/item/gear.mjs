const { NumberField, SchemaField, StringField, HTMLField } = foundry.data.fields;

export class GearData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ label: "ASHANVIL.Description" }),
      quantity: new NumberField({ integer: true, initial: 1, min: 0 }),
      weight: new NumberField({ required: false, initial: 0, min: 0 }),
      price: new SchemaField({
        value: new NumberField({ initial: 0, min: 0 }),
        denomination: new StringField({ initial: "gp" }),
      }),
    };
  }
}
