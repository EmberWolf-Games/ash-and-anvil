import { MAX_CLASSES, MAX_TOTAL_LEVEL } from "../../rules/constants.mjs";
import { buildExperienceContext } from "../../rules/experience.mjs";
import { formatClassEntry } from "../../helpers/identity-display.mjs";
import { itemSummary } from "./prepare-sheet-items.mjs";

/**
 * @param {Actor} actor
 */
function classItems(actor) {
  return actor.items.filter((i) => i.type === "class");
}

/**
 * @param {Actor} actor
 * @param {object} baseContext
 */
export function prepareFeaturesTabContext(actor, baseContext) {
  const system = actor.system;
  const classes = classItems(actor);
  const primary = classes[0] ?? null;
  const secondary = classes[1] ?? null;
  const primaryLevel = Math.max(0, Number(system.attributes?.primaryClassLevel) || 0);
  const secondaryLevel = Math.max(0, Number(system.attributes?.secondaryClassLevel) || 0);
  const totalLevel = system.attributes?.totalLevel ?? 1;
  const experience = buildExperienceContext(actor);

  /** @type {object[]} */
  const classCards = [];

  if (primary) {
    classCards.push({
      role: "primary",
      roleLabel: game.i18n.localize("ASHANVIL.PrimaryClass"),
      itemId: primary.id,
      name: primary.name,
      img: primary.img,
      level: primaryLevel || 1,
      subclass: system.details?.primarySubclass ?? "",
      subclassField: "system.details.primarySubclass",
      displayLine: formatClassEntry(
        primary.name,
        primaryLevel || 1,
        system.details?.primarySubclass ?? ""
      ),
      hitDie: primary.system?.hitDie ?? null,
      description: primary.system?.description ?? "",
    });
  }

  if (secondary && secondaryLevel > 0) {
    classCards.push({
      role: "secondary",
      roleLabel: game.i18n.localize("ASHANVIL.SecondaryClass"),
      itemId: secondary.id,
      name: secondary.name,
      img: secondary.img,
      level: secondaryLevel,
      subclass: system.details?.secondarySubclass ?? "",
      subclassField: "system.details.secondarySubclass",
      displayLine: formatClassEntry(
        secondary.name,
        secondaryLevel,
        system.details?.secondarySubclass ?? ""
      ),
      hitDie: secondary.system?.hitDie ?? null,
      description: secondary.system?.description ?? "",
    });
  }

  const ancestryItem = actor.items.find((i) => i.type === "ancestry") ?? null;
  const backgroundItem = actor.items.find((i) => i.type === "background") ?? null;

  return {
    featuresTab: {
      classCards,
      canAddSecondClass:
        !secondary && classes.length < MAX_CLASSES && totalLevel < MAX_TOTAL_LEVEL,
      canLevelUp: experience.canLevelUp && baseContext.canAdjustResources,
      experience,
      ancestry: itemSummary(ancestryItem),
      background: itemSummary(backgroundItem),
      totalLevel,
      maxTotalLevel: MAX_TOTAL_LEVEL,
    },
  };
}
