---
name: local-foundry-playtest
description: >-
  Smoke-test Ash & Anvil on the developer's local Foundry VTT instance via browser
  automation. Use when asked to playtest, verify chargen, test system changes locally,
  or run docs/playtest-chargen-mvp.md against localhost Foundry.
---

# Local Foundry Playtest (Ash & Anvil)

## Prerequisites

1. Foundry must be **running** on the machine (default `http://localhost:30000`).
2. Read credentials from **`.cursor/local-foundry-test.json`** (gitignored). If missing, copy from `.cursor/local-foundry-test.example.json` and fill in the password.
3. Test world must use system **`ash-and-anvil`**.

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

Use `cursor-ide-browser` MCP tools:

1. `browser_navigate` → `{baseUrl}/join`
2. Snapshot the page. If login form appears, fill username/password and submit.
3. If user does not exist, stop and ask the human to create **`cursor-test-gm`** (Gamemaster) in Foundry Setup → Configuration → User Management, then retry.
4. From world join / setup, launch **`worldTitle`** (or match by `worldId`).
5. Wait for game load (sidebar visible, no fatal console errors).
6. Run checklist items from `docs/playtest-chargen-mvp.md`.

## Chargen smoke path (minimum)

1. Actors sidebar → Create Actor → **Character**
2. Open character sheet → **Build Character**
3. Step 0: select any ancestry → **Next**
4. Step 1: select class → **Next**
5. Step 2: select background → **Next**
6. Step 3: abilities (defaults OK for smoke test) → **Next**
7. Step 4: pick required class skills → **Next**
8. Step 5: **Finish**
9. Confirm sheet shows ancestry/class/background and no blocking errors.

Use `browser_snapshot` before each click. Prefer `data-action` buttons (`next`, `back`, `finish`, `openChargen`).

## Syncing dev system to local Foundry

Local install path (this machine):

`C:/Users/Drago/AppData/Local/FoundryVTT/Data/systems/ash-and-anvil`

After code changes, copy or symlink from repo root to that folder, then hard-refresh the world (Ctrl+Shift+R) or restart Foundry.

## Reporting

Return a short report:

- Foundry + system version observed
- Checklist pass/fail per section
- Console errors (if any)
- Screenshots for failures

File GitHub issues for regressions; do not include passwords in issues.
