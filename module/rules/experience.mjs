import { MAX_TOTAL_LEVEL } from "./constants.mjs";

/** Playtest XP required per total level gained after level 1. */
export const XP_PER_LEVEL = 1000;

/**
 * Cumulative XP required to reach a given total character level.
 * @param {number} totalLevel
 * @returns {number}
 */
export function cumulativeXpForTotalLevel(totalLevel) {
  const level = Math.max(1, Math.floor(Number(totalLevel) || 1));
  return (level - 1) * XP_PER_LEVEL;
}

/**
 * @param {Actor} actor
 * @returns {{
 *   value: number,
 *   current: number,
 *   needed: number,
 *   pct: number,
 *   display: string,
 *   canLevelUp: boolean,
 *   atMax: boolean,
 *   totalLevel: number,
 * }}
 */
export function buildExperienceContext(actor) {
  const system = actor.system;
  const totalLevel = system.attributes?.totalLevel ?? 1;
  const xp = Math.max(0, Number(system.attributes?.experience?.value) || 0);

  if (totalLevel >= MAX_TOTAL_LEVEL) {
    const floor = cumulativeXpForTotalLevel(totalLevel);
    return {
      value: xp,
      current: xp - floor,
      needed: 0,
      pct: 100,
      display: `${xp - floor}/—`,
      canLevelUp: false,
      atMax: true,
      totalLevel,
    };
  }

  const floor = cumulativeXpForTotalLevel(totalLevel);
  const ceiling = cumulativeXpForTotalLevel(totalLevel + 1);
  const needed = ceiling - floor;
  const current = Math.max(0, Math.min(needed, xp - floor));
  const pct = needed ? Math.min(100, Math.floor((current / needed) * 100)) : 0;

  return {
    value: xp,
    current,
    needed,
    pct,
    display: `${current}/${needed}`,
    canLevelUp: xp >= ceiling,
    atMax: false,
    totalLevel,
  };
}

/**
 * @param {Actor} actor
 * @returns {boolean}
 */
export function canCharacterLevelUp(actor) {
  return buildExperienceContext(actor).canLevelUp;
}
