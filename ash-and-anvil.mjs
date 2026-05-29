/**
 * Ash & Anvil (1st Edition) — Foundry VTT game system
 * Copyright (c) EmberWolf Games. All rights reserved.
 */

import { AAAActor, AAAItem } from "./module/documents/_module.mjs";
import { CharacterData, NpcData } from "./module/data/actor/_module.mjs";
import { FeatureData, GearData, SpellData } from "./module/data/item/_module.mjs";
import { registerSettings } from "./module/config/settings.mjs";
import { printReadySummary, printStartupBanner } from "./module/helpers/banner.mjs";
import { aaGroup, aaLog, aaVerbose } from "./module/helpers/logger.mjs";
import { CharacterActorSheet, NpcActorSheet } from "./module/sheets/actor/_module.mjs";
import { ItemSheetAA } from "./module/sheets/item-sheet.mjs";
import { registerPauseScreen } from "./module/ui/pause.mjs";

Hooks.once("init", () => {
  printStartupBanner();
  aaLog("Initializing (1st Edition)…");

  CONFIG.ASH_ANVIL = {
    keyVersion: "0.1.4",
  };

  aaGroup("Data models", () => {
    CONFIG.Actor.dataModels = {
      character: CharacterData,
      npc: NpcData,
    };

    CONFIG.Item.dataModels = {
      gear: GearData,
      feature: FeatureData,
      spell: SpellData,
    };

    aaVerbose("Actor data models", Object.keys(CONFIG.Actor.dataModels));
    aaVerbose("Item data models", Object.keys(CONFIG.Item.dataModels));
  });

  CONFIG.Actor.documentClass = AAAActor;
  CONFIG.Item.documentClass = AAAItem;

  registerSettings();
  registerPauseScreen();

  aaGroup("Sheets", () => {
    Actors.registerSheet("ash-and-anvil", CharacterActorSheet, {
      types: ["character"],
      makeDefault: true,
      label: "ASHANVIL.SheetActorCharacter",
    });

    Actors.registerSheet("ash-and-anvil", NpcActorSheet, {
      types: ["npc"],
      makeDefault: true,
      label: "ASHANVIL.SheetActorNpc",
    });

    Items.registerSheet("ash-and-anvil", ItemSheetAA, {
      makeDefault: true,
      label: "ASHANVIL.SheetItem",
    });

    aaVerbose("Actor and item sheets registered.");
  });

  aaLog("Init hook complete.");
});

Hooks.once("ready", () => {
  printReadySummary();
});
