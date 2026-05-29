/**
 * Character sheet layout parameters — tune here before/during visual design.
 * Templates read from CONFIG.ASH_ANVIL.sheets.character at render time.
 */

/** @typedef {object} SheetTabParam
 * @property {string} id
 * @property {string} labelKey i18n key
 * @property {string} template Handlebars template path
 * @property {boolean} [default] first tab shown when sheet opens
 * @property {boolean} [nested] tab contains sub-tabs (see subTabs map)
 */

/** @typedef {object} SheetSubTabParam
 * @property {string} id
 * @property {string} labelKey
 * @property {string} [template] optional override; defaults to tabs/{parent}-{id}.hbs
 * @property {boolean} [default]
 */

/** @type {Readonly<SheetTabParam[]>} */
export const CHARACTER_SHEET_TABS = [
  {
    id: "details",
    labelKey: "ASHANVIL.SheetTabDetails",
    template: "systems/ash-and-anvil/templates/actor/tabs/details.hbs",
    default: true,
  },
  {
    id: "inventory",
    labelKey: "ASHANVIL.SheetTabInventory",
    template: "systems/ash-and-anvil/templates/actor/tabs/inventory.hbs",
  },
  {
    id: "features",
    labelKey: "ASHANVIL.SheetTabFeatures",
    template: "systems/ash-and-anvil/templates/actor/tabs/features.hbs",
  },
  {
    id: "powers",
    labelKey: "ASHANVIL.SheetTabPowers",
    template: "systems/ash-and-anvil/templates/actor/tabs/powers.hbs",
    nested: true,
  },
  {
    id: "effects",
    labelKey: "ASHANVIL.SheetTabEffects",
    template: "systems/ash-and-anvil/templates/actor/tabs/effects.hbs",
    nested: true,
  },
  {
    id: "biography",
    labelKey: "ASHANVIL.SheetTabBiography",
    template: "systems/ash-and-anvil/templates/actor/tabs/biography.hbs",
  },
];

/** @type {Readonly<Record<string, SheetSubTabParam[]>>} */
export const CHARACTER_SHEET_SUB_TABS = {
  powers: [
    {
      id: "spellcasting",
      labelKey: "ASHANVIL.SheetSubTabSpellcasting",
      template: "systems/ash-and-anvil/templates/actor/tabs/powers-spellcasting.hbs",
      default: true,
    },
    {
      id: "psionics",
      labelKey: "ASHANVIL.SheetSubTabPsionics",
      template: "systems/ash-and-anvil/templates/actor/tabs/powers-psionics.hbs",
    },
    {
      id: "divineGifts",
      labelKey: "ASHANVIL.SheetSubTabDivineGifts",
      template: "systems/ash-and-anvil/templates/actor/tabs/powers-divine-gifts.hbs",
    },
  ],
  effects: [
    {
      id: "active",
      labelKey: "ASHANVIL.SheetSubTabActiveEffects",
      template: "systems/ash-and-anvil/templates/actor/tabs/effects-active.hbs",
      default: true,
    },
    {
      id: "passive",
      labelKey: "ASHANVIL.SheetSubTabPassiveEffects",
      template: "systems/ash-and-anvil/templates/actor/tabs/effects-passive.hbs",
    },
  ],
};

/** Layout grid tokens (CSS hooks in styles/ash-and-anvil.css). */
export const CHARACTER_SHEET_LAYOUT = {
  columns: 12,
  gap: "0.75rem",
  portraitSize: 96,
  abilityDisplay: "grid",
  skillDisplay: "grouped",
  showChargenBanner: true,
};

/** @type {Readonly<object>} */
export const CHARACTER_SHEET_PARAMS = {
  id: "character",
  window: {
    width: 860,
    height: 920,
    resizable: true,
  },
  tabs: CHARACTER_SHEET_TABS,
  subTabs: CHARACTER_SHEET_SUB_TABS,
  layout: CHARACTER_SHEET_LAYOUT,
};

/** NPC sheet params (placeholder for later full design). */
export const NPC_SHEET_PARAMS = {
  id: "npc",
  window: { width: 560, height: 640, resizable: true },
};

/**
 * @param {foundry.abstract.Document} _actor
 * @returns {typeof CHARACTER_SHEET_PARAMS}
 */
export function getCharacterSheetParams(_actor) {
  return CONFIG.ASH_ANVIL?.sheets?.character ?? CHARACTER_SHEET_PARAMS;
}

/**
 * @param {string} parentTabId
 * @returns {SheetSubTabParam[]}
 */
export function getSubTabs(parentTabId) {
  const params = getCharacterSheetParams();
  return params.subTabs?.[parentTabId] ?? [];
}

/**
 * @param {string} parentTabId
 * @returns {string}
 */
export function defaultSubTabId(parentTabId) {
  const tabs = getSubTabs(parentTabId);
  return tabs.find((t) => t.default)?.id ?? tabs[0]?.id ?? "";
}
