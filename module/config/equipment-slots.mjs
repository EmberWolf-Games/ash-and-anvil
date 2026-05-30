const BASE = "/systems/ash-and-anvil/assets/ui";
const SLOT_SIZE = 9.5;

/**
 * @typedef {"panel-left" | "panel-rings"} EquipmentPanelPlacement
 * @typedef {{ id: string, labelKey: string, abbrKey?: string, group: string, placement: EquipmentPanelPlacement, ringIndex?: number }} EquipmentPanelSlotDef
 * @typedef {{ storageKey: string, abbrKey: string, group: string, top: number, left: number, size?: number }} MannequinDisplaySlotDef
 */

/** @type {Readonly<Record<string, string>>} */
export const MANNEQUIN_IMAGES = {
  male: `${BASE}/mannequin_male.png`,
  female: `${BASE}/mannequin_female.png`,
};

/** Persisted equipment slot ids (actor.system.equipment). */
/** @type {readonly string[]} */
export const EQUIPMENT_SLOT_IDS = [
  "head",
  "leftEar",
  "rightEar",
  "neck",
  "shoulders",
  "chest",
  "leftArm",
  "rightArm",
  "body",
  "hands",
  "naturalArmor",
  "waist1",
  "waist2",
  "waist3",
  "legs",
  "feet",
  "leftHand",
  "rightHand",
  "backCloak",
  "backSheathe",
  "backpack",
  "floating",
  "ring1",
  "ring2",
  "ring3",
  "ring4",
  "ring5",
  "ring6",
  "ring7",
  "ring8",
  "ring9",
  "ring10",
];

/** Labels for storage keys and panel slots. */
/** @type {Readonly<Record<string, { labelKey: string, abbrKey?: string, group: string }>>} */
export const EQUIPMENT_SLOT_META = {
  head: { labelKey: "ASHANVIL.EquipHead", abbrKey: "ASHANVIL.EquipAbbrHead", group: "body" },
  leftEar: { labelKey: "ASHANVIL.EquipLeftEar", abbrKey: "ASHANVIL.EquipAbbrEar", group: "body" },
  rightEar: { labelKey: "ASHANVIL.EquipRightEar", abbrKey: "ASHANVIL.EquipAbbrEar", group: "body" },
  neck: { labelKey: "ASHANVIL.EquipNeck", abbrKey: "ASHANVIL.EquipAbbrNeck", group: "body" },
  shoulders: { labelKey: "ASHANVIL.EquipShoulders", abbrKey: "ASHANVIL.EquipAbbrShoulders", group: "body" },
  chest: { labelKey: "ASHANVIL.EquipChest", abbrKey: "ASHANVIL.EquipAbbrChest", group: "body" },
  leftArm: { labelKey: "ASHANVIL.EquipLeftArm", abbrKey: "ASHANVIL.EquipAbbrArm", group: "body" },
  rightArm: { labelKey: "ASHANVIL.EquipRightArm", abbrKey: "ASHANVIL.EquipAbbrArm", group: "body" },
  body: { labelKey: "ASHANVIL.EquipBody", abbrKey: "ASHANVIL.EquipAbbrBody", group: "body" },
  hands: { labelKey: "ASHANVIL.EquipHands", abbrKey: "ASHANVIL.EquipAbbrHands", group: "body" },
  naturalArmor: { labelKey: "ASHANVIL.EquipNaturalArmor", abbrKey: "ASHANVIL.EquipAbbrNatural", group: "body" },
  waist1: { labelKey: "ASHANVIL.EquipWaist1", abbrKey: "ASHANVIL.EquipAbbrWaist", group: "waist" },
  waist2: { labelKey: "ASHANVIL.EquipWaist2", abbrKey: "ASHANVIL.EquipAbbrWaist", group: "waist" },
  waist3: { labelKey: "ASHANVIL.EquipWaist3", abbrKey: "ASHANVIL.EquipAbbrWaist", group: "waist" },
  legs: { labelKey: "ASHANVIL.EquipLegs", abbrKey: "ASHANVIL.EquipAbbrLegs", group: "body" },
  feet: { labelKey: "ASHANVIL.EquipFeet", abbrKey: "ASHANVIL.EquipAbbrFeet", group: "body" },
  leftHand: { labelKey: "ASHANVIL.EquipLeftHand", group: "held" },
  rightHand: { labelKey: "ASHANVIL.EquipRightHand", group: "held" },
  backCloak: { labelKey: "ASHANVIL.EquipBackCloak", group: "back" },
  backSheathe: { labelKey: "ASHANVIL.EquipBackSheathe", group: "back" },
  backpack: { labelKey: "ASHANVIL.EquipBackpack", group: "back" },
  floating: { labelKey: "ASHANVIL.EquipFloating", group: "special" },
  ring1: { labelKey: "ASHANVIL.EquipRing", group: "rings" },
  ring2: { labelKey: "ASHANVIL.EquipRing", group: "rings" },
  ring3: { labelKey: "ASHANVIL.EquipRing", group: "rings" },
  ring4: { labelKey: "ASHANVIL.EquipRing", group: "rings" },
  ring5: { labelKey: "ASHANVIL.EquipRing", group: "rings" },
  ring6: { labelKey: "ASHANVIL.EquipRing", group: "rings" },
  ring7: { labelKey: "ASHANVIL.EquipRing", group: "rings" },
  ring8: { labelKey: "ASHANVIL.EquipRing", group: "rings" },
  ring9: { labelKey: "ASHANVIL.EquipRing", group: "rings" },
  ring10: { labelKey: "ASHANVIL.EquipRing", group: "rings" },
};

/**
 * Visual mannequin layout. Multiple entries may share a storageKey (linked pair).
 * @type {readonly MannequinDisplaySlotDef[]}
 */
export const MANNEQUIN_DISPLAY = [
  { storageKey: "head", abbrKey: "ASHANVIL.EquipAbbrHead", group: "body", top: 4, left: 50, size: SLOT_SIZE },
  { storageKey: "leftEar", abbrKey: "ASHANVIL.EquipAbbrEar", group: "body", top: 8, left: 28, size: SLOT_SIZE },
  { storageKey: "rightEar", abbrKey: "ASHANVIL.EquipAbbrEar", group: "body", top: 8, left: 72, size: SLOT_SIZE },
  { storageKey: "neck", abbrKey: "ASHANVIL.EquipAbbrNeck", group: "body", top: 13, left: 50, size: SLOT_SIZE },
  { storageKey: "chest", abbrKey: "ASHANVIL.EquipAbbrChest", group: "body", top: 21, left: 50, size: SLOT_SIZE },
  { storageKey: "shoulders", abbrKey: "ASHANVIL.EquipAbbrShoulders", group: "body", top: 19, left: 24, size: SLOT_SIZE },
  { storageKey: "shoulders", abbrKey: "ASHANVIL.EquipAbbrShoulders", group: "body", top: 19, left: 76, size: SLOT_SIZE },
  { storageKey: "body", abbrKey: "ASHANVIL.EquipAbbrBody", group: "body", top: 28, left: 50, size: SLOT_SIZE },
  { storageKey: "leftArm", abbrKey: "ASHANVIL.EquipAbbrArm", group: "body", top: 32, left: 10, size: SLOT_SIZE },
  { storageKey: "rightArm", abbrKey: "ASHANVIL.EquipAbbrArm", group: "body", top: 32, left: 90, size: SLOT_SIZE },
  { storageKey: "hands", abbrKey: "ASHANVIL.EquipAbbrHands", group: "body", top: 40, left: 16, size: SLOT_SIZE },
  { storageKey: "hands", abbrKey: "ASHANVIL.EquipAbbrHands", group: "body", top: 40, left: 84, size: SLOT_SIZE },
  { storageKey: "waist1", abbrKey: "ASHANVIL.EquipAbbrWaist", group: "waist", top: 36, left: 34, size: SLOT_SIZE },
  { storageKey: "waist2", abbrKey: "ASHANVIL.EquipAbbrWaist", group: "waist", top: 36, left: 50, size: SLOT_SIZE },
  { storageKey: "waist3", abbrKey: "ASHANVIL.EquipAbbrWaist", group: "waist", top: 36, left: 66, size: SLOT_SIZE },
  { storageKey: "legs", abbrKey: "ASHANVIL.EquipAbbrLegs", group: "body", top: 58, left: 38, size: SLOT_SIZE },
  { storageKey: "legs", abbrKey: "ASHANVIL.EquipAbbrLegs", group: "body", top: 58, left: 62, size: SLOT_SIZE },
  { storageKey: "feet", abbrKey: "ASHANVIL.EquipAbbrFeet", group: "body", top: 77, left: 38, size: SLOT_SIZE },
  { storageKey: "feet", abbrKey: "ASHANVIL.EquipAbbrFeet", group: "body", top: 77, left: 62, size: SLOT_SIZE },
];

/** @type {readonly EquipmentPanelSlotDef[]} */
export const PANEL_SLOTS = [
  { id: "leftHand", labelKey: "ASHANVIL.EquipLeftHand", group: "held", placement: "panel-left" },
  { id: "rightHand", labelKey: "ASHANVIL.EquipRightHand", group: "held", placement: "panel-left" },
  { id: "naturalArmor", labelKey: "ASHANVIL.EquipNaturalArmor", group: "held", placement: "panel-left" },
  { id: "backCloak", labelKey: "ASHANVIL.EquipBackCloak", group: "back", placement: "panel-left" },
  { id: "backSheathe", labelKey: "ASHANVIL.EquipBackSheathe", group: "back", placement: "panel-left" },
  { id: "backpack", labelKey: "ASHANVIL.EquipBackpack", group: "back", placement: "panel-left" },
  { id: "floating", labelKey: "ASHANVIL.EquipFloating", group: "special", placement: "panel-left" },
  { id: "ring1", labelKey: "ASHANVIL.EquipRing", group: "rings", placement: "panel-rings", ringIndex: 1 },
  { id: "ring2", labelKey: "ASHANVIL.EquipRing", group: "rings", placement: "panel-rings", ringIndex: 2 },
  { id: "ring3", labelKey: "ASHANVIL.EquipRing", group: "rings", placement: "panel-rings", ringIndex: 3 },
  { id: "ring4", labelKey: "ASHANVIL.EquipRing", group: "rings", placement: "panel-rings", ringIndex: 4 },
  { id: "ring5", labelKey: "ASHANVIL.EquipRing", group: "rings", placement: "panel-rings", ringIndex: 5 },
  { id: "ring6", labelKey: "ASHANVIL.EquipRing", group: "rings", placement: "panel-rings", ringIndex: 6 },
  { id: "ring7", labelKey: "ASHANVIL.EquipRing", group: "rings", placement: "panel-rings", ringIndex: 7 },
  { id: "ring8", labelKey: "ASHANVIL.EquipRing", group: "rings", placement: "panel-rings", ringIndex: 8 },
  { id: "ring9", labelKey: "ASHANVIL.EquipRing", group: "rings", placement: "panel-rings", ringIndex: 9 },
  { id: "ring10", labelKey: "ASHANVIL.EquipRing", group: "rings", placement: "panel-rings", ringIndex: 10 },
];

/** @type {Readonly<Record<string, { labelKey: string, abbrKey?: string, group: string }>>} */
export const EQUIPMENT_SLOT_MAP = EQUIPMENT_SLOT_META;

/** Storage keys that render as a linked left/right pair on the mannequin. */
/** @type {ReadonlySet<string>} */
export const LINKED_MANNEQUIN_SLOTS = new Set(["shoulders", "hands", "legs", "feet"]);

/**
 * @param {string} [gender]
 * @returns {string}
 */
export function mannequinImageForGender(gender) {
  const g = String(gender ?? "")
    .trim()
    .toLowerCase();
  if (g === "female") return MANNEQUIN_IMAGES.female;
  return MANNEQUIN_IMAGES.male;
}

/** @deprecated use EQUIPMENT_SLOT_IDS */
export const EQUIPMENT_SLOTS = PANEL_SLOTS;
