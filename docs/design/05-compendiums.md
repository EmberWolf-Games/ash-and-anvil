# Compendiums

## Pack IDs (system.json)

| Pack | Type | Purpose |
|------|------|---------|
| `ash-and-anvil.ancestries` | Item | Playable ancestries |
| `ash-and-anvil.classes` | Item | Classes |
| `ash-and-anvil.backgrounds` | Item | Backgrounds |
| `ash-and-anvil.features` | Item | Traits and class features |

## Starter content (MVP)

Seeded from `module/starter/*.json` when compendiums are empty (GM world, `automationEnabled`).

| Ancestry | Class | Background |
|----------|-------|------------|
| Ironbound | Vanguard | Field Medic |
| Skylark | Wayfinder | Chronicler |
| Rootwalker | Artificer | Reformed Scoundrel |

All names and mechanics are original to EmberWolf Games.

## Building packs for release

Compile with Foundry’s compendium tools or export LevelDB packs into `packs/` before release zip. Source JSON in `module/starter/` remains the authoring format for version control.
