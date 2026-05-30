const BASE = "/systems/ash-and-anvil/assets/ui";
const SLOT_SIZE = 11;

/**
 * Equipment slot definitions.
 * @typedef {"mannequin" | "panel-left" | "panel-rings"} EquipmentSlotPlacement
 * @typedef {{ id: string, labelKey: string, abbrKey?: string, group: string, placement: EquipmentSlotPlacement, top?: number, left?: number, size?: number, ringIndex?: number }} EquipmentSlotDef
 */

export const MANNEQUIN_IMAGES = {

  male: `${BASE}/mannequin_male.png`,

  female: `${BASE}/mannequin_female.png`,

};



/**

 * Square slot anchors — top/left are center points on the figure overlay (percent).

 * Coordinates are relative to `.mannequin-slots`, not the outer frame.

 * @type {readonly EquipmentSlotDef[]}

 */

export const EQUIPMENT_SLOTS = [

  { id: "head", labelKey: "ASHANVIL.EquipHead", abbrKey: "ASHANVIL.EquipAbbrHead", group: "body", placement: "mannequin", top: 5, left: 50, size: SLOT_SIZE },

  { id: "leftEar", labelKey: "ASHANVIL.EquipLeftEar", abbrKey: "ASHANVIL.EquipAbbrEar", group: "body", placement: "mannequin", top: 9, left: 30, size: SLOT_SIZE },

  { id: "rightEar", labelKey: "ASHANVIL.EquipRightEar", abbrKey: "ASHANVIL.EquipAbbrEar", group: "body", placement: "mannequin", top: 9, left: 70, size: SLOT_SIZE },

  { id: "neck", labelKey: "ASHANVIL.EquipNeck", abbrKey: "ASHANVIL.EquipAbbrNeck", group: "body", placement: "mannequin", top: 14, left: 50, size: SLOT_SIZE },

  { id: "shoulders", labelKey: "ASHANVIL.EquipShoulders", abbrKey: "ASHANVIL.EquipAbbrShoulders", group: "body", placement: "mannequin", top: 19, left: 50, size: SLOT_SIZE },

  { id: "chest", labelKey: "ASHANVIL.EquipChest", abbrKey: "ASHANVIL.EquipAbbrChest", group: "body", placement: "mannequin", top: 25, left: 50, size: SLOT_SIZE },

  { id: "leftArm", labelKey: "ASHANVIL.EquipLeftArm", abbrKey: "ASHANVIL.EquipAbbrArm", group: "body", placement: "mannequin", top: 30, left: 10, size: SLOT_SIZE },

  { id: "rightArm", labelKey: "ASHANVIL.EquipRightArm", abbrKey: "ASHANVIL.EquipAbbrArm", group: "body", placement: "mannequin", top: 30, left: 90, size: SLOT_SIZE },

  { id: "naturalArmor", labelKey: "ASHANVIL.EquipNaturalArmor", abbrKey: "ASHANVIL.EquipAbbrNatural", group: "body", placement: "mannequin", top: 25, left: 72, size: SLOT_SIZE },

  { id: "body", labelKey: "ASHANVIL.EquipBody", abbrKey: "ASHANVIL.EquipAbbrBody", group: "body", placement: "mannequin", top: 35, left: 50, size: SLOT_SIZE },

  { id: "hands", labelKey: "ASHANVIL.EquipHands", abbrKey: "ASHANVIL.EquipAbbrHands", group: "body", placement: "mannequin", top: 44, left: 50, size: SLOT_SIZE },

  { id: "waist1", labelKey: "ASHANVIL.EquipWaist1", abbrKey: "ASHANVIL.EquipAbbrWaist", group: "waist", placement: "mannequin", top: 50, left: 38, size: SLOT_SIZE },

  { id: "waist2", labelKey: "ASHANVIL.EquipWaist2", abbrKey: "ASHANVIL.EquipAbbrWaist", group: "waist", placement: "mannequin", top: 50, left: 50, size: SLOT_SIZE },

  { id: "waist3", labelKey: "ASHANVIL.EquipWaist3", abbrKey: "ASHANVIL.EquipAbbrWaist", group: "waist", placement: "mannequin", top: 50, left: 62, size: SLOT_SIZE },

  { id: "legs", labelKey: "ASHANVIL.EquipLegs", abbrKey: "ASHANVIL.EquipAbbrLegs", group: "body", placement: "mannequin", top: 64, left: 50, size: SLOT_SIZE },

  { id: "feet", labelKey: "ASHANVIL.EquipFeet", abbrKey: "ASHANVIL.EquipAbbrFeet", group: "body", placement: "mannequin", top: 93, left: 50, size: SLOT_SIZE },

  { id: "leftHand", labelKey: "ASHANVIL.EquipLeftHand", group: "held", placement: "panel-left" },

  { id: "rightHand", labelKey: "ASHANVIL.EquipRightHand", group: "held", placement: "panel-left" },

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

/** @type {readonly string[]} */
export const EQUIPMENT_SLOT_IDS = EQUIPMENT_SLOTS.map((s) => s.id);

/** @type {Readonly<Record<string, EquipmentSlotDef>>} */
export const EQUIPMENT_SLOT_MAP = Object.fromEntries(EQUIPMENT_SLOTS.map((s) => [s.id, s]));

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
