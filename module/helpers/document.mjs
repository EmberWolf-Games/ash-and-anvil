/**
 * Clone TypeDataModel / plain system data for updates.
 * @param {object} source
 * @returns {object}
 */
export function cloneSystemData(source) {
  if (!source) return {};
  if (typeof source.toObject === "function") {
    return foundry.utils.deepClone(source.toObject());
  }
  return foundry.utils.deepClone(source);
}

/**
 * @param {foundry.abstract.Document} doc
 * @returns {object}
 */
export function documentToCreateData(doc) {
  if (typeof doc.toObject === "function") return doc.toObject();
  return foundry.utils.deepClone(doc);
}
