/** Default single-denomination currency (base unit = 1 shard). */
export const DEFAULT_DENOMINATIONS = [{ id: "shard", label: "Shard", rate: 1 }];

const SYSTEM_ID = "ash-and-anvil";

/**
 * @returns {{ label: string, denominations: { id: string, label: string, rate: number }[] }}
 */
export function getCurrencyConfig() {
  const label = game.settings.get(SYSTEM_ID, "currencyLabel") ?? "Shards";
  const raw = game.settings.get(SYSTEM_ID, "currencyDenominations") ?? "";
  let denominations = DEFAULT_DENOMINATIONS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) {
      denominations = parsed
        .map((d) => ({
          id: String(d.id ?? d.label ?? "unit").toLowerCase(),
          label: String(d.label ?? d.id ?? "Unit"),
          rate: Math.max(1, Number(d.rate) || 1),
        }))
        .sort((a, b) => a.rate - b.rate);
    }
  } catch {
    /* keep default */
  }
  return { label, denominations };
}

/**
 * Lowest denomination (rate === 1 or smallest rate).
 * @param {{ id: string, label: string, rate: number }[]} denominations
 */
export function baseDenomination(denominations) {
  const sorted = [...denominations].sort((a, b) => a.rate - b.rate);
  return sorted[0] ?? DEFAULT_DENOMINATIONS[0];
}

/**
 * @param {number} baseAmount total in base units
 * @param {{ id: string, label: string, rate: number }[]} denominations
 * @returns {{ id: string, label: string, count: number }[]}
 */
export function breakdownCurrency(baseAmount, denominations) {
  let remaining = Math.max(0, Math.floor(Number(baseAmount) || 0));
  const sorted = [...denominations].sort((a, b) => b.rate - a.rate);
  const parts = [];
  for (const denom of sorted) {
    const count = Math.floor(remaining / denom.rate);
    if (count > 0) parts.push({ id: denom.id, label: denom.label, count });
    remaining -= count * denom.rate;
  }
  if (remaining > 0) {
    const base = baseDenomination(denominations);
    parts.push({ id: base.id, label: base.label, count: remaining });
  }
  return parts;
}

/**
 * @param {number} baseAmount
 * @returns {string}
 */
export function formatCurrency(baseAmount) {
  const { label, denominations } = getCurrencyConfig();
  const parts = breakdownCurrency(baseAmount, denominations);
  if (!parts.length) return `0 ${label}`;
  if (parts.length === 1 && parts[0].id === denominations[0]?.id) {
    return `${parts[0].count} ${label}`;
  }
  return parts.map((p) => `${p.count} ${p.label}`).join(", ");
}

/**
 * Shop price display — always shows mixed denominations when useful.
 * @param {number} basePrice price stored in base units
 * @returns {string}
 */
export function formatShopPrice(basePrice) {
  return formatCurrency(basePrice);
}

/**
 * Migrate legacy cp/sp/gp/pp object to base shards (best-effort).
 * @param {object} legacy
 * @returns {number}
 */
export function migrateLegacyCurrency(legacy) {
  if (legacy?.value != null) return Math.max(0, Number(legacy.value) || 0);
  const cp = legacy?.cp ?? 0;
  const sp = legacy?.sp ?? 0;
  const gp = legacy?.gp ?? 0;
  const pp = legacy?.pp ?? 0;
  return cp + sp * 10 + gp * 100 + pp * 1000;
}
