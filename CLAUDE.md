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

This is a **Wayward game mod** — TypeScript source that compiles to `out/Mod.js`, which Wayward loads at runtime via `mod.json`. There is no test framework and no server; the compiled output is dropped into the game's mod directory.

### Key files

- `src/Mod.ts` — entry point (~80 lines); lifecycle hooks, dialog toggle, wires components together
- `src/IQualityHighlighterSaveData.ts` — save data type + `DEFAULTS` map; single source of truth for all setting keys and their defaults
- `src/ModSettings.ts` — abstract base class; handles `initializeSaveData`/`initializeGlobalData`, and generic `setting(key)` / `toggle(key, value)` used by the dialog
- `src/TerrainChecks.ts` — pure functions (`isLimestoneTerrain`, `isIronTerrain`, etc.) for each ore/gem terrain type
- `src/TileHighlighter.ts` — scan, cleanup, and overlay management
- `src/QualityInfoDialog.ts` — dialog UI driven by a `CHECKBOXES` data table
- `mod.json` — mod metadata; `"file": "out/Mod"` tells Wayward where the compiled entry point is
- `lang/english.json` — localisation strings for dialog titles and action names
- `out/` — compiled JS/d.ts output (committed, since Wayward loads from here)

### How the mod works

`QualityHighlighterMod extends ModSettings extends Mod` (from `@wayward/game`) and uses Wayward's decorator-based APIs:

- **`@Register.dialog`** — registers `QualityInfoDialog` (a custom `Dialog` subclass) with Wayward's dialog system, giving it a stable `DialogId`.
- **`@Mod.globalData` / `@Mod.saveData`** — auto-persisted data bags. `globalData` survives across all saves; `saveData` is per-save. Settings write to both so they persist globally but can be overridden per-save.
- **`@EventHandler(EventBus.LocalPlayer, "postMove")`** — fires `onMove()` each time the player moves. This is the main scan trigger: it calls `TileHighlighter.scan()` and `TileHighlighter.cleanup()`.

### Highlighting pipeline

1. On each player move (and on `onInitialize`), `TileHighlighter.scan()` iterates a `SCAN_RADIUS × SCAN_RADIUS` (default 16) grid around the player.
2. For each qualifying tile, an `IOverlayInfo` is created (`OverlayType.Full` for quality tiles, `OverlayType.QuestionMark` for ore/gem tiles) and applied via `tile.addOrUpdateOverlay(overlay)`.
3. Active overlays are tracked in `tracked: Map<string, { tile, overlay }>` keyed by `"x,y,z:type"` (types: `quality`, `ore`, `gem`, `doodad`).
4. `TileHighlighter.cleanup()` removes overlays from tiles that no longer qualify (player changed z-level, setting toggled off, item picked up, etc.).

### Settings / dialog

`QualityInfoDialog` renders a `CheckButton` per entry in the `CHECKBOXES` array. Toggling a checkbox calls `mod.toggle(key, value)` on `ModSettings`, which writes to both data bags and triggers a re-scan. The dialog is opened/closed with the `H` key via a raw `document.addEventListener('keydown', …)` listener registered in `onInitialize`.

### Ore/terrain detection

`TerrainChecks.ts` exports one pure function per ore type (e.g. `isLimestoneTerrain`, `isIronTerrain`). These are collected in `TERRAIN_CHECKS` inside `TileHighlighter.ts`, paired with their settings key, and iterated during scan and cleanup.

### Adding a new setting

1. Add the key + default to `DEFAULTS` in `IQualityHighlighterSaveData.ts`
2. Add a terrain check function to `TerrainChecks.ts` (if ore/gem) and wire it into `TERRAIN_CHECKS` in `TileHighlighter.ts`
3. Add one entry to `CHECKBOXES` in `QualityInfoDialog.ts`

### Wayward API notes

- `@wayward/types` provides all game type definitions; the actual game code runs inside Wayward at runtime.
- `tsconfig.json` extends `@wayward/types/tsconfig.mod.base.json` which sets strict mode and other mod-specific compiler options.
- `TileHighlighter.SCAN_RADIUS` is a public static — it can be changed at runtime from the browser console via `TileHighlighter.SCAN_RADIUS = N`.
- The `window.tile1`–`window.tile5` assignments in `addPlusTilesToWindow()` are debug helpers exposing nearby tiles to the browser console; they are not functional features.
