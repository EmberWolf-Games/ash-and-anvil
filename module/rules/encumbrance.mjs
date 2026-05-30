import { EQUIPMENT_SLOT_IDS } from "../config/equipment-slots.mjs";
import { itemWeight } from "./inventory.mjs";

/** @typedef {"normal" | "encumbered" | "heavilyEncumbered" | "overMax"} EncumbranceTier */

/**
 * @param {string|number} weightField
 * @returns {number}
 */
export function parseBodyWeight(weightField) {
  const match = String(weightField ?? "").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

/**
 * @param {Record<string, string>} equipment
 * @returns {Set<string>}
 */
export function getEquippedItemIds(equipment) {
  const ids = new Set();
  for (const slotId of EQUIPMENT_SLOT_IDS) {
    const id = equipment?.[slotId];
    if (id) ids.add(id);
  }
  return ids;
}

/**
 * @param {number} mgtScore
 * @returns {{ light: number, heavy: number, max: number }}
 */
export function encumbranceThresholds(mgtScore) {
  const mgt = Math.max(0, Number(mgtScore) || 0);
  const light = 10 * mgt;
  const heavy = 20 * mgt;
  const max = Math.min(60 * mgt, 5 * heavy);
  return { light, heavy, max };
}

/**
 * @param {Actor} actor
 * @returns {{ bodyWeight: number, wornWeight: number, carriedWeight: number, currentWeight: number }}
 */
export function computeWeightBreakdown(actor) {
  const equippedIds = getEquippedItemIds(actor.system.equipment ?? {});
  const bodyWeight = parseBodyWeight(actor.system.details?.weight);
  let wornWeight = 0;
  let carriedWeight = 0;

  for (const item of actor.items) {
    if (item.type !== "gear") continue;
    const w = itemWeight(item);
    if (equippedIds.has(item.id)) wornWeight += w;
    else carriedWeight += w;
  }

  return {
    bodyWeight,
    wornWeight,
    carriedWeight,
    currentWeight: bodyWeight + wornWeight + carriedWeight,
  };
}

/**
 * @param {number} currentWeight
 * @param {{ light: number, heavy: number, max: number }} thresholds
 * @returns {EncumbranceTier}
 */
export function encumbranceTier(currentWeight, thresholds) {
  if (currentWeight > thresholds.max) return "overMax";
  if (currentWeight > thresholds.heavy) return "heavilyEncumbered";
  if (currentWeight > thresholds.light) return "encumbered";
  return "normal";
}

/**
 * @param {number} baseWalk
 * @param {EncumbranceTier} tier
 * @returns {number}
 */
export function effectiveWalkSpeed(baseWalk, tier) {
  const base = Math.max(0, Number(baseWalk) || 0);
  const min = 5;
  switch (tier) {
    case "encumbered":
      return Math.max(min, base - 10);
    case "heavilyEncumbered":
    case "overMax":
      return Math.max(min, Math.floor(base / 2));
    default:
      return base;
  }
}

/**
 * @param {EncumbranceTier} tier
 * @returns {number}
 */
export function attackBaneForTier(tier) {
  if (tier === "heavilyEncumbered" || tier === "overMax") return -2;
  if (tier === "encumbered") return -1;
  return 0;
}

/**
 * @param {Actor} actor
 * @param {object} system
 */
export function deriveEncumbrance(actor, system) {
  const mgt = system.abilities?.mgt?.value ?? 10;
  const thresholds = encumbranceThresholds(mgt);
  const breakdown = computeWeightBreakdown(actor);
  const tier = encumbranceTier(breakdown.currentWeight, thresholds);

  system.speed ??= {};
  if (!system.speed.baseWalk) {
    system.speed.baseWalk = system.speed.walk ?? 30;
  }

  const baseWalk = system.speed.baseWalk;
  const effectiveWalk = effectiveWalkSpeed(baseWalk, tier);
  system.speed.walk = effectiveWalk;

  system.inventory ??= { totalWeight: 0, notes: "" };
  system.inventory.totalWeight = breakdown.currentWeight;
  system.inventory.encumbrance = {
    tier,
    attackBane: attackBaneForTier(tier),
    current: breakdown.currentWeight,
    max: thresholds.max,
    lightThreshold: thresholds.light,
    heavyThreshold: thresholds.heavy,
    bodyWeight: breakdown.bodyWeight,
    wornWeight: breakdown.wornWeight,
    carriedWeight: breakdown.carriedWeight,
    effectiveWalk,
    baseWalk,
  };
}

/**
 * @param {Actor} actor
 * @param {Item} item
 * @param {string|null} [excludeItemId]
 * @returns {{ ok: boolean, message?: string }}
 */
export function validateWeightPickup(actor, item, excludeItemId = null) {
  const mgt = actor.system.abilities?.mgt?.value ?? 10;
  const { max } = encumbranceThresholds(mgt);
  const breakdown = computeWeightBreakdown(actor);
  let current = breakdown.currentWeight;

  if (excludeItemId) {
    const existing = actor.items.get(excludeItemId);
    if (existing?.type === "gear") current -= itemWeight(existing);
  }

  if (current + itemWeight(item) > max) {
    return { ok: false, message: game.i18n.localize("ASHANVIL.EncumbranceOverMax") };
  }
  return { ok: true };
}
