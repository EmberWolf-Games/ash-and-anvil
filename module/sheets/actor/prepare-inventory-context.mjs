import {
  breakdownCurrency,
  formatCurrency,
  getCurrencyConfig,
} from "../../rules/currency.mjs";
import {
  countContainerContents,
  getContainerGear,
  getGearInContainer,
  getRootCarriedGear,
} from "../../rules/inventory.mjs";
import { gearRow } from "./prepare-sheet-items.mjs";

/**
 * @param {Actor} actor
 * @param {object} [options]
 * @param {string|null} [options.openContainerId]
 */
export function prepareInventoryTabContext(actor, options = {}) {
  const system = actor.system;
  const inventory = system.inventory ?? { totalWeight: 0, notes: "" };
  const { label: currencyLabel, denominations } = getCurrencyConfig();
  const baseValue = system.currency?.value ?? 0;
  const openContainerId = options.openContainerId ?? null;

  const rootGear = getRootCarriedGear(actor).map((item) => gearRow(item, actor));
  const containers = getContainerGear(actor).map((item) => {
    const row = gearRow(item, actor);
    return {
      ...row,
      childCount: countContainerContents(actor, item.id),
      isOpen: openContainerId === item.id,
    };
  });

  let openContainer = null;
  if (openContainerId) {
    const containerItem = actor.items.get(openContainerId);
    if (containerItem) {
      openContainer = {
        ...gearRow(containerItem, actor),
        contents: getGearInContainer(actor, openContainerId).map((i) => gearRow(i, actor)),
      };
    }
  }

  return {
    inventory: {
      currencyLabel,
      currencyValue: baseValue,
      currencyDisplay: formatCurrency(baseValue),
      currencyBreakdown: breakdownCurrency(baseValue, denominations),
      denominations,
      rootGear,
      containers,
      openContainer,
      openContainerId,
      totalWeight: inventory.totalWeight ?? 0,
      notes: inventory.notes ?? "",
      hasRootGear: rootGear.length > 0,
      hasContainers: containers.length > 0,
    },
  };
}
