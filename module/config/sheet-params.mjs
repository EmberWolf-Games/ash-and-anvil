/**
 * Character sheet layout parameters — tune here before/during visual design.
 * Templates read from CONFIG.ASH_ANVIL.sheets.character at render time.
 */

/** @typedef {object} SheetTabParam
 * @property {string} id
 * @property {string} labelKey i18n key
 * @property {string} template Handlebars template path
 * @property {boolean} [default] first tab shown when sheet opens
 */

/** @typedef {object} SheetZoneParam
 * @property {string} id stable zone id for CSS / layout grid
 * @property {string} labelKey optional i18n label
 * @property {string[]} fields data keys available in this zone (see docs/design/06-character-sheet-layout.md)
 */

/** @type {Readonly<SheetTabParam[]>} */
export const CHARACTER_SHEET_TABS = [
  {
    id: "main",
    labelKey: "ASHANVIL.SheetTabMain",
    template: "systems/ash-and-anvil/templates/actor/tabs/main.hbs",
    default: true,
  },
  {
    id: "features",
    labelKey: "ASHANVIL.SheetTabFeatures",
    template: "systems/ash-and-anvil/templates/actor/tabs/features.hbs",
  },
  {
    id: "biography",
    labelKey: "ASHANVIL.SheetTabBiography",
    template: "systems/ash-and-anvil/templates/actor/tabs/biography.hbs",
  },
];

/** Layout grid tokens (CSS hooks in styles/ash-and-anvil.css). */
export const CHARACTER_SHEET_LAYOUT = {
  /** Total columns for CSS grid zones */
  columns: 12,
  /** Default gap between zones (rem) */
  gap: "0.75rem",
  /** Profile portrait size in header (px) */
  portraitSize: 96,
  /** Ability block display: "grid" | "row" | "compact" — templates/CSS branch on this */
  abilityDisplay: "grid",
  /** Skills display: "table" | "grouped" | "compact" */
  skillDisplay: "grouped",
  /** Show chargen banner when build incomplete */
  showChargenBanner: true,
};

/**
 * Semantic zones — map your wireframe regions to these ids when you lay out the sheet.
 * @type {Readonly<Record<string, SheetZoneParam>>}
 */
export const CHARACTER_SHEET_ZONES = {
  header: {
    id: "header",
    labelKey: "ASHANVIL.SheetZoneHeader",
    fields: ["name", "img", "level", "health", "initiative", "edge"],
  },
  identity: {
    id: "identity",
    labelKey: "ASHANVIL.SheetZoneIdentity",
    fields: ["ancestry", "class", "background", "buildComplete"],
  },
  abilities: {
    id: "abilities",
    labelKey: "ASHANVIL.SheetZoneAbilities",
    fields: ["abilities.*.value", "abilities.*.mod"],
  },
  skills: {
    id: "skills",
    labelKey: "ASHANVIL.SheetZoneSkills",
    fields: ["skills.*.trained", "skills.*.bonus"],
  },
  features: {
    id: "features",
    labelKey: "ASHANVIL.SheetZoneFeatures",
    fields: ["items.feature", "build.ancestry", "build.class", "build.background"],
  },
  biography: {
    id: "biography",
    labelKey: "ASHANVIL.SheetZoneBiography",
    fields: ["details.biography"],
  },
};

/** @type {Readonly<object>} */
export const CHARACTER_SHEET_PARAMS = {
  id: "character",
  window: {
    width: 820,
    height: 900,
    resizable: true,
  },
  tabs: CHARACTER_SHEET_TABS,
  layout: CHARACTER_SHEET_LAYOUT,
  zones: CHARACTER_SHEET_ZONES,
};

/** NPC sheet params (placeholder for later full design). */
export const NPC_SHEET_PARAMS = {
  id: "npc",
  window: { width: 560, height: 640, resizable: true },
};

/**
 * @param {foundry.abstract.Document} actor
 * @returns {typeof CHARACTER_SHEET_PARAMS}
 */
export function getCharacterSheetParams(_actor) {
  return CONFIG.ASH_ANVIL?.sheets?.character ?? CHARACTER_SHEET_PARAMS;
}
