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
import { CHARACTER_SHEET_PARAMS, NPC_SHEET_PARAMS } from "./module/config/sheet-params.mjs";
import { printReadySummary, printStartupBanner } from "./module/helpers/banner.mjs";
import { aaGroup, aaLog, aaVerbose } from "./module/helpers/logger.mjs";
import { registerHandlebarsPartials } from "./module/helpers/templates.mjs";
import { CharacterActorSheet, NpcActorSheet } from "./module/sheets/actor/_module.mjs";
import { ItemSheetAA } from "./module/sheets/item-sheet.mjs";
import { registerPauseScreen } from "./module/ui/pause.mjs";
import { seedCompendiumsIfNeeded } from "./module/bootstrap/seed-compendiums.mjs";
import * as RULES from "./module/rules/_module.mjs";

Hooks.once("init", async () => {
  printStartupBanner();
  aaLog("Initializing (1st Edition)…");

  await registerHandlebarsPartials();

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
    keyVersion: "0.6.1.3",
    rules: RULES,
    currency: {
      getConfig: RULES.getCurrencyConfig,
      format: RULES.formatCurrency,
      formatShopPrice: RULES.formatShopPrice,
      breakdown: RULES.breakdownCurrency,
    },
    registeredTypes: {
      actors: Object.keys(actorDataModels),
      items: Object.keys(itemDataModels),
    },
    sheets: {
      character: CHARACTER_SHEET_PARAMS,
      npc: NPC_SHEET_PARAMS,
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
  const { ActorSheetV2, ItemSheetV2 } = foundry.applications.sheets;

  registerSettings();
  registerPauseScreen();

  aaGroup("Sheets", () => {
    Actors.unregisterSheet("core", ActorSheetV2);
    Items.unregisterSheet("core", ItemSheetV2);

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

    aaLog(
      `Registered actor sheets — character: ${CharacterActorSheet.DEFAULT_OPTIONS.id}; npc: ${NpcActorSheet.DEFAULT_OPTIONS.id}`
    );
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
