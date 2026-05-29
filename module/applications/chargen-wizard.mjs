const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
import { ABILITY_KEYS, SKILLS, SKILL_KEYS } from "../rules/constants.mjs";
import { applyAncestryAdjustments } from "../rules/derive-character.mjs";
import { getRulesConfig } from "../rules/config.mjs";
import { loadStarterCatalog } from "../bootstrap/seed-compendiums.mjs";
import {
  defaultAbilityScores,
  isValidStandardArrayAssignment,
  validatePointBuy,
} from "./chargen-helpers.mjs";

export class ChargenWizard extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @type {Actor} */
  actor;

  /** @type {number} */
  step = 0;

  /** @type {object} */
  state = {
    ancestryId: null,
    classId: null,
    backgroundId: null,
    abilities: defaultAbilityScores(),
    classSkills: [],
    catalog: { ancestries: [], classes: [], backgrounds: [] },
  };

  static DEFAULT_OPTIONS = {
    id: "ash-anvil-chargen",
    classes: ["ash-and-anvil", "chargen-wizard"],
    tag: "form",
    window: { title: "ASHANVIL.ChargenTitle", icon: "fa-hammer" },
    position: { width: 620, height: 720 },
    actions: {
      next: ChargenWizard.#onNext,
      back: ChargenWizard.#onBack,
      finish: ChargenWizard.#onFinish,
      gotoStep: ChargenWizard.#onGotoStep,
    },
  };

  static PARTS = {
    body: {
      template: "systems/ash-and-anvil/templates/chargen/wizard.hbs",
      scrollable: [""],
    },
  };

  /**
   * @param {Actor} actor
   */
  static async show(actor) {
    const app = new ChargenWizard({ actor });
    app.state.catalog = await loadStarterCatalog();
    return app.render({ force: true });
  }

  constructor(options = {}) {
    const { actor, ...rest } = options;
    super(rest);
    this.actor = actor;
  }

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const rules = getRulesConfig();
    const selectedAncestry = this.#findEntry(this.state.catalog.ancestries, this.state.ancestryId);
    const selectedClass = this.#findEntry(this.state.catalog.classes, this.state.classId);
    const selectedBackground = this.#findEntry(this.state.catalog.backgrounds, this.state.backgroundId);

    context.step = this.step;
    context.steps = [
      game.i18n.localize("ASHANVIL.ChargenStepAncestry"),
      game.i18n.localize("ASHANVIL.ChargenStepClass"),
      game.i18n.localize("ASHANVIL.ChargenStepBackground"),
      game.i18n.localize("ASHANVIL.ChargenStepAbilities"),
      game.i18n.localize("ASHANVIL.ChargenStepSkills"),
      game.i18n.localize("ASHANVIL.ChargenStepReview"),
    ];
    context.catalog = this.state.catalog;
    context.state = this.state;
    context.rules = rules;
    context.selectedAncestry = selectedAncestry;
    context.selectedClass = selectedClass;
    context.selectedBackground = selectedBackground;
    context.abilityKeys = ABILITY_KEYS;
    const abilityLabelKeys = {
      mgt: "ASHANVIL.AbilityMgt",
      fin: "ASHANVIL.AbilityFin",
      res: "ASHANVIL.AbilityRes",
      ins: "ASHANVIL.AbilityIns",
      foc: "ASHANVIL.AbilityFoc",
      pre: "ASHANVIL.AbilityPre",
    };
    context.abilityLabels = Object.fromEntries(
      ABILITY_KEYS.map((k) => [k, game.i18n.localize(abilityLabelKeys[k])])
    );
    context.skillRows = SKILL_KEYS.map((key) => ({
      key,
      label: game.i18n.localize(SKILLS[key].label),
      inPool: selectedClass?.system?.skillPool?.includes(key) ?? false,
      trained:
        this.state.classSkills.includes(key) ||
        (selectedBackground?.system?.trainedSkills?.includes(key) ?? false),
      locked: selectedBackground?.system?.trainedSkills?.includes(key) ?? false,
    }));
    context.canNext = this.#canAdvance();
    context.isLast = this.step >= 5;
    return context;
  }

  /** @override */
  async _onRender(context, options) {
    await super._onRender(context, options);
    this.#bindFormListeners();
  }

  #bindFormListeners() {
    const form = this.#getForm();
    if (!form || form.dataset.aaChargenBound) return;
    form.dataset.aaChargenBound = "1";
    form.addEventListener("change", () => {
      this.#readForm(form);
      this.render({ force: true });
    });
  }

  /**
   * @returns {HTMLFormElement|null}
   */
  #getForm() {
    if (this.element instanceof HTMLFormElement) return this.element;
    return this.element?.querySelector("form") ?? null;
  }

  /**
   * @param {object[]} list
   * @param {string|null} id
   */
  #findEntry(list, id) {
    return list.find((e) => e.id === id || e.uuid === id) ?? null;
  }

  #canAdvance() {
    switch (this.step) {
      case 0:
        return !!this.state.ancestryId;
      case 1:
        return !!this.state.classId;
      case 2:
        return !!this.state.backgroundId;
      case 3:
        return this.#abilitiesValid();
      case 4: {
        const cls = this.#findEntry(this.state.catalog.classes, this.state.classId);
        const need = cls?.system?.skillChoices ?? 0;
        const bg = this.#findEntry(this.state.catalog.backgrounds, this.state.backgroundId);
        const bgCount = bg?.system?.trainedSkills?.length ?? 0;
        return this.state.classSkills.length >= need;
      }
      default:
        return true;
    }
  }

  #abilitiesValid() {
    const rules = getRulesConfig();
    const scores = this.state.abilities;
    if (rules.statMethod === "standardArray") {
      return isValidStandardArrayAssignment(ABILITY_KEYS.map((k) => scores[k]));
    }
    if (rules.statMethod === "pointBuy") {
      return validatePointBuy(scores).valid;
    }
    return ABILITY_KEYS.every((k) => scores[k] >= 3 && scores[k] <= 18);
  }

  static async #onNext(_event, target) {
    const app = /** @type {ChargenWizard} */ (this);
    const form = app.#getForm() ?? target.closest("form");
    if (form) app.#readForm(form);
    if (!app.#canAdvance()) {
      ui.notifications.warn(game.i18n.localize("ASHANVIL.ChargenIncomplete"));
      return;
    }
    if (app.step < 5) {
      app.step += 1;
      app.render({ force: true });
    }
  }

  static async #onBack(_event, target) {
    const app = /** @type {ChargenWizard} */ (this);
    const form = app.#getForm() ?? target.closest("form");
    if (form) app.#readForm(form);
    if (app.step > 0) {
      app.step -= 1;
      app.render({ force: true });
    }
  }

  static async #onFinish(_event, target) {
    const app = /** @type {ChargenWizard} */ (this);
    const form = app.#getForm() ?? target.closest("form");
    if (form) app.#readForm(form);
    if (!app.#canAdvance()) {
      ui.notifications.warn(game.i18n.localize("ASHANVIL.ChargenIncomplete"));
      return;
    }
    await app.#applyBuild();
    app.close();
  }

  static async #onGotoStep(_event, target) {
    const app = /** @type {ChargenWizard} */ (this);
    const form = app.#getForm();
    if (form) app.#readForm(form);
    const step = Number(target.dataset.step);
    if (!Number.isInteger(step) || step < 0 || step > 5) return;

    if (step <= app.step) {
      app.step = step;
      app.render({ force: true });
      return;
    }

    while (app.step < step) {
      if (!app.#canAdvance()) {
        ui.notifications.warn(game.i18n.localize("ASHANVIL.ChargenIncomplete"));
        return;
      }
      app.step += 1;
    }
    app.render({ force: true });
  }

  /**
   * @param {HTMLFormElement} form
   */
  #readForm(form) {
    const fd = new FormDataExtended(form);
    const data = fd.object;
    if (data.ancestryId !== undefined) this.state.ancestryId = data.ancestryId || null;
    if (data.classId !== undefined) this.state.classId = data.classId || null;
    if (data.backgroundId !== undefined) this.state.backgroundId = data.backgroundId || null;
    for (const key of ABILITY_KEYS) {
      const val = data.abilities?.[key];
      if (val !== undefined && val !== null && val !== "") this.state.abilities[key] = Number(val);
    }
    this.state.classSkills = [];
    for (const key of SKILL_KEYS) {
      if (data.classSkills?.[key]) this.state.classSkills.push(key);
    }
  }

  async #applyBuild() {
    const ancestry = this.#findEntry(this.state.catalog.ancestries, this.state.ancestryId);
    const cls = this.#findEntry(this.state.catalog.classes, this.state.classId);
    const background = this.#findEntry(this.state.catalog.backgrounds, this.state.backgroundId);

    const system = foundry.utils.deepClone(this.actor.system.toObject());

    for (const key of ABILITY_KEYS) {
      system.abilities[key].value = this.state.abilities[key];
    }
    applyAncestryAdjustments(system, ancestry ? { system: ancestry.system } : null);

    system.details.ancestryId = ancestry?.uuid ?? ancestry?.id ?? "";
    system.details.classId = cls?.uuid ?? cls?.id ?? "";
    system.details.backgroundId = background?.uuid ?? background?.id ?? "";

    for (const key of SKILL_KEYS) {
      system.skills[key].trained = false;
    }
    for (const key of background?.system?.trainedSkills ?? []) {
      if (system.skills[key]) system.skills[key].trained = true;
    }
    for (const key of this.state.classSkills) {
      if (system.skills[key]) system.skills[key].trained = true;
    }

    system.chargen.buildComplete = true;
    system.chargen.buildVersion = game.system.version;

    const toEmbed = [];
    if (game.settings.get("ash-and-anvil", "automationEnabled")) {
      for (const entry of [ancestry, cls, background]) {
        if (!entry) continue;
        if (entry.uuid) {
          const doc = await fromUuid(entry.uuid);
          if (doc) toEmbed.push(doc.toObject());
        } else {
          toEmbed.push({
            name: entry.name,
            type: entry.type,
            system: foundry.utils.deepClone(entry.system),
          });
        }
      }
      const featurePack = game.packs.get("ash-and-anvil.features");
      if (featurePack) {
        const keys = [
          ...(ancestry?.system?.featureKeys ?? []),
          ...(cls?.system?.featureKeys ?? []),
          ...(background?.system?.featureKeys ?? []),
        ];
        const index = await featurePack.getIndex();
        for (const key of keys) {
          const match = index.find((i) => i.flags?.["ash-and-anvil"]?.starterKey === key);
          if (match) {
            const f = await fromUuid(match.uuid);
            if (f) toEmbed.push(f.toObject());
          }
        }
      }
    }

    await this.actor.update({ system });
    if (toEmbed.length) {
      await this.actor.createEmbeddedDocuments("Item", toEmbed);
    }
    this.actor.prepareData();
    await this.actor.sheet?.render(true);
    ui.notifications.info(game.i18n.localize("ASHANVIL.ChargenComplete"));
  }
}
