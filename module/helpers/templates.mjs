import { aaVerbose } from "./logger.mjs";

const SYSTEM = "systems/ash-and-anvil/templates";

/** @type {readonly string[]} */
export const HANDLEBARS_PARTIALS = [
  `${SYSTEM}/actor/tabs/details.hbs`,
  `${SYSTEM}/actor/tabs/equipment.hbs`,
  `${SYSTEM}/actor/tabs/inventory.hbs`,
  `${SYSTEM}/actor/tabs/features.hbs`,
  `${SYSTEM}/actor/tabs/powers.hbs`,
  `${SYSTEM}/actor/tabs/effects.hbs`,
  `${SYSTEM}/actor/tabs/biography.hbs`,
  `${SYSTEM}/actor/tabs/powers-spellcasting.hbs`,
  `${SYSTEM}/actor/tabs/powers-psionics.hbs`,
  `${SYSTEM}/actor/tabs/powers-divine-gifts.hbs`,
  `${SYSTEM}/actor/tabs/effects-active.hbs`,
  `${SYSTEM}/actor/tabs/effects-passive.hbs`,
  `${SYSTEM}/actor/parts/spell-list.hbs`,
  `${SYSTEM}/actor/parts/item-row-actions.hbs`,
  `${SYSTEM}/actor/parts/biography.hbs`,
  `${SYSTEM}/actor/parts/features.hbs`,
  `${SYSTEM}/actor/parts/effect-list.hbs`,
  `${SYSTEM}/actor/parts/equipment-slot-mannequin.hbs`,
  `${SYSTEM}/actor/parts/equipment-slot-panel.hbs`,
  `${SYSTEM}/actor/parts/inventory-gear-row.hbs`,
  `${SYSTEM}/actor/parts/resource-adjust.hbs`,
  `${SYSTEM}/actor/parts/resource-bar.hbs`,
  `${SYSTEM}/actor/parts/spell-level-groups.hbs`,
  `${SYSTEM}/actor/parts/tag-field.hbs`,
];

/**
 * Preload Handlebars partials referenced via {{> "path"}} in sheet templates.
 */
export async function registerHandlebarsPartials() {
  const loader = foundry.applications.handlebars.loadTemplates;
  await loader(HANDLEBARS_PARTIALS);
  aaVerbose(`Loaded ${HANDLEBARS_PARTIALS.length} Handlebars partials.`);
}
