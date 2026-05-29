/** @type {readonly string[]} */
export const ABILITY_KEYS = ["mgt", "fin", "res", "ins", "foc", "pre"];

/** @type {Readonly<Record<string, { ability: string, label: string }>>} */
export const SKILLS = {
  athletics: { ability: "mgt", label: "ASHANVIL.SkillAthletics" },
  agility: { ability: "fin", label: "ASHANVIL.SkillAgility" },
  stealth: { ability: "fin", label: "ASHANVIL.SkillStealth" },
  endurance: { ability: "res", label: "ASHANVIL.SkillEndurance" },
  lore: { ability: "ins", label: "ASHANVIL.SkillLore" },
  craft: { ability: "ins", label: "ASHANVIL.SkillCraft" },
  awareness: { ability: "foc", label: "ASHANVIL.SkillAwareness" },
  survival: { ability: "foc", label: "ASHANVIL.SkillSurvival" },
  resolve: { ability: "foc", label: "ASHANVIL.SkillResolve" },
  influence: { ability: "pre", label: "ASHANVIL.SkillInfluence" },
  deception: { ability: "pre", label: "ASHANVIL.SkillDeception" },
  performance: { ability: "pre", label: "ASHANVIL.SkillPerformance" },
};

/** @type {readonly string[]} */
export const SKILL_KEYS = Object.keys(SKILLS);

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
