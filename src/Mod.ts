import Mod from "@wayward/game/mod/Mod";
import { Quality } from "@wayward/game/game/IObject";
import type Tile from "@wayward/game/game/tile/Tile";  
import { IOverlayInfo, OverlayType } from "@wayward/game/game/tile/ITerrain";
import { EventHandler } from "@wayward/game/event/EventManager";
import { EventBus } from "@wayward/game/event/EventBuses";
import Register from "@wayward/game/mod/ModRegistry";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import { RangeInput } from "@wayward/game/ui/component/RangeInput";
import Component from "@wayward/game/ui/component/Component";
import { Heading } from "@wayward/game/ui/component/Text";
import Text from "@wayward/game/ui/component/Text";

export default class QualityHighlighterMod extends Mod { 
    // Settings properties
    public isEnabled = true;
    public scanRadius = 33; // Max scan radius in tiles
    public highlightSuperior = true; // Quality.Superior (green)
    public highlightRemarkable = true; // Quality.Remarkable (blue)
    public highlightExceptional = true; // Quality.Exceptional (purple)
    public highlightMastercrafted = false; // Quality.Mastercrafted (orange)
    public highlightRelic = false; // Quality.Relic (red)
    public overlayAlpha = 100; // Transparency of overlays

    /**
     * Register mod options in the Options menu
     */
    @Register.optionsSection
    protected onInitializeModOptions(component: Component): void {
        // Add heading
        new Heading()
            .appendTo(component);

        // Enable/Disable highlighting
        new CheckButton()
            .setChecked(this.isEnabled)
            .setRefreshMethod(() => this.isEnabled)
            .event.subscribe("toggle", (checkButton, checked) => {
                this.isEnabled = checked;
            })
            .appendTo(component);

        // Scan radius setting
        new Text()
            .appendTo(component);
        
        new RangeInput()
            .setMin(5)
            .setMax(50)
            .setStep(2)
            .refresh()
            .setRefreshMethod(() => this.scanRadius)
            .event.subscribe("finish", (rangeInput, value) => {
                this.scanRadius = value;
            })
            .appendTo(component);

        // Quality level checkboxes
        new CheckButton()
            .setChecked(this.highlightSuperior)
            .setRefreshMethod(() => this.highlightSuperior)
            .event.subscribe("toggle", (checkButton, checked) => {
                this.highlightSuperior = checked;
            })
            .appendTo(component);

        new CheckButton()
            .setChecked(this.highlightRemarkable)
            .setRefreshMethod(() => this.highlightRemarkable)
            .event.subscribe("toggle", (checkButton, checked) => {
                this.highlightRemarkable = checked;
            })
            .appendTo(component);

        new CheckButton()
            .setChecked(this.highlightExceptional)
            .setRefreshMethod(() => this.highlightExceptional)
            .event.subscribe("toggle", (checkButton, checked) => {
                this.highlightExceptional = checked;
            })
            .appendTo(component);

        new CheckButton()
            .setChecked(this.highlightMastercrafted)
            .setRefreshMethod(() => this.highlightMastercrafted)
            .event.subscribe("toggle", (checkButton, checked) => {
                this.highlightMastercrafted = checked;
            })
            .appendTo(component);

        new CheckButton()
            .setChecked(this.highlightRelic)
            .setRefreshMethod(() => this.highlightRelic)
            .event.subscribe("toggle", (checkButton, checked) => {
                this.highlightRelic = checked;
            })
            .appendTo(component);

        // Overlay alpha/transparency setting
        new Text()
            .appendTo(component);
        
        new RangeInput()
            .setMin(20)
            .setMax(255)
            .setStep(10)
            .refresh()
            .setRefreshMethod(() => this.overlayAlpha)
            .event.subscribe("finish", (rangeInput, value) => {
                this.overlayAlpha = value;
                // Re-apply overlays with new transparency
                this.refreshAllOverlays();
            })
            .appendTo(component);
    } 
    @EventHandler(EventBus.LocalPlayer, "postMove")
    protected onMove(): void {
        if (!this.isEnabled) return; // Check if highlighting is enabled
        this.scanVisibleTilesForQuality();
        this.cleanupInvalidQualityTiles();
        this.addPlusTilesToWindow();
    } 

    /**
     * Add tiles in plus format around player to window object
     */
    private addPlusTilesToWindow(): void {
        const island = game.islands.active[0];
        if (!island) return;

        const playerX = localPlayer.x;
        const playerY = localPlayer.y;
        const playerZ = localPlayer.z;

        // Get tiles in plus format: center, north, south, east, west
        (window as any).tile1 = island.getTileSafe(playerX, playerY, playerZ); // Center
        (window as any).tile2 = island.getTileSafe(playerX, playerY - 1, playerZ); // North
        (window as any).tile3 = island.getTileSafe(playerX, playerY + 1, playerZ); // South
        (window as any).tile4 = island.getTileSafe(playerX + 1, playerY, playerZ); // East
        (window as any).tile5 = island.getTileSafe(playerX - 1, playerY, playerZ); // West
 
        // const tile = island.getTileSafe(playerX - 1, playerY, playerZ); // West
//  tile?.type = TerrainType.BasaltWithLimestone
//  tile?.type = TerrainType.GraniteWithLimestone
//  tile?.type = TerrainType.SandstoneWithLimestone
//  tile?.type = TerrainType.BasaltWithIron
//  tile?.type = TerrainType.basalt
//  tile?.type = TerrainType.SandstoneWithLimestone
//  tile?.type = TerrainType.SandstoneWithLimestone
//  tile?.type = TerrainType.SandstoneWithLimestone


    } 

    /**
     * Remove overlays from tiles that no longer have quality > 1
     */
    private cleanupInvalidQualityTiles(): void {
        const tilesToRemove: string[] = [];
        const playerZ = localPlayer.z;
        
        for (const [tileKey, { tile, overlay }] of this.qualityTilesToHighlight) {
            // Remove overlay if tile is not on current z level or no longer has quality
            if (tile.z !== playerZ || !tile.quality || tile.quality <= 1) {
                tile.removeOverlay(overlay);
                tilesToRemove.push(tileKey);
            }
        }
        
        // Remove invalid tiles from our tracking map
        for (const tileKey of tilesToRemove) {
            this.qualityTilesToHighlight.delete(tileKey);
        }
    }

    /**
     * Create overlay info based on item quality
     */
    private createQualityOverlay(quality: Quality): IOverlayInfo | null {
        let red = 0, green = 0, blue = 0;
        
        switch (quality) {
            case Quality.Superior:
                if (!this.highlightSuperior) return null;
                green = 200; // Green
                break;
            case Quality.Remarkable:
                if (!this.highlightRemarkable) return null;
                blue = 200; // Blue
                break;
            case Quality.Exceptional:
                if (!this.highlightExceptional) return null;
                red = 128; blue = 200; // Purple
                break;
            case Quality.Mastercrafted:
                if (!this.highlightMastercrafted) return null;
                red = 255; green = 165; // Orange
                break;
            case Quality.Relic:
                if (!this.highlightRelic) return null;
                red = 200; // Red
                break;
            default:
                return null; // Don't highlight unknown qualities
        }
        
        return {
            type: OverlayType.Full,
            red,
            green,
            blue,
            alpha: this.overlayAlpha
        };
    }

    /**
     * Scan visible tiles around player for tiles with quality
     */
    private scanVisibleTilesForQuality(): void {
        const island = game.islands.active[0];
        if (!island) return;
 
        const tilesX = this.scanRadius;
        const tilesY = this.scanRadius;
        const centerX = localPlayer.x;
        const centerY = localPlayer.y;
        const z = localPlayer.z;
        
        let tilesFound = 0;
        
        for (let x = centerX - Math.floor(tilesX / 2); x <= centerX + Math.floor(tilesX / 2); x++) {
            for (let y = centerY - Math.floor(tilesY / 2); y <= centerY + Math.floor(tilesY / 2); y++) {
                const tile = island.getTileSafe(x, y, z);
                if (!tile || tile.quality === undefined || tile.quality === 0) continue;
                
                const tileKey = `${x},${y},${z}`;
                // Only apply overlay if we haven't already highlighted this tile
                if (!this.qualityTilesToHighlight.has(tileKey)) {
                    const overlay = this.createQualityOverlay(tile.quality);
                    if (overlay) { // Only highlight if overlay was created (quality is enabled)
                        tilesFound++;
                        this.qualityTilesToHighlight.set(tileKey, {
                            tile,
                            overlay
                        });
                        tile.addOrUpdateOverlay(overlay);
                    }
                }
            }
        }
        
    }

     private qualityTilesToHighlight = new Map<string, { tile: Tile; overlay: IOverlayInfo }>();

    /**
     * Refresh all overlays with current settings (called when transparency changes)
     */
    private refreshAllOverlays(): void {
        for (const [tileKey, { tile, overlay }] of this.qualityTilesToHighlight) {
            if (tile.quality) {
                const newOverlay = this.createQualityOverlay(tile.quality);
                if (newOverlay) {
                    // Update the stored overlay and refresh the tile
                    this.qualityTilesToHighlight.set(tileKey, { tile, overlay: newOverlay });
                    tile.addOrUpdateOverlay(newOverlay);
                } else {
                    // Quality type is now disabled, remove the overlay
                    tile.removeOverlay(overlay);
                    this.qualityTilesToHighlight.delete(tileKey);
                }
            }
        }
    }
  
}
