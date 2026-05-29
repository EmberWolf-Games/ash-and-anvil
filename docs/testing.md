# Testing policy (pre-1.0)

Until **Ash & Anvil 1.0.0**, all development and QA testing runs against a **local Foundry VTT install in the browser**. The Forge hosting environment is **not** used for day-to-day testing.

## Target environment

| Item | Value |
|------|--------|
| Foundry | Local install, accessed in **browser** (not the desktop app for automation) |
| Default URL | `http://localhost:30000` |
| System path | `%LocalAppData%\FoundryVTT\Data\systems\ash-and-anvil\` |
| Test world | **Ash and Anvil Test** (`test-world`) |
| Test GM | `cursor-test-gm` (credentials in `.cursor/local-foundry-test.json`) |

## Workflow

1. **Link or copy** the repo into Foundry’s `Data/systems/ash-and-anvil/` (junction recommended — see README).
2. **Start Foundry** and open the test world in your browser.
3. After code changes, **sync** the system folder and **hard refresh** (Ctrl+Shift+R).
4. Run manual checks from [`playtest-chargen-mvp.md`](playtest-chargen-mvp.md) or automated smoke via:

   ```bash
   node .cursor/playtest-chargen.mjs
   ```

   (Requires Foundry running and credentials file present.)

5. Record issues on GitHub with Foundry version, system version, rules profile, and stat method.

## Agent / Cursor testing

Agents should read:

- `.cursor/skills/local-foundry-playtest/SKILL.md`
- `.cursor/local-foundry-test.json` (gitignored; copy from `.cursor/local-foundry-test.example.json`)

Do **not** attempt Forge login or Forge-specific debugging unless the user explicitly requests a pre-1.0 Forge smoke test.

## When Forge returns

At **1.0.0**, re-enable Forge as a release validation target:

- Install from `releases/latest/download/system.json`
- Verify compendium seed, chargen, and regression items on a hosted world
- Update this document to describe both local and Forge QA

Distribution via Forge Bazaar remains supported for releases; only **active QA** is local-only before 1.0.
