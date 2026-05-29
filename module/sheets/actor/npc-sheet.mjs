const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class NpcActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["ash-and-anvil", "sheet", "actor", "npc"],
    position: { width: 560, height: 640 },
    window: { resizable: true },
    tag: "form",
  };

  static PARTS = {
    body: {
      template: "systems/ash-and-anvil/templates/actor/npc-sheet.hbs",
      scrollable: [""],
    },
  };

  /** @override */
  get title() {
    return `${this.actor.name} — ${game.i18n.localize("ASHANVIL.SheetActorNpc")}`;
  }
}
