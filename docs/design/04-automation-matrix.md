# Automation Matrix (Chargen MVP)

| Behavior | Always | `automationEnabled` | `verboseLogging` / `debugRules` |
|----------|--------|---------------------|----------------------------------|
| Ability mod derivation | yes | — | log in debug |
| Edge / skill bonus display | yes | — | log in debug |
| HP max from class + Res | yes | — | log in debug |
| Initiative mod from Fin | yes | — | — |
| Chargen wizard apply | manual open | embed features on finish | log steps |
| d20 check helper (preview) | — | optional roll buttons (future) | log formula |
| Compendium seed on empty world | — | yes (GM only, once) | log | 

## Rules profile effects (chargen)

| Setting | standard | narrative | gritty |
|---------|----------|-----------|--------|
| Point buy | 27 | 28 | 25 |
| HP at L1 | die + Res | die + Res | die only |
| Edge | +2 | +2 | +2 |

## Settings keys

See `module/config/settings.mjs` and `module/rules/config.mjs`.
