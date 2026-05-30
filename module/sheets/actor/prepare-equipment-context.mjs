import { EQUIPMENT_SLOTS, mannequinImageForGender } from "../../config/equipment-slots.mjs";
import { gearRow } from "./prepare-sheet-items.mjs";

/**
 * @param {import("../../config/equipment-slots.mjs").EquipmentSlotDef} def
 * @param {Actor} actor
 */
function mapSlot(def, actor) {
  const equipmentData = actor.system.equipment ?? {};
  const itemId = equipmentData[def.id] ?? "";
  const item = itemId ? actor.items.get(itemId) : null;
  const ringIndex = def.ringIndex ?? null;
  const abbrKey = def.abbrKey ?? def.labelKey;

  return {
    id: def.id,
    label: game.i18n.localize(def.labelKey),
    abbr:
      ringIndex != null
        ? `R${ringIndex}`
        : game.i18n.localize(abbrKey),
    group: def.group,
    placement: def.placement,
    top: def.top,
    left: def.left,
    size: def.size ?? 7.5,
    ringIndex,
    itemId,
    item: item ? gearRow(item, actor) : null,
    occupied: !!item,
  };
}

/**
 * @param {Actor} actor
 */
export function prepareEquipmentTabContext(actor) {
  const gender = actor.system.details?.gender ?? "";
  const slots = EQUIPMENT_SLOTS.map((def) => mapSlot(def, actor));

  return {
    equipment: {
      mannequinPath: mannequinImageForGender(gender),
      mannequinIsFemale: mannequinImageForGender(gender).includes("female"),
      gender,
      mannequinSlots: slots.filter((s) => s.placement === "mannequin"),
      leftSlots: slots.filter((s) => s.placement === "panel-left"),
      ringSlots: slots.filter((s) => s.placement === "panel-rings"),
    },
  };
}
