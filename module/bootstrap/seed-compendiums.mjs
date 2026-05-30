import starter from "../starter/content.mjs";
import { aaLog, aaVerbose, aaWarn } from "../helpers/logger.mjs";

const ItemDocument = foundry.documents.Item;

/**
 * Seed compendiums from module/starter/content.mjs when packs are empty.
 */
/**
 * @returns {Promise<{ seeded: boolean, packs: string[] }>}
 */
export async function seedCompendiumsIfNeeded() {
  if (!game.user.isGM) return { seeded: false, packs: [] };
  if (!game.settings.get("ash-and-anvil", "automationEnabled")) return { seeded: false, packs: [] };

  const seededPacks = [];
  const featureMap = await ensureFeatures(seededPacks);
  await ensurePack("ancestries", starter.ancestries, (data) => buildAncestry(data, featureMap), seededPacks);
  await ensurePack("classes", starter.classes, (data) => buildClass(data, featureMap), seededPacks);
  await ensurePack("backgrounds", starter.backgrounds, (data) => buildBackground(data, featureMap), seededPacks);
  return { seeded: seededPacks.length > 0, packs: seededPacks };
}

/**
 * @param {CompendiumCollection} pack
 * @param {() => Promise<void>} operation
 */
async function withUnlockedPack(pack, operation) {
  if (!pack) return;
  const wasLocked = pack.locked;
  if (wasLocked) {
    aaVerbose(`Unlocking compendium for seeding: ${pack.collection}`);
    await pack.configure({ locked: false });
  }
  try {
    await operation();
  } finally {
    if (wasLocked) {
      aaVerbose(`Re-locking compendium: ${pack.collection}`);
      await pack.configure({ locked: true });
    }
  }
}

/**
 * @returns {Promise<Map<string, string>>}
 */
/**
 * @param {string[]} seededPacks
 */
async function ensureFeatures(seededPacks) {
  const pack = game.packs.get("ash-and-anvil.features");
  if (!pack) {
    aaWarn("Features compendium pack not found; starter features unavailable.");
    return new Map();
  }
  if ((await pack.getIndex()).size > 0) {
    return indexFeatureKeys(pack);
  }

  await withUnlockedPack(pack, async () => {
    const docs = starter.features.map((f) => ({
      name: f.name,
      type: "feature",
      system: {
        description: f.description,
        key: f.key,
      },
      flags: { "ash-and-anvil": { starterKey: f.key } },
    }));
    await ItemDocument.createDocuments(docs, { pack: pack.collection });
    seededPacks.push(pack.collection);
    aaLog(`Seeded ${docs.length} features into ${pack.title}.`);
  });

  return indexFeatureKeys(pack);
}

/**
 * @param {CompendiumCollection} pack
 * @returns {Promise<Map<string, string>>}
 */
async function indexFeatureKeys(pack) {
  const map = new Map();
  const documents = await pack.getDocuments();
  for (const doc of documents) {
    const key = doc.flags?.["ash-and-anvil"]?.starterKey;
    if (key) map.set(key, doc.uuid);
  }
  return map;
}

/**
 * @param {string} name
 * @param {object[]} entries
 * @param {(data: object) => object} builder
 */
/**
 * @param {string[]} seededPacks
 */
async function ensurePack(name, entries, builder, seededPacks) {
  const pack = game.packs.get(`ash-and-anvil.${name}`);
  if (!pack) {
    aaWarn(`Compendium pack ash-and-anvil.${name} not found.`);
    return;
  }
  if ((await pack.getIndex()).size > 0) {
    aaVerbose(`Compendium ${name} already populated; skip seed.`);
    return;
  }

  await withUnlockedPack(pack, async () => {
    const docs = entries.map((e) => builder(e));
    await ItemDocument.createDocuments(docs, { pack: pack.collection });
    seededPacks.push(pack.collection);
    aaLog(`Seeded ${docs.length} entries into ${pack.title}.`);
  });
}

/**
 * @param {object} data
 * @param {Map<string, string>} _featureMap
 */
function buildAncestry(data, _featureMap) {
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

function buildClass(data, _featureMap) {
  return {
    name: data.name,
    type: "class",
    system: {
      description: data.description,
      hitDie: data.hitDie,
      skillPointsPerLevel: data.skillPointsPerLevel ?? 2,
      skillChoices: data.skillChoices,
      skillPool: data.skillPool,
      featureKeys: data.featureKeys,
      casterProgression: data.casterProgression ?? "none",
      powerPool: data.powerPool ?? "none",
      spellcastingAbility: data.spellcastingAbility ?? "mnd",
    },
    flags: { "ash-and-anvil": { starterKey: data.key } },
  };
}

function buildBackground(data, _featureMap) {
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
 * @returns {Promise<{ ancestries: object[], classes: object[], backgrounds: object[] }>}
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
/**
 * @param {Item} doc
 */
function catalogEntryFromDocument(doc) {
  const system =
    typeof doc.system?.toObject === "function"
      ? doc.system.toObject()
      : foundry.utils.deepClone(doc.system ?? {});
  return {
    id: doc.id,
    uuid: doc.uuid,
    name: doc.name,
    system,
    type: doc.type,
    starterKey: doc.flags?.["ash-and-anvil"]?.starterKey,
  };
}

async function loadPackOrFallback(packName, fallback, type, builder) {
  const pack = game.packs.get(`ash-and-anvil.${packName}`);
  if (pack && (await pack.getIndex()).size > 0) {
    const docs = await pack.getDocuments();
    return docs.map(catalogEntryFromDocument);
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
