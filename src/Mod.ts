import Mod from "@wayward/game/mod/Mod";
import { Quality } from "@wayward/game/game/IObject";
import type Tile from "@wayward/game/game/tile/Tile";  
import { IOverlayInfo, OverlayType } from "@wayward/game/game/tile/ITerrain";
import { EventHandler } from "@wayward/game/event/EventManager";
import { EventBus } from "@wayward/game/event/EventBuses";
import Register from "@wayward/game/mod/ModRegistry";
import { DialogId } from "@wayward/game/ui/screen/screens/game/Dialogs";
import Dialog from "@wayward/game/ui/screen/screens/game/component/Dialog";
import { ScreenId } from "@wayward/game/ui/screen/IScreen"; 
import { CheckButton } from "@wayward/game/ui/component/CheckButton";

/**
 * Custom dialog for Quality Highlighter information
 */
class QualityInfoDialog extends Dialog {
    private showHighlightingCheckbox: CheckButton;
    private modInstance?: QualityHighlighterMod;
    
    constructor(id: DialogId) {
        super(id);
        console.log("Quality Info Dialog constructor called!");
        
        // Set up event listeners
        this.event.subscribe("load", (host, initial: boolean) => {
            console.log("Dialog load event fired, initial:", initial);
            this.setupUI();
        });
    }
    
    public setModInstance(mod: QualityHighlighterMod): void {
        console.log("Setting mod instance on dialog, highlighting enabled:", mod.isHighlightingEnabled);
        this.modInstance = mod;
        // Update checkbox state if UI is already set up
        if (this.showHighlightingCheckbox) {
            console.log("Updating checkbox to:", mod.isHighlightingEnabled);
            this.showHighlightingCheckbox.setChecked(mod.isHighlightingEnabled);
        }
    }
    
    private setupUI(): void { 
        console.log("Setting up dialog UI, mod instance:", this.modInstance ? "exists" : "undefined");
        console.log("Initial highlighting state:", this.modInstance?.isHighlightingEnabled ?? "unknown");
        
        // Add checkbox for show highlighting
        this.showHighlightingCheckbox = new CheckButton();
        this.showHighlightingCheckbox.element.textContent = "Show Highlighting";
        this.showHighlightingCheckbox.setChecked(this.modInstance?.isHighlightingEnabled ?? true);
        
        // Add event handler for checkbox toggle
        this.showHighlightingCheckbox.event.subscribe("toggle", (host, checked: boolean) => {
            console.log("Checkbox toggle event - checked:", checked, "mod instance:", this.modInstance ? "exists" : "undefined");
            if (this.modInstance) {
                this.modInstance.setHighlightingEnabled(checked);
            } else {
                console.warn("No mod instance available when toggling checkbox!");
            }
        });
        
        this.body.append(this.showHighlightingCheckbox);
    }
    
    protected onShow(): void {
        // This will run when the dialog is shown
        console.log("Quality Info Dialog onShow called!");
    }
}

export default class QualityHighlighterMod extends Mod {
    @Register.dialog("QualityInfoDialog", {
        minResolution: { x: 300, y: 200 },
        size: { x: 0.3, y: 0.4 },
        edges: "center"
    }, QualityInfoDialog)
    public readonly qualityDialogId: DialogId;
    
    // State for whether highlighting is enabled
    public isHighlightingEnabled: boolean = true;
    
    /**
     * Initialize the mod and set up keyboard listener
     */
    public override onInitialize(): void {
        this.setupKeyboardListener();
    }

    /**
     * Setup keyboard event listener for 'p' key
     */
    private setupKeyboardListener(): void {
        // Add event listener for keydown events
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            // Check if 'p' key was pressed (case insensitive)
            if (event.code === 'KeyP' || event.key.toLowerCase() === 'p') {
                // Only trigger if no modifier keys are pressed
                if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
                    this.onPKeyPressed();
                }
            }
        });
    }

    /**
     * Function that runs when 'p' key is pressed - opens the Wayward dialog
     */
    private onPKeyPressed(): void {
        console.log("P key pressed! Toggling quality info dialog...");
        this.toggleQualityDialog();
    }

    /**
     * Toggle the quality info dialog
     */
    private toggleQualityDialog(): void {
        const gameScreen = ui.screens.get(ScreenId.Game);
        if (gameScreen) {
            // Check if dialog is already open
            const existingDialog = gameScreen.dialogs.get(this.qualityDialogId);
            const wasOpen = !!existingDialog;
            
            gameScreen.dialogs.toggle(this.qualityDialogId);
            
            // Only set mod instance if dialog was just opened (not closed)
            if (!wasOpen) {
                const dialog = gameScreen.dialogs.get(this.qualityDialogId);
                if (dialog && 'setModInstance' in dialog) {
                    (dialog as unknown as QualityInfoDialog).setModInstance(this);
                }
            }
        }
    }
    
    /**
     * Enable or disable highlighting
     */
    public setHighlightingEnabled(enabled: boolean): void {
        console.log("Setting highlighting enabled:", enabled);
        this.isHighlightingEnabled = enabled;
        
        if (!enabled) {
            // Clear all existing highlights when disabled
            this.clearAllHighlights();
        } else {
            // Re-scan when enabled
            this.scanVisibleTilesForQuality();
        }
    }
    
    /**
     * Clear all quality tile highlights
     */
    private clearAllHighlights(): void {
        for (const [, { tile, overlay }] of this.qualityTilesToHighlight) {
            tile.removeOverlay(overlay);
        }
        this.qualityTilesToHighlight.clear();
    }



    @EventHandler(EventBus.LocalPlayer, "postMove")
    protected onMove(): void {
        if (this.isHighlightingEnabled) {
            this.scanVisibleTilesForQuality();
        }
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
     * Remove overlays from tiles that no longer have quality > 1 or when highlighting is disabled
     */
    private cleanupInvalidQualityTiles(): void {
        const tilesToRemove: string[] = [];
        const playerZ = localPlayer.z;
        
        for (const [tileKey, { tile, overlay }] of this.qualityTilesToHighlight) {
            // Remove overlay if highlighting is disabled, tile is not on current z level, or no longer has quality
            if (!this.isHighlightingEnabled || tile.z !== playerZ || !tile.quality || tile.quality <= 1) {
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
        if (!this.isHighlightingEnabled) return; // Don't scan if highlighting is disabled
        
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
