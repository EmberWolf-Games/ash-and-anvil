---
name: local-foundry-playtest
description: >-
  Smoke-test Ash & Anvil on the developer's local Foundry VTT instance in the browser.
  Use when asked to playtest, verify chargen, test system changes, or run docs/playtest-chargen-mvp.md.
  Pre-1.0: local browser only — do NOT use Forge unless the user explicitly requests it.
---

# Local Foundry Playtest (Ash & Anvil)

## Policy (pre-1.0)

**All QA runs on local Foundry in the browser until version 1.0.0.** Do not log into Forge, debug Forge modules, or treat Forge as the default test target. See `docs/testing.md`.

## Prerequisites

1. Foundry must be **running** locally (default `http://localhost:30000`).
2. Test in **browser**, not the Foundry desktop app (for automation).
3. Read credentials from **`.cursor/local-foundry-test.json`** (gitignored). If missing, copy from `.cursor/local-foundry-test.example.json`.
4. Test world must use system **`ash-and-anvil`**.

## Credentials file

Load `.cursor/local-foundry-test.json`:

| Field | Purpose |
|-------|---------|
| `baseUrl` | Foundry root URL |
| `worldId` / `worldTitle` | World to launch |
| `username` / `password` | Dedicated GM test account |
| `checklist` | Playtest doc path (default `docs/playtest-chargen-mvp.md`) |

**Never commit** `.cursor/local-foundry-test.json`. Do not echo passwords in chat or commits.

## Browser workflow

Use `cursor-ide-browser` MCP or Playwright script `.cursor/playtest-chargen.mjs`:

1. `browser_navigate` → `{baseUrl}/join`
2. Select test user from dropdown, enter password, join world **`worldTitle`**.
3. If user missing: ask human to create **`cursor-test-gm`** in Setup → User Management.
4. Wait for game load (sidebar visible, no fatal console errors).
5. Run checklist from `docs/playtest-chargen-mvp.md`.

## Chargen smoke path (minimum)

1. Actors sidebar → Create Actor → **Character**
2. Open sheet → **Build Character**
3. Ancestry → Class → Background → Abilities → Skills → Review → **Finish**
4. Confirm sheet shows ancestry/class/background, abilities, Edge, trained skills, embedded features.

Use `browser_snapshot` before clicks. Prefer `data-action` buttons (`next`, `back`, `finish`, `openChargen`).

## Syncing dev system to local Foundry

`C:/Users/Drago/AppData/Local/FoundryVTT/Data/systems/ash-and-anvil`

After code changes, copy or junction from repo root, then hard-refresh (Ctrl+Shift+R).

## Reporting

Return: Foundry + system version, checklist pass/fail, console errors, screenshots on failure. File GitHub issues without passwords.
