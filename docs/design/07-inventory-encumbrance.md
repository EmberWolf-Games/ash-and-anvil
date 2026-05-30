# Inventory, Resources & Encumbrance

## Inventory tab layout

Two-column grid (mirrors Equipment tab):

- **Left rail:** currency adjust, encumbrance summary, container list (on person + bags; equipped backpack pinned)
- **Right panel:** contents of selected view (on person or open container)

## Currency & HP — delta input

Shared parser (`module/rules/resource-adjust.mjs`):

| Input | Result (current 15) |
|-------|---------------------|
| `25` | Set to 25 |
| `+10` | 25 |
| `-3` | 12 |

Applies on Enter / Apply button. Used for currency (Inventory) and HP current (Details + token HUD).

## Weight

```
current = bodyWeight + wornWeight + carriedWeight
```

| Component | Source |
|-----------|--------|
| bodyWeight | Numeric parse of `system.details.weight` (Biography) |
| wornWeight | Equipped gear (unique IDs across equipment slots) |
| carriedWeight | All other gear on actor (not double-counting worn) |

## Encumbrance (MGT score)

| Threshold | Formula |
|-----------|---------|
| Light load (encumbered above) | 10 × MGT |
| Heavy load (heavily encumbered above) | 20 × MGT |
| Max carry | min(60 × MGT, 5 × heavy load) |

| Tier | Walk speed | Attacks |
|------|------------|---------|
| Normal | base walk | — |
| Encumbered | base − 10 ft (min 5) | Bane (−1) |
| Heavily encumbered | half base (min 5) | Double bane (−2) |
| Over max | same as heavily | Double bane; hard block pickups |

`system.speed.baseWalk` stores editable base; `system.speed.walk` is effective after derivation.

## Containers

- Hard block when `containerCapacity` exceeded
- No nesting containers inside containers
- Cannot stow equipped items without unequipping first
- Hard block pickups when over max carry weight

## Backpack link (Equipment ↔ Inventory)

When a container item occupies `equipment.backpack`, it is pinned at the top of the container list with an “Equipped” badge.
