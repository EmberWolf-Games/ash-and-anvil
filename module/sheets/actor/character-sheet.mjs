import { ChargenWizard } from "../../applications/chargen-wizard.mjs";
import { SKILLS, SKILL_KEYS } from "../../rules/constants.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

const ABILITY_LABELS = {
  mgt: "ASHANVIL.AbilityMgt",
  fin: "ASHANVIL.AbilityFin",
  res: "ASHANVIL.AbilityRes",
  ins: "ASHANVIL.AbilityIns",
  foc: "ASHANVIL.AbilityFoc",
  pre: "ASHANVIL.AbilityPre",
};

export class CharacterActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["ash-and-anvil", "sheet", "actor", "character"],
    position: { width: 780, height: 860 },
    window: { resizable: true },
    tag: "form",
    actions: {
      openChargen: CharacterActorSheet.#onOpenChargen,
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
    if (partId === "header") {
      context.buildComplete = this.actor.system.chargen?.buildComplete;
    }
    if (partId === "body") {
      context.abilityRows = Object.entries(this.actor.system.abilities ?? {}).map(([key, ability]) => ({
        key,
        ability,
        label: game.i18n.localize(ABILITY_LABELS[key] ?? key),
      }));
      context.skillRows = SKILL_KEYS.map((key) => ({
        key,
        label: game.i18n.localize(SKILLS[key].label),
        skill: this.actor.system.skills?.[key] ?? { trained: false, bonus: 0 },
      }));
      context.edge = this.actor.system.proficiency?.edge ?? 2;
      context.buildComplete = this.actor.system.chargen?.buildComplete;
      context.editable = this.isEditable;
      context.ancestryName = this.#linkedItemName("ancestry", this.actor.system.details?.ancestryId);
      context.className = this.#linkedItemName("class", this.actor.system.details?.classId);
      context.backgroundName = this.#linkedItemName("background", this.actor.system.details?.backgroundId);
    }
    return context;
  }

  /**
   * @param {string} type
   * @param {string} idOrUuid
   */
  #linkedItemName(type, idOrUuid) {
    const embedded = this.actor.items.find((i) => i.type === type);
    if (embedded) return embedded.name;
    if (!idOrUuid) return "—";
    const world = game.items.get(idOrUuid);
    return world?.name ?? "—";
  }

  static async #onOpenChargen() {
    const app = /** @type {CharacterActorSheet} */ (this);
    await ChargenWizard.show(app.actor);
  }
}
