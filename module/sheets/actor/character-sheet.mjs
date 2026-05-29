import { ChargenWizard } from "../../applications/chargen-wizard.mjs";
import { CHARACTER_SHEET_PARAMS } from "../../config/sheet-params.mjs";
import { prepareCharacterSheetContext } from "./prepare-character-context.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class CharacterActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  /** @type {string} */
  #activeTab = CHARACTER_SHEET_PARAMS.tabs.find((t) => t.default)?.id ?? "main";

  static DEFAULT_OPTIONS = {
    classes: ["ash-and-anvil", "sheet", "actor", "character"],
    position: {
      width: CHARACTER_SHEET_PARAMS.window.width,
      height: CHARACTER_SHEET_PARAMS.window.height,
    },
    window: { resizable: CHARACTER_SHEET_PARAMS.window.resizable },
    tag: "form",
    actions: {
      openChargen: CharacterActorSheet.#onOpenChargen,
      changeTab: CharacterActorSheet.#onChangeTab,
    },
  };

  static PARTS = {
    header: {
      template: "systems/ash-and-anvil/templates/actor/parts/header.hbs",
    },
    body: {
      template: "systems/ash-and-anvil/templates/actor/character-sheet.hbs",
      scrollable: [""],
    },
  };

  /** @override */
  get title() {
    return `${this.actor.name} — ${game.i18n.localize("ASHANVIL.SheetActorCharacter")}`;
  }

  /** @override */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);
    const sheetContext = prepareCharacterSheetContext(this.actor, { editable: this.isEditable });

    if (partId === "header") {
      Object.assign(context, {
        buildComplete: sheetContext.buildComplete,
        combat: sheetContext.combat,
        layout: sheetContext.layout,
      });
    }

    if (partId === "body") {
      Object.assign(context, sheetContext, { activeTab: this.#activeTab });
    }

    return context;
  }

  static async #onOpenChargen() {
    const app = /** @type {CharacterActorSheet} */ (this);
    await ChargenWizard.show(app.actor);
  }

  static #onChangeTab(_event, target) {
    const app = /** @type {CharacterActorSheet} */ (this);
    const tab = target.dataset.tab;
    if (!tab || tab === app.#activeTab) return;
    const valid = CHARACTER_SHEET_PARAMS.tabs.some((t) => t.id === tab);
    if (!valid) return;
    app.#activeTab = tab;
    app.render(false);
  }
}
