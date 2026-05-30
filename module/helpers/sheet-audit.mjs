const FLAG_SCOPE = "ash-and-anvil";
const FLAG_KEY = "changeLog";
const MAX_ENTRIES = 150;

/**
 * @param {object} obj
 * @param {string} prefix
 * @returns {Record<string, unknown>}
 */
function flattenObject(obj, prefix = "") {
  /** @type {Record<string, unknown>} */
  const out = {};
  if (!obj || typeof obj !== "object") return out;
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (val != null && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(out, flattenObject(val, path));
    } else {
      out[path] = val;
    }
  }
  return out;
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function displayValue(value) {
  if (value == null || value === "") return "—";
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * @param {Actor} actor
 * @param {Record<string, unknown>} updateData
 */
export async function recordSheetChanges(actor, updateData) {
  if (!updateData || !Object.keys(updateData).length) return;

  const before = actor.system?.toObject?.() ?? actor.system ?? {};
  /** @type {{ path: string, from: unknown, to: unknown }[]} */
  const diffs = [];

  if ("name" in updateData && updateData.name !== actor.name) {
    diffs.push({ path: "name", from: actor.name, to: updateData.name });
  }

  if (updateData.system && typeof updateData.system === "object") {
    const flatUpdate = flattenObject(updateData.system);
    for (const [path, to] of Object.entries(flatUpdate)) {
      const from = foundry.utils.getProperty(before, path);
      if (JSON.stringify(from) === JSON.stringify(to)) continue;
      diffs.push({ path: `system.${path}`, from, to });
    }
  }

  if (!diffs.length) return;

  const log = foundry.utils.deepClone(actor.getFlag(FLAG_SCOPE, FLAG_KEY) ?? []);
  log.unshift({
    ts: Date.now(),
    userId: game.user.id,
    userName: game.user.name,
    changes: diffs,
  });
  if (log.length > MAX_ENTRIES) log.length = MAX_ENTRIES;
  await actor.setFlag(FLAG_SCOPE, FLAG_KEY, log);
}

/**
 * @param {Actor} actor
 * @returns {object[]}
 */
export function getSheetChangeLog(actor) {
  return actor.getFlag(FLAG_SCOPE, FLAG_KEY) ?? [];
}

/**
 * @param {Actor} actor
 * @returns {{ userName: string, ts: string, summary: string, changes: object[] }[]}
 */
export function formatChangeLogForDisplay(actor) {
  return getSheetChangeLog(actor).map((entry) => ({
    userName: entry.userName,
    ts: new Date(entry.ts).toLocaleString(),
    summary: (entry.changes ?? [])
      .map((c) => `${c.path}: ${displayValue(c.from)} → ${displayValue(c.to)}`)
      .join("; "),
    changes: entry.changes ?? [],
  }));
}
