import {
  EQUIPMENT_SLOT_META,
  LINKED_MANNEQUIN_SLOTS,
  MANNEQUIN_DISPLAY,
  PANEL_SLOTS,
  mannequinImageForGender,
} from "../../config/equipment-slots.mjs";
import { gearRow } from "./prepare-sheet-items.mjs";

/**
 * @param {import("../../config/equipment-slots.mjs").EquipmentPanelSlotDef} def
 * @param {Actor} actor
 */
function mapPanelSlot(def, actor) {
  const equipmentData = actor.system.equipment ?? {};
  const itemId = equipmentData[def.id] ?? "";
  const item = itemId ? actor.items.get(itemId) : null;
  const ringIndex = def.ringIndex ?? null;
  const meta = EQUIPMENT_SLOT_META[def.id];

  return {
    id: def.id,
    storageKey: def.id,
    label: game.i18n.localize(def.labelKey),
    abbr: ringIndex != null ? `R${ringIndex}` : game.i18n.localize(meta?.abbrKey ?? def.labelKey),
    group: def.group,
    placement: def.placement,
    linked: false,
    ringIndex,
    itemId,
    item: item ? gearRow(item, actor) : null,
    occupied: !!item,
  };
}

/**
 * @param {import("../../config/equipment-slots.mjs").MannequinDisplaySlotDef} def
 * @param {Actor} actor
 * @param {number} index
 */
function mapMannequinSlot(def, actor, index) {
  const equipmentData = actor.system.equipment ?? {};
  const storageKey = def.storageKey;
  const itemId = equipmentData[storageKey] ?? "";
  const item = itemId ? actor.items.get(itemId) : null;
  const meta = EQUIPMENT_SLOT_META[storageKey];
  const linked = LINKED_MANNEQUIN_SLOTS.has(storageKey);

  return {
    id: `${storageKey}-${index}`,
    storageKey,
    label: game.i18n.localize(meta?.labelKey ?? def.abbrKey),
    abbr: game.i18n.localize(def.abbrKey),
    group: def.group,
    placement: "mannequin",
    top: def.top,
    left: def.left,
    size: def.size ?? 9.5,
    linked,
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
  const panelSlots = PANEL_SLOTS.map((def) => mapPanelSlot(def, actor));
  const mannequinSlots = MANNEQUIN_DISPLAY.map((def, index) => mapMannequinSlot(def, actor, index));

  return {
    equipment: {
      mannequinPath: mannequinImageForGender(gender),
      mannequinIsFemale: mannequinImageForGender(gender).includes("female"),
      gender,
      mannequinSlots,
      leftSlots: panelSlots.filter((s) => s.placement === "panel-left"),
      ringSlots: panelSlots.filter((s) => s.placement === "panel-rings"),
    },
  };
}
