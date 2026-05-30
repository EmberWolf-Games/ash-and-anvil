const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

import { rollD20Check } from "../rules/d20.mjs";
import {
  damageMultiplier,
  damageRollFormula,
  spellAttackBonus,
  spellSaveDc,
} from "../rules/powers.mjs";

/**
 * @param {Actor} actor
 * @param {Item} spell
 */
export async function runSpellCast(actor, spell) {
  const dialog = new SpellCastDialog({ actor, spell });
  return dialog.run();
}

export class SpellCastDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @type {Actor} */
  actor;

  /** @type {Item} */
  spell;

  /** @type {string} */
  phase = "attack";

  /** @type {number} */
  boon = 0;

  /** @type {boolean|null} */
  attackHit = null;

  /** @type {boolean|null} */
  saveFailed = null;

  /** @type {(() => void)|null} */
  #resolve = null;

  static DEFAULT_OPTIONS = {
    id: "ash-anvil-spell-cast",
    classes: ["ash-and-anvil", "spell-cast-dialog"],
    tag: "form",
    window: { title: "ASHANVIL.SpellCastTitle", icon: "fa-hand-sparkles" },
    position: { width: 420, height: "auto" },
    actions: {
      setBoon: SpellCastDialog.#onSetBoon,
      rollAttack: SpellCastDialog.#onRollAttack,
      setAttackHit: SpellCastDialog.#onSetAttackHit,
      setSaveResult: SpellCastDialog.#onSetSaveResult,
      rollDamage: SpellCastDialog.#onRollDamage,
      cancel: SpellCastDialog.#onCancel,
    },
  };

  static PARTS = {
    body: {
      template: "systems/ash-and-anvil/templates/spells/cast-dialog.hbs",
    },
  };

  /**
   * @param {object} options
   */
  constructor(options = {}) {
    const { actor, spell, ...rest } = options;
    super(rest);
    this.actor = actor;
    this.spell = spell;
    this.phase = this.#initialPhase();
  }

  /**
   * @returns {Promise<void>}
   */
  run() {
    return new Promise((resolve) => {
      this.#resolve = resolve;
      this.render(true);
    });
  }

  #initialPhase() {
    const sys = this.spell.system ?? {};
    if (sys.requiresAttack) return "attack";
    if (sys.requiresSave) return "save";
    if (String(sys.damageFormula ?? "").trim()) return "damage";
    return "complete";
  }

  #nextPhaseAfterAttack() {
    const sys = this.spell.system ?? {};
    if (sys.requiresSave) return "save";
    if (String(sys.damageFormula ?? "").trim()) return "damage";
    return "complete";
  }

  #nextPhaseAfterSave() {
    const sys = this.spell.system ?? {};
    if (String(sys.damageFormula ?? "").trim()) return "damage";
    return "complete";
  }

  #finish() {
    this.close();
    this.#resolve?.();
    this.#resolve = null;
  }

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const sys = this.spell.system ?? {};
    const attackBonus = spellAttackBonus(this.actor, this.spell);
    const saveDc = spellSaveDc(this.actor, this.spell);
    const damageFormula = damageRollFormula(sys.damageFormula, sys.damageMisc ?? 0);
    const multiplier = damageMultiplier(sys.damageOnSave, this.saveFailed);
    const scaledFormula =
      multiplier === 0.5 && damageFormula
        ? `floor((${damageFormula}) / 2)`
        : damageFormula;

    context.spell = this.spell;
    context.phase = this.phase;
    context.boon = this.boon;
    context.attackBonus = attackBonus;
    context.saveDc = saveDc;
    context.damageFormula = damageFormula;
    context.scaledFormula = scaledFormula;
    context.multiplier = multiplier;
    context.attackHit = this.attackHit;
    context.saveFailed = this.saveFailed;
    context.requiresAttack = !!sys.requiresAttack;
    context.requiresSave = !!sys.requiresSave;
    context.damageOnSave = sys.damageOnSave ?? "none";
    context.damageOnSaveHint = game.i18n.localize(
      `ASHANVIL.SpellDamageOnSave.${sys.damageOnSave ?? "none"}`
    );
    return context;
  }

  static #onSetBoon(event, target) {
    const app = /** @type {SpellCastDialog} */ (this);
    app.boon = Number(target.dataset.boon) || 0;
    app.render(false);
  }

  static async #onRollAttack() {
    const app = /** @type {SpellCastDialog} */ (this);
    const bonus = spellAttackBonus(app.actor, app.spell);
    const result = await rollD20Check({
      modifier: bonus,
      boon: app.boon,
      label: game.i18n.format("ASHANVIL.SpellAttackRoll", { name: app.spell.name }),
    });
    const roll = await new Roll(`${result.d20} + ${bonus}`).evaluate();
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: app.actor }),
      flavor: game.i18n.format("ASHANVIL.SpellAttackRoll", { name: app.spell.name }),
    });
    app.phase = "attackResult";
    app.render(false);
  }

  static #onSetAttackHit(event, target) {
    const app = /** @type {SpellCastDialog} */ (this);
    app.attackHit = target.dataset.hit === "true";
    if (!app.attackHit) {
      ui.notifications.info(game.i18n.localize("ASHANVIL.SpellAttackMiss"));
      app.#finish();
      return;
    }
    app.phase = app.#nextPhaseAfterAttack();
    if (app.phase === "complete") {
      ui.notifications.info(game.i18n.format("ASHANVIL.SpellCastComplete", { name: app.spell.name }));
      app.#finish();
      return;
    }
    app.render(false);
  }

  static #onSetSaveResult(event, target) {
    const app = /** @type {SpellCastDialog} */ (this);
    app.saveFailed = target.dataset.failed === "true";
    const mult = damageMultiplier(app.spell.system?.damageOnSave, app.saveFailed);
    if (mult <= 0) {
      ui.notifications.info(game.i18n.localize("ASHANVIL.SpellSaveNoDamage"));
      app.#finish();
      return;
    }
    app.phase = app.#nextPhaseAfterSave();
    app.render(false);
  }

  static async #onRollDamage() {
    const app = /** @type {SpellCastDialog} */ (this);
    const sys = app.spell.system ?? {};
    const baseFormula = damageRollFormula(sys.damageFormula, sys.damageMisc ?? 0);
    if (!baseFormula) {
      app.#finish();
      return;
    }
    const mult = damageMultiplier(sys.damageOnSave, app.saveFailed);
    const formula =
      mult === 0.5 ? `floor((${baseFormula}) / 2)` : mult === 1 ? baseFormula : baseFormula;
    const roll = await new Roll(formula).evaluate();
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: app.actor }),
      flavor: game.i18n.format("ASHANVIL.SpellDamageRoll", { name: app.spell.name }),
    });
    ui.notifications.info(game.i18n.format("ASHANVIL.SpellCastComplete", { name: app.spell.name }));
    app.#finish();
  }

  static #onCancel() {
    const app = /** @type {SpellCastDialog} */ (this);
    app.#finish();
  }
}

/**
 * @param {Item} spell
 */
export async function showSpellInfo(spell) {
  const sys = spell.system ?? {};
  const rows = [];
  if (sys.level != null) {
    rows.push(
      `<p><strong>${game.i18n.localize("ASHANVIL.SpellLevel")}:</strong> ${sys.level}</p>`
    );
  }
  if (sys.school) {
    rows.push(
      `<p><strong>${game.i18n.localize("ASHANVIL.SpellSchool")}:</strong> ${sys.school}</p>`
    );
  }
  if (sys.requiresAttack) rows.push(`<p>${game.i18n.localize("ASHANVIL.SpellRequiresAttack")}</p>`);
  if (sys.requiresSave) rows.push(`<p>${game.i18n.localize("ASHANVIL.SpellRequiresSave")}</p>`);
  if (sys.damageFormula) {
    rows.push(
      `<p><strong>${game.i18n.localize("ASHANVIL.SpellDamageFormula")}:</strong> ${sys.damageFormula}</p>`
    );
  }
  const desc = sys.description ?? "";

  new Dialog({
    title: spell.name,
    content: `<div class="ash-and-anvil spell-info-dialog">${rows.join("")}${desc}</div>`,
    buttons: {
      close: {
        label: game.i18n.localize("Close"),
      },
    },
  }).render(true);
}
