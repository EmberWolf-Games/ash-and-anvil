/** @type {Readonly<Record<string, number>>} */
export const CASTER_PROGRESSION_RATE = {
  none: 0,
  third: 0.33,
  half: 0.5,
  threeQuarter: 0.75,
  full: 1,
};

/** @type {readonly string[]} */
export const CASTER_PROGRESSION_TYPES = ["none", "third", "half", "threeQuarter", "full"];

/** @type {readonly string[]} */
export const POWER_POOL_TYPES = ["none", "mana", "focus", "divine"];

/** @type {readonly string[]} */
export const SPELLCASTING_ABILITIES = ["mnd", "ins", "cha", "vit"];

/**
 * Max spell level (or psionic rank) from effective caster level — 1–5 → 1 … 56–60 → 12.
 * @param {number} effectiveLevel
 * @returns {number}
 */
export function maxSpellLevelForEffectiveLevel(effectiveLevel) {
  const level = Math.max(0, Math.floor(Number(effectiveLevel) || 0));
  if (level <= 0) return 0;
  return Math.min(12, Math.ceil(level / 5));
}

/**
 * @param {number} classLevel
 * @param {string} progression
 * @returns {number}
 */
export function effectiveCasterLevel(classLevel, progression) {
  const rate = CASTER_PROGRESSION_RATE[progression] ?? 0;
  return Math.floor(Math.max(0, Number(classLevel) || 0) * rate);
}

/**
 * @param {number} effectiveDivineLevel
 * @returns {number}
 */
export function divineRank(effectiveDivineLevel) {
  const level = Math.max(0, Math.floor(Number(effectiveDivineLevel) || 0));
  if (level <= 0) return 0;
  return Math.ceil(level / 5);
}

/**
 * @param {object} abilities actor.system.abilities
 * @param {string} abilityKey
 * @returns {number}
 */
export function spellcastingAbilityMod(abilities, abilityKey) {
  return abilities?.[abilityKey]?.mod ?? 0;
}

/**
 * @param {Actor} actor
 * @returns {{ item: Item, level: number }[]}
 */
export function getClassLevelAllocations(actor) {
  const system = actor.system;
  const classItems = actor.items.filter((i) => i.type === "class");
  if (!classItems.length) return [];

  const primaryId = system.details?.classId ?? "";
  const secondaryId = system.details?.secondaryClassId ?? "";
  const primary =
    classItems.find((c) => c.id === primaryId || c.uuid === primaryId) ?? classItems[0];
  const secondary =
    classItems.find((c) => c.id === secondaryId || c.uuid === secondaryId) ??
    classItems.find((c) => c.id !== primary?.id);

  /** @type {{ item: Item, level: number }[]} */
  const allocations = [];
  const primaryLevel = Math.max(0, Number(system.attributes?.primaryClassLevel) || 0);
  const secondaryLevel = Math.max(0, Number(system.attributes?.secondaryClassLevel) || 0);

  if (primary && primaryLevel > 0) allocations.push({ item: primary, level: primaryLevel });
  if (secondary && secondary.id !== primary?.id && secondaryLevel > 0) {
    allocations.push({ item: secondary, level: secondaryLevel });
  }

  return allocations;
}

/**
 * @param {{ item: Item, level: number }} allocation
 * @param {object} abilities
 * @returns {{ mana: number, focus: number, favor: number }}
 */
function poolContribution(allocation, abilities) {
  const sys = allocation.item.system ?? {};
  const progression = sys.casterProgression ?? "none";
  const pool = sys.powerPool ?? "none";
  const abilityKey = sys.spellcastingAbility ?? "mnd";
  const eff = effectiveCasterLevel(allocation.level, progression);
  const maxRank = maxSpellLevelForEffectiveLevel(eff);
  const mod = spellcastingAbilityMod(abilities, abilityKey);

  const out = { mana: 0, focus: 0, favor: 0 };

  if (eff <= 0 || pool === "none") return out;

  if (pool === "mana") {
    out.mana = eff + maxRank + mod;
  } else if (pool === "focus") {
    out.focus = eff + maxRank + Math.max(0, mod);
  } else if (pool === "divine") {
    const rank = divineRank(eff);
    const insightMod = Math.max(0, spellcastingAbilityMod(abilities, "ins"));
    out.favor = rank + insightMod;
  }

  return out;
}

/**
 * @param {Actor} actor
 * @returns {boolean}
 */
export function actorHasPowerPool(actor, pool) {
  return actor.items.some(
    (i) => i.type === "class" && (i.system?.powerPool ?? "none") === pool
  );
}

/**
 * @param {Actor} actor
 * @param {object} system
 */
export function deriveCasterResources(actor, system) {
  system.resources ??= {};
  for (const key of ["mana", "focus", "favor"]) {
    system.resources[key] ??= { value: 0, max: 0, bonus: 0 };
  }

  if (system.attributes?.favor != null && !system.resources.favor.value) {
    system.resources.favor.value = Math.max(0, Number(system.attributes.favor) || 0);
  }

  const abilities = system.abilities ?? {};
  const totals = { mana: 0, focus: 0, favor: 0 };

  for (const allocation of getClassLevelAllocations(actor)) {
    const part = poolContribution(allocation, abilities);
    totals.mana += part.mana;
    totals.focus += part.focus;
    totals.favor += part.favor;
  }

  for (const key of ["mana", "focus", "favor"]) {
    const bonus = Math.max(0, Number(system.resources[key].bonus) || 0);
    const max = Math.max(0, totals[key] + bonus);
    system.resources[key].max = max;
    system.resources[key].value = Math.min(
      Math.max(0, Number(system.resources[key].value) || 0),
      max
    );
  }

  system.attributes.favor = system.resources.favor.value;
}

/**
 * @param {Actor} actor
 * @returns {object[]}
 */
export function buildResourceBarContext(actor) {
  const system = actor.system;
  const resources = system.resources ?? {};
  /** @type {object[]} */
  const bars = [];

  const defs = [
    {
      key: "mana",
      labelKey: "ASHANVIL.ResourceMana",
      abbrKey: "ASHANVIL.ResourceManaAbbr",
      pool: "mana",
      path: "resources.mana.value",
    },
    {
      key: "focus",
      labelKey: "ASHANVIL.ResourceFocus",
      abbrKey: "ASHANVIL.ResourceFocusAbbr",
      pool: "focus",
      path: "resources.focus.value",
    },
    {
      key: "favor",
      labelKey: "ASHANVIL.ResourceFavor",
      abbrKey: "ASHANVIL.ResourceFavorAbbr",
      pool: "divine",
      path: "resources.favor.value",
    },
  ];

  for (const def of defs) {
    if (!actorHasPowerPool(actor, def.pool)) continue;
    const res = resources[def.key] ?? { value: 0, max: 0, bonus: 0 };
    const max = res.max ?? 0;
    const value = res.value ?? 0;
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    bars.push({
      key: def.key,
      label: game.i18n.localize(def.labelKey),
      abbr: game.i18n.localize(def.abbrKey),
      value,
      max,
      bonus: res.bonus ?? 0,
      display: `${value} / ${max}`,
      pct,
      path: def.path,
      bonusPath: `resources.${def.key}.bonus`,
    });
  }

  return bars;
}
