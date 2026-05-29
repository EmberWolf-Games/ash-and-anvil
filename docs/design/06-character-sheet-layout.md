# Character Sheet Layout Brief

Use this document when you lay out the full character sheet design. Params and templates are wired; you describe **where** things go and **how** they look — we implement against this spec.

## Params (code)

| Location | Purpose |
|----------|---------|
| `module/config/sheet-params.mjs` | Window size, tabs, layout tokens, zone ids |
| `module/sheets/actor/prepare-character-context.mjs` | All data bound to templates |
| `styles/ash-and-anvil.css` | Theme tokens (`--aa-*`) and zone/tab styles |
| `CONFIG.ASH_ANVIL.sheets.character` | Runtime copy of sheet params (init hook) |

### Layout tokens (`CHARACTER_SHEET_LAYOUT`)

| Token | Current | Notes for your layout |
|-------|---------|------------------------|
| `columns` | 12 | CSS grid column count |
| `gap` | 0.75rem | Zone spacing |
| `portraitSize` | 96px | Header portrait |
| `abilityDisplay` | `grid` | `grid` \| `row` \| `compact` |
| `skillDisplay` | `grouped` | `grouped` \| `table` |
| `showChargenBanner` | true | Incomplete-build banner on Main tab |

### Tabs (`CHARACTER_SHEET_TABS`)

| Tab id | Label | Sub-tabs | Status |
|--------|-------|----------|--------|
| `details` | Details | — | **Layout pending** (start here) |
| `inventory` | Inventory | — | Layout pending |
| `features` | Features | — | Layout pending |
| `powers` | Powers | Spellcasting, Psionics, Divine Gifts | Sub-tabs wired; layout pending |
| `effects` | Effects | Active, Passive | Sub-tabs wired; layout pending |
| `biography` | Biography | — | **Implemented** (see `parts/biography.hbs`) |

Add/rename/reorder tabs in `sheet-params.mjs`; wire matching partial in `character-sheet.hbs`.

---

## Zones (wireframe slots)

Each zone has a stable `data-zone="..."` attribute for CSS grid placement.

| Zone id | Current content | Available data |
|---------|-----------------|----------------|
| `header` | Portrait, name, level, HP, initiative | `document`, `combat.*`, `buildComplete` |
| `identity` | Ancestry / class / background names | `identity.*` |
| `abilities` | Six ability scores + mods | `abilityRows[]` |
| `combat` | Edge, initiative, hit die | `combat.*` |
| `skills` | Skills (grouped by ability) | `skillGroups[]`, `skillRows[]` |
| `features` | Build blocks + feature items | `items.build.*`, `items.features[]` |
| `biography` | ProseMirror bio | `system.details.biography` |

---

## Context reference (for designers)

Prepared in `prepareCharacterSheetContext()`:

```
identity.ancestry / .class / .background  → { id, name, description, system }
combat  → { level, health{value,max,temp}, initiative, edge, hitDie, hpDisplay }
abilityRows[]  → { key, label, short, ability{value,mod} }
skillGroups[]  → { abilityKey, abilityLabel, skills[] }
skillRows[]    → { key, label, abilityKey, skill{trained,bonus} }
items.features[] / .gear[] / .spells[]
items.build.ancestry / .class / .background
```

---

## Your layout (fill in)

### Overall

- **Sheet size:** width ___ × height ___
- **Reference / mockup:** (link or describe)
- **Tone:** (parchment, dark iron, etc.)

### Header

- Portrait position: ___
- Resources shown: ___
- HP style (bar / numbers / both): ___

### Main tab

Describe grid placement of zones (e.g. “identity top-left, abilities 2×3 center, skills right column”):

```
[ your wireframe or ASCII layout here ]
```

### Features tab

- Show build blocks? Y/N
- Feature list style (cards / compact / expandable): ___

### Biography tab

- Full-width editor? Notes field? ___

### Interactions

- Roll buttons on skills? Y/N
- Edit abilities on sheet after chargen? Y/N
- Item drag-drop areas? ___

### Assets needed

- Sheet background image? ___
- Frame/border art? ___
- Ability icon set? ___

---

## Template partials (rearrange freely)

```
templates/actor/
  character-sheet.hbs      ← tab shell
  parts/header.hbs
  parts/identity.hbs
  parts/abilities.hbs
  parts/skills.hbs
  parts/features.hbs
  parts/biography.hbs
  tabs/main.hbs
  tabs/features.hbs
  tabs/biography.hbs
```

When you send your layout, specify which partials move where and any new zones/tabs.
