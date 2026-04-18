# Quality Highlighter Mod for Wayward

A comprehensive Wayward mod that highlights quality tiles, items, terrain features, and more with colorful visual overlays to make valuable resources easier to spot during exploration.

## Features

### Quality Highlighting
- **🟢 Green** - Superior Quality tiles/items (Quality.Superior)
- **🔵 Blue** - Remarkable Quality tiles/items (Quality.Remarkable)  
- **🟣 Purple** - Exceptional Quality tiles/items (Quality.Exceptional)
- **🟠 Orange** - Mastercrafted Quality tiles/items (Quality.Mastercrafted)
- **🔴 Red** - Relic Quality tiles/items (Quality.Relic)

### Additional Highlighting Options
- **⚪ White Question Mark** - Gems on the ground (when enabled)
- **🟡 Yellow Question Mark** - Ore deposits in terrain (when enabled)
- **Quality Doodads** - Trees and plants with quality ratings (when enabled)
- **Civilization Items** - Toggle for highlighting civilization score items (optional)

### Terrain/Ore Detection
- Limestone deposits
- Talc deposits
- Iron ore veins
- Copper ore veins
- Tin ore deposits
- Coal deposits
- Niter deposits
- Gem deposits

## How It Works

### Tile Scanning
The mod automatically scans a 16-tile radius around the player and applies colored overlays to qualifying tiles. Scanning occurs whenever the player moves to a new tile.

### Visual Overlays
- **Full tile overlays** for quality tiles with semi-transparent colored backgrounds
- **Question mark overlays** for ore deposits and gems
- **Smart cleanup** removes overlays when moving between z-levels or when items are collected

### Settings Dialog
Press **H** to open the settings dialog where you can toggle various highlighting options on and off.

## Installation

1. Copy the mod folder to your Wayward mods directory
2. Enable the mod in the Wayward Mod Manager  
3. Start a new game or load an existing save
4. Press **H** to configure highlighting options

## Controls

- **H Key** - Open/close the mod settings dialog

## Technical Details

### Events Used
- `LocalPlayer.postMove` - Triggers scanning when the player moves
- Custom dialog system for mod configuration

### Quality Detection
The mod checks `tile.quality` and `doodad.quality` against these values:
- `Quality.Superior = 2` (Green overlay)
- `Quality.Remarkable = 3` (Blue overlay)  
- `Quality.Exceptional = 4` (Purple overlay)
- `Quality.Mastercrafted = 5` (Orange overlay)
- `Quality.Relic = 6` (Red overlay)

### Performance
- Scans 16-tile radius around player (configurable via `TileHighlighter.SCAN_RADIUS`)
- Efficient overlay management with automatic cleanup
- Only processes tiles when player moves
- Tracks active overlays to prevent duplicate rendering

## Compatibility

- **Wayward Version**: 2.15.4-beta and newer
- **Multiplayer**: Yes, client-side only  
- **Save Compatibility**: Yes, can be added/removed without affecting saves
- **Other Mods**: Should be compatible with most other mods

## Configuration Options

All settings can be toggled in the mod's settings dialog (press **H**):

- **Highlighting Enabled** - Master toggle for all highlighting
- **Civilization Items** - Include/exclude items with civilization scores
- **Limestone Tiles** - Highlight limestone terrain deposits
- **Talc Tiles** - Highlight talc terrain deposits  
- **Iron Tiles** - Highlight iron ore in terrain
- **Copper Tiles** - Highlight copper ore deposits
- **Tin Tiles** - Highlight tin ore deposits
- **Coal Tiles** - Highlight coal deposits in terrain
- **Niter Tiles** - Highlight niter/saltpeter deposits
- **Gems** - Highlight gems found on the ground
- **Plants and Trees** - Highlight doodads (trees/plants) with quality

## Attribution

Created for the Wayward modding community. Uses the official Wayward API and follows established modding patterns from the Wayward Types documentation.
