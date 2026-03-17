import { PlayerAction, ActionType, GameState, PlayerState } from '../../../core/types.js';
/** Normal AI - Balanced play with position awareness */
export declare class NormalAI {
    readonly id: string;
    readonly name: string;
    readonly isHuman = false;
    private state;
    private bluffFrequency;
    constructor(id: string, name: string);
    private createInitialState;
    /** Normal AI decision making - balanced with position awareness */
    getAction(gameState: GameState, availableActions: ActionType[]): PlayerAction;
    private evaluateHandStrength;
    private getPositionValue;
    private calculatePotOdds;
    private calculateRaiseAmount;
    private executeBluff;
    private createFoldAction;
    private createCheckAction;
    private createCallAction;
    private createRaiseAction;
    updateState(state: PlayerState): void;
    reset(): void;
}
//# sourceMappingURL=normal.d.ts.map