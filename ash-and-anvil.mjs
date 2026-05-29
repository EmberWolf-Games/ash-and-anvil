/**
 * Ash & Anvil (1st Edition) — Foundry VTT game system
 * Copyright (c) EmberWolf Games. All rights reserved.
 */

import { AAAActor, AAAItem } from "./module/documents/_module.mjs";
import { CharacterData, NpcData } from "./module/data/actor/_module.mjs";
import { FeatureData, GearData, SpellData } from "./module/data/item/_module.mjs";
import { registerSettings } from "./module/config/settings.mjs";
import { CharacterActorSheet, NpcActorSheet } from "./module/sheets/actor/_module.mjs";
import { ItemSheetAA } from "./module/sheets/item-sheet.mjs";

Hooks.once("init", () => {
  console.log("Ash & Anvil | Initializing (1st Edition)");

  CONFIG.ASH_ANVIL = {
    keyVersion: "0.1.0",
  };

  CONFIG.Actor.dataModels = {
    character: CharacterData,
    npc: NpcData,
  };

  CONFIG.Item.dataModels = {
    gear: GearData,
    feature: FeatureData,
    spell: SpellData,
  };

  CONFIG.Actor.documentClass = AAAActor;
  CONFIG.Item.documentClass = AAAItem;

  registerSettings();

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
});

Hooks.once("ready", () => {
  console.log("Ash & Anvil | Ready");
});
