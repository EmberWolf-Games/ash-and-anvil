# Core Resolution (1st Edition)

## The check

```
d20 + abilityMod + skillBonus + otherBonuses >= Difficulty → success
```

- **Difficulty (DC):** Set by the DM (typical range 5–30).
- **Ability mod:** `floor((score - 10) / 2)`.
- **Skill bonus:** ability mod + proficiency (if trained) + situational modifiers.

## Boon and Bane

When circumstances help or hinder a roll:

| State | Effect |
|-------|--------|
| **Boon** | Roll 2d20, keep the **higher** |
| **Bane** | Roll 2d20, keep the **lower** |
| **Boon + Bane** | Cancel out; roll 1d20 |

Stacking: multiple Boons or Banes do not stack beyond one net Boon or Bane (GM may override for extreme situations).

## Natural 20 and 1

| Roll | Attack (future) | Check |
|------|-----------------|-------|
| **20** | Critical hit (combat milestone) | Automatic success if the roll could succeed |
| **1** | Automatic miss (combat milestone) | Automatic failure |

For checks, nat 20/1 do not bypass impossible DCs unless the GM rules otherwise.

## Proficiency (Edge)

Characters have an **Edge** bonus from training and experience:

| Level | Edge |
|-------|------|
| 1–4 | +2 |
| 5–8 | +3 |
| 9–12 | +4 |
| 13–16 | +5 |
| 17–20 | +6 |

Apply Edge when trained in a skill or when proficient with a save category (future).

## Six attributes

| Key | Name | Typical use |
|-----|------|-------------|
| `mgt` | Might | Force, melee power, intimidation through strength |
| `fin` | Finesse | Precision, reflexes, stealth, ranged accuracy |
| `res` | Resilience | Endurance, constitution, resisting harm |
| `ins` | Insight | Reasoning, memory, analysis |
| `foc` | Focus | Awareness, willpower, perception |
| `pre` | Presence | Charisma, leadership, performance |

Score range: 3–20 at level 1 (methods in `03-chargen-flow.md`). Mod derived as above.

## Skills (12)

| Key | Name | Ability |
|-----|------|---------|
| `athletics` | Athletics | Might |
| `agility` | Agility | Finesse |
| `stealth` | Stealth | Finesse |
| `endurance` | Endurance | Resilience |
| `lore` | Lore | Insight |
| `craft` | Craft | Insight |
| `awareness` | Awareness | Focus |
| `survival` | Survival | Focus |
| `resolve` | Resolve | Focus |
| `influence` | Influence | Presence |
| `deception` | Deception | Presence |
| `performance` | Performance | Presence |

**Trained:** character applies Edge to the skill. **Untrained:** ability mod only.

## Rules profiles (world setting)

| Profile | Edge at L1 | Notes |
|---------|------------|-------|
| `standard` | +2 | Default |
| `narrative` | +2 | Lower combat pressure (future); chargen unchanged |
| `gritty` | +2 | Fewer starting resources (chargen HP variant) |

## Magic

Not used in character-creation MVP. Arcane magic, psionics, and divine gifts are separate future subsystems.
