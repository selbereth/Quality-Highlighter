export const DEFAULTS = {
    isHighlightingEnabled: true,
    includeCivilizationItems: false,
    includeLimestoneTiles: false,
    includeTalcTiles: false,
    includeIronTiles: false,
    includeCopperTiles: false,
    includeTinTiles: false,
    includeCoalTiles: false,
    includeNiterTiles: false,
    includeGems: false,
    includePlantsAndTrees: false,
};

export type IQualityHighlighterSaveData = Partial<typeof DEFAULTS>;
export type SettingKey = keyof typeof DEFAULTS;
