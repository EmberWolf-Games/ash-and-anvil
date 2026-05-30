const { NumberField, StringField, HTMLField, BooleanField } = foundry.data.fields;

export const SPELL_TRADITIONS = ["arcane", "psionic", "divine"];
export const SPELL_DAMAGE_ON_SAVE = ["none", "half", "full"];
export const SPELL_CASTING_ABILITIES = ["mgt", "agi", "vit", "mnd", "ins", "cha"];

export class SpellData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ label: "ASHANVIL.Description" }),
      level: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.SpellLevel" }),
      school: new StringField({ initial: "", label: "ASHANVIL.SpellSchool" }),
      tradition: new StringField({ initial: "arcane", label: "ASHANVIL.SpellTradition" }),
      prepared: new BooleanField({ initial: false, label: "ASHANVIL.SpellPrepared" }),
      requiresAttack: new BooleanField({ initial: false, label: "ASHANVIL.SpellRequiresAttack" }),
      requiresSave: new BooleanField({ initial: false, label: "ASHANVIL.SpellRequiresSave" }),
      saveAbility: new StringField({ initial: "for", label: "ASHANVIL.SpellSaveAbility" }),
      saveDC: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.SpellSaveDC" }),
      damageFormula: new StringField({ initial: "", label: "ASHANVIL.SpellDamageFormula" }),
      damageOnSave: new StringField({
        initial: "none",
        choices: Object.fromEntries(SPELL_DAMAGE_ON_SAVE.map((k) => [k, k])),
        label: "ASHANVIL.SpellDamageOnSave",
      }),
      castingAbility: new StringField({
        initial: "mnd",
        choices: Object.fromEntries(SPELL_CASTING_ABILITIES.map((k) => [k, k])),
        label: "ASHANVIL.SpellCastingAbility",
      }),
      attackMisc: new NumberField({ integer: true, initial: 0, label: "ASHANVIL.Misc" }),
      damageMisc: new NumberField({ integer: true, initial: 0, label: "ASHANVIL.SpellDamageMisc" }),
    };
  }
}
