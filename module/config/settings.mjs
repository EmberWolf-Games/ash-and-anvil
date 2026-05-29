import { aaLog, aaVerbose } from "../helpers/logger.mjs";

const SYSTEM_ID = "ash-and-anvil";

/**
 * World-level configuration switches for DMs (automation and rules params).
 * Expand this registry as mechanics are defined in planning.
 */
export function registerSettings() {
  game.settings.register(SYSTEM_ID, "verboseLogging", {
    name: "ASHANVIL.SettingsVerboseLoggingName",
    hint: "ASHANVIL.SettingsVerboseLoggingHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => {
      aaLog(`Verbose logging ${value ? "enabled" : "disabled"}.`);
      if (value) aaVerbose("Diagnostic logging is now active for this world.");
    },
  });

  game.settings.register(SYSTEM_ID, "rulesProfile", {
    name: "ASHANVIL.SettingsRulesProfileName",
    hint: "ASHANVIL.SettingsRulesProfileHint",
    scope: "world",
    config: true,
    type: String,
    choices: {
      standard: "ASHANVIL.SettingsRulesProfileStandard",
      narrative: "ASHANVIL.SettingsRulesProfileNarrative",
      gritty: "ASHANVIL.SettingsRulesProfileGritty",
    },
    default: "standard",
    requiresReload: true,
  });

  game.settings.register(SYSTEM_ID, "automationEnabled", {
    name: "ASHANVIL.SettingsAutomationName",
    hint: "ASHANVIL.SettingsAutomationHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SYSTEM_ID, "debugRules", {
    name: "ASHANVIL.SettingsDebugRulesName",
    hint: "ASHANVIL.SettingsDebugRulesHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });

  aaVerbose("World settings registered.");
}

/**
 * @returns {boolean}
 */
export function isAutomationEnabled() {
  return game.settings.get(SYSTEM_ID, "automationEnabled");
}

/**
 * @returns {string}
 */
export function getRulesProfile() {
  return game.settings.get(SYSTEM_ID, "rulesProfile");
}
