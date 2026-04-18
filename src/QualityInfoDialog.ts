import { DialogId } from "@wayward/game/ui/screen/screens/game/Dialogs";
import Dialog from "@wayward/game/ui/screen/screens/game/component/Dialog";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import { SettingKey } from "./IQualityHighlighterSaveData";
import type QualityHighlighterMod from "./Mod";

const CHECKBOXES: Array<{ label: string; key: SettingKey }> = [
    { label: "Show Highlighting",          key: "isHighlightingEnabled" },
    { label: "Include Civilization Items", key: "includeCivilizationItems" },
    { label: "Highlight Gems",             key: "includeGems" },
    { label: "Highlight Plants & Trees",   key: "includePlantsAndTrees" },
    { label: "Include Limestone Tiles",    key: "includeLimestoneTiles" },
    { label: "Include Talc Tiles",         key: "includeTalcTiles" },
    { label: "Include Iron Tiles",         key: "includeIronTiles" },
    { label: "Include Copper Tiles",       key: "includeCopperTiles" },
    { label: "Include Tin Tiles",          key: "includeTinTiles" },
    { label: "Include Coal Tiles",         key: "includeCoalTiles" },
    { label: "Include Niter Tiles",        key: "includeNiterTiles" },
];

export class QualityInfoDialog extends Dialog {
    private checkboxes: CheckButton[] = [];
    private modInstance?: QualityHighlighterMod;

    constructor(id: DialogId) {
        super(id);
        this.header.setText(() => [{ content: "Quality Highlighter [H]" }]);
        this.event.subscribe("load", () => this.setupUI());
    }

    public setModInstance(mod: QualityHighlighterMod): void {
        this.modInstance = mod;
        this.checkboxes.forEach((cb, i) => cb.setChecked(mod.setting(CHECKBOXES[i].key)));
    }

    private setupUI(): void {
        this.checkboxes = CHECKBOXES.map(({ label, key }) => {
            const cb = new CheckButton();
            cb.element.textContent = label;
            cb.setChecked(this.modInstance?.setting(key) ?? false);
            cb.event.subscribe("toggle", (btn: CheckButton) => this.modInstance?.toggle(key, btn.checked));
            return cb;
        });
        this.body.append(...this.checkboxes);
    }
}
