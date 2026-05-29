const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class CharacterActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["ash-and-anvil", "sheet", "actor", "character"],
    position: { width: 720, height: 800 },
    window: { resizable: true },
    tag: "form",
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
    if (partId === "body") {
      const abilityLabels = {
        str: "ASHANVIL.AbilityStr",
        dex: "ASHANVIL.AbilityDex",
        con: "ASHANVIL.AbilityCon",
        int: "ASHANVIL.AbilityInt",
        wis: "ASHANVIL.AbilityWis",
        cha: "ASHANVIL.AbilityCha",
      };
      context.abilityRows = Object.entries(this.actor.system.abilities ?? {}).map(([key, ability]) => ({
        key,
        ability,
        label: game.i18n.localize(abilityLabels[key] ?? key),
      }));
      context.editable = this.isEditable;
    }
    return context;
  }
}
