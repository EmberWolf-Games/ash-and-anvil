const SYSTEM_ID = "ash-and-anvil";
const LOG_PREFIX = "Ash & Anvil";

/**
 * @returns {boolean}
 */
export function isVerboseLogging() {
  try {
    return game.settings.get(SYSTEM_ID, "verboseLogging");
  } catch {
    return false;
  }
}

/**
 * @returns {boolean}
 */
export function isRulesDebugEnabled() {
  try {
    return game.settings.get(SYSTEM_ID, "debugRules");
  } catch {
    return false;
  }
}

/**
 * Standard log — always visible (major lifecycle events).
 * @param {string} message
 * @param {...*} args
 */
export function aaLog(message, ...args) {
  console.log(`${LOG_PREFIX} | ${message}`, ...args);
}

/**
 * Verbose diagnostic log — only when Verbose Logging is enabled in settings.
 * @param {string} message
 * @param {...*} args
 */
export function aaVerbose(message, ...args) {
  if (!isVerboseLogging()) return;
  console.log(
    `%c${LOG_PREFIX}%c | ${message}`,
    "color:#e85d04;font-weight:bold",
    "color:inherit",
    ...args
  );
}

/**
 * Rules-resolution debug — verbose logging OR Debug Rules setting.
 * @param {string} message
 * @param {...*} args
 */
export function aaRules(message, ...args) {
  if (!isVerboseLogging() && !isRulesDebugEnabled()) return;
  console.debug(`${LOG_PREFIX} [rules] | ${message}`, ...args);
}

/**
 * @param {string} message
 * @param {...*} args
 */
export function aaWarn(message, ...args) {
  console.warn(`${LOG_PREFIX} | ${message}`, ...args);
}

/**
 * @param {string} message
 * @param {...*} args
 */
export function aaError(message, ...args) {
  console.error(`${LOG_PREFIX} | ${message}`, ...args);
}

/**
 * @param {string} label
 * @param {() => void} fn
 */
export function aaGroup(label, fn) {
  if (!isVerboseLogging()) return;
  console.group(`${LOG_PREFIX} | ${label}`);
  try {
    fn();
  } finally {
    console.groupEnd();
  }
}

/**
 * Time an operation when verbose logging is enabled.
 * @param {string} label
 * @param {() => void | Promise<void>} fn
 */
export async function aaTime(label, fn) {
  if (!isVerboseLogging()) return fn();
  const start = performance.now();
  aaVerbose(`→ ${label}`);
  try {
    return await fn();
  } finally {
    aaVerbose(`← ${label} (${(performance.now() - start).toFixed(1)}ms)`);
  }
}
