import starter from "../starter/content.mjs";
import { aaLog, aaVerbose } from "../helpers/logger.mjs";

/**
 * Seed compendiums from module/starter/content.json when packs are empty.
 */
export async function seedCompendiumsIfNeeded() {
  if (!game.user.isGM) return;
  if (!game.settings.get("ash-and-anvil", "automationEnabled")) return;

  const featureMap = await ensureFeatures();
  await ensurePack("ancestries", starter.ancestries, (data) => buildAncestry(data, featureMap));
  await ensurePack("classes", starter.classes, (data) => buildClass(data, featureMap));
  await ensurePack("backgrounds", starter.backgrounds, (data) => buildBackground(data, featureMap));
}

/**
 * @returns {Promise<Map<string, string>>}
 */
async function ensureFeatures() {
  const pack = game.packs.get("ash-and-anvil.features");
  if (!pack) return new Map();
  if ((await pack.getIndex()).size > 0) {
    return indexFeatureKeys(pack);
  }

  const docs = [];
  for (const f of starter.features) {
    docs.push({
      name: f.name,
      type: "feature",
      system: {
        description: f.description,
        key: f.key,
      },
      flags: { "ash-and-anvil": { starterKey: f.key } },
    });
  }
  await Item.createDocuments(docs, { pack: pack.collection });
  aaLog(`Seeded ${docs.length} features into ${pack.title}.`);
  return indexFeatureKeys(pack);
}

/**
 * @param {CompendiumCollection} pack
 * @returns {Promise<Map<string, string>>}
 */
async function indexFeatureKeys(pack) {
  const index = await pack.getIndex({ fields: ["flags"] });
  const map = new Map();
  for (const entry of index) {
    const key = entry.flags?.["ash-and-anvil"]?.starterKey;
    if (key) map.set(key, entry.uuid);
  }
  return map;
}

/**
 * @param {string} name
 * @param {object[]} entries
 * @param {(data: object) => object} builder
 */
async function ensurePack(name, entries, builder) {
  const pack = game.packs.get(`ash-and-anvil.${name}`);
  if (!pack) return;
  if ((await pack.getIndex()).size > 0) {
    aaVerbose(`Compendium ${name} already populated; skip seed.`);
    return;
  }

  const docs = entries.map((e) => builder(e));
  await Item.createDocuments(docs, { pack: pack.collection });
  aaLog(`Seeded ${docs.length} entries into ${pack.title}.`);
}

/**
 * @param {object} data
 * @param {Map<string, string>} featureMap
 */
function buildAncestry(data, featureMap) {
  return {
    name: data.name,
    type: "ancestry",
    system: {
      description: data.description,
      size: data.size,
      speed: data.speed,
      abilityAdjustments: data.abilityAdjustments,
      featureKeys: data.featureKeys,
    },
    flags: { "ash-and-anvil": { starterKey: data.key } },
  };
}

function buildClass(data, featureMap) {
  return {
    name: data.name,
    type: "class",
    system: {
      description: data.description,
      hitDie: data.hitDie,
      skillChoices: data.skillChoices,
      skillPool: data.skillPool,
      featureKeys: data.featureKeys,
    },
    flags: { "ash-and-anvil": { starterKey: data.key } },
  };
}

function buildBackground(data, featureMap) {
  return {
    name: data.name,
    type: "background",
    system: {
      description: data.description,
      trainedSkills: data.trainedSkills,
      starterGear: data.starterGear,
      featureKeys: data.featureKeys,
    },
    flags: { "ash-and-anvil": { starterKey: data.key } },
  };
}

/**
 * Load starter items for chargen when compendiums unavailable.
 * @returns {Promise<{ ancestries: Item[], classes: Item[], backgrounds: Item[] }>}
 */
export async function loadStarterCatalog() {
  const ancestries = await loadPackOrFallback("ancestries", starter.ancestries, "ancestry", buildAncestry);
  const classes = await loadPackOrFallback("classes", starter.classes, "class", buildClass);
  const backgrounds = await loadPackOrFallback("backgrounds", starter.backgrounds, "background", buildBackground);
  return { ancestries, classes, backgrounds };
}

/**
 * @param {string} packName
 * @param {object[]} fallback
 * @param {string} type
 * @param {Function} builder
 */
async function loadPackOrFallback(packName, fallback, type, builder) {
  const pack = game.packs.get(`ash-and-anvil.${packName}`);
  if (pack && (await pack.getIndex()).size > 0) {
    const docs = await pack.getDocuments();
    return docs.map((d) => ({ id: d.id, uuid: d.uuid, name: d.name, system: d.system.toObject(), type }));
  }

  const featureMap = new Map();
  return fallback.map((data) => {
    const built = builder(data, featureMap);
    return {
      id: data.key,
      uuid: null,
      name: built.name,
      system: built.system,
      type: built.type,
      starterKey: data.key,
    };
  });
}
