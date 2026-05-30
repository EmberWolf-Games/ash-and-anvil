/** @type {readonly string[]} */
export const HAND_SLOT_IDS = ["leftHand", "rightHand"];

/** @type {readonly string[]} */
export const WIELD_TYPES = ["", "oneHanded", "twoHanded", "shield"];

/**
 * @param {Item} item
 * @returns {string}
 */
export function getGearWieldType(item) {
  return String(item?.system?.wieldType ?? "").trim();
}

/**
 * @param {Actor} actor
 * @returns {Item|null}
 */
export function getRightHandItem(actor) {
  const id = actor.system.equipment?.rightHand;
  return id ? actor.items.get(id) ?? null : null;
}

/**
 * @param {Actor} actor
 * @returns {boolean}
 */
export function isLeftHandTwoHandedGhost(actor) {
  const rightItem = getRightHandItem(actor);
  if (!rightItem || getGearWieldType(rightItem) !== "twoHanded") return false;
  return !actor.system.equipment?.leftHand;
}

/**
 * @param {Actor} actor
 * @param {string} slotId
 * @returns {boolean}
 */
export function isHandSlotDropLocked(actor, slotId) {
  return slotId === "leftHand" && isLeftHandTwoHandedGhost(actor);
}

/**
 * @param {Actor} actor
 * @param {Item} item
 * @param {string} slotId
 * @returns {{ ok: boolean, message?: string }}
 */
export function validateHandEquip(actor, item, slotId) {
  if (!HAND_SLOT_IDS.includes(slotId)) return { ok: true };

  if (isHandSlotDropLocked(actor, slotId)) {
    return { ok: false, message: game.i18n.localize("ASHANVIL.HandSlotTwoHandedLocked") };
  }

  const wield = getGearWieldType(item);
  if (!wield) return { ok: true };

  const equipment = actor.system.equipment ?? {};
  const leftId = equipment.leftHand ?? "";
  const rightId = equipment.rightHand ?? "";
  const leftItem = leftId ? actor.items.get(leftId) : null;
  const rightItem = rightId ? actor.items.get(rightId) : null;
  const leftWield = leftItem ? getGearWieldType(leftItem) : "";
  const rightWield = rightItem ? getGearWieldType(rightItem) : "";

  if (wield === "shield" && slotId !== "leftHand") {
    return { ok: false, message: game.i18n.localize("ASHANVIL.HandSlotShieldLeftOnly") };
  }

  if (wield === "twoHanded") {
    if (slotId !== "rightHand") {
      return { ok: false, message: game.i18n.localize("ASHANVIL.HandSlotTwoHandedRightOnly") };
    }
    if (leftWield === "shield") {
      return { ok: false, message: game.i18n.localize("ASHANVIL.HandSlotNoTwoHandWithShield") };
    }
  }

  if (slotId === "rightHand" && wield === "shield") {
    return { ok: false, message: game.i18n.localize("ASHANVIL.HandSlotShieldLeftOnly") };
  }

  if (slotId === "leftHand" && rightWield === "twoHanded" && wield !== "") {
    return { ok: false, message: game.i18n.localize("ASHANVIL.HandSlotTwoHandedLocked") };
  }

  if (slotId === "rightHand" && leftWield === "shield" && wield === "twoHanded") {
    return { ok: false, message: game.i18n.localize("ASHANVIL.HandSlotNoTwoHandWithShield") };
  }

  return { ok: true };
}

/**
 * Clear left hand when equipping a two-handed weapon to the right hand.
 * @param {Actor} actor
 * @param {Item} item
 * @param {string} slotId
 * @param {Record<string, string>} equipment
 */
export async function applyHandEquipSideEffects(actor, item, slotId, equipment) {
  const wield = getGearWieldType(item);
  if (wield !== "twoHanded" || slotId !== "rightHand") return;

  const leftId = equipment.leftHand;
  if (!leftId) return;

  const leftItem = actor.items.get(leftId);
  if (leftItem) await leftItem.update({ "system.equipmentSlot": "" });
  equipment.leftHand = "";
}

/**
 * @param {Actor} actor
 * @param {string} slotId
 * @returns {string}
 */
export function resolveUnequipSlotId(actor, slotId) {
  if (slotId === "leftHand" && isLeftHandTwoHandedGhost(actor)) return "rightHand";
  return slotId;
}
