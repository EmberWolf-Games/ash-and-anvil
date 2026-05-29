const { NumberField, SchemaField, StringField, HTMLField, ArrayField } = foundry.data.fields;

export class ClassData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ label: "ASHANVIL.Description" }),
      hitDie: new NumberField({ integer: true, initial: 8, min: 4, max: 12, label: "ASHANVIL.HitDie" }),
      skillChoices: new NumberField({ integer: true, initial: 2, min: 0, label: "ASHANVIL.SkillChoices" }),
      skillPool: new ArrayField(new StringField(), { label: "ASHANVIL.SkillPool" }),
      featureKeys: new ArrayField(new StringField(), { label: "ASHANVIL.FeatureKeys" }),
    };
  }
}
