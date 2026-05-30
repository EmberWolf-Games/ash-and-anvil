/**
 * Shared item/effect row helpers for character sheet tabs.
 */
import { formatGearPrice } from "../../rules/inventory.mjs";

/**
 * @param {Item|null} item
 */
export function itemSummary(item) {
  if (!item) {
    return { id: null, name: "—", description: "", system: null, type: null, img: null };
  }
  const system =
    typeof item.system?.toObject === "function"
      ? item.system.toObject()
      : foundry.utils.deepClone(item.system ?? {});
  return {
    id: item.id,
    uuid: item.uuid,
    name: item.name,
    type: item.type,
    img: item.img,
    description: system.description ?? "",
    system,
  };
}

/**
 * @param {Item} item
 * @param {Actor} [actor]
 */
export function gearRow(item, actor) {
  const summary = itemSummary(item);
  const sys = summary.system ?? {};
  return {
    ...summary,
    quantity: sys.quantity ?? 1,
    weight: sys.weight ?? 0,
    priceValue: sys.price?.value ?? 0,
    priceDisplay: formatGearPrice(item),
    isContainer: sys.isContainer ?? false,
    containerKind: sys.containerKind ?? "",
    containerId: sys.containerId ?? "",
    equipmentSlot: sys.equipmentSlot ?? "",
  };
}

/**
 * @param {Item} item
 */
export function itemRow(item) {
  const summary = itemSummary(item);
  const sys = summary.system ?? {};
  return {
    ...summary,
    quantity: sys.quantity ?? 1,
    weight: sys.weight ?? 0,
    priceValue: sys.price?.value ?? 0,
    priceDisplay: formatGearPrice(item),
    spellLevel: sys.level ?? 0,
    spellSchool: sys.school ?? "",
    spellTradition: sys.tradition ?? "arcane",
    prepared: sys.prepared ?? false,
    hitDie: sys.hitDie ?? null,
    skillChoices: sys.skillChoices ?? null,
    skillPool: sys.skillPool ?? [],
    starterGear: sys.starterGear ?? "",
    featureKey: sys.key ?? "",
    isContainer: sys.isContainer ?? false,
    containerKind: sys.containerKind ?? "",
  };
}

/**
 * @param {ActiveEffect} effect
 */
export function effectRow(effect) {
  const duration = effect.duration ?? {};
  const temporary = Boolean(duration.seconds || duration.rounds || duration.turns || duration.startTime);
  const changes = (effect.changes ?? []).map((c) => ({
    key: c.key,
    value: c.value,
    mode: c.mode,
    label: `${c.key}: ${c.value}`,
  }));
  return {
    id: effect.id,
    name: effect.name,
    img: effect.img,
    disabled: effect.disabled ?? false,
    temporary,
    description: effect.description ?? "",
    changes,
    changeSummary: changes.map((c) => c.label).join("; "),
  };
}

/**
 * @param {Actor} actor
 * @returns {ActiveEffect[]}
 */
export function getActorEffects(actor) {
  if (typeof actor.allApplicableEffects === "function") {
    return [...actor.allApplicableEffects()];
  }
  return [...(actor.effects?.contents ?? [])];
}

/**
 * @param {string} name
 * @returns {Promise<boolean>}
 */
export async function confirmDeleteItem(name) {
  const content = game.i18n.format("ASHANVIL.ConfirmDeleteContent", { name });
  if (foundry.applications?.api?.DialogV2?.confirm) {
    return foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("ASHANVIL.ConfirmDeleteTitle") },
      content: `<p>${content}</p>`,
    });
  }
  return window.confirm(content);
}
