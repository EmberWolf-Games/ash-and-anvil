/**
 * Equipment slot definitions — positions are % on the mannequin panel (top, left).
 * @typedef {{ id: string, labelKey: string, group: string, top: number, left: number, w?: number, h?: number }} EquipmentSlotDef
 */

/** @type {readonly EquipmentSlotDef[]} */
export const EQUIPMENT_SLOTS = [
  { id: "head", labelKey: "ASHANVIL.EquipHead", group: "body", top: 4, left: 44, w: 12, h: 10 },
  { id: "leftEar", labelKey: "ASHANVIL.EquipLeftEar", group: "body", top: 8, left: 32, w: 8, h: 6 },
  { id: "rightEar", labelKey: "ASHANVIL.EquipRightEar", group: "body", top: 8, left: 60, w: 8, h: 6 },
  { id: "neck", labelKey: "ASHANVIL.EquipNeck", group: "body", top: 14, left: 44, w: 12, h: 6 },
  { id: "shoulders", labelKey: "ASHANVIL.EquipShoulders", group: "body", top: 18, left: 38, w: 24, h: 8 },
  { id: "backCloak", labelKey: "ASHANVIL.EquipBackCloak", group: "back", top: 20, left: 68, w: 12, h: 18 },
  { id: "backSheathe", labelKey: "ASHANVIL.EquipBackSheathe", group: "back", top: 24, left: 18, w: 10, h: 20 },
  { id: "backpack", labelKey: "ASHANVIL.EquipBackpack", group: "back", top: 28, left: 62, w: 14, h: 16 },
  { id: "chest", labelKey: "ASHANVIL.EquipChest", group: "body", top: 26, left: 40, w: 20, h: 12 },
  { id: "leftArm", labelKey: "ASHANVIL.EquipLeftArm", group: "body", top: 28, left: 22, w: 10, h: 16 },
  { id: "rightArm", labelKey: "ASHANVIL.EquipRightArm", group: "body", top: 28, left: 68, w: 10, h: 16 },
  { id: "hands", labelKey: "ASHANVIL.EquipHands", group: "body", top: 38, left: 40, w: 20, h: 8 },
  { id: "body", labelKey: "ASHANVIL.EquipBody", group: "body", top: 40, left: 38, w: 24, h: 10 },
  { id: "naturalArmor", labelKey: "ASHANVIL.EquipNaturalArmor", group: "body", top: 44, left: 42, w: 16, h: 8 },
  { id: "waist1", labelKey: "ASHANVIL.EquipWaist1", group: "waist", top: 50, left: 32, w: 10, h: 8 },
  { id: "waist2", labelKey: "ASHANVIL.EquipWaist2", group: "waist", top: 52, left: 44, w: 12, h: 8 },
  { id: "waist3", labelKey: "ASHANVIL.EquipWaist3", group: "waist", top: 50, left: 58, w: 10, h: 8 },
  { id: "legs", labelKey: "ASHANVIL.EquipLegs", group: "body", top: 58, left: 40, w: 20, h: 14 },
  { id: "feet", labelKey: "ASHANVIL.EquipFeet", group: "body", top: 78, left: 38, w: 24, h: 10 },
  { id: "leftHand", labelKey: "ASHANVIL.EquipLeftHand", group: "held", top: 42, left: 8, w: 12, h: 12 },
  { id: "rightHand", labelKey: "ASHANVIL.EquipRightHand", group: "held", top: 42, left: 80, w: 12, h: 12 },
  { id: "floating", labelKey: "ASHANVIL.EquipFloating", group: "special", top: 10, left: 82, w: 12, h: 12 },
  { id: "ring1", labelKey: "ASHANVIL.EquipRing", group: "rings", top: 72, left: 26, w: 6, h: 6 },
  { id: "ring2", labelKey: "ASHANVIL.EquipRing", group: "rings", top: 74, left: 32, w: 6, h: 6 },
  { id: "ring3", labelKey: "ASHANVIL.EquipRing", group: "rings", top: 76, left: 38, w: 6, h: 6 },
  { id: "ring4", labelKey: "ASHANVIL.EquipRing", group: "rings", top: 77, left: 44, w: 6, h: 6 },
  { id: "ring5", labelKey: "ASHANVIL.EquipRing", group: "rings", top: 77, left: 50, w: 6, h: 6 },
  { id: "ring6", labelKey: "ASHANVIL.EquipRing", group: "rings", top: 76, left: 56, w: 6, h: 6 },
  { id: "ring7", labelKey: "ASHANVIL.EquipRing", group: "rings", top: 74, left: 62, w: 6, h: 6 },
  { id: "ring8", labelKey: "ASHANVIL.EquipRing", group: "rings", top: 72, left: 68, w: 6, h: 6 },
  { id: "ring9", labelKey: "ASHANVIL.EquipRing", group: "rings", top: 70, left: 50, w: 6, h: 6 },
  { id: "ring10", labelKey: "ASHANVIL.EquipRing", group: "rings", top: 68, left: 56, w: 6, h: 6 },
];

/** @type {readonly string[]} */
export const EQUIPMENT_SLOT_IDS = EQUIPMENT_SLOTS.map((s) => s.id);

/** @type {Readonly<Record<string, EquipmentSlotDef>>} */
export const EQUIPMENT_SLOT_MAP = Object.fromEntries(EQUIPMENT_SLOTS.map((s) => [s.id, s]));
