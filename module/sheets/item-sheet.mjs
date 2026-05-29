const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

export class ItemSheetAA extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["ash-and-anvil", "sheet", "item"],
    position: { width: 520, height: 600 },
    window: { resizable: true },
    tag: "form",
  };

  static PARTS = {
    body: {
      template: "systems/ash-and-anvil/templates/item/item-sheet.hbs",
      scrollable: [""],
    },
  };

  /** @override */
  get title() {
    return `${this.item.name} — ${game.i18n.localize("ASHANVIL.SheetItem")}`;
  }
}
