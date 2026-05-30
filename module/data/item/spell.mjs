const { NumberField, StringField, HTMLField, BooleanField } = foundry.data.fields;

export const SPELL_TRADITIONS = ["arcane", "psionic", "divine"];

export class SpellData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ label: "ASHANVIL.Description" }),
      level: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.SpellLevel" }),
      school: new StringField({ initial: "", label: "ASHANVIL.SpellSchool" }),
      tradition: new StringField({ initial: "arcane", label: "ASHANVIL.SpellTradition" }),
      prepared: new BooleanField({ initial: false, label: "ASHANVIL.SpellPrepared" }),
    };
  }
}
