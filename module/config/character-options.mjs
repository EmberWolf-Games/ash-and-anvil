/** @type {readonly { value: string, labelKey: string }[]} */
export const GENDER_OPTIONS = [
  { value: "", labelKey: "ASHANVIL.GenderUnset" },
  { value: "male", labelKey: "ASHANVIL.GenderMale" },
  { value: "female", labelKey: "ASHANVIL.GenderFemale" },
];

/** @type {readonly { value: string, labelKey: string }[]} */
export const ALIGNMENT_OPTIONS = [
  { value: "", labelKey: "ASHANVIL.AlignmentUnset" },
  { value: "lawfulGood", labelKey: "ASHANVIL.AlignmentLawfulGood" },
  { value: "neutralGood", labelKey: "ASHANVIL.AlignmentNeutralGood" },
  { value: "chaoticGood", labelKey: "ASHANVIL.AlignmentChaoticGood" },
  { value: "lawfulNeutral", labelKey: "ASHANVIL.AlignmentLawfulNeutral" },
  { value: "trueNeutral", labelKey: "ASHANVIL.AlignmentTrueNeutral" },
  { value: "chaoticNeutral", labelKey: "ASHANVIL.AlignmentChaoticNeutral" },
  { value: "lawfulEvil", labelKey: "ASHANVIL.AlignmentLawfulEvil" },
  { value: "neutralEvil", labelKey: "ASHANVIL.AlignmentNeutralEvil" },
  { value: "chaoticEvil", labelKey: "ASHANVIL.AlignmentChaoticEvil" },
];

/** @type {readonly { value: string, labelKey: string }[]} */
export const LIFESTYLE_OPTIONS = [
  { value: "", labelKey: "ASHANVIL.LifestyleUnset" },
  { value: "wretched", labelKey: "ASHANVIL.LifestyleWretched" },
  { value: "squalid", labelKey: "ASHANVIL.LifestyleSqualid" },
  { value: "poor", labelKey: "ASHANVIL.LifestylePoor" },
  { value: "modest", labelKey: "ASHANVIL.LifestyleModest" },
  { value: "comfortable", labelKey: "ASHANVIL.LifestyleComfortable" },
  { value: "wealthy", labelKey: "ASHANVIL.LifestyleWealthy" },
  { value: "aristocrat", labelKey: "ASHANVIL.LifestyleAristocrat" },
];

/**
 * @param {readonly { value: string, labelKey: string }[]} options
 * @returns {{ value: string, label: string }[]}
 */
export function localizeOptions(options) {
  return options.map((o) => ({
    value: o.value,
    label: game.i18n.localize(o.labelKey),
  }));
}
