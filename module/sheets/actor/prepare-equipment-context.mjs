import { EQUIPMENT_SLOTS } from "../../config/equipment-slots.mjs";
import { gearRow } from "./prepare-sheet-items.mjs";

/**
 * @param {Actor} actor
 */
export function prepareEquipmentTabContext(actor) {
  const equipmentData = actor.system.equipment ?? {};
  const slots = EQUIPMENT_SLOTS.map((def) => {
    const itemId = equipmentData[def.id] ?? "";
    const item = itemId ? actor.items.get(itemId) : null;
    return {
      id: def.id,
      label: game.i18n.localize(def.labelKey),
      group: def.group,
      top: def.top,
      left: def.left,
      w: def.w ?? 10,
      h: def.h ?? 10,
      itemId,
      item: item ? gearRow(item, actor) : null,
      occupied: !!item,
    };
  });

  return {
    equipment: {
      slots,
      mannequinPath: "systems/ash-and-anvil/assets/ui/equipment-mannequin.svg",
    },
  };
}
