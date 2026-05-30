import { aaLog, aaVerbose } from "../helpers/logger.mjs";
import { STANDARD_ARRAY } from "../rules/constants.mjs";

const SYSTEM_ID = "ash-and-anvil";

/**
 * World-level configuration switches for DMs (automation and rules params).
 */
export function registerSettings() {
  if (!game.settings) {
    console.error("Ash & Anvil | game.settings unavailable during registerSettings.");
    return;
  }

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

  game.settings.register(SYSTEM_ID, "statMethod", {
    name: "ASHANVIL.SettingsStatMethodName",
    hint: "ASHANVIL.SettingsStatMethodHint",
    scope: "world",
    config: true,
    type: String,
    choices: {
      standardArray: "ASHANVIL.SettingsStatMethodArray",
      pointBuy: "ASHANVIL.SettingsStatMethodPointBuy",
      manual: "ASHANVIL.SettingsStatMethodManual",
    },
    default: "standardArray",
  });

  game.settings.register(SYSTEM_ID, "pointBuyTotal", {
    name: "ASHANVIL.SettingsPointBuyTotalName",
    hint: "ASHANVIL.SettingsPointBuyTotalHint",
    scope: "world",
    config: true,
    type: Number,
    default: 27,
  });

  game.settings.register(SYSTEM_ID, "standardArray", {
    name: "ASHANVIL.SettingsStandardArrayName",
    hint: "ASHANVIL.SettingsStandardArrayHint",
    scope: "world",
    config: true,
    type: String,
    default: STANDARD_ARRAY.join(", "),
  });

  game.settings.register(SYSTEM_ID, "autoApplyDerived", {
    name: "ASHANVIL.SettingsAutoApplyDerivedName",
    hint: "ASHANVIL.SettingsAutoApplyDerivedHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SYSTEM_ID, "currencyLabel", {
    name: "ASHANVIL.SettingsCurrencyLabelName",
    hint: "ASHANVIL.SettingsCurrencyLabelHint",
    scope: "world",
    config: true,
    type: String,
    default: "Shards",
  });

  game.settings.register(SYSTEM_ID, "currencyDenominations", {
    name: "ASHANVIL.SettingsCurrencyDenominationsName",
    hint: "ASHANVIL.SettingsCurrencyDenominationsHint",
    scope: "world",
    config: true,
    type: String,
    default: JSON.stringify([{ id: "shard", label: "Shard", rate: 1 }], null, 0),
  });

  aaVerbose("World settings registered.");
}

export function isAutomationEnabled() {
  return game.settings.get(SYSTEM_ID, "automationEnabled");
}

export function getRulesProfile() {
  return game.settings.get(SYSTEM_ID, "rulesProfile");
}
