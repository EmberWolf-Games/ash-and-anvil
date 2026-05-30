import { ABILITIES, SAVES, SKILL_DEFINITIONS } from "../rules/constants.mjs";

/** @type {Readonly<Record<string, string>>} */
const EXACT_LABELS = {
  name: "ASHANVIL.AuditName",
  "system.attributes.health.value": "ASHANVIL.AuditHealthValue",
  "system.attributes.health.max": "ASHANVIL.AuditHealthMax",
  "system.attributes.health.temp": "ASHANVIL.AuditHealthTemp",
  "system.attributes.primaryClassLevel": "ASHANVIL.AuditPrimaryClassLevel",
  "system.attributes.secondaryClassLevel": "ASHANVIL.AuditSecondaryClassLevel",
  "system.currency.value": "ASHANVIL.AuditCurrency",
  "system.details.lineage": "ASHANVIL.Lineage",
  "system.details.gender": "ASHANVIL.BioGender",
  "system.details.alignment": "ASHANVIL.BioAlignment",
  "system.details.weight": "ASHANVIL.BioWeight",
  "system.inventory.notes": "ASHANVIL.InventoryNotes",
  "system.resources.mana.value": "ASHANVIL.ResourceMana",
  "system.resources.mana.bonus": "ASHANVIL.ResourceManaBonus",
  "system.resources.focus.value": "ASHANVIL.ResourceFocus",
  "system.resources.focus.bonus": "ASHANVIL.ResourceFocusBonus",
  "system.resources.favor.value": "ASHANVIL.ResourceFavor",
  "system.resources.favor.bonus": "ASHANVIL.ResourceFavorBonus",
  "system.speed.baseWalk": "ASHANVIL.SpeedBaseWalk",
  "system.defense.armorCategory": "ASHANVIL.ArmorCategory",
  "system.attributes.experience.value": "ASHANVIL.Experience",
  "system.details.subrace": "ASHANVIL.Subrace",
  "system.details.primarySubclass": "ASHANVIL.PrimarySubclass",
  "system.details.secondarySubclass": "ASHANVIL.SecondarySubclass",
  "system.attributes.deathSaves.successes": "ASHANVIL.Successes",
  "system.attributes.deathSaves.failures": "ASHANVIL.Failures",
  "system.attributes.deathSaves.stabilized": "ASHANVIL.DeathSaveStabilizedLabel",
  "system.attributes.deathSaves.isDead": "ASHANVIL.DeathSaveDead",
};

/**
 * @param {string} path
 * @returns {string}
 */
export function humanizeAuditPath(path) {
  if (EXACT_LABELS[path]) return game.i18n.localize(EXACT_LABELS[path]);

  let m = path.match(/^system\.abilities\.(\w+)\.value$/);
  if (m) {
    const ab = ABILITIES[m[1]];
    return ab
      ? game.i18n.format("ASHANVIL.AuditAbilityScore", { ability: game.i18n.localize(ab.label) })
      : path;
  }

  m = path.match(/^system\.saves\.(\w+)\.(trained|misc)$/);
  if (m) {
    const save = SAVES[m[1]];
    const field =
      m[2] === "trained" ? game.i18n.localize("ASHANVIL.Trained") : game.i18n.localize("ASHANVIL.Misc");
    return save
      ? game.i18n.format("ASHANVIL.AuditSaveField", {
          save: game.i18n.localize(save.label),
          field,
        })
      : path;
  }

  m = path.match(/^system\.skills\.entries\.(\w+)\.(ranks|misc)$/);
  if (m) {
    const skill = SKILL_DEFINITIONS[m[1]];
    const field =
      m[2] === "ranks" ? game.i18n.localize("ASHANVIL.Ranks") : game.i18n.localize("ASHANVIL.Misc");
    return skill
      ? game.i18n.format("ASHANVIL.AuditSkillField", {
          skill: game.i18n.localize(skill.label),
          field,
        })
      : path;
  }

  m = path.match(/^system\.proficiencies\.(\w+)$/);
  if (m) return game.i18n.format("ASHANVIL.AuditProficiency", { key: m[1] });

  m = path.match(/^system\.defenses\.(\w+)$/);
  if (m) return game.i18n.format("ASHANVIL.AuditDefenseList", { key: m[1] });

  m = path.match(/^system\.defense\.ac\.(\w+)$/);
  if (m) return game.i18n.format("ASHANVIL.AuditACPart", { part: m[1] });

  return path.replace(/^system\./, "").replace(/\./g, " › ");
}

/**
 * @param {unknown} value
 * @param {string} path
 * @returns {string}
 */
export function humanizeAuditValue(value, path) {
  if (value == null || value === "") return game.i18n.localize("ASHANVIL.AuditEmpty");
  if (typeof value === "boolean") {
    return value ? game.i18n.localize("ASHANVIL.AuditYes") : game.i18n.localize("ASHANVIL.AuditNo");
  }
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : game.i18n.localize("ASHANVIL.AuditEmpty");
  }
  if (typeof value === "object") return JSON.stringify(value);
  if (path.endsWith(".trained")) {
    return value
      ? game.i18n.localize("ASHANVIL.AuditYes")
      : game.i18n.localize("ASHANVIL.AuditNo");
  }
  return String(value);
}

/**
 * @param {{ path: string, from: unknown, to: unknown }} change
 * @returns {string}
 */
export function formatAuditChange(change) {
  const label = humanizeAuditPath(change.path);
  const from = humanizeAuditValue(change.from, change.path);
  const to = humanizeAuditValue(change.to, change.path);
  return game.i18n.format("ASHANVIL.AuditChangeLine", { label, from, to });
}
