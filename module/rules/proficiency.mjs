/**
 * Edge bonus by character level (1st Edition table).
 * @param {number} level
 * @returns {number}
 */
export function edgeBonus(level) {
  const lv = Math.max(1, Number(level) || 1);
  if (lv >= 17) return 6;
  if (lv >= 13) return 5;
  if (lv >= 9) return 4;
  if (lv >= 5) return 3;
  return 2;
}
