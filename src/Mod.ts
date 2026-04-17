import Mod from "@wayward/game/mod/Mod";
import { Quality } from "@wayward/game/game/IObject";
import type Tile from "@wayward/game/game/tile/Tile";  
import { IOverlayInfo, OverlayType, TerrainType } from "@wayward/game/game/tile/ITerrain";
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
    private includeCivilizationCheckbox: CheckButton;
    private includeOresCheckbox: CheckButton;
    private includeTalcCheckbox: CheckButton;
    private includeTopazCheckbox: CheckButton;
    private includeIronCheckbox: CheckButton;
    private includeCopperCheckbox: CheckButton;
    private includeTinCheckbox: CheckButton;
    private modInstance?: QualityHighlighterMod;
    
    constructor(id: DialogId) {
        super(id);
        
        // Set up event listeners
        this.event.subscribe("load", (host, initial: boolean) => {
            this.setupUI();
        });
    }
    
    public setModInstance(mod: QualityHighlighterMod): void {
        this.modInstance = mod;
        // Update checkbox states if UI is already set up
        if (this.showHighlightingCheckbox) {
            this.showHighlightingCheckbox.setChecked(mod.isHighlightingEnabled);
        }
        if (this.includeCivilizationCheckbox) {
            this.includeCivilizationCheckbox.setChecked(mod.includeCivilizationItems);
        }
        if (this.includeOresCheckbox) {
            this.includeOresCheckbox.setChecked(mod.includeOresTiles);
        }
        if (this.includeTalcCheckbox) {
            this.includeTalcCheckbox.setChecked(mod.includeTalcTiles);
        }
        if (this.includeTopazCheckbox) {
            this.includeTopazCheckbox.setChecked(mod.includeTopazTiles);
        }
        if (this.includeIronCheckbox) {
            this.includeIronCheckbox.setChecked(mod.includeIronTiles);
        }
        if (this.includeCopperCheckbox) {
            this.includeCopperCheckbox.setChecked(mod.includeCopperTiles);
        }
        if (this.includeTinCheckbox) {
            this.includeTinCheckbox.setChecked(mod.includeTinTiles);
        }
    }
    
    private setupUI(): void { 
        // Add checkbox for show highlighting
        this.showHighlightingCheckbox = new CheckButton();
        this.showHighlightingCheckbox.element.textContent = "Show Highlighting";
        this.showHighlightingCheckbox.setChecked(this.modInstance?.isHighlightingEnabled ?? true);
        
        // Add event handler for checkbox toggle
        this.showHighlightingCheckbox.event.subscribe("toggle", (checkButton:CheckButton) => {
            if (this.modInstance) {
                this.modInstance.setHighlightingEnabled(checkButton.checked);
            }
        });
        
        // Add checkbox for civilization items
        this.includeCivilizationCheckbox = new CheckButton();
        this.includeCivilizationCheckbox.element.textContent = "Include Civilization Items";
        this.includeCivilizationCheckbox.setChecked(this.modInstance?.includeCivilizationItems ?? false);
        
        // Add event handler for civilization checkbox toggle
        this.includeCivilizationCheckbox.event.subscribe("toggle", (checkButton:CheckButton) => {
            if (this.modInstance) {
                this.modInstance.setCivilizationItemsEnabled(checkButton.checked);
            }
        });
        
        // Add checkbox for ores tiles
        this.includeOresCheckbox = new CheckButton();
        this.includeOresCheckbox.element.textContent = "Include Limestone Tiles";
        this.includeOresCheckbox.setChecked(this.modInstance?.includeOresTiles ?? false);
        
        // Add event handler for ores checkbox toggle
        this.includeOresCheckbox.event.subscribe("toggle", (checkButton:CheckButton) => {
            if (this.modInstance) {
                this.modInstance.setOresTilesEnabled(checkButton.checked);
            }
        });
        
        // Add checkbox for talc tiles
        this.includeTalcCheckbox = new CheckButton();
        this.includeTalcCheckbox.element.textContent = "Include Talc Tiles";
        this.includeTalcCheckbox.setChecked(this.modInstance?.includeTalcTiles ?? false);
        
        // Add event handler for talc checkbox toggle
        this.includeTalcCheckbox.event.subscribe("toggle", (checkButton:CheckButton) => {
            if (this.modInstance) {
                this.modInstance.setTalcTilesEnabled(checkButton.checked);
            }
        });
        
        // Add checkbox for topaz tiles
        this.includeTopazCheckbox = new CheckButton();
        this.includeTopazCheckbox.element.textContent = "Include Topaz Tiles";
        this.includeTopazCheckbox.setChecked(this.modInstance?.includeTopazTiles ?? false);
        
        // Add event handler for topaz checkbox toggle
        this.includeTopazCheckbox.event.subscribe("toggle", (checkButton:CheckButton) => {
            if (this.modInstance) {
                this.modInstance.setTopazTilesEnabled(checkButton.checked);
            }
        });
        
        // Add checkbox for iron tiles
        this.includeIronCheckbox = new CheckButton();
        this.includeIronCheckbox.element.textContent = "Include Iron Tiles";
        this.includeIronCheckbox.setChecked(this.modInstance?.includeIronTiles ?? false);
        
        // Add event handler for iron checkbox toggle
        this.includeIronCheckbox.event.subscribe("toggle", (checkButton:CheckButton) => {
            if (this.modInstance) {
                this.modInstance.setIronTilesEnabled(checkButton.checked);
            }
        });
        
        // Add checkbox for copper tiles
        this.includeCopperCheckbox = new CheckButton();
        this.includeCopperCheckbox.element.textContent = "Include Copper Tiles";
        this.includeCopperCheckbox.setChecked(this.modInstance?.includeCopperTiles ?? false);
        
        // Add event handler for copper checkbox toggle
        this.includeCopperCheckbox.event.subscribe("toggle", (checkButton:CheckButton) => {
            if (this.modInstance) {
                this.modInstance.setCopperTilesEnabled(checkButton.checked);
            }
        });
        
        // Add checkbox for tin tiles
        this.includeTinCheckbox = new CheckButton();
        this.includeTinCheckbox.element.textContent = "Include Tin Tiles";
        this.includeTinCheckbox.setChecked(this.modInstance?.includeTinTiles ?? false);
        
        // Add event handler for tin checkbox toggle
        this.includeTinCheckbox.event.subscribe("toggle", (checkButton:CheckButton) => {
            if (this.modInstance) {
                this.modInstance.setTinTilesEnabled(checkButton.checked);
            }
        });
        
        this.body.append(this.showHighlightingCheckbox);
        this.body.append(this.includeCivilizationCheckbox);
        this.body.append(this.includeOresCheckbox);
        this.body.append(this.includeTalcCheckbox);
        this.body.append(this.includeTopazCheckbox);
        this.body.append(this.includeIronCheckbox);
        this.body.append(this.includeCopperCheckbox);
        this.body.append(this.includeTinCheckbox);
    } 
    
}

export default class QualityHighlighterMod extends Mod {

    @Register.dialog("QualityInfoDialog", {
        minResolution: { x: 300, y: 400 },
        size: { x: 0.35, y: 0.6 },
        edges: "center",
        saveOpen: false
    }, QualityInfoDialog)
    public readonly qualityDialogId: DialogId;


    
    // State for whether highlighting is enabled
    public isHighlightingEnabled: boolean = true;
    // State for whether to include civilization items
    public includeCivilizationItems: boolean = false;
    // State for whether to include ores tiles
    public includeOresTiles: boolean = false;
    // State for whether to include talc tiles
    public includeTalcTiles: boolean = false;
    // State for whether to include topaz tiles
    public includeTopazTiles: boolean = false;
    // State for whether to include iron tiles
    public includeIronTiles: boolean = false;
    // State for whether to include copper tiles
    public includeCopperTiles: boolean = false;
    // State for whether to include tin tiles
    public includeTinTiles: boolean = false;
    
    /**
     * Initialize the mod and set up keyboard listener
     */
    public override onInitialize(): void {
        this.setupKeyboardListener();
    }

    /**
     * Setup keyboard event listener for 'h' key
     */
    private setupKeyboardListener(): void {
        // Add event listener for keydown events
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            // Check if 'h' key was pressed (case insensitive)
            if (event.code === 'KeyH' || event.key.toLowerCase() === 'h') {
                // Only trigger if no modifier keys are pressed
                if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
                    this.toggleQualityDialog();
                }
            }
        });
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
     * Enable or disable civilization items highlighting
     */
    public setCivilizationItemsEnabled(enabled: boolean): void {
        this.includeCivilizationItems = enabled;
        
        // Re-scan tiles when setting changes
        if (this.isHighlightingEnabled) {
            this.clearAllHighlights();
            this.scanVisibleTilesForQuality();
        }
    }
    
    /**
     * Enable or disable ores tiles highlighting
     */
    public setOresTilesEnabled(enabled: boolean): void {
        this.includeOresTiles = enabled;
        
        // Re-scan tiles when setting changes
        if (this.isHighlightingEnabled) {
            this.clearAllHighlights();
            this.scanVisibleTilesForQuality();
        }
    }
    
    /**
     * Enable or disable talc tiles highlighting
     */
    public setTalcTilesEnabled(enabled: boolean): void {
        this.includeTalcTiles = enabled;
        
        // Re-scan tiles when setting changes
        if (this.isHighlightingEnabled) {
            this.clearAllHighlights();
            this.scanVisibleTilesForQuality();
        }
    }
    
    /**
     * Enable or disable topaz tiles highlighting
     */
    public setTopazTilesEnabled(enabled: boolean): void {
        this.includeTopazTiles = enabled;
        
        // Re-scan tiles when setting changes
        if (this.isHighlightingEnabled) {
            this.clearAllHighlights();
            this.scanVisibleTilesForQuality();
        }
    }
    
    /**
     * Enable or disable iron tiles highlighting
     */
    public setIronTilesEnabled(enabled: boolean): void {
        this.includeIronTiles = enabled;
        
        // Re-scan tiles when setting changes
        if (this.isHighlightingEnabled) {
            this.clearAllHighlights();
            this.scanVisibleTilesForQuality();
        }
    }
    
    /**
     * Enable or disable copper tiles highlighting
     */
    public setCopperTilesEnabled(enabled: boolean): void {
        this.includeCopperTiles = enabled;
        
        // Re-scan tiles when setting changes
        if (this.isHighlightingEnabled) {
            this.clearAllHighlights();
            this.scanVisibleTilesForQuality();
        }
    }
    
    /**
     * Enable or disable tin tiles highlighting
     */
    public setTinTilesEnabled(enabled: boolean): void {
        this.includeTinTiles = enabled;
        
        // Re-scan tiles when setting changes
        if (this.isHighlightingEnabled) {
            this.clearAllHighlights();
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
     * Remove overlays from tiles that no longer qualify for highlighting
     */
    private cleanupInvalidQualityTiles(): void {
        const tilesToRemove: string[] = [];
        const playerZ = localPlayer.z;
        
        for (const [tileKey, { tile, overlay }] of this.qualityTilesToHighlight) {
            const isQualityKey = tileKey.endsWith(':quality');
            const isOreKey = tileKey.endsWith(':ore');
            
            // Check if tile still qualifies for highlighting
            const hasQuality = tile.quality !== undefined && tile.quality > 0;
            const isOresTile = (this.includeOresTiles && this.isOresTerrain(tile.type)) ||
                (this.includeTalcTiles && this.isTalcTerrain(tile.type)) ||
                (this.includeTopazTiles && this.isTopazTerrain(tile.type)) ||
                (this.includeIronTiles && this.isIronTerrain(tile.type)) ||
                (this.includeCopperTiles && this.isCopperTerrain(tile.type)) ||
                (this.includeTinTiles && this.isTinTerrain(tile.type));
            
            let shouldRemove = false;
            
            // Check if on wrong Z level or highlighting disabled
            if (!this.isHighlightingEnabled || tile.z !== playerZ) {
                shouldRemove = true;
            }
            // Check quality overlay validity
            else if (isQualityKey) {
                const isCivilizationItem = tile.description?.civilizationScore && tile.description.civilizationScore > 0;
                const shouldShowCivilization = this.includeCivilizationItems || !isCivilizationItem;
                if (!hasQuality || !shouldShowCivilization) {
                    shouldRemove = true;
                }
            }
            // Check ore overlay validity  
            else if (isOreKey) {
                if (!isOresTile) {
                    shouldRemove = true;
                }
            }
            
            if (shouldRemove) {
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
     * Create overlay info for ores tiles
     */
    private createOresOverlay(): IOverlayInfo {
        return {
            type: OverlayType.QuestionMark,
            // yellow for ores
            red: 255,
            green: 255, 
            blue: 0,
            alpha: 200
        };
    }

    /**
     * Scan visible tiles around player for tiles with quality or ores
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
                if (!tile) continue;
                
                // Check if tile has quality
                const hasQuality = tile.quality !== undefined && tile.quality > 0;
                
                // Check if it's an ore tile (if any ore type is enabled)
                const isOresTile = (this.includeOresTiles && this.isOresTerrain(tile.type)) ||
                    (this.includeTalcTiles && this.isTalcTerrain(tile.type)) ||
                    (this.includeTopazTiles && this.isTopazTerrain(tile.type)) ||
                    (this.includeIronTiles && this.isIronTerrain(tile.type)) ||
                    (this.includeCopperTiles && this.isCopperTerrain(tile.type)) ||
                    (this.includeTinTiles && this.isTinTerrain(tile.type));
                
                // Skip if neither quality nor ores
                if (!hasQuality && !isOresTile) continue;
                
                // If civilization items are enabled, check if it's a civilization item
                const isCivilizationItem = hasQuality && tile.description?.civilizationScore && tile.description.civilizationScore > 0;
                
                // Handle quality overlay
                if (hasQuality && (this.includeCivilizationItems || !isCivilizationItem)) {
                    const qualityTileKey = `${x},${y},${z}:quality`;
                    if (!this.qualityTilesToHighlight.has(qualityTileKey)) {
                        tilesFound++;
                        const overlay = this.createQualityOverlay(tile.quality!);
                        this.qualityTilesToHighlight.set(qualityTileKey, {
                            tile,
                            overlay
                        });
                        tile.addOrUpdateOverlay(overlay);
                    }
                }
                
                // Handle ore overlay
                if (isOresTile) {
                    const oreTileKey = `${x},${y},${z}:ore`;
                    if (!this.qualityTilesToHighlight.has(oreTileKey)) {
                        tilesFound++;
                        const overlay = this.createOresOverlay();
                        this.qualityTilesToHighlight.set(oreTileKey, {
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
      * Check if terrain type contains ores (limestone)
      */
     private isOresTerrain(terrainType: TerrainType): boolean {
         return terrainType === TerrainType.GraniteWithLimestone ||
                terrainType === TerrainType.SandstoneWithLimestone ||
                terrainType === TerrainType.BasaltWithLimestone;
     }
     
     /**
      * Check if terrain type contains talc
      */
     private isTalcTerrain(terrainType: TerrainType): boolean {
         return terrainType === TerrainType.GraniteWithTalc ||
                terrainType === TerrainType.SandstoneWithTalc ||
                terrainType === TerrainType.BasaltWithTalc;
     }
     
     /**
      * Check if terrain type contains topaz
      */
     private isTopazTerrain(terrainType: TerrainType): boolean {
         return terrainType === TerrainType.GraniteWithTopaz;
     }
     
     /**
      * Check if terrain type contains iron
      */
     private isIronTerrain(terrainType: TerrainType): boolean {
         return terrainType === TerrainType.GraniteWithIron ||
                terrainType === TerrainType.SandstoneWithIron ||
                terrainType === TerrainType.BasaltWithIron;
     }
     
     /**
      * Check if terrain type contains copper
      */
     private isCopperTerrain(terrainType: TerrainType): boolean {
         return terrainType === TerrainType.GraniteWithCopper ||
                terrainType === TerrainType.SandstoneWithCopper;
     }
     
     /**
      * Check if terrain type contains tin
      */
     private isTinTerrain(terrainType: TerrainType): boolean {
         return terrainType === TerrainType.GraniteWithTin ||
                terrainType === TerrainType.SandstoneWithTin;
     }
  
}
