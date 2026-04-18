import Mod from "@wayward/game/mod/Mod";
import { DEFAULTS, IQualityHighlighterSaveData, SettingKey } from "./IQualityHighlighterSaveData";

export abstract class ModSettings extends Mod {
    protected abstract readonly globalData: IQualityHighlighterSaveData;
    protected abstract readonly data: IQualityHighlighterSaveData;
    protected abstract rescan(): void;

    public override initializeSaveData(data?: IQualityHighlighterSaveData): IQualityHighlighterSaveData {
        const g = this.globalData;
        return Object.fromEntries(
            (Object.keys(DEFAULTS) as SettingKey[]).map(k => [k, data?.[k] ?? g?.[k] ?? DEFAULTS[k]])
        ) as IQualityHighlighterSaveData;
    }

    public override initializeGlobalData(data?: IQualityHighlighterSaveData): IQualityHighlighterSaveData {
        return Object.fromEntries(
            (Object.keys(DEFAULTS) as SettingKey[]).map(k => [k, data?.[k] ?? DEFAULTS[k]])
        ) as IQualityHighlighterSaveData;
    }

    public setting(key: SettingKey): boolean {
        const settings = this.data && Object.keys(this.data).length > 0 ? this.data : this.globalData;
        return settings[key] ?? DEFAULTS[key];
    }

    public toggle(key: SettingKey, value: boolean): void {
        const settings = { [key]: value } as IQualityHighlighterSaveData;
        Object.assign(this.globalData, settings);
        if (this.data && Object.keys(this.data).length > 0) Object.assign(this.data, settings);
        this.rescan();
    }
}
