import { itemRow } from "./prepare-sheet-items.mjs";
import {
  buildSpellLevelGroups,
  computePowerTabAvailability,
  POWER_TAB_EMPTY_HINT,
  POWER_TAB_TRADITION,
} from "../../rules/powers.mjs";
import { getSubTabs } from "../../config/sheet-params.mjs";

/**
 * @param {Actor} actor
 */
export function preparePowersTabContext(actor) {
  const spells = actor.items.filter((i) => i.type === "spell").map(itemRow);
  const availability = computePowerTabAvailability(actor);

  const byTradition = (tradition) =>
    spells.filter((s) => (s.spellTradition ?? "arcane") === tradition);

  /** @type {Record<string, object>} */
  const tabData = {};
  for (const [tabId, tradition] of Object.entries(POWER_TAB_TRADITION)) {
    const tabSpells = byTradition(tradition);
    const meta = availability[tabId] ?? { enabled: false, maxLevel: 0 };
    tabData[tabId] = {
      enabled: meta.enabled,
      maxLevel: meta.maxLevel,
      levelGroups: meta.enabled
        ? buildSpellLevelGroups(
            tabSpells,
            meta.maxLevel,
            tabId,
            POWER_TAB_EMPTY_HINT[tabId]
          )
        : [],
    };
  }

  const subTabs = getSubTabs("powers").map((tab) => ({
    ...tab,
    enabled: tabData[tab.id]?.enabled ?? false,
  }));

  return {
    powers: {
      subTabs,
      spellcasting: tabData.spellcasting,
      psionics: tabData.psionics,
      divineGifts: tabData.divineGifts,
    },
    spellTraditions: POWER_TAB_TRADITION,
    powerHints: {
      spellcasting: game.i18n.localize(POWER_TAB_EMPTY_HINT.spellcasting),
      psionics: game.i18n.localize(POWER_TAB_EMPTY_HINT.psionics),
      divineGifts: game.i18n.localize(POWER_TAB_EMPTY_HINT.divineGifts),
    },
  };
}

/**
 * @param {object} powersContext
 * @param {string} currentId
 * @returns {string}
 */
export function resolvePowersSubTab(powersContext, currentId) {
  const subTabs = powersContext?.powers?.subTabs ?? [];
  const current = subTabs.find((t) => t.id === currentId);
  if (current?.enabled) return currentId;
  return subTabs.find((t) => t.enabled)?.id ?? currentId ?? "spellcasting";
}
