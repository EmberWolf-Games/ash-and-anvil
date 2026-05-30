/** Maximum total character level. */
export const MAX_TOTAL_LEVEL = 60;

/** Maximum classes on one character. */
export const MAX_CLASSES = 2;

/** Levels at which blended ancestry features may be chosen. */
export const ANCESTRY_FEATURE_LEVELS = [1, 5, 10, 15];

/** @type {readonly string[]} */
export const ABILITY_KEYS = ["mgt", "agi", "vit", "mnd", "ins", "cha"];

/** @type {Readonly<Record<string, { label: string, abbr: string }>>} */
export const ABILITIES = {
  mgt: { label: "ASHANVIL.AbilityMgt", abbr: "MGT" },
  agi: { label: "ASHANVIL.AbilityAgi", abbr: "AGI" },
  vit: { label: "ASHANVIL.AbilityVit", abbr: "VIT" },
  mnd: { label: "ASHANVIL.AbilityMnd", abbr: "MND" },
  ins: { label: "ASHANVIL.AbilityIns", abbr: "INS" },
  cha: { label: "ASHANVIL.AbilityCha", abbr: "CHA" },
};

export const ABILITY_MIN = 0;
export const ABILITY_MAX = 50;
export const ABILITY_MOD_MIN = -5;
export const ABILITY_MOD_MAX = 20;

/** @type {readonly string[]} */
export const SAVE_KEYS = ["for", "ref", "res", "com"];

/** @type {Readonly<Record<string, { ability: string, label: string, abbr: string }>>} */
export const SAVES = {
  for: { ability: "vit", label: "ASHANVIL.SaveFortitude", abbr: "FOR" },
  ref: { ability: "agi", label: "ASHANVIL.SaveReflex", abbr: "REF" },
  res: { ability: "mnd", label: "ASHANVIL.SaveResolve", abbr: "RES" },
  com: { ability: "cha", label: "ASHANVIL.SaveComposure", abbr: "COM" },
};

/** 3.5e-inspired base skill list — DM may add custom skills on the actor. */
export const SKILL_DEFINITIONS = {
  appraise: { ability: "mnd", label: "ASHANVIL.SkillAppraise" },
  balance: { ability: "agi", label: "ASHANVIL.SkillBalance" },
  bluff: { ability: "cha", label: "ASHANVIL.SkillBluff" },
  climb: { ability: "mgt", label: "ASHANVIL.SkillClimb" },
  concentration: { ability: "vit", label: "ASHANVIL.SkillConcentration" },
  craft: { ability: "mnd", label: "ASHANVIL.SkillCraft" },
  decipherScript: { ability: "mnd", label: "ASHANVIL.SkillDecipherScript" },
  diplomacy: { ability: "cha", label: "ASHANVIL.SkillDiplomacy" },
  disableDevice: { ability: "mnd", label: "ASHANVIL.SkillDisableDevice" },
  disguise: { ability: "cha", label: "ASHANVIL.SkillDisguise" },
  escapeArtist: { ability: "agi", label: "ASHANVIL.SkillEscapeArtist" },
  forgery: { ability: "mnd", label: "ASHANVIL.SkillForgery" },
  gatherInformation: { ability: "cha", label: "ASHANVIL.SkillGatherInformation" },
  handleAnimal: { ability: "cha", label: "ASHANVIL.SkillHandleAnimal" },
  heal: { ability: "ins", label: "ASHANVIL.SkillHeal" },
  hide: { ability: "agi", label: "ASHANVIL.SkillHide" },
  intimidate: { ability: "cha", label: "ASHANVIL.SkillIntimidate" },
  jump: { ability: "mgt", label: "ASHANVIL.SkillJump" },
  listen: { ability: "ins", label: "ASHANVIL.SkillListen" },
  moveSilently: { ability: "agi", label: "ASHANVIL.SkillMoveSilently" },
  openLock: { ability: "agi", label: "ASHANVIL.SkillOpenLock" },
  perform: { ability: "cha", label: "ASHANVIL.SkillPerform" },
  profession: { ability: "ins", label: "ASHANVIL.SkillProfession" },
  ride: { ability: "agi", label: "ASHANVIL.SkillRide" },
  search: { ability: "ins", label: "ASHANVIL.SkillSearch" },
  senseMotive: { ability: "ins", label: "ASHANVIL.SkillSenseMotive" },
  sleightOfHand: { ability: "agi", label: "ASHANVIL.SkillSleightOfHand" },
  spellcraft: { ability: "mnd", label: "ASHANVIL.SkillSpellcraft" },
  spot: { ability: "ins", label: "ASHANVIL.SkillSpot" },
  survival: { ability: "ins", label: "ASHANVIL.SkillSurvival" },
  swim: { ability: "mgt", label: "ASHANVIL.SkillSwim" },
  tumble: { ability: "agi", label: "ASHANVIL.SkillTumble" },
  useMagicDevice: { ability: "cha", label: "ASHANVIL.SkillUseMagicDevice" },
  useRope: { ability: "agi", label: "ASHANVIL.SkillUseRope" },
};

/** @type {readonly string[]} */
export const SKILL_KEYS = Object.keys(SKILL_DEFINITIONS);

/** @deprecated use SKILL_DEFINITIONS */
export const SKILLS = SKILL_DEFINITIONS;

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

/** @type {Readonly<Record<number, number>>} */
export const POINT_BUY_COSTS = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export const ARMOR_CATEGORIES = ["none", "light", "medium", "heavy"];

/** Legacy ability key migration map (pre-0.3 chargen). */
export const LEGACY_ABILITY_MAP = {
  fin: "agi",
  res: "vit",
  foc: "ins",
  pre: "cha",
};
