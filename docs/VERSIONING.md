# Versioning

Ash & Anvil uses a **build version** scheme so pre-1.0 work does not race toward semver `1.0.0` before the system is release-ready.

## Format: `M.m.b.h`

| Segment | Meaning | Digits | Example |
|---------|---------|--------|---------|
| **M** | Major | 1–2 | `0` |
| **m** | Minor | 1–2 | `6` |
| **b** | Build | 1–3 | `1`, `12`, `100` |
| **h** | Hotfix | 1–3, optional `a`–`z` suffix | `2`, `100`, `2a` |

**Example:** `0.6.1.2` — major 0, minor 6, build 1, hotfix 2.

Segments are **not** zero-padded. Prefer the shortest valid form (`0.6.1.2`, not `0.6.001.002`).

### Bumping

| Change type | Bump |
|-------------|------|
| Hotfix / patch on current build | **h** (+1, or append letter for same hotfix slot) |
| New build on a minor line | **b** (+1), reset **h** to `0` |
| Feature milestone on a major line | **m** (+1), reset **b** and **h** |
| Breaking / edition milestone | **M** (+1), reset lower segments |

Always keep in sync:

- `system.json` → `"version"`
- `ash-and-anvil.mjs` → `CONFIG.ASH_ANVIL.keyVersion`

## Legacy semver

Tags like `v0.6.1` remain valid for older releases. CI accepts both schemes during migration. Comparison treats legacy `M.m.p` as `M.m.0.p`.

## Releases

On push to `main`, GitHub Actions reads `system.json`, validates the version, and publishes `v<version>` if that tag does not exist.

Manual validation:

```bash
node utils/release/validate-version.mjs 0.6.1.2
```

Local artifact build:

```bash
node utils/release/build-release.mjs 0.6.1.2
```
