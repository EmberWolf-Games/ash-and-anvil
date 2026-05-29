const { HTMLField, StringField } = foundry.data.fields;

export class FeatureData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ label: "ASHANVIL.Description" }),
      key: new StringField({ initial: "", label: "ASHANVIL.FeatureKey" }),
    };
  }
}
