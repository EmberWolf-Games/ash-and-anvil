# Ash & Anvil (1st Edition)

[![Foundry v13](https://img.shields.io/badge/Foundry-v13-informational)](https://foundryvtt.com/)
[![License](https://img.shields.io/github/license/EmberWolf-Games/ash-and-anvil)](LICENSE)

**Ash & Anvil** is an original D20 fantasy roleplaying system for [Foundry Virtual Tabletop](https://foundryvtt.com/) **v13** (build **351+** recommended), developed by [EmberWolf Games](https://github.com/EmberWolf-Games).

This repository is the Foundry **game system package** (JavaScript, sheets, data models, and automation hooks). Rules text, setting lore, and art are original to EmberWolf Games and are not derived from D&D, Pathfinder, or other third-party RPGs.

## Requirements

- Foundry VTT **v13**, stable build **351** or newer
- Plain ES modules (no build step required for the current scaffold)

## Install

### Manifest URL (players / GMs)

Use this manifest when installing the system in Foundry (**Install System** → **Manifest URL**) or when publishing to the Forge Bazaar:

```
https://github.com/EmberWolf-Games/ash-and-anvil/releases/latest/download/system.json
```

That URL always points at the newest release. The manifest’s `download` field references the matching `ash-and-anvil.zip` on the same release.

### Development (clone + junction)

Foundry loads systems from:

`%LocalAppData%\FoundryVTT\Data\systems\ash-and-anvil\`

**Windows junction (recommended):**

```powershell
New-Item -ItemType Directory -Force -Path "$env:LOCALAPPDATA\FoundryVTT\Data\systems" | Out-Null
cmd /c mklink /J "%LOCALAPPDATA%\FoundryVTT\Data\systems\ash-and-anvil" "G:\Cursor_Projects\ash-and-anvil"
```

Replace the path on the right with your local clone directory. Then restart Foundry or refresh **Game Systems**, and create a world using **Ash & Anvil (1st Edition)**.

## Testing (pre-1.0)

Development QA runs on **local Foundry in the browser** only until **1.0.0** — not on Forge. See [`docs/testing.md`](docs/testing.md) and [`docs/playtest-chargen-mvp.md`](docs/playtest-chargen-mvp.md).

Quick smoke (Foundry running locally):

```bash
node .cursor/playtest-chargen.mjs
```

## Project layout

```
ash-and-anvil/
  system.json              # Package manifest (id must match folder name)
  ash-and-anvil.mjs        # Entry point
  module/
    config/                # World settings (DM switches)
    data/                  # TypeDataModel schemas
    documents/             # Actor / Item document classes
    sheets/                # Application V2 sheets
  templates/               # Handlebars templates
  styles/                  # System CSS
  lang/                    # i18n
  assets/                  # Icons and UI art
  packs/                   # Compendiums (future)
```

## World settings

Under **Configure Settings → Ash & Anvil**:

| Setting | Purpose |
|--------|---------|
| **Verbose Logging** | Detailed F12 console diagnostics (init, settings, pause overlay, etc.) |
| **Rules Profile** | Baseline mode: `standard`, `narrative`, or `gritty` (hooks for future mechanics) |
| **Enable Automation** | Master switch for automated resolution |
| **Debug Rules Resolution** | Extra `console.debug` output for rules resolution (also shown when verbose logging is on) |

## Status

Pre-1.0 development. Versioning uses the **build scheme** `M.m.b.h` (see [docs/VERSIONING.md](docs/VERSIONING.md)) so releases do not drift toward semver `1.0.0` before the system is ready.

| Version | Notes |
|--------|--------|
| **0.6.1.3** | Current dev build on `main`. Hotfix increments on each release. |

Core D20 mechanics and automation are in active development. |

## Releasing

Releases are built automatically by GitHub Actions (`.github/workflows/release.yml`) on every push to `main`.

1. Bump `"version"` in `system.json` (and `keyVersion` in `ash-and-anvil.mjs`) using `M.m.b.h` — see [docs/VERSIONING.md](docs/VERSIONING.md).
2. Commit and push to `main`.
3. The workflow validates the version, creates `v<version>` if it does not exist yet, and publishes assets.

If a tag for that version already exists, the workflow skips (no duplicate release).

Manual run: **Actions → Release → Run workflow** (optional version override).

The workflow uploads three assets to the GitHub Release:

| Asset | Purpose |
|-------|---------|
| `system.json` | Foundry / Forge manifest (`releases/latest/download/system.json`) |
| `ash-and-anvil.zip` | Installable system package |
| `ash-and-anvil-<version>-source.tar.gz` | Full source snapshot |

Validate a version locally:

```bash
node utils/release/validate-version.mjs 0.6.1.2
```

Build artifacts locally:

```bash
node utils/release/build-release.mjs 0.6.1.2
```

Output is written to `dist/release/`.

## Contributing

This project is in early development. Issues and discussion are welcome on GitHub. Please do not submit content that infringes third-party RPG intellectual property.

## License

System **source code** in this repository is licensed under the [MIT License](LICENSE). Copyright © EmberWolf Games.

Rules text, setting lore, and artwork (when added) may be licensed separately; see repository releases and package documentation for content terms.
