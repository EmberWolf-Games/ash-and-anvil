import { effectRow, getActorEffects } from "./prepare-sheet-items.mjs";

/**
 * @param {Actor} actor
 */
export function prepareEffectsTabContext(actor) {
  const rows = getActorEffects(actor).map(effectRow);
  const activeEffects = rows.filter((e) => e.temporary);
  const passiveEffects = rows.filter((e) => !e.temporary);

  return {
    effects: {
      active: activeEffects,
      passive: passiveEffects,
      hasActive: activeEffects.length > 0,
      hasPassive: passiveEffects.length > 0,
      activeHint: game.i18n.localize("ASHANVIL.NoActiveEffects"),
      passiveHint: game.i18n.localize("ASHANVIL.NoPassiveEffects"),
    },
  };
}
