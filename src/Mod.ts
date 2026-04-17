import Mod from "@wayward/game/mod/Mod";
import { Quality } from "@wayward/game/game/IObject";
import type Tile from "@wayward/game/game/tile/Tile";  
import { IOverlayInfo, OverlayType, TerrainType } from "@wayward/game/game/tile/ITerrain";
import { EventHandler } from "@wayward/game/event/EventManager";
import { EventBus } from "@wayward/game/event/EventBuses";

export default class QualityHighlighterMod extends Mod { 
    @EventHandler(EventBus.LocalPlayer, "postMove")
    protected onMove(): void {
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
 
//         const tile = island.getTileSafe(playerX - 1, playerY, playerZ); // West
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
    private createQualityOverlay(quality: Quality): IOverlayInfo {
        let red = 0, green = 0, blue = 0;
        
        switch (quality) {
            case Quality.Superior:
                green = 200; // Green
                break;
            case Quality.Remarkable:
                blue = 200; // Blue
                break;
            case Quality.Exceptional:
                red = 128; blue = 200; // Purple
                break;
            case Quality.Mastercrafted:
                red = 255; green = 165; // Orange
                break;
            case Quality.Relic:
                red = 200; // Red
                break;
            default:
                red = green = blue = 100; // Gray fallback
                break;
        }
        
        return {
            type: OverlayType.Full,
            red,
            green,
            blue,
            alpha: 100
        };
    }

    /**
     * Scan visible tiles around player for tiles with quality
     */
    private scanVisibleTilesForQuality(): void {
        const island = game.islands.active[0];
        if (!island) return;
 
        // const tilesX = 5
        // const tilesY = 5 
        // max visibility
        const tilesX = 33
        const tilesY = 33 
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
                    tilesFound++;
                    const overlay = this.createQualityOverlay(tile.quality);
                    this.qualityTilesToHighlight.set(tileKey, {
                        tile,
                        overlay
                    });
                    tile.addOrUpdateOverlay(overlay);
                }
            }
        }
        
    }

     private qualityTilesToHighlight = new Map<string, { tile: Tile; overlay: IOverlayInfo }>();
  
}
