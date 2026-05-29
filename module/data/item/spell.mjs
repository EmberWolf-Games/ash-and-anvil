const { NumberField, StringField, HTMLField } = foundry.data.fields;

export class SpellData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ label: "ASHANVIL.Description" }),
      level: new NumberField({ integer: true, initial: 0, min: 0 }),
      school: new StringField({ initial: "", label: "ASHANVIL.SpellSchool" }),
    };
  }
}
