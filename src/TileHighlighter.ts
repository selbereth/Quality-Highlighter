import { Quality } from "@wayward/game/game/IObject";
import type Tile from "@wayward/game/game/tile/Tile";
import { IOverlayInfo, OverlayType } from "@wayward/game/game/tile/ITerrain";
import { ItemTypeGroup } from "@wayward/game/game/item/IItem";
import {
    isLimestoneTerrain, isTalcTerrain, isGemTerrain,
    isIronTerrain, isCopperTerrain, isTinTerrain,
    isCoalTerrain, isNiterTerrain,
} from "./TerrainChecks";
import { SettingKey } from "./IQualityHighlighterSaveData";
import type { ModSettings } from "./ModSettings";

type TileEntry = { tile: Tile; overlay: IOverlayInfo };

const TERRAIN_CHECKS: Array<[SettingKey, (t: number) => boolean]> = [
    ["includeLimestoneTiles", isLimestoneTerrain],
    ["includeTalcTiles",      isTalcTerrain],
    ["includeGems",           isGemTerrain],
    ["includeIronTiles",      isIronTerrain],
    ["includeCopperTiles",    isCopperTerrain],
    ["includeTinTiles",       isTinTerrain],
    ["includeCoalTiles",      isCoalTerrain],
    ["includeNiterTiles",     isNiterTerrain],
];

export class TileHighlighter {
    public static readonly SCAN_RADIUS = 16;
    private tracked = new Map<string, TileEntry>();

    constructor(private readonly mod: ModSettings) {}

    public scan(): void {
        if (!this.mod.setting("isHighlightingEnabled")) return;
        const island = game.islands.active[0];
        if (!island) return;

        const { x: cx, y: cy, z } = localPlayer;
        const r = TileHighlighter.SCAN_RADIUS;

        for (let x = cx - r; x <= cx + r; x++) {
            for (let y = cy - r; y <= cy + r; y++) {
                const tile = island.getTileSafe(x, y, z);
                if (!tile) continue;

                const hasQuality = tile.quality !== undefined && tile.quality > 0;
                const isMinedTile = this.isEnabledMinedTile(tile.type);
                if (!hasQuality && !isMinedTile) continue;

                const isCivItem = hasQuality && tile.description?.civilizationScore && tile.description.civilizationScore > 0;

                if (hasQuality && (this.mod.setting("includeCivilizationItems") || !isCivItem)) {
                    this.addOverlay(`${x},${y},${z}:quality`, tile, this.qualityOverlay(tile.quality!));
                }

                if (isMinedTile) {
                    this.addOverlay(`${x},${y},${z}:ore`, tile, this.oreOverlay());
                }

                if (this.mod.setting("includeGems")) {
                    const hasGem = tile.containedItems?.some(item => item.isInGroup(ItemTypeGroup.Gem)) ?? false;
                    if (hasGem) this.addOverlay(`${x},${y},${z}:gem`, tile, this.gemOverlay());
                }

                if (this.mod.setting("includePlantsAndTrees")) {
                    const doodad = tile.doodad;
                    if (doodad?.quality !== undefined && doodad.quality >= Quality.Superior) {
                        this.addOverlay(`${x},${y},${z}:doodad`, tile, this.qualityOverlay(doodad.quality));
                    }
                }
            }
        }
    }

    public cleanup(): void {
        const playerZ = localPlayer.z;
        const toRemove: string[] = [];
        for (const [key, { tile, overlay }] of this.tracked) {
            if (this.shouldRemove(key, tile, playerZ)) {
                tile.removeOverlay(overlay);
                toRemove.push(key);
            }
        }
        for (const key of toRemove) this.tracked.delete(key);
    }

    public clear(): void {
        for (const [, { tile, overlay }] of this.tracked) tile.removeOverlay(overlay);
        this.tracked.clear();
    }

    public addPlusTilesToWindow(): void {
        const island = game.islands.active[0];
        if (!island) return;
        const { x, y, z } = localPlayer;
        (window as any).tile1 = island.getTileSafe(x, y, z);
        (window as any).tile2 = island.getTileSafe(x, y - 1, z);
        (window as any).tile3 = island.getTileSafe(x, y + 1, z);
        (window as any).tile4 = island.getTileSafe(x + 1, y, z);
        (window as any).tile5 = island.getTileSafe(x - 1, y, z);
    }

    private isEnabledMinedTile(type: number): boolean {
        return TERRAIN_CHECKS.some(([key, check]) => this.mod.setting(key) && check(type));
    }

    private addOverlay(key: string, tile: Tile, overlay: IOverlayInfo): void {
        if (!this.tracked.has(key)) {
            this.tracked.set(key, { tile, overlay });
            tile.addOrUpdateOverlay(overlay);
        }
    }

    private shouldRemove(key: string, tile: Tile, playerZ: number): boolean {
        if (!this.mod.setting("isHighlightingEnabled") || tile.z !== playerZ) return true;
        if (key.endsWith(':quality')) {
            const hasQuality = tile.quality !== undefined && tile.quality > 0;
            const isCivItem = tile.description?.civilizationScore && tile.description.civilizationScore > 0;
            return !hasQuality || (!this.mod.setting("includeCivilizationItems") && !!isCivItem);
        }
        if (key.endsWith(':ore'))    return !this.isEnabledMinedTile(tile.type);
        if (key.endsWith(':gem'))    return !this.mod.setting("includeGems") || !(tile.containedItems?.some(i => i.isInGroup(ItemTypeGroup.Gem)) ?? false);
        if (key.endsWith(':doodad')) {
            const doodad = tile.doodad;
            return !this.mod.setting("includePlantsAndTrees") || doodad?.quality === undefined || doodad.quality < Quality.Superior;
        }
        return false;
    }

    private qualityOverlay(quality: Quality): IOverlayInfo {
        let red = 0, green = 0, blue = 0;
        switch (quality) {
            case Quality.Superior:      green = 200; break;
            case Quality.Remarkable:    blue = 200; break;
            case Quality.Exceptional:   red = 128; blue = 200; break;
            case Quality.Mastercrafted: red = 255; green = 165; break;
            case Quality.Relic:         red = 200; break;
            default:                    red = green = blue = 100; break;
        }
        return { type: OverlayType.Full, red, green, blue, alpha: 100 };
    }

    private gemOverlay(): IOverlayInfo {
        return { type: OverlayType.QuestionMark, red: 255, green: 255, blue: 255, alpha: 200 };
    }

    private oreOverlay(): IOverlayInfo {
        return { type: OverlayType.QuestionMark, red: 255, green: 255, blue: 0, alpha: 200 };
    }
}
