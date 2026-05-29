# Playtest Checklist — Character Creation MVP (v0.2.0)

## Setup

1. Install or link system from `main` / latest release **v0.2.0+**.
2. Create a new world on **Ash & Anvil (1st Edition)** with **automation enabled**.
3. Log in as **GM** first (seeds compendiums once).
4. Hard refresh browser (Ctrl+Shift+R).

## Compendium seed

- [ ] Sidebar → Compendiums → **Ancestries**, **Classes**, **Backgrounds**, **Features** each have 3+ entries (after GM load).
- [ ] Entries are original names (Ironbound, Vanguard, etc.).

## World settings

- [ ] Configure Settings → **Ash & Anvil** shows all options (verbose, rules profile, stat method, point buy, standard array, automation).
- [ ] Change **stat method** to point buy; note pool in chargen step 4.

## Character creation wizard

- [ ] Create Actor → **Character**.
- [ ] Open sheet → **Build Character** (banner visible if incomplete).
- [ ] Step through: Ancestry → Class → Background → Abilities → Skills → Review.
- [ ] Finish — no console errors.
- [ ] Sheet shows ancestry/class/background names, abilities, Edge, skill bonuses.
- [ ] HP max = class hit die + Resilience mod (Standard/Narrative) or die only (Gritty profile).
- [ ] Embedded feature items appear on actor when automation on.

## Player

- [ ] Player can run wizard on owned actor (if permissions allow).
- [ ] Sheet reflects trained skills with correct bonuses.

## Regression

- [ ] F12 banner displays **Ash & Anvil** ASCII art (no syntax errors).
- [ ] Pause overlay uses custom image at half size.
- [ ] `releases/latest/download/system.json` installs in Foundry.

## Notes

Record issues in GitHub with Foundry version, profile, and stat method used.
