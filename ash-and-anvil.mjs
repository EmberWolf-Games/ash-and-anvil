/**
 * Ash & Anvil (1st Edition) — Foundry VTT game system
 * Copyright (c) EmberWolf Games. All rights reserved.
 */

import { AAAActor, AAAItem } from "./module/documents/_module.mjs";
import { CharacterData, NpcData } from "./module/data/actor/_module.mjs";
import {
  AncestryData,
  BackgroundData,
  ClassData,
  FeatureData,
  GearData,
  SpellData,
} from "./module/data/item/_module.mjs";
import { registerSettings } from "./module/config/settings.mjs";
import { printReadySummary, printStartupBanner } from "./module/helpers/banner.mjs";
import { aaGroup, aaLog, aaVerbose } from "./module/helpers/logger.mjs";
import { CharacterActorSheet, NpcActorSheet } from "./module/sheets/actor/_module.mjs";
import { ItemSheetAA } from "./module/sheets/item-sheet.mjs";
import { registerPauseScreen } from "./module/ui/pause.mjs";
import { seedCompendiumsIfNeeded } from "./module/bootstrap/seed-compendiums.mjs";
import * as RULES from "./module/rules/_module.mjs";

Hooks.once("init", () => {
  printStartupBanner();
  aaLog("Initializing (1st Edition)…");

  const actorDataModels = {
    character: CharacterData,
    npc: NpcData,
  };

  const itemDataModels = {
    ancestry: AncestryData,
    class: ClassData,
    background: BackgroundData,
    gear: GearData,
    feature: FeatureData,
    spell: SpellData,
  };

  CONFIG.ASH_ANVIL = {
    keyVersion: "0.2.6",
    rules: RULES,
    registeredTypes: {
      actors: Object.keys(actorDataModels),
      items: Object.keys(itemDataModels),
    },
  };

  aaGroup("Data models", () => {
    CONFIG.Actor.dataModels = actorDataModels;
    CONFIG.Item.dataModels = itemDataModels;
    aaVerbose("Actor data models", CONFIG.ASH_ANVIL.registeredTypes.actors);
    aaVerbose("Item data models", CONFIG.ASH_ANVIL.registeredTypes.items);
  });

  CONFIG.Actor.documentClass = AAAActor;
  CONFIG.Item.documentClass = AAAItem;

  const { Actors, Items } = foundry.documents.collections;

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
      types: ["gear", "feature", "spell", "ancestry", "class", "background"],
      makeDefault: true,
      label: "ASHANVIL.SheetItem",
    });

    aaVerbose("Actor and item sheets registered.");
  });

  aaLog("Init hook complete.");
});

Hooks.once("ready", async () => {
  printReadySummary();
  try {
    const result = await seedCompendiumsIfNeeded();
    if (result?.seeded) {
      ui.notifications?.info(game.i18n.localize("ASHANVIL.SeedCompendiumsDone"), { localize: false });
    }
  } catch (err) {
    console.error("Ash & Anvil | Compendium seed failed", err);
    ui.notifications?.error(game.i18n.localize("ASHANVIL.SeedCompendiumsFailed"), { localize: false });
  }
});
