/**
 * Parse a resource adjust field: absolute value or delta (+/-).
 * @param {string|number} raw
 * @param {number} current
 * @returns {number}
 */
export function parseDeltaInput(raw, current) {
  const base = Math.max(0, Math.floor(Number(current) || 0));
  const text = String(raw ?? "").trim();
  if (!text) return base;

  if (/^[+-]/.test(text)) {
    const delta = Number(text);
    if (Number.isNaN(delta)) return base;
    return Math.max(0, Math.floor(base + delta));
  }

  const absolute = Number(text);
  if (Number.isNaN(absolute)) return base;
  return Math.max(0, Math.floor(absolute));
}

/**
 * @param {string} path dot path on actor.system
 * @param {Actor} actor
 * @param {string|number} raw
 * @returns {Promise<number>}
 */
export async function applyResourceDelta(actor, path, raw) {
  const current = foundry.utils.getProperty(actor.system, path) ?? 0;
  const next = parseDeltaInput(raw, current);
  await actor.update({ [`system.${path}`]: next });
  return next;
}
