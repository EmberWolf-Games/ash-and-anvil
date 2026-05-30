/**
 * @param {Actor} actor
 * @returns {number}
 */
export function wakeSaveDc(actor) {
  const vitMod = actor.system.abilities?.vit?.mod ?? 0;
  return Math.max(1, 16 - vitMod);
}

/**
 * @param {Actor} actor
 * @returns {boolean}
 */
export function canRollDeathSave(actor) {
  if (actor.system.attributes?.deathSaves?.isDead) return false;
  const hp = actor.system.attributes?.health?.value ?? 0;
  return hp <= 0 && !actor.system.attributes?.deathSaves?.stabilized;
}

/**
 * @param {Actor} actor
 * @returns {boolean}
 */
export function canRollWakeSave(actor) {
  if (actor.system.attributes?.deathSaves?.isDead) return false;
  return !!actor.system.attributes?.deathSaves?.stabilized;
}

/**
 * @param {Actor} actor
 * @param {number} d20
 * @returns {{ updates: Record<string, unknown>, outcome: string, awakened?: boolean, died?: boolean, stabilized?: boolean }}
 */
export function resolveDeathSaveRoll(actor, d20) {
  let successes = actor.system.attributes?.deathSaves?.successes ?? 0;
  let failures = actor.system.attributes?.deathSaves?.failures ?? 0;
  /** @type {Record<string, unknown>} */
  const updates = {};
  let outcome = "";
  let awakened = false;
  let died = false;
  let stabilized = false;

  if (d20 === 20) {
    awakened = true;
    outcome = "ASHANVIL.DeathSaveNat20";
    updates["system.attributes.health.value"] = Math.max(1, actor.system.attributes?.health?.value ?? 0);
    updates["system.attributes.deathSaves.successes"] = 0;
    updates["system.attributes.deathSaves.failures"] = 0;
    updates["system.attributes.deathSaves.stabilized"] = false;
    updates["system.attributes.deathSaves.isDead"] = false;
  } else if (d20 === 1) {
    failures += 2;
    outcome = "ASHANVIL.DeathSaveNat1";
    if (failures >= 3) {
      died = true;
      failures = 3;
      updates["system.attributes.deathSaves.isDead"] = true;
      outcome = "ASHANVIL.DeathSaveDied";
    }
    updates["system.attributes.deathSaves.failures"] = failures;
    updates["system.attributes.deathSaves.successes"] = successes;
  } else if (d20 >= 10) {
    successes += 1;
    outcome = "ASHANVIL.DeathSaveSuccess";
    if (successes >= 3) {
      successes = 3;
      stabilized = true;
      updates["system.attributes.deathSaves.stabilized"] = true;
      outcome = "ASHANVIL.DeathSaveStabilized";
    }
    updates["system.attributes.deathSaves.successes"] = successes;
    updates["system.attributes.deathSaves.failures"] = failures;
  } else {
    failures += 1;
    outcome = "ASHANVIL.DeathSaveFailure";
    if (failures >= 3) {
      died = true;
      failures = 3;
      updates["system.attributes.deathSaves.isDead"] = true;
      outcome = "ASHANVIL.DeathSaveDied";
    }
    updates["system.attributes.deathSaves.failures"] = failures;
    updates["system.attributes.deathSaves.successes"] = successes;
  }

  return { updates, outcome, awakened, died, stabilized };
}

/**
 * @param {boolean} success
 * @returns {Record<string, unknown>}
 */
export function resolveWakeSave(success) {
  if (!success) return {};
  return {
    "system.attributes.health.value": 1,
    "system.attributes.deathSaves.successes": 0,
    "system.attributes.deathSaves.failures": 0,
    "system.attributes.deathSaves.stabilized": false,
    "system.attributes.deathSaves.isDead": false,
  };
}
