import {
  breakdownCurrency,
  formatCurrency,
  getCurrencyConfig,
} from "../../rules/currency.mjs";
import {
  countContainerContents,
  getContainerGear,
  getGearInContainer,
  getLinkedBackpackId,
  getRootCarriedGear,
} from "../../rules/inventory.mjs";
import { gearRow } from "./prepare-sheet-items.mjs";

/**
 * @param {import("../../config/equipment-slots.mjs").EquipmentPanelSlotDef} def
 * @param {Actor} actor
 */
function mapGearRow(item, actor) {
  const row = gearRow(item, actor);
  const slot = item.system?.equipmentSlot ?? "";
  return {
    ...row,
    equipped: !!slot,
    equipmentSlot: slot,
  };
}

/**
 * @param {Actor} actor
 * @param {object} [options]
 * @param {string|null} [options.openContainerId]
 */
export function prepareInventoryTabContext(actor, options = {}) {
  const system = actor.system;
  const inventory = system.inventory ?? { totalWeight: 0, notes: "" };
  const enc = inventory.encumbrance ?? {};
  const { label: currencyLabel, denominations } = getCurrencyConfig();
  const baseValue = system.currency?.value ?? 0;
  const openContainerId = options.openContainerId ?? null;
  const linkedBackpackId = getLinkedBackpackId(actor);

  const rootGear = getRootCarriedGear(actor).map((item) => mapGearRow(item, actor));

  const containers = getContainerGear(actor).map((item) => {
    const row = mapGearRow(item, actor);
    const capacity = item.system.containerCapacity ?? 0;
    const childCount = countContainerContents(actor, item.id);
    return {
      ...row,
      childCount,
      capacity,
      capacityLabel: capacity > 0 ? `${childCount} / ${capacity}` : `${childCount}`,
      isOpen: openContainerId === item.id,
      isLinkedBackpack: item.id === linkedBackpackId,
    };
  });

  containers.sort((a, b) => {
    if (a.isLinkedBackpack && !b.isLinkedBackpack) return -1;
    if (!a.isLinkedBackpack && b.isLinkedBackpack) return 1;
    return a.name.localeCompare(b.name);
  });

  const containerViews = [
    {
      id: "root",
      label: game.i18n.localize("ASHANVIL.InventoryOnPerson"),
      childCount: rootGear.length,
      isOpen: !openContainerId,
      isLinkedBackpack: false,
    },
    ...containers.map((c) => ({
      id: c.id,
      label: c.name,
      childCount: c.childCount,
      capacityLabel: c.capacityLabel,
      isOpen: c.isOpen,
      isLinkedBackpack: c.isLinkedBackpack,
      img: c.img,
    })),
  ];

  let activeContents = rootGear;
  let activeTitle = game.i18n.localize("ASHANVIL.InventoryOnPerson");
  let activeCapacity = null;
  let activeDropContainerId = "";

  if (openContainerId) {
    const containerItem = actor.items.get(openContainerId);
    if (containerItem) {
      activeTitle = containerItem.name;
      activeContents = getGearInContainer(actor, openContainerId).map((i) => mapGearRow(i, actor));
      const capacity = containerItem.system.containerCapacity ?? 0;
      const childCount = activeContents.length;
      activeCapacity =
        capacity > 0
          ? { current: childCount, max: capacity, label: `${childCount} / ${capacity}` }
          : null;
      activeDropContainerId = openContainerId;
    }
  }

  const tier = enc.tier ?? "normal";
  const encIconClass =
    tier === "heavilyEncumbered" || tier === "overMax"
      ? "encumbrance-icon--heavy"
      : tier === "encumbered"
        ? "encumbrance-icon--light"
        : "";

  const tierLabelKey = `ASHANVIL.EncumbranceTier.${tier}`;

  return {
    inventory: {
      currencyLabel,
      currencyValue: baseValue,
      currencyDisplay: formatCurrency(baseValue),
      currencyBreakdown: breakdownCurrency(baseValue, denominations),
      denominations,
      rootGear,
      containers,
      containerViews,
      linkedBackpackId,
      activeTitle,
      activeContents,
      activeCapacity,
      activeDropContainerId,
      openContainerId,
      hasRootGear: rootGear.length > 0,
      hasContainers: containers.length > 0,
      hasActiveContents: activeContents.length > 0,
      totalWeight: enc.current ?? inventory.totalWeight ?? 0,
      maxWeight: enc.max ?? 0,
      notes: inventory.notes ?? "",
      encumbrance: {
        tier,
        tierLabel: game.i18n.localize(tierLabelKey),
        iconClass: encIconClass,
        attackBane: enc.attackBane ?? 0,
        attackBaneLabel:
          (enc.attackBane ?? 0) === -2
            ? game.i18n.localize("ASHANVIL.EncumbranceAttackBane2")
            : (enc.attackBane ?? 0) === -1
              ? game.i18n.localize("ASHANVIL.EncumbranceAttackBane1")
              : "",
        current: enc.current ?? 0,
        max: enc.max ?? 0,
        lightThreshold: enc.lightThreshold ?? 0,
        heavyThreshold: enc.heavyThreshold ?? 0,
        effectiveWalk: enc.effectiveWalk ?? system.speed?.walk ?? 30,
        baseWalk: enc.baseWalk ?? system.speed?.baseWalk ?? 30,
        bodyWeight: enc.bodyWeight ?? 0,
        wornWeight: enc.wornWeight ?? 0,
        carriedWeight: enc.carriedWeight ?? 0,
      },
    },
  };
}
