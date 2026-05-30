import { ChargenWizard } from "../../applications/chargen-wizard.mjs";
import { LevelUpWizard } from "../../applications/level-up-wizard.mjs";

import {

  CHARACTER_SHEET_PARAMS,

  defaultSubTabId,

  getSubTabs,

} from "../../config/sheet-params.mjs";

import { equipItemToSlot, moveItemToContainer, unequipSlot } from "../../rules/equipment.mjs";

import { validateWeightPickup } from "../../rules/encumbrance.mjs";

import { parseDeltaInput } from "../../rules/resource-adjust.mjs";

import {
  rollAbilityCheck,
  rollDeathSave,
  rollSavingThrow,
  rollSkillCheck,
  rollWakeSave,
} from "../../rules/sheet-rolls.mjs";

import { normalizeTagArray } from "../../helpers/tag-arrays.mjs";

import { formatChangeLogForDisplay, recordSheetChanges } from "../../helpers/sheet-audit.mjs";

import { confirmDeleteItem, getActorEffects } from "./prepare-sheet-items.mjs";

import { prepareCharacterSheetContext } from "./prepare-character-context.mjs";



const { HandlebarsApplicationMixin } = foundry.applications.api;

const { ActorSheetV2 } = foundry.applications.sheets;



const INVENTORY_ITEM_TYPES = new Set(["gear", "spell", "feature"]);



export class CharacterActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {

  #activeTab = CHARACTER_SHEET_PARAMS.tabs.find((t) => t.default)?.id ?? "details";

  #activeSubTabs = {

    powers: defaultSubTabId("powers"),

    effects: defaultSubTabId("effects"),

  };

  /** @type {string|null} */

  #openContainerId = null;

  /** @type {boolean} */

  #sheetEditMode = false;

  /** @type {Set<string>} */
  #openCollapsibles = new Set();



  static DEFAULT_OPTIONS = {

    id: "ash-anvil-character-sheet",

    classes: ["ash-and-anvil", "sheet", "actor", "character"],

    position: {

      width: CHARACTER_SHEET_PARAMS.window.width,

      height: CHARACTER_SHEET_PARAMS.window.height,

    },

    window: { resizable: CHARACTER_SHEET_PARAMS.window.resizable },

    tag: "form",

    form: {

      submitOnChange: true,

      submitOnClose: true,

    },

    actions: {

      openChargen: CharacterActorSheet.#onOpenChargen,

      openLevelUp: CharacterActorSheet.#onOpenLevelUp,

      changeTab: CharacterActorSheet.#onChangeTab,

      changeSubTab: CharacterActorSheet.#onChangeSubTab,

      toggleEditMode: CharacterActorSheet.#onToggleEditMode,

      addTag: CharacterActorSheet.#onAddTag,

      removeTag: CharacterActorSheet.#onRemoveTag,

      addCustomSkill: CharacterActorSheet.#onAddCustomSkill,

      toggleHeritage: CharacterActorSheet.#onToggleHeritage,

      createItem: CharacterActorSheet.#onCreateItem,

      editItem: CharacterActorSheet.#onEditItem,

      deleteItem: CharacterActorSheet.#onDeleteItem,

      toggleEffect: CharacterActorSheet.#onToggleEffect,

      openContainer: CharacterActorSheet.#onOpenContainer,

      closeContainer: CharacterActorSheet.#onCloseContainer,

      applyResourceDelta: CharacterActorSheet.#onApplyResourceDelta,

      rollAbility: CharacterActorSheet.#onRollAbility,

      rollSave: CharacterActorSheet.#onRollSave,

      rollSkill: CharacterActorSheet.#onRollSkill,

      rollDeathSave: CharacterActorSheet.#onRollDeathSave,

      rollWakeSave: CharacterActorSheet.#onRollWakeSave,

      unequipSlot: CharacterActorSheet.#onUnequipSlot,

    },

    dragDrop: [

      {

        dragSelector: "[data-item-id]",

        dropSelector: ".inventory-drop, .equipment-slot",

      },

    ],

  };



  static PARTS = {

    header: {

      template: "systems/ash-and-anvil/templates/actor/parts/header.hbs",

    },

    body: {

      template: "systems/ash-and-anvil/templates/actor/character-sheet.hbs",

      scrollable: [".sheet-tab-content", ".sheet-subtab-content"],

    },

  };



  get title() {

    return `${this.actor.name} — ${game.i18n.localize("ASHANVIL.SheetActorCharacter")}`;

  }



  #canEditSheet() {

    return this.isEditable && this.#sheetEditMode;

  }



  /** Gameplay resource tweaks (HP, currency, pools) without full edit mode. */

  #canAdjustResources() {

    return this.isEditable;

  }



  #syncEditLockClass() {

    this.element?.classList.toggle("sheet-edit-locked", this.isEditable && !this.#sheetEditMode);

  }

  #collapsibleContext() {
    return {
      proficiencies: this.#openCollapsibles.has("proficiencies"),
      defenses: this.#openCollapsibles.has("defenses"),
      heritage: this.#openCollapsibles.has("heritage"),
    };
  }

  #captureOpenCollapsibles() {
    this.element?.querySelectorAll("details[data-collapsible-id]").forEach((el) => {
      const id = el.dataset.collapsibleId;
      if (!id) return;
      if (el.open) this.#openCollapsibles.add(id);
      else this.#openCollapsibles.delete(id);
    });
  }

  #bindCollapsibles() {
    this.element?.querySelectorAll("details[data-collapsible-id]").forEach((el) => {
      if (el.dataset.collapsibleBound) return;
      el.dataset.collapsibleBound = "1";
      el.addEventListener("toggle", () => {
        const id = el.dataset.collapsibleId;
        if (!id) return;
        if (el.open) this.#openCollapsibles.add(id);
        else this.#openCollapsibles.delete(id);
      });
    });
  }

  async render(force, options) {
    if (this.rendered) this.#captureOpenCollapsibles();
    return super.render(force, options);
  }



  /** @param {object} submitData */

  #sanitizeSubmitName(submitData) {

    if (!submitData) return;

    const name = submitData.name;

    if (typeof name === "string") {

      if (name.endsWith(".character")) submitData.name = name.slice(0, -".character".length);

      return;

    }

    if (Array.isArray(name)) {

      submitData.name = String(

        name.find((v) => typeof v === "string" && v !== "character") ?? name[0] ?? this.actor.name

      );

      return;

    }

    if (name && typeof name === "object") {

      const values = Object.values(name).filter((v) => typeof v === "string");

      submitData.name = values.find((v) => v !== "character") ?? values[0] ?? this.actor.name;

    }

  }



  /** @inheritdoc */

  _onChangeForm(formConfig, event) {

    if (!this.#canEditSheet()) return;

    const el = event.target;

    if (!(el instanceof HTMLElement) || !el.name) return;

    if (el.closest(".tag-field") || el.closest(".sheet-edit-toggle")) return;

    return super._onChangeForm(formConfig, event);

  }



  async #submitOpenForm() {

    if (!this.#canEditSheet() || !this.rendered) return;

    try {

      await this.submit();

    } catch (err) {

      console.warn(`${game.system.id} | Character sheet submit skipped`, err);

    }

  }



  async _preparePartContext(partId, context, options) {

    context = await super._preparePartContext(partId, context, options);

    const sheetEditMode = this.#canEditSheet();

    const canAdjustResources = this.#canAdjustResources();

    const sheetContext = prepareCharacterSheetContext(this.actor, {

      editable: sheetEditMode,

      sheetEditMode,

      canAdjustResources,

      changeLog: formatChangeLogForDisplay(this.actor),

      openContainerId: this.#openContainerId,

    });



    if (partId === "header") {

      Object.assign(context, {

        buildComplete: sheetContext.buildComplete,

        canEditActor: this.isEditable,

        sheetEditMode,

        isGM: sheetContext.isGM,

        changeLog: sheetContext.changeLog,

      });

    }



    if (partId === "body") {

      Object.assign(context, sheetContext, {

        activeTab: this.#activeTab,

        activeSubTabs: { ...this.#activeSubTabs },

        subTabs: CHARACTER_SHEET_PARAMS.subTabs,

        openCollapsibles: this.#collapsibleContext(),

      });

    }



    return context;

  }



  async _preClose(options) {

    await this.#submitOpenForm();

    return super._preClose(options);

  }



  async _onRender(context, options) {

    await super._onRender(context, options);

    this.#syncEditLockClass();

    this.#bindTagSelects();

    this.#bindCollapsibles();

  }



  #bindTagSelects() {

    this.element?.querySelectorAll(".tag-add-select").forEach((select) => {

      if (select.dataset.bound) return;

      select.dataset.bound = "1";

      select.addEventListener("change", (event) => {

        event.stopPropagation();

        const btn = select.closest(".tag-field")?.querySelector("[data-action=addTag]");

        if (btn) void this.#performAddTag(event, btn);

      });

    });

  }



  async _processSubmitData(event, form, submitData, options) {

    this.#sanitizeSubmitName(submitData);

    if (this.#canEditSheet()) await recordSheetChanges(this.actor, submitData);

    return super._processSubmitData(event, form, submitData, options);

  }



  async _onDropItem(event, item) {

    if (!this.#canEditSheet() || !INVENTORY_ITEM_TYPES.has(item.type)) return false;



    const target = event.target.closest("[data-drop-zone]");

    if (item.type === "gear" && target) {

      const zone = target.dataset.dropZone;

      if (zone === "equipment") {

        const slotEl = target.closest("[data-slot]");

        const slotId = slotEl?.dataset.slot;

        if (slotId) {

          if (slotEl?.dataset.locked === "true") {

            ui.notifications.warn(game.i18n.localize("ASHANVIL.HandSlotTwoHandedLocked"));

            return true;

          }

          const equipped = await equipItemToSlot(this.actor, item, slotId);

          if (equipped) this.render(false);

          return equipped;

        }

      }

      if (zone === "container") {

        const containerId = target.dataset.containerId;

        if (containerId !== undefined) {

          const moved = await moveItemToContainer(this.actor, item, containerId);

          if (moved) this.render(false);

          return moved;

        }

      }

      if (zone === "root") {

        const moved = await moveItemToContainer(this.actor, item, "");

        if (moved) this.render(false);

        return moved;

      }

    }



    if (item.parent?.id === this.actor.id) return super._onDropItem(event, item);

    const weightCheck = validateWeightPickup(this.actor, item);

    if (!weightCheck.ok) {

      ui.notifications.warn(weightCheck.message);

      return false;

    }

    const itemData = item.toObject();

    delete itemData._id;

    await Item.createDocuments([itemData], { parent: this.actor });

    return true;

  }



  static async #onOpenChargen() {

    const app = /** @type {CharacterActorSheet} */ (this);

    await ChargenWizard.show(app.actor);

  }



  static async #onOpenLevelUp() {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.#canAdjustResources()) return;

    await LevelUpWizard.show(app.actor);

    app.render(false);

  }



  static async #onChangeTab(_event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    await app.#submitOpenForm();

    const tab = target.dataset.tab;

    if (!tab || tab === app.#activeTab) return;

    if (!CHARACTER_SHEET_PARAMS.tabs.some((t) => t.id === tab)) return;

    app.#activeTab = tab;

    app.render(false);

  }



  static async #onChangeSubTab(_event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    await app.#submitOpenForm();

    const group = target.dataset.group;

    const tab = target.dataset.tab;

    if (!group || !tab) return;

    if (!getSubTabs(group).some((t) => t.id === tab)) return;

    app.#activeSubTabs[group] = tab;

    app.render(false);

  }



  static #onToggleEditMode(_event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.isEditable) return;

    app.#sheetEditMode = target.checked;

    app.render(false);

  }



  static async #onAddTag(event, target) {
    return /** @type {CharacterActorSheet} */ (this).#performAddTag(event, target);
  }

  async #performAddTag(event, target) {
    event.preventDefault?.();
    event.stopPropagation?.();

    if (!this.#canEditSheet()) return;

    const field = target.dataset.field;
    if (!field) return;

    const select = target.closest(".tag-field")?.querySelector(".tag-add-select");
    const value = select?.value ?? "";
    if (!value) return;

    const current = normalizeTagArray(foundry.utils.getProperty(this.actor.system, field));
    if (current.includes(value)) return;
    current.push(value);

    const update = { system: {} };
    foundry.utils.setProperty(update.system, field, current);
    await this.actor.update(update);
    await recordSheetChanges(this.actor, update);
    if (select) select.value = "";
    this.render(false);
  }

  static async #onRemoveTag(event, target) {
    return /** @type {CharacterActorSheet} */ (this).#performRemoveTag(event, target);
  }

  async #performRemoveTag(event, target) {
    event.preventDefault?.();
    event.stopPropagation?.();

    if (!this.#canEditSheet()) return;

    const field = target.dataset.field;
    const value = target.dataset.value;
    if (!field || !value) return;

    const current = normalizeTagArray(foundry.utils.getProperty(this.actor.system, field)).filter(
      (v) => v !== value
    );

    const update = { system: {} };
    foundry.utils.setProperty(update.system, field, current);
    await this.actor.update(update);
    await recordSheetChanges(this.actor, update);
    this.render(false);
  }



  static #onOpenContainer(_event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    const id = target.dataset.containerId ?? null;

    app.#openContainerId = !id || id === "root" ? null : id;

    app.#activeTab = "inventory";

    app.render(false);

  }



  static async #onApplyResourceDelta(_event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.#canAdjustResources()) return;

    const path = target.dataset.path;

    const wrap = target.closest("[data-resource-path]");

    const input = wrap?.querySelector("[data-resource-input]");

    if (!path || !input) return;

    const current = foundry.utils.getProperty(app.actor.system, path) ?? 0;

    let next = parseDeltaInput(input.value, current);

    if (path === "attributes.health.value") {

      const max = app.actor.system.attributes?.health?.max ?? next;

      next = Math.min(next, max);

    }

    if (path.startsWith("resources.") && path.endsWith(".value")) {

      const key = path.split(".")[1];

      const max = app.actor.system.resources?.[key]?.max ?? next;

      next = Math.min(next, max);

    }

    const update = { [`system.${path}`]: next };

    if (path === "resources.favor.value") update["system.attributes.favor"] = next;

    await app.actor.update(update);

    input.value = "";

    app.render(false);

  }



  static async #onRollAbility(_event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.#canAdjustResources()) return;

    const ability = target.dataset.ability;

    if (!ability) return;

    await rollAbilityCheck(app.actor, ability);

  }



  static async #onRollSave(_event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.#canAdjustResources()) return;

    const save = target.dataset.save;

    if (!save) return;

    await rollSavingThrow(app.actor, save);

  }



  static async #onRollSkill(_event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.#canAdjustResources()) return;

    const skill = target.dataset.skill;

    if (!skill) return;

    const customIndex = target.dataset.customIndex ?? null;

    await rollSkillCheck(app.actor, skill, customIndex);

  }



  static async #onRollDeathSave(_event, _target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.#canAdjustResources()) return;

    await rollDeathSave(app.actor);

    app.render(false);

  }



  static async #onRollWakeSave(_event, _target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.#canAdjustResources()) return;

    await rollWakeSave(app.actor);

    app.render(false);

  }



  static #onCloseContainer() {

    const app = /** @type {CharacterActorSheet} */ (this);

    app.#openContainerId = null;

    app.render(false);

  }



  static async #onUnequipSlot(_event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.#canEditSheet()) return;

    const slotId = target.dataset.slot;

    if (!slotId) return;

    await unequipSlot(app.actor, slotId);

    app.render(false);

  }



  static async #onAddCustomSkill() {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.#canEditSheet()) return;

    const label = window.prompt(game.i18n.localize("ASHANVIL.SkillName"));

    if (!label?.trim()) return;

    const custom = foundry.utils.deepClone(app.actor.system.skills?.custom ?? []);

    custom.push({

      id: foundry.utils.randomID(),

      label: label.trim(),

      ability: "mnd",

      ranks: 0,

      misc: 0,

      bonus: 0,

    });

    const update = { "system.skills.custom": custom };

    await app.actor.update(update);

    await recordSheetChanges(app.actor, { system: { skills: { custom } } });

    app.render(false);

  }



  static async #onToggleHeritage(event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.#canEditSheet()) return;

    const kind = target.dataset.heritage;

    const checked = target.checked;

    const update = {

      "system.details.isVampire": kind === "vampire" ? checked : false,

      "system.details.isLycanthrope": kind === "lycanthrope" ? checked : false,

    };

    if (checked && kind === "vampire") update["system.details.isLycanthrope"] = false;

    if (checked && kind === "lycanthrope") update["system.details.isVampire"] = false;

    await app.actor.update(update);

    await recordSheetChanges(app.actor, foundry.utils.expandObject(update));

    app.render(false);

  }



  static async #onCreateItem(_event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.#canEditSheet()) return;

    const type = target.dataset.itemType ?? "gear";

    const tradition = target.dataset.tradition ?? "arcane";

    const isContainer = target.dataset.container === "1";

    const labels = {

      gear: isContainer ? "ASHANVIL.NewContainer" : "ASHANVIL.NewGear",

      spell: "ASHANVIL.NewSpell",

      feature: "ASHANVIL.NewFeature",

    };

    const data = {

      name: game.i18n.localize(labels[type] ?? "Name"),

      type,

      system: {},

    };

    if (type === "spell") data.system = { tradition, level: 0, school: "", prepared: false };

    if (type === "gear" && isContainer) {

      data.system = { isContainer: true, containerKind: "backpack", containerCapacity: 20, quantity: 1 };

    }

    const created = await Item.createDocuments([data], { parent: app.actor });

    created[0]?.sheet?.render(true);

    app.render(false);

  }



  static #onEditItem(_event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    const itemId = target.closest("[data-item-id]")?.dataset.itemId ?? target.dataset.itemId;

    app.actor.items.get(itemId)?.sheet?.render(true);

  }



  static async #onDeleteItem(_event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.#canEditSheet()) return;

    const itemId = target.closest("[data-item-id]")?.dataset.itemId ?? target.dataset.itemId;

    const item = app.actor.items.get(itemId);

    if (!item) return;

    if (!(await confirmDeleteItem(item.name))) return;

    await item.delete();

    app.render(false);

  }



  static async #onToggleEffect(_event, target) {

    const app = /** @type {CharacterActorSheet} */ (this);

    if (!app.#canEditSheet()) return;

    const effectId = target.dataset.effectId;

    const effect =

      app.actor.effects.get(effectId) ??

      getActorEffects(app.actor).find((e) => e.id === effectId);

    if (!effect) return;

    await effect.update({ disabled: !target.checked });

    app.render(false);

  }

}

