/**
 * @param {unknown} value
 * @returns {string[]}
 */
export function normalizeTagArray(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (value == null || value === "") return [];
  return String(value)
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * @param {readonly { value: string, labelKey: string }[]} catalog
 * @param {string[]} selected
 * @returns {{ value: string, label: string }[]}
 */
export function selectedTags(catalog, selected) {
  const set = new Set(selected);
  return catalog
    .filter((entry) => set.has(entry.value))
    .map((entry) => ({ value: entry.value, label: game.i18n.localize(entry.labelKey) }));
}

/**
 * @param {readonly { value: string, labelKey: string }[]} catalog
 * @param {string[]} selected
 * @returns {{ value: string, label: string }[]}
 */
export function availableTagOptions(catalog, selected) {
  const set = new Set(selected);
  return catalog
    .filter((entry) => !set.has(entry.value))
    .map((entry) => ({ value: entry.value, label: game.i18n.localize(entry.labelKey) }));
}

/**
 * @param {readonly { value: string, labelKey: string }[]} catalog
 * @param {string} value
 * @returns {string}
 */
export function tagLabel(catalog, value) {
  const entry = catalog.find((e) => e.value === value);
  return entry ? game.i18n.localize(entry.labelKey) : value;
}
