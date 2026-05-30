import { itemRow } from "./prepare-sheet-items.mjs";

const TRADITIONS = {
  spellcasting: "arcane",
  psionics: "psionic",
  divineGifts: "divine",
};

/**
 * @param {Actor} actor
 */
export function preparePowersTabContext(actor) {
  const spells = actor.items.filter((i) => i.type === "spell").map(itemRow);

  const byTradition = (tradition) =>
    spells
      .filter((s) => (s.spellTradition ?? "arcane") === tradition)
      .sort((a, b) => a.spellLevel - b.spellLevel || a.name.localeCompare(b.name));

  return {
    powers: {
      spellcasting: byTradition(TRADITIONS.spellcasting),
      psionics: byTradition(TRADITIONS.psionics),
      divineGifts: byTradition(TRADITIONS.divineGifts),
    },
    spellTraditions: TRADITIONS,
    powerHints: {
      spellcasting: game.i18n.localize("ASHANVIL.NoSpellsArcane"),
      psionics: game.i18n.localize("ASHANVIL.NoSpellsPsionic"),
      divineGifts: game.i18n.localize("ASHANVIL.NoSpellsDivine"),
    },
  };
}
