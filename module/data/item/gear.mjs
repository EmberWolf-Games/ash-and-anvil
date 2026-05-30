const { NumberField, SchemaField, StringField, HTMLField, BooleanField } = foundry.data.fields;

export const CONTAINER_KINDS = ["backpack", "pouch", "quiver", "sheath", "bag", "other"];

export class GearData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ label: "ASHANVIL.Description" }),
      quantity: new NumberField({ integer: true, initial: 1, min: 0 }),
      weight: new NumberField({ required: false, initial: 0, min: 0 }),
      /** Price stored in base currency units (shards). */
      price: new SchemaField({
        value: new NumberField({ initial: 0, min: 0 }),
      }),
      isContainer: new BooleanField({ initial: false, label: "ASHANVIL.IsContainer" }),
      containerKind: new StringField({ initial: "", label: "ASHANVIL.ContainerKind" }),
      containerCapacity: new NumberField({ integer: true, initial: 0, min: 0, label: "ASHANVIL.ContainerCapacity" }),
      /** Parent container item id on this actor. */
      containerId: new StringField({ initial: "", label: "ASHANVIL.ContainerId" }),
      /** Equipment slot id when worn/wielded. */
      equipmentSlot: new StringField({ initial: "", label: "ASHANVIL.EquipmentSlot" }),
      /** Hand wield category for weapons and shields. */
      wieldType: new StringField({ initial: "", label: "ASHANVIL.WieldType" }),
    };
  }
}
