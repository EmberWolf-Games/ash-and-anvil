import { applyAbilityMods } from "./ability.mjs";
import { SKILLS, SKILL_KEYS, ABILITY_KEYS } from "./constants.mjs";
import { getRulesConfig } from "./config.mjs";
import { edgeBonus } from "./proficiency.mjs";
import { aaRules } from "../helpers/logger.mjs";

/**
 * Ensure default skill entries exist on character system data.
 * @param {object} system
 */
export function ensureSkillStructure(system) {
  system.skills ??= {};
  for (const key of SKILL_KEYS) {
    system.skills[key] ??= { trained: false };
  }
}

/**
 * @param {Actor} actor
 */
export function deriveCharacter(actor) {
  if (actor.type !== "character") return;
  const system = actor.system;
  ensureSkillStructure(system);

  applyAbilityMods(system.abilities);

  const level = system.attributes?.level ?? 1;
  const edge = edgeBonus(level);
  system.proficiency ??= {};
  system.proficiency.edge = edge;

  const rules = getRulesConfig();

  for (const key of SKILL_KEYS) {
    const skill = system.skills[key];
    const abilityKey = SKILLS[key].ability;
    const abilityMod = system.abilities?.[abilityKey]?.mod ?? 0;
    skill.bonus = abilityMod + (skill.trained ? edge : 0);
  }

  system.attributes.initiative ??= { mod: 0 };
  system.attributes.initiative.mod = system.abilities?.fin?.mod ?? 0;

  const classItem =
    actor.items.find((i) => i.type === "class") ??
    (system.details?.classId ? game.items.get(system.details.classId) : null);
  const hitDie = classItem?.system?.hitDie ?? 8;
  const resMod = system.abilities?.res?.mod ?? 0;
  const maxHp = rules.grittyHp
    ? Math.max(1, hitDie)
    : Math.max(1, hitDie + resMod);

  system.attributes.health ??= { value: maxHp, max: maxHp, temp: 0 };
  if (system.chargen?.buildComplete) {
    system.attributes.health.max = maxHp;
    if (system.attributes.health.value > maxHp) system.attributes.health.value = maxHp;
  } else if (!system.attributes.health.max) {
    system.attributes.health.max = maxHp;
    system.attributes.health.value = maxHp;
  }

  aaRules(`derive ${actor.name}`, { edge, maxHp, initiative: system.attributes.initiative.mod });
}

/**
 * Apply ancestry ability adjustments from linked item.
 * @param {object} system
 * @param {Item|null} ancestryItem
 */
export function applyAncestryAdjustments(system, ancestryItem) {
  if (!ancestryItem?.system?.abilityAdjustments) return;
  for (const key of ABILITY_KEYS) {
    const delta = ancestryItem.system.abilityAdjustments[key] ?? 0;
    if (!delta) continue;
    system.abilities[key].value = Math.min(20, (system.abilities[key].value ?? 10) + delta);
  }
  applyAbilityMods(system.abilities);
}
