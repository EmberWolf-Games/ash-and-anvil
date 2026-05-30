const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const { FormDataExtended } = foundry.applications.ux;

import { ABILITIES, ABILITY_KEYS } from "../rules/constants.mjs";

export class CustomSkillDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @type {Actor} */
  actor;

  /** @type {number|null} */
  editIndex = null;

  static DEFAULT_OPTIONS = {
    id: "ash-anvil-custom-skill",
    classes: ["ash-and-anvil", "custom-skill-dialog"],
    tag: "form",
    window: { title: "ASHANVIL.AddCustomSkill", icon: "fa-plus" },
    position: { width: 360 },
    actions: {
      save: CustomSkillDialog.#onSave,
      cancel: CustomSkillDialog.#onCancel,
    },
  };

  static PARTS = {
    body: {
      template: "systems/ash-and-anvil/templates/dialogs/custom-skill-dialog.hbs",
    },
  };

  /**
   * @param {object} options
   * @param {Actor} options.actor
   * @param {number|null} [options.editIndex]
   */
  constructor(options = {}) {
    const { actor, editIndex = null, ...rest } = options;
    super(rest);
    this.actor = actor;
    this.editIndex = editIndex;
    if (editIndex != null) {
      this.options.window ??= {};
      this.options.window.title = "ASHANVIL.EditCustomSkill";
    }
  }

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const entry =
      this.editIndex != null ? this.actor.system.skills?.custom?.[this.editIndex] ?? null : null;
    context.label = entry?.label ?? "";
    context.ability = entry?.ability ?? "mnd";
    context.abilityOptions = ABILITY_KEYS.map((key) => ({
      key,
      abbr: ABILITIES[key].abbr,
      label: game.i18n.localize(ABILITIES[key].label),
    }));
    return context;
  }

  static #onCancel() {
    this.close();
  }

  static async #onSave() {
    const form = this.element?.querySelector("form") ?? this.element;
    if (!(form instanceof HTMLFormElement)) return;
    const data = new FormDataExtended(form).object;
    const label = String(data.label ?? "").trim();
    if (!label) {
      ui.notifications.warn(game.i18n.localize("ASHANVIL.CustomSkillNameRequired"));
      return;
    }
    const ability = ABILITY_KEYS.includes(data.ability) ? data.ability : "mnd";
    const custom = foundry.utils.deepClone(this.actor.system.skills?.custom ?? []);

    if (this.editIndex != null) {
      const entry = custom[this.editIndex];
      if (!entry) return;
      entry.label = label;
      entry.ability = ability;
    } else {
      custom.push({
        id: foundry.utils.randomID(),
        label,
        ability,
        spRanks: 0,
        moneyRanks: 0,
        misc: 0,
        bonus: 0,
      });
    }

    await this.actor.update({ "system.skills.custom": custom });
    this.close();
  }

  /**
   * @param {Actor} actor
   * @param {number|null} [editIndex]
   */
  static prompt(actor, editIndex = null) {
    const app = new CustomSkillDialog({ actor, editIndex });
    return app.render({ force: true });
  }
}
