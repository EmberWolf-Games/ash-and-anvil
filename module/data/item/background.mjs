const { SchemaField, StringField, HTMLField, ArrayField } = foundry.data.fields;

export class BackgroundData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ label: "ASHANVIL.Description" }),
      trainedSkills: new ArrayField(new StringField(), { label: "ASHANVIL.TrainedSkills" }),
      starterGear: new StringField({ initial: "", label: "ASHANVIL.StarterGear" }),
      featureKeys: new ArrayField(new StringField(), { label: "ASHANVIL.FeatureKeys" }),
    };
  }
}
