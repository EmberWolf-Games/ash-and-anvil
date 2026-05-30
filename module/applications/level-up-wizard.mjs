const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const { FormDataExtended } = foundry.applications.ux;

import { MAX_TOTAL_LEVEL } from "../rules/constants.mjs";
import { buildExperienceContext, canCharacterLevelUp } from "../rules/experience.mjs";
import { loadStarterCatalog } from "../bootstrap/seed-compendiums.mjs";
import { documentToCreateData } from "../helpers/document.mjs";

export class LevelUpWizard extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @type {Actor} */
  actor;

  /** @type {number} */
  step = 0;

  /** @type {object} */
  state = {
    mode: "primary",
    subclass: "",
    newClassId: null,
    featName: "",
    featureNotes: "",
    catalog: { classes: [] },
  };

  static DEFAULT_OPTIONS = {
    id: "ash-anvil-level-up",
    classes: ["ash-and-anvil", "level-up-wizard"],
    tag: "form",
    window: { title: "ASHANVIL.LevelUpTitle", icon: "fa-arrow-up" },
    position: { width: 560, height: 640 },
    actions: {
      next: LevelUpWizard.#onNext,
      back: LevelUpWizard.#onBack,
      finish: LevelUpWizard.#onFinish,
    },
  };

  static PARTS = {
    body: {
      template: "systems/ash-and-anvil/templates/levelup/wizard.hbs",
      scrollable: [""],
    },
  };

  /**
   * @param {Actor} actor
   */
  static async show(actor) {
    if (!canCharacterLevelUp(actor)) {
      ui.notifications.warn(game.i18n.localize("ASHANVIL.LevelUpNotReady"));
      return;
    }
    const app = new LevelUpWizard({ actor });
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
    const system = this.actor.system;
    const classes = this.actor.items.filter((i) => i.type === "class");
    const primary = classes[0] ?? null;
    const secondary = classes[1] ?? null;
    const primaryLevel = system.attributes?.primaryClassLevel ?? 1;
    const secondaryLevel = system.attributes?.secondaryClassLevel ?? 0;
    const totalLevel = system.attributes?.totalLevel ?? 1;
    const experience = buildExperienceContext(this.actor);

    const canPrimary = !!primary && primaryLevel + secondaryLevel < MAX_TOTAL_LEVEL;
    const canSecondary = !!secondary && secondaryLevel > 0 && totalLevel < MAX_TOTAL_LEVEL;
    const canAddClass = !secondary && classes.length < 2 && totalLevel < MAX_TOTAL_LEVEL;

    context.step = this.step;
    context.steps = [
      game.i18n.localize("ASHANVIL.LevelUpStepAdvance"),
      game.i18n.localize("ASHANVIL.LevelUpStepSubclass"),
      game.i18n.localize("ASHANVIL.LevelUpStepFeatures"),
      game.i18n.localize("ASHANVIL.LevelUpStepReview"),
    ];
    context.state = this.state;
    context.experience = experience;
    context.primary = primary;
    context.secondary = secondary;
    context.advanceOptions = {
      canPrimary,
      canSecondary,
      canAddClass,
      primaryLabel: primary
        ? game.i18n.format("ASHANVIL.LevelUpAdvancePrimary", {
            name: primary.name,
            level: primaryLevel + 1,
          })
        : "",
      secondaryLabel: secondary
        ? game.i18n.format("ASHANVIL.LevelUpAdvanceSecondary", {
            name: secondary.name,
            level: secondaryLevel + 1,
          })
        : "",
    };
    context.catalog = this.state.catalog;
    context.subclassLabel =
      this.state.mode === "secondary" || this.state.mode === "addClass"
        ? game.i18n.localize("ASHANVIL.SecondarySubclass")
        : game.i18n.localize("ASHANVIL.PrimarySubclass");
    context.isLast = this.step >= 3;
    context.canNext = this.#canAdvance();
    context.reviewSummary = this.#reviewSummary(primary, secondary, primaryLevel, secondaryLevel);
    return context;
  }

  /** @override */
  async _onRender(context, options) {
    await super._onRender(context, options);
    this.#bindFormListeners();
  }

  #bindFormListeners() {
    const form = this.element?.querySelector("form") ?? this.element;
    if (!form || form.dataset.aaLevelUpBound) return;
    form.dataset.aaLevelUpBound = "true";
    form.addEventListener("change", () => this.#readForm(form));
    form.addEventListener("input", () => this.#readForm(form));
  }

  #getForm() {
    return this.element?.querySelector("form") ?? this.element;
  }

  /**
   * @param {object|null} primary
   * @param {object|null} secondary
   * @param {number} primaryLevel
   * @param {number} secondaryLevel
   */
  #reviewSummary(primary, secondary, primaryLevel, secondaryLevel) {
    const mode = this.state.mode;
    if (mode === "primary" && primary) {
      return game.i18n.format("ASHANVIL.LevelUpReviewPrimary", {
        name: primary.name,
        level: primaryLevel + 1,
      });
    }
    if (mode === "secondary" && secondary) {
      return game.i18n.format("ASHANVIL.LevelUpReviewSecondary", {
        name: secondary.name,
        level: secondaryLevel + 1,
      });
    }
    if (mode === "addClass") {
      const entry = this.#findClass(this.state.newClassId);
      return entry
        ? game.i18n.format("ASHANVIL.LevelUpReviewAddClass", { name: entry.name })
        : game.i18n.localize("ASHANVIL.LevelUpReviewAddClassPending");
    }
    return "—";
  }

  #findClass(id) {
    return this.state.catalog.classes.find((c) => c.id === id || c.uuid === id) ?? null;
  }

  #canAdvance() {
    if (this.step === 0) {
      if (this.state.mode === "addClass") return !!this.state.newClassId;
      return ["primary", "secondary"].includes(this.state.mode);
    }
    return true;
  }

  /**
   * @param {HTMLFormElement} form
   */
  #readForm(form) {
    const fd = new FormDataExtended(form);
    const data = fd.object;
    if (data.mode !== undefined) this.state.mode = data.mode || "primary";
    if (data.newClassId !== undefined) this.state.newClassId = data.newClassId || null;
    if (data.subclass !== undefined) this.state.subclass = data.subclass ?? "";
    if (data.featName !== undefined) this.state.featName = data.featName ?? "";
    if (data.featureNotes !== undefined) this.state.featureNotes = data.featureNotes ?? "";
  }

  static #onBack() {
    const app = /** @type {LevelUpWizard} */ (this);
    if (app.step > 0) app.step -= 1;
    app.render({ force: true });
  }

  static async #onNext() {
    const app = /** @type {LevelUpWizard} */ (this);
    const form = app.#getForm();
    if (form) app.#readForm(form);
    if (!app.#canAdvance()) {
      ui.notifications.warn(game.i18n.localize("ASHANVIL.LevelUpIncomplete"));
      return;
    }
    app.step += 1;
    app.render({ force: true });
  }

  static async #onFinish() {
    const app = /** @type {LevelUpWizard} */ (this);
    const form = app.#getForm();
    if (form) app.#readForm(form);
    if (!canCharacterLevelUp(app.actor)) {
      ui.notifications.warn(game.i18n.localize("ASHANVIL.LevelUpNotReady"));
      return;
    }
    await app.#applyLevelUp();
    app.close();
  }

  async #applyLevelUp() {
    const system = this.actor.system;
    /** @type {Record<string, unknown>} */
    const updates = {};
    /** @type {object[]} */
    const embedded = [];
    let primaryLevel = system.attributes?.primaryClassLevel ?? 1;
    let secondaryLevel = system.attributes?.secondaryClassLevel ?? 0;

    if (this.state.mode === "primary") {
      primaryLevel += 1;
      updates["system.attributes.primaryClassLevel"] = primaryLevel;
      if (this.state.subclass.trim()) {
        updates["system.details.primarySubclass"] = this.state.subclass.trim();
      }
    } else if (this.state.mode === "secondary") {
      secondaryLevel += 1;
      updates["system.attributes.secondaryClassLevel"] = secondaryLevel;
      if (this.state.subclass.trim()) {
        updates["system.details.secondarySubclass"] = this.state.subclass.trim();
      }
    } else if (this.state.mode === "addClass") {
      const entry = this.#findClass(this.state.newClassId);
      if (!entry) {
        ui.notifications.error(game.i18n.localize("ASHANVIL.LevelUpPickClass"));
        return;
      }
      updates["system.attributes.secondaryClassLevel"] = 1;
      updates["system.details.secondaryClassId"] = entry.uuid ?? entry.id ?? "";
      if (this.state.subclass.trim()) {
        updates["system.details.secondarySubclass"] = this.state.subclass.trim();
      }
      if (entry.uuid) {
        const doc = await fromUuid(entry.uuid);
        if (doc) embedded.push(documentToCreateData(doc));
      } else {
        embedded.push({
          name: entry.name,
          type: "class",
          system: foundry.utils.deepClone(entry.system),
        });
      }
    }

    await this.actor.update(updates);

    if (embedded.length) {
      await this.actor.createEmbeddedDocuments("Item", embedded);
    }

    if (this.state.featName.trim()) {
      await this.actor.createEmbeddedDocuments("Item", [
        {
          name: this.state.featName.trim(),
          type: "feature",
          system: {
            description: this.state.featureNotes.trim(),
            key: "",
          },
        },
      ]);
    } else if (this.state.featureNotes.trim()) {
      await this.actor.createEmbeddedDocuments("Item", [
        {
          name: game.i18n.localize("ASHANVIL.LevelUpFeatureNotes"),
          type: "feature",
          system: {
            description: this.state.featureNotes.trim(),
            key: "",
          },
        },
      ]);
    }

    this.actor.prepareData();
    await this.actor.sheet?.render(true);
    ui.notifications.info(game.i18n.localize("ASHANVIL.LevelUpComplete"));
  }
}
