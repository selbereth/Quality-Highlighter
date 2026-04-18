import { EventHandler } from "@wayward/game/event/EventManager";
import { EventBus } from "@wayward/game/event/EventBuses";
import type { IActionHandlerApi, ActionType } from "@wayward/game/game/entity/action/IAction";
import type ActionExecutor from "@wayward/game/game/entity/action/ActionExecutor";
import Register from "@wayward/game/mod/ModRegistry";
import { DialogId } from "@wayward/game/ui/screen/screens/game/Dialogs";
import { ScreenId } from "@wayward/game/ui/screen/IScreen";
import { IQualityHighlighterSaveData } from "./IQualityHighlighterSaveData";
import { ModSettings } from "./ModSettings";

import { QualityInfoDialog } from "./QualityInfoDialog";
import { TileHighlighter } from "./TileHighlighter";

export default class QualityHighlighterMod extends ModSettings {

    @Register.dialog("QualityInfoDialog", {
        minResolution: { x: 300, y: 400 },
        size: { x: 0.35, y: 0.6 },
        edges: "center",
        saveOpen: false
    }, QualityInfoDialog)
    public readonly qualityDialogId: DialogId;

    @ModSettings.globalData<QualityHighlighterMod>()
    public readonly globalData!: IQualityHighlighterSaveData;

    @ModSettings.saveData<QualityHighlighterMod>()
    public readonly data!: IQualityHighlighterSaveData;

    private readonly highlighter = new TileHighlighter(this);

    // -------------------------------------------------------------------------
    // Rescan (satisfies abstract in ModSettings)
    // -------------------------------------------------------------------------

    protected rescan(): void {
        if (this.setting("isHighlightingEnabled")) {
            this.highlighter.clear();
            this.highlighter.scan();
        } else {
            this.highlighter.clear();
        }
    }

    // -------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------

    public override onInitialize(): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if ((e.code === 'KeyH' || e.key.toLowerCase() === 'h') && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDialog();
            }
        });
        if (this.setting("isHighlightingEnabled")) this.highlighter.scan();
    }

    @EventHandler(EventBus.LocalPlayer, "postMove")
    protected onMove(): void {
        if (this.setting("isHighlightingEnabled")) this.highlighter.scan();
        this.highlighter.cleanup();
        this.highlighter.addPlusTilesToWindow();
    }

    @EventHandler(EventBus.Actions, "postExecuteAction")
    protected onAction(_host: ActionExecutor<any, any, any, any, any>, _type: ActionType, actionApi: IActionHandlerApi): void {
        if (actionApi.executor !== localPlayer) return;
        const tile = actionApi.targetTile;
        if (!tile) return;
        this.highlighter.rescanTile(tile);
        this.highlighter.cleanup();
    }

    // -------------------------------------------------------------------------
    // Dialog
    // -------------------------------------------------------------------------

    private toggleDialog(): void {
        const gameScreen = ui.screens.get(ScreenId.Game);
        if (!gameScreen) return;
        gameScreen.dialogs.toggle(this.qualityDialogId);
        const dialog = gameScreen.dialogs.get(this.qualityDialogId);
        if (dialog && 'setModInstance' in dialog) {
            (dialog as unknown as QualityInfoDialog).setModInstance(this);
        }
    }
}
