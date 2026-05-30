/**
 * @param {object} system
 */
export function deriveDefense(system) {
  system.defense ??= {};
  system.defense.armorCategory ??= "none";
  system.defense.ac ??= { base: 10, armor: 0, shield: 0, misc: 0, total: 0 };
  system.defense.ac.total =
    (system.defense.ac.base ?? 10) +
    (system.defense.ac.armor ?? 0) +
    (system.defense.ac.shield ?? 0) +
    (system.defense.ac.misc ?? 0);

  const agiMod = system.abilities?.agi?.mod ?? 0;
  const category = system.defense.armorCategory ?? "none";
  let agiContribution = agiMod;
  if (category === "medium") agiContribution = Math.min(2, Math.max(agiMod, 0));
  if (category === "heavy") agiContribution = 0;

  system.defense.touchAc = 10 + agiContribution + (system.defense.ac.misc ?? 0);
}
