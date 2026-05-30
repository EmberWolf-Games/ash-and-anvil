import { EQUIPMENT_SLOT_IDS } from "../config/equipment-slots.mjs";

/**
 * @param {Actor} actor
 * @param {Item} item
 * @param {string} slotId
 */
export async function equipItemToSlot(actor, item, slotId) {
  if (item.type !== "gear" || !EQUIPMENT_SLOT_IDS.includes(slotId)) return;

  const equipment = foundry.utils.deepClone(actor.system.equipment ?? {});
  const previousId = equipment[slotId];
  if (previousId && previousId !== item.id) {
    const prev = actor.items.get(previousId);
    if (prev) await prev.update({ "system.equipmentSlot": "" });
  }

  const oldSlot = item.system.equipmentSlot;
  if (oldSlot && oldSlot !== slotId) equipment[oldSlot] = "";

  equipment[slotId] = item.id;
  const flat = {};
  for (const id of EQUIPMENT_SLOT_IDS) {
    flat[`system.equipment.${id}`] = equipment[id] ?? "";
  }

  await item.update({ "system.equipmentSlot": slotId, "system.containerId": "" });
  await actor.update(flat);
}

/**
 * @param {Actor} actor
 * @param {string} slotId
 */
export async function unequipSlot(actor, slotId) {
  const itemId = actor.system.equipment?.[slotId];
  if (!itemId) return;
  const item = actor.items.get(itemId);
  if (item) await item.update({ "system.equipmentSlot": "" });
  await actor.update({ [`system.equipment.${slotId}`]: "" });
}

/**
 * @param {Actor} actor
 * @param {Item} item
 * @param {string} containerId
 */
export async function moveItemToContainer(actor, item, containerId) {
  if (item.type !== "gear") return;
  const oldSlot = item.system.equipmentSlot;
  await item.update({
    "system.containerId": containerId ?? "",
    "system.equipmentSlot": "",
  });
  if (oldSlot) await actor.update({ [`system.equipment.${oldSlot}`]: "" });
}
