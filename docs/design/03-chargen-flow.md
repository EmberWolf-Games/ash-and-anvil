# Character Creation Flow

## Wizard steps (Foundry)

1. **Ancestry** — pick one ancestry Item
2. **Class** — pick one class Item
3. **Background** — pick one background Item
4. **Abilities** — assign scores per world `statMethod`
5. **Skills** — apply class choices + background trainings
6. **Review** — confirm; write actor; embed features; `buildComplete = true`

Entry: **Character sheet** header button **Build Character**, or prompt when opening incomplete character.

## Stat methods (world setting)

| Method | Description |
|--------|-------------|
| `standardArray` | Assign 15, 14, 13, 12, 10, 8 across the six attributes (default) |
| `pointBuy` | 27 points; costs per score table in rules config |
| `manual` | Enter any scores 3–18; GM responsibility |

Ancestry ability adjustments apply **after** assignment.

## Point buy costs

| Score | Cost |
|-------|------|
| 8 | 0 |
| 9 | 1 |
| 10 | 2 |
| 11 | 3 |
| 12 | 4 |
| 13 | 5 |
| 14 | 7 |
| 15 | 9 |

Default pool: **27** (`pointBuyTotal` setting). Gritty: **25**. Narrative: **28**.

## Skill step

- Background grants fixed trainings (set `trained: true`).
- Class grants `skillChoices` picks from `skillPool` (player toggles in wizard).
- All other skills untrained.

## Validation

- All six abilities assigned (method-specific ranges)
- Ancestry, class, background selected
- Class skill choices satisfied
- Name non-empty

## Automation

If `automationEnabled`:

- Auto-embed ancestry/class feature items on finish
- Re-run derivation on actor

If disabled:

- Same data written; GM may adjust sheet manually before marking complete
