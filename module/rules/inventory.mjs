import { formatShopPrice } from "./currency.mjs";

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
 * @returns {Item[]} worn + in-hand items at inventory root
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
    const qty = item.system.quantity ?? 1;
    total += qty * (item.system.weight ?? 0);
  }
  return total;
}
