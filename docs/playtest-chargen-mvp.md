# Playtest Checklist — Character Creation MVP

**Environment:** Local Foundry in browser only (see [`testing.md`](testing.md)). Pre-1.0 — do not use Forge for this checklist.

**System version:** 0.4.0+

## Setup

1. Link or copy system from repo into `%LocalAppData%\FoundryVTT\Data\systems\ash-and-anvil\` (or install latest release into local Foundry).
2. Open Foundry in **browser** at `http://localhost:30000`.
3. Launch test world **Ash and Anvil Test** on **Ash & Anvil (1st Edition)** with **automation enabled**.
4. Log in as **GM** first (seeds compendiums once).
5. Hard refresh browser (Ctrl+Shift+R).

Automated smoke (optional): `node .cursor/playtest-chargen.mjs`

## Compendium seed

- [ ] Sidebar → Compendiums → **Ancestries**, **Classes**, **Backgrounds**, **Features** each have 3+ entries (after GM load).
- [ ] Entries are original names (Ironbound, Vanguard, etc.).

## World settings

- [ ] Configure Settings → **Ash & Anvil** shows all options (verbose, rules profile, stat method, point buy, standard array, automation, **currency name**, **currency denominations JSON**).
- [ ] Change **stat method** to point buy; note pool in chargen step 4.

## Character creation wizard

- [ ] Create Actor → **Character**.
- [ ] Open sheet → **Build Character** (banner visible if incomplete).
- [ ] Step through: Ancestry → Class → Background → Abilities → Skills → Review.
- [ ] Finish — no console errors.
- [ ] Sheet **Details** tab: six abilities (MGT/AGI/VIT/MND/INS/CHA), saves, AC, skills with ranks, primary class level 1, total level 1.
- [ ] HP max = class hit die + Vitality mod at level 1 (Standard/Narrative) or die only (Gritty profile).
- [ ] Embedded feature items appear on actor when automation on.

## Character sheet tabs (0.4.0)

- [ ] **Details** — identity, abilities, saves, skills, proficiencies, vitals, heritage.
- [ ] **Equipment** — mannequin slots; drag gear to slot; unequip works.
## Inventory tab (0.6.1.8+)

- [ ] **Inventory** — two-column layout; currency delta (`+10` / absolute); encumbrance weight current/max with yellow/red icons
- [ ] **Encumbrance** — walk speed derived from base walk; attack bane at encumbered / double bane when heavily encumbered
- [ ] **Containers** — left-rail navigation; capacity hard block; equipped backpack pinned when in backpack slot
- [ ] **HP delta** — Details tab and token HUD adjust field (`+5` / absolute)
- [ ] Drag gear to container / on person; over-max weight blocked on pickup
- [ ] **Features** — build blocks + ancestry feature tiers (1/5/10/15).
- [ ] **Powers** — spellcasting / psionics / divine gifts sub-tabs.
- [ ] **Effects** — active / passive sub-tabs.
- [ ] **Biography** — identity and prose fields.

## Player

- [ ] Player can run wizard on owned actor (if permissions allow).
- [ ] Sheet reflects skill ranks with correct derived bonuses.

## Regression

- [ ] F12 banner displays **Ash & Anvil** ASCII art (no syntax errors).
- [ ] Pause overlay uses custom image at half size.
- [ ] Release manifest installs into **local** Foundry (`releases/latest/download/system.json`).

## Notes

Record issues in GitHub with Foundry version, system version, profile, and stat method used.
