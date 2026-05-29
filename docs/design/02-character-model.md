# Character Model (Level 1)

## Actor type: `character`

### Attributes

| Field | Description |
|-------|-------------|
| `level` | Always 1 in MVP |
| `health.value` / `health.max` | Current and maximum hit points |
| `health.temp` | Temporary HP (future) |
| `initiative.mod` | Initiative modifier (Fin mod + bonuses) |

### Abilities

Six scores (`mgt`, `fin`, `res`, `ins`, `foc`, `pre`) with derived `mod`.

### Skills

Map of 12 skills, each:

| Field | Description |
|-------|-------------|
| `trained` | boolean |
| `bonus` | derived on sheet (not stored) |

### Proficiency

| Field | Description |
|-------|-------------|
| `edge` | Derived from level (Edge bonus) |

### Details

| Field | Description |
|-------|-------------|
| `ancestryId` | UUID of ancestry Item |
| `classId` | UUID of class Item |
| `backgroundId` | UUID of background Item |
| `biography` | HTML |

### Chargen

| Field | Description |
|-------|-------------|
| `buildComplete` | false until wizard finishes |
| `buildVersion` | matches system version when built |

## Item types

### `ancestry`

- Size, speed
- Ability adjustments (+1 etc.)
- Granted feature item IDs or embedded features

### `class`

- Hit die (d8, d10, …)
- Skill choice count + skill pool
- Level-1 feature references

### `background`

- Fixed skill trainings
- Starter gear notes (text or item links)

### `feature`

- Rules description (HTML)
- Mechanical tags (future Active Effects)

## Hit points at level 1

```
maxHP = classHitDie + resilienceMod
```

Minimum 1 HP. Gritty profile: no +mod to HP at level 1 (class die only).

## Embedded items

On chargen completion, ancestry/class/background **feature** items are embedded on the actor for quick sheet access.
