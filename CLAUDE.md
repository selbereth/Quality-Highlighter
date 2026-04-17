# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Compile TypeScript once
npm run build

# Compile and watch for changes
npm run watch

# Remove compiled output and build info
npm run clean
```

There are no tests in this project. The mod is tested by running it inside the Wayward game.

## Architecture

This is a **Wayward game mod** — a single-file TypeScript mod that compiles to `out/Mod.js`, which Wayward loads at runtime via `mod.json`. There is no test framework and no server; the compiled output is dropped into the game's mod directory.

### Key files

- `src/Mod.ts` — the entire mod implementation (one file)
- `mod.json` — mod metadata; `"file": "out/Mod"` tells Wayward where the compiled entry point is
- `lang/english.json` — localisation strings for dialog titles and action names
- `out/` — compiled JS/d.ts output (committed, since Wayward loads from here)

### How the mod works

`QualityHighlighterMod extends Mod` (from `@wayward/game`) and uses Wayward's decorator-based APIs:

- **`@Register.dialog`** — registers `QualityInfoDialog` (a custom `Dialog` subclass) with Wayward's dialog system, giving it a stable `DialogId`.
- **`@Mod.globalData` / `@Mod.saveData`** — auto-persisted data bags. `globalData` survives across all saves; `saveData` is per-save. Settings write to both so they persist globally but can be overridden per-save.
- **`@EventHandler(EventBus.LocalPlayer, "postMove")`** — fires `onMove()` each time the player moves. This is the main scan trigger: it calls `scanVisibleTilesForQuality()` and `cleanupInvalidQualityTiles()`.

### Highlighting pipeline

1. On each player move (and on `onInitialize`), `scanVisibleTilesForQuality()` iterates a `SCAN_RADIUS × SCAN_RADIUS` (default 16) grid around the player.
2. For each qualifying tile, an `IOverlayInfo` is created (`OverlayType.Full` for quality tiles, `OverlayType.QuestionMark` for ore/gem tiles) and applied via `tile.addOrUpdateOverlay(overlay)`.
3. Active overlays are tracked in `qualityTilesToHighlight: Map<string, { tile, overlay }>` keyed by `"x,y,z:type"` (types: `quality`, `ore`, `gem`, `doodad`).
4. `cleanupInvalidQualityTiles()` removes overlays from tiles that no longer qualify (player changed z-level, setting toggled off, item picked up, etc.).

### Settings / dialog

`QualityInfoDialog extends Dialog` renders `CheckButton` widgets for each toggle. It does not persist state itself — it calls setter methods on `QualityHighlighterMod` (e.g. `setHighlightingEnabled`, `setGemsEnabled`), which write to both data bags and trigger a re-scan. The dialog is opened/closed with the `H` key via a raw `document.addEventListener('keydown', …)` listener registered in `onInitialize`.

### Ore/terrain detection

Each ore type has a private `is*Terrain(TerrainType): boolean` method that checks the relevant `TerrainType` variants (e.g. `GraniteWithLimestone`, `SandstoneWithLimestone`, `BasaltWithLimestone`). Adding a new ore type means: adding a flag to `IQualityHighlighterSaveData`, a getter/setter pair, an `is*Terrain` helper, a checkbox in `QualityInfoDialog.setupUI`, and wiring the checkbox toggle to call the new setter.

### Wayward API notes

- `@wayward/types` provides all game type definitions; the actual game code runs inside Wayward at runtime.
- `tsconfig.json` extends `@wayward/types/tsconfig.mod.base.json` which sets strict mode and other mod-specific compiler options.
- `SCAN_RADIUS` is a public static — it can be changed at runtime from the browser console via `QualityHighlighterMod.SCAN_RADIUS = N`.
- The `window.tile1`–`window.tile5` assignments in `addPlusTilesToWindow()` are debug helpers exposing nearby tiles to the browser console; they are not functional features.
