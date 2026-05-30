/**
 * Ash & Anvil version scheme: M.m.b.h[+suffix]
 *   M — major (1–2 digits)
 *   m — minor (1–2 digits)
 *   b — build (1–3 digits)
 *   h — hotfix (1–3 digits, optional trailing a–z)
 *
 * Legacy semver (M.m.p) is accepted for migration and comparison only.
 */

/** @type {RegExp} */
export const LEGACY_SEMVER_PATTERN = /^\d+\.\d+\.\d+(-[\w.-]+)?(\+[\w.-]+)?$/;

/** @type {RegExp} */
export const BUILD_VERSION_PATTERN = /^\d{1,2}\.\d{1,2}\.\d{1,3}\.\d{1,3}[a-z]?$/;

/**
 * @typedef {{ scheme: "build"|"legacy", major: number, minor: number, build: number, hotfix: number, hotfixSuffix: string, raw: string }} ParsedVersion
 */

/**
 * @param {string} version
 * @returns {boolean}
 */
export function isValidVersion(version) {
  if (!version || typeof version !== "string") return false;
  const v = version.trim();
  return BUILD_VERSION_PATTERN.test(v) || LEGACY_SEMVER_PATTERN.test(v);
}

/**
 * @param {string} version
 * @returns {ParsedVersion}
 */
export function parseVersion(version) {
  const raw = String(version ?? "").trim();
  if (BUILD_VERSION_PATTERN.test(raw)) {
    const match = /^(\d{1,2})\.(\d{1,2})\.(\d{1,3})\.(\d{1,3})([a-z]?)$/.exec(raw);
    if (!match) throw new Error(`Invalid build version: ${raw}`);
    return {
      scheme: "build",
      major: Number(match[1]),
      minor: Number(match[2]),
      build: Number(match[3]),
      hotfix: Number(match[4]),
      hotfixSuffix: match[5] ?? "",
      raw,
    };
  }

  if (LEGACY_SEMVER_PATTERN.test(raw)) {
    const core = raw.split("-")[0].split("+")[0];
    const [major, minor, patch] = core.split(".").map(Number);
    return {
      scheme: "legacy",
      major,
      minor,
      build: 0,
      hotfix: patch,
      hotfixSuffix: "",
      raw,
    };
  }

  throw new Error(`Invalid version: ${raw}`);
}

/**
 * @param {ParsedVersion} parsed
 * @returns {number[]}
 */
function sortKey(parsed) {
  const suffix = parsed.hotfixSuffix ? parsed.hotfixSuffix.charCodeAt(0) - 96 : 0;
  return [parsed.major, parsed.minor, parsed.build, parsed.hotfix, suffix];
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {number} negative if a < b, positive if a > b, 0 if equal
 */
export function compareVersions(a, b) {
  const ka = sortKey(parseVersion(a));
  const kb = sortKey(parseVersion(b));
  for (let i = 0; i < ka.length; i++) {
    if (ka[i] !== kb[i]) return ka[i] - kb[i];
  }
  return 0;
}

/**
 * @param {string} version
 * @returns {string}
 */
export function versionTag(version) {
  return `v${String(version).trim()}`;
}

/**
 * Map legacy semver to the build scheme for display/migration hints.
 * @param {string} legacy
 * @returns {string}
 */
export function legacyToBuildVersion(legacy) {
  const parsed = parseVersion(legacy);
  if (parsed.scheme === "build") return parsed.raw;
  return `${parsed.major}.${parsed.minor}.${parsed.build}.${parsed.hotfix}`;
}

/**
 * @param {string} version
 * @returns {string}
 */
export function validateVersionOrThrow(version) {
  const v = String(version ?? "").trim();
  if (!isValidVersion(v)) {
    throw new Error(
      `Invalid version "${v}". Use M.m.b.h (e.g. 0.6.1.2) or legacy semver during migration.`
    );
  }
  return v;
}
