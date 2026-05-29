# Playtest Checklist — Character Creation MVP

**Environment:** Local Foundry in browser only (see [`testing.md`](testing.md)). Pre-1.0 — do not use Forge for this checklist.

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
- [ ] Release manifest installs into **local** Foundry (`releases/latest/download/system.json`).

## Notes

Record issues in GitHub with Foundry version, system version, profile, and stat method used.
