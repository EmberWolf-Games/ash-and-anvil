import { PLAYTEST_CONDITIONS } from "../../config/playtest-conditions.mjs";
import { effectRow, getActorEffects } from "./prepare-sheet-items.mjs";

/**
 * @param {Actor} actor
 */
export function prepareEffectsTabContext(actor) {
  const rows = getActorEffects(actor).map(effectRow);
  const activeEffects = rows.filter((e) => e.temporary);
  const passiveEffects = rows.filter((e) => !e.temporary);
  const activeConditions = new Set(actor.system.conditions?.active ?? []);

  const conditionOptions = PLAYTEST_CONDITIONS.map((cond) => ({
    value: cond.value,
    label: game.i18n.localize(cond.labelKey),
    checked: activeConditions.has(cond.value),
  }));

  return {
    effects: {
      active: activeEffects,
      passive: passiveEffects,
      hasActive: activeEffects.length > 0,
      hasPassive: passiveEffects.length > 0,
      activeHint: game.i18n.localize("ASHANVIL.NoActiveEffects"),
      passiveHint: game.i18n.localize("ASHANVIL.NoPassiveEffects"),
      conditionOptions,
    },
  };
}
