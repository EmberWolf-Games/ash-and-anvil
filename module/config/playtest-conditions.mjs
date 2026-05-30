import { CONDITIONS } from "./traits.mjs";

/** Playtest condition toggles (standard conditions plus extras for testing). */
/** @type {readonly { value: string, labelKey: string }[]} */
export const PLAYTEST_CONDITIONS = [
  ...CONDITIONS,
  { value: "bleeding", labelKey: "ASHANVIL.TraitBleeding" },
];
