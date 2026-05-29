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

Use this manifest when installing the system in Foundry (**Install System** → **Manifest URL**):

```
https://raw.githubusercontent.com/EmberWolf-Games/ash-and-anvil/main/system.json
```

### Development (clone + junction)

Foundry loads systems from:

`%LocalAppData%\FoundryVTT\Data\systems\ash-and-anvil\`

**Windows junction (recommended):**

```powershell
New-Item -ItemType Directory -Force -Path "$env:LOCALAPPDATA\FoundryVTT\Data\systems" | Out-Null
cmd /c mklink /J "%LOCALAPPDATA%\FoundryVTT\Data\systems\ash-and-anvil" "G:\Cursor_Projects\ash-and-anvil"
```

Replace the path on the right with your local clone directory. Then restart Foundry or refresh **Game Systems**, and create a world using **Ash & Anvil (1st Edition)**.

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
| **Rules Profile** | Baseline mode: `standard`, `narrative`, or `gritty` (hooks for future mechanics) |
| **Enable Automation** | Master switch for automated resolution |
| **Debug Rules Resolution** | Verbose logging while developing rules |

## Status

| Version | Notes |
|--------|--------|
| **0.1.0** | Scaffold: data models, Application V2 sheets, DM settings registry. Core D20 mechanics and automation are planned. |

## Contributing

This project is in early development. Issues and discussion are welcome on GitHub. Please do not submit content that infringes third-party RPG intellectual property.

## License

System **source code** in this repository is licensed under the [MIT License](LICENSE). Copyright © EmberWolf Games.

Rules text, setting lore, and artwork (when added) may be licensed separately; see repository releases and package documentation for content terms.
