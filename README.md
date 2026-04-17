# Quality Item Highlighter Mod for Wayward

A Wayward mod that highlights quality items with colorful visual effects to make them easier to spot during gameplay.

## Features

### Quality Colors
- **🔵 Blue** - Superior Quality items (Quality.Superior)
- **🟣 Purple** - Remarkable Quality items (Quality.Remarkable)
- **🟡 Gold** - Exceptional Quality items (Quality.Exceptional) *[Bonus]*
- **🟠 Orange** - Mastercrafted Quality items (Quality.Mastercrafted) *[Bonus]*
- **🔴 Red** - Relic Quality items (Quality.Relic) *[Bonus]*

### Visual Effects
- **Ground Items**: Colorful outlines and glowing effects around items on the ground
- **UI Items**: CSS-based highlighting for items in inventories and containers
- **Pulsing Animation**: Subtle pulsing effect to draw attention to quality items
- **Smart Detection**: Automatically detects when new quality items appear

## How It Works

### Ground Highlighting
The mod hooks into Wayward's rendering system to draw colored overlays around quality items on the world map. Items within a 16-tile radius of the player are scanned and highlighted with appropriate colors.

### UI Highlighting  
Quality items in the user interface (inventory, containers, etc.) receive CSS-based styling with colored borders and glowing effects.

### Performance
- Optimized rendering that only scans visible areas
- Error handling to prevent crashes
- Efficient caching of highlight data

## Installation

1. Copy the mod folder to your Wayward mods directory
2. Enable the mod in the Wayward Mod Manager
3. Start a new game or load an existing save

## Technical Details

### Events Used
- `WorldRenderer.renderOverlay` - For drawing ground item highlights
- `ItemManager.itemAdd` - For detecting new quality items
- `UiItemComponentStatic.update` - For UI highlighting updates

### Quality Detection
The mod checks `item.quality` against the following values:
- `Quality.Superior = 2` (Blue)
- `Quality.Remarkable = 3` (Purple)
- `Quality.Exceptional = 4` (Gold)
- `Quality.Mastercrafted = 5` (Orange)
- `Quality.Relic = 6` (Red)

## Compatibility

- **Wayward Version**: 2.15.4-beta and newer
- **Multiplayer**: Yes, client-side only
- **Save Compatibility**: Yes, can be added/removed without affecting saves

## Attribution

Created for the Wayward modding community. Uses the official Wayward API and follows the established modding patterns from the Wayward Types documentation.
