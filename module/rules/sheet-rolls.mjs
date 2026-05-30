import { ABILITIES, SAVES, SKILL_DEFINITIONS } from "./constants.mjs";
import {
  canRollDeathSave,
  canRollWakeSave,
  resolveDeathSaveRoll,
  resolveWakeSave,
  wakeSaveDc,
} from "./death-saves.mjs";

/**
 * @param {Actor} actor
 * @param {Roll} roll
 * @param {string} label
 * @param {string} [detail]
 */
async function postRollToChat(actor, roll, label, detail = "") {
  const speaker = ChatMessage.getSpeaker({ actor });
  const flavor = detail ? `${label} — ${detail}` : label;
  await roll.toMessage({ speaker, flavor });
}

/**
 * @param {Actor} actor
 * @param {string} abilityKey
 */
export async function rollAbilityCheck(actor, abilityKey) {
  const def = ABILITIES[abilityKey];
  if (!def) return;
  const mod = actor.system.abilities?.[abilityKey]?.mod ?? 0;
  const label = game.i18n.format("ASHANVIL.RollAbilityCheck", {
    ability: game.i18n.localize(def.label),
  });
  const roll = await new Roll(`1d20 + ${mod}`).evaluate();
  await postRollToChat(actor, roll, label, `${game.i18n.localize("ASHANVIL.RollTotal")}: ${roll.total}`);
}

/**
 * @param {Actor} actor
 * @param {string} saveKey
 */
export async function rollSavingThrow(actor, saveKey) {
  const def = SAVES[saveKey];
  if (!def) return;
  const mod = actor.system.saves?.[saveKey]?.total ?? 0;
  const label = game.i18n.format("ASHANVIL.RollSavingThrow", {
    save: game.i18n.localize(def.label),
  });
  const roll = await new Roll(`1d20 + ${mod}`).evaluate();
  await postRollToChat(actor, roll, label, `${game.i18n.localize("ASHANVIL.RollTotal")}: ${roll.total}`);
}

/**
 * @param {Actor} actor
 * @param {string} skillKey
 * @param {number|null} [customIndex]
 */
export async function rollSkillCheck(actor, skillKey, customIndex = null) {
  let label;
  let mod;

  if (customIndex != null && customIndex !== "") {
    const idx = Number(customIndex);
    const entry = actor.system.skills?.custom?.[idx];
    if (!entry) return;
    label = game.i18n.format("ASHANVIL.RollSkillCheck", { skill: entry.label });
    mod = entry.bonus ?? 0;
  } else {
    const def = SKILL_DEFINITIONS[skillKey];
    if (!def) return;
    label = game.i18n.format("ASHANVIL.RollSkillCheck", {
      skill: game.i18n.localize(def.label),
    });
    mod = actor.system.skills?.entries?.[skillKey]?.bonus ?? 0;
  }

  const roll = await new Roll(`1d20 + ${mod}`).evaluate();
  await postRollToChat(actor, roll, label, `${game.i18n.localize("ASHANVIL.RollTotal")}: ${roll.total}`);
}

/**
 * @param {Actor} actor
 */
export async function rollDeathSave(actor) {
  if (!canRollDeathSave(actor)) {
    ui.notifications.warn(game.i18n.localize("ASHANVIL.DeathSaveNotAllowed"));
    return;
  }

  const roll = await new Roll("1d20").evaluate();
  const d20 = roll.total;
  const { updates, outcome, awakened, died, stabilized } = resolveDeathSaveRoll(actor, d20);

  if (Object.keys(updates).length) await actor.update(updates);

  const label = game.i18n.localize("ASHANVIL.DeathSaveRoll");
  const detail = `${game.i18n.localize("ASHANVIL.RollDie")}: ${d20} — ${game.i18n.localize(outcome)}`;
  await postRollToChat(actor, roll, label, detail);

  if (awakened) ui.notifications.info(game.i18n.localize("ASHANVIL.DeathSaveAwakened"));
  if (stabilized) ui.notifications.info(game.i18n.localize("ASHANVIL.DeathSaveStabilizedMsg"));
  if (died) ui.notifications.warn(game.i18n.localize("ASHANVIL.DeathSaveDiedMsg"));
}

/**
 * @param {Actor} actor
 */
export async function rollWakeSave(actor) {
  if (!canRollWakeSave(actor)) {
    ui.notifications.warn(game.i18n.localize("ASHANVIL.WakeSaveNotAllowed"));
    return;
  }

  const dc = wakeSaveDc(actor);
  const mod = actor.system.saves?.for?.total ?? 0;
  const label = game.i18n.format("ASHANVIL.RollWakeSave", { dc });
  const roll = await new Roll(`1d20 + ${mod}`).evaluate();
  const d20 = roll.dice?.[0]?.results?.[0]?.result ?? roll.total - mod;
  const total = d20 + mod;
  const success = total >= dc;

  if (success) {
    await actor.update(resolveWakeSave(true));
    ui.notifications.info(game.i18n.localize("ASHANVIL.WakeSaveSuccess"));
  } else {
    ui.notifications.warn(game.i18n.localize("ASHANVIL.WakeSaveFailure"));
  }

  const successText = success
    ? game.i18n.localize("ASHANVIL.RollSuccess")
    : game.i18n.localize("ASHANVIL.RollFailure");
  await postRollToChat(
    actor,
    roll,
    label,
    `${game.i18n.localize("ASHANVIL.RollTotal")}: ${total} vs DC ${dc} — ${successText}`
  );
}
