import { PlayerAction, ActionType, GameState, PlayerState } from '../../../core/types.js';
/** Hard AI - Aggressive with GTO-inspired play */
export declare class HardAI {
    readonly id: string;
    readonly name: string;
    readonly isHuman = false;
    private state;
    private opponentModels;
    private lastActions;
    constructor(id: string, name: string);
    private createInitialState;
    /** Hard AI decision making - sophisticated strategy */
    getAction(gameState: GameState, availableActions: ActionType[]): PlayerAction;
    private evaluateHandStrength;
    private calculateDrawPotential;
    private getRankValue;
    private getPositionValue;
    private analyzeBoardTexture;
    private estimateOpponentRanges;
    private calculateStackDepth;
    private calculateAdjustedStrength;
    private makeDecision;
    private playStrongHand;
    private updateOpponentModels;
    private createFoldAction;
    private createCheckAction;
    private createCallAction;
    private createRaiseAction;
    private createAllInAction;
    updateState(state: PlayerState): void;
    reset(): void;
}
//# sourceMappingURL=hard.d.ts.map