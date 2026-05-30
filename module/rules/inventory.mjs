import { formatShopPrice } from "./currency.mjs";
import { validateWeightPickup } from "./encumbrance.mjs";

/**
 * @param {Item} item
 * @returns {number}
 */
export function itemWeight(item) {
  if (!item || item.type !== "gear") return 0;
  const qty = item.system?.quantity ?? 1;
  return qty * (item.system?.weight ?? 0);
}

/**
 * @param {object} sys gear item system data
 * @returns {boolean}
 */
export function isCarriedOnPerson(sys) {
  return !sys?.containerId && !sys?.equipmentSlot;
}

/**
 * @param {Item} item
 * @returns {boolean}
 */
export function isGearContainer(item) {
  return item.type === "gear" && !!item.system?.isContainer;
}

/**
 * @param {Actor} actor
 * @param {string} [containerId]
 * @returns {Item[]}
 */
export function getGearInContainer(actor, containerId) {
  return actor.items.filter(
    (i) => i.type === "gear" && (i.system.containerId ?? "") === (containerId ?? "")
  );
}

/**
 * @param {Actor} actor
 * @returns {Item[]} loose gear on person (not equipped, not in a container)
 */
export function getRootCarriedGear(actor) {
  return actor.items.filter((i) => i.type === "gear" && isCarriedOnPerson(i.system));
}

/**
 * @param {Actor} actor
 * @returns {Item[]}
 */
export function getContainerGear(actor) {
  return actor.items.filter((i) => isGearContainer(i));
}

/**
 * @param {Actor} actor
 * @param {string} containerId
 * @returns {number}
 */
export function countContainerContents(actor, containerId) {
  return getGearInContainer(actor, containerId).length;
}

/**
 * @param {Item} item
 * @returns {string}
 */
export function formatGearPrice(item) {
  const value = item.system?.price?.value ?? 0;
  return formatShopPrice(value);
}

/**
 * @param {Actor} actor
 * @returns {number}
 */
export function totalCarriedWeight(actor) {
  let total = 0;
  for (const item of actor.items) {
    if (item.type !== "gear") continue;
    total += itemWeight(item);
  }
  return total;
}

/**
 * @param {Actor} actor
 * @param {string} containerId
 * @param {Item} item
 * @returns {{ ok: boolean, message?: string }}
 */
export function validateContainerAdd(actor, containerId, item) {
  if (!containerId) return { ok: true };

  const container = actor.items.get(containerId);
  if (!container || !isGearContainer(container)) {
    return { ok: false, message: game.i18n.localize("ASHANVIL.ContainerInvalid") };
  }

  if (item.id === containerId) {
    return { ok: false, message: game.i18n.localize("ASHANVIL.ContainerSelfNest") };
  }

  if (isGearContainer(item)) {
    return { ok: false, message: game.i18n.localize("ASHANVIL.ContainerNoNest") };
  }

  if (item.system?.equipmentSlot) {
    return { ok: false, message: game.i18n.localize("ASHANVIL.ContainerUnequipFirst") };
  }

  const capacity = container.system.containerCapacity ?? 0;
  if (capacity > 0) {
    const current = countContainerContents(actor, containerId);
    const replacingSelf = item.system.containerId === containerId;
    const count = replacingSelf ? current : current + 1;
    if (count > capacity) {
      return { ok: false, message: game.i18n.localize("ASHANVIL.ContainerFull") };
    }
  }

  const weightCheck = validateWeightPickup(actor, item, item.id);
  if (!weightCheck.ok) return weightCheck;

  return { ok: true };
}

/**
 * @param {Actor} actor
 * @returns {string|null}
 */
export function getLinkedBackpackId(actor) {
  const id = actor.system.equipment?.backpack ?? "";
  if (!id) return null;
  const item = actor.items.get(id);
  return item && isGearContainer(item) ? id : null;
}
