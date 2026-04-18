import { TerrainType } from "@wayward/game/game/tile/ITerrain";

export function isLimestoneTerrain(t: TerrainType): boolean {
    return t === TerrainType.GraniteWithLimestone ||
           t === TerrainType.SandstoneWithLimestone ||
           t === TerrainType.BasaltWithLimestone;
}

export function isTalcTerrain(t: TerrainType): boolean {
    return t === TerrainType.GraniteWithTalc ||
           t === TerrainType.SandstoneWithTalc ||
           t === TerrainType.BasaltWithTalc;
}

export function isGemTerrain(t: TerrainType): boolean {
    return t === TerrainType.SandstoneWithOpal ||
           t === TerrainType.GraniteWithTopaz ||
           t === TerrainType.BasaltWithSapphire;
}

export function isIronTerrain(t: TerrainType): boolean {
    return t === TerrainType.GraniteWithIron ||
           t === TerrainType.SandstoneWithIron ||
           t === TerrainType.BasaltWithIron;
}

export function isCopperTerrain(t: TerrainType): boolean {
    return t === TerrainType.GraniteWithCopper ||
           t === TerrainType.SandstoneWithCopper;
}

export function isTinTerrain(t: TerrainType): boolean {
    return t === TerrainType.GraniteWithTin ||
           t === TerrainType.SandstoneWithTin;
}

export function isCoalTerrain(t: TerrainType): boolean {
    return t === TerrainType.GraniteWithCoal ||
           t === TerrainType.BasaltWithCoal;
}

export function isNiterTerrain(t: TerrainType): boolean {
    return t === TerrainType.SandstoneWithNiter;
}
