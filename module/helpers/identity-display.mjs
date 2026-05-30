import { GENDER_OPTIONS, localizeOptions } from "../config/character-options.mjs";

/**
 * @param {string} className
 * @param {number} level
 * @param {string} [subclass]
 * @returns {string}
 */
export function formatClassEntry(className, level, subclass = "") {
  const name = String(className ?? "").trim();
  if (!name) return "—";
  const sub = String(subclass ?? "").trim();
  const prefix = sub ? `${sub} ` : "";
  const lvl = Math.max(0, Number(level) || 0);
  return `${prefix}${name} ${lvl}`;
}

/**
 * @param {Actor} actor
 * @returns {string}
 */
export function formatClassSummary(actor) {
  const system = actor.system;
  const classes = actor.items.filter((i) => i.type === "class");
  const primary = classes[0] ?? null;
  const secondary = classes[1] ?? null;
  const primaryLevel = Math.max(0, Number(system.attributes?.primaryClassLevel) || 0);
  const secondaryLevel = Math.max(0, Number(system.attributes?.secondaryClassLevel) || 0);
  const parts = [];

  if (primary) {
    parts.push(
      formatClassEntry(primary.name, primaryLevel || 1, system.details?.primarySubclass ?? "")
    );
  }
  if (secondary && secondaryLevel > 0) {
    parts.push(
      formatClassEntry(secondary.name, secondaryLevel, system.details?.secondarySubclass ?? "")
    );
  }

  return parts.join(" / ") || "—";
}

/**
 * @param {Actor} actor
 * @returns {string}
 */
export function formatAncestrySummary(actor) {
  const system = actor.system;
  const genderKey = system.details?.gender ?? "";
  const genderLabel =
    localizeOptions(GENDER_OPTIONS).find((g) => g.value === genderKey)?.label ??
    (genderKey ? genderKey : "");
  const subrace = String(system.details?.subrace ?? "").trim();
  const ancestry = actor.items.find((i) => i.type === "ancestry")?.name ?? "";
  const ageRaw = system.details?.age;
  const age =
    ageRaw != null && String(ageRaw).trim() !== "" ? String(ageRaw).trim() : "0";

  const identityParts = [];
  if (genderLabel) identityParts.push(genderLabel);
  if (subrace) identityParts.push(subrace);
  if (ancestry) identityParts.push(ancestry);

  const identity = identityParts.join(" ") || "—";
  return `${identity}, ${age}`;
}
