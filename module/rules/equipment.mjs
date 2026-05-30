import { EQUIPMENT_SLOT_IDS } from "../config/equipment-slots.mjs";
import {
  applyHandEquipSideEffects,
  resolveUnequipSlotId,
  validateHandEquip,
} from "./hand-slots.mjs";
import { validateContainerAdd } from "./inventory.mjs";

/**
 * @param {Actor} actor
 * @param {Item} item
 * @param {string} slotId
 * @returns {Promise<boolean>}
 */
export async function equipItemToSlot(actor, item, slotId) {
  if (item.type !== "gear" || !EQUIPMENT_SLOT_IDS.includes(slotId)) return false;

  const validation = validateHandEquip(actor, item, slotId);
  if (!validation.ok) {
    ui.notifications.warn(validation.message);
    return false;
  }

  const equipment = foundry.utils.deepClone(actor.system.equipment ?? {});
  const previousId = equipment[slotId];
  if (previousId && previousId !== item.id) {
    const prev = actor.items.get(previousId);
    if (prev) await prev.update({ "system.equipmentSlot": "" });
  }

  const oldSlot = item.system.equipmentSlot;
  if (oldSlot && oldSlot !== slotId) equipment[oldSlot] = "";

  await applyHandEquipSideEffects(actor, item, slotId, equipment);

  equipment[slotId] = item.id;
  const flat = {};
  for (const id of EQUIPMENT_SLOT_IDS) {
    flat[`system.equipment.${id}`] = equipment[id] ?? "";
  }

  const itemUpdate = { "system.equipmentSlot": slotId, "system.containerId": "" };
  await item.update(itemUpdate);
  await actor.update(flat);
  return true;
}

/**
 * @param {Actor} actor
 * @param {string} slotId
 */
export async function unequipSlot(actor, slotId) {
  const resolved = resolveUnequipSlotId(actor, slotId);
  const itemId = actor.system.equipment?.[resolved];
  if (!itemId) return;
  const item = actor.items.get(itemId);
  if (item) await item.update({ "system.equipmentSlot": "" });
  await actor.update({ [`system.equipment.${resolved}`]: "" });
}

/**
 * @param {Actor} actor
 * @param {Item} item
 * @param {string} containerId
 * @returns {Promise<boolean>}
 */
export async function moveItemToContainer(actor, item, containerId) {
  if (item.type !== "gear") return false;

  const containerCheck = validateContainerAdd(actor, containerId ?? "", item);
  if (!containerCheck.ok) {
    ui.notifications.warn(containerCheck.message);
    return false;
  }

  const oldSlot = item.system.equipmentSlot;
  await item.update({
    "system.containerId": containerId ?? "",
    "system.equipmentSlot": "",
  });
  if (oldSlot) await actor.update({ [`system.equipment.${oldSlot}`]: "" });
  return true;
}
