import { PlayerAction, ActionType, GameState, PlayerState } from '../../../core/types.js';
/** Easy AI - Passive and predictable */
export declare class EasyAI {
    readonly id: string;
    readonly name: string;
    readonly isHuman = false;
    private state;
    constructor(id: string, name: string);
    private createInitialState;
    /** Easy AI decision making - very passive */
    getAction(gameState: GameState, availableActions: ActionType[]): PlayerAction;
    private evaluateHandStrength;
    private createFoldAction;
    private createCheckAction;
    private createCallAction;
    private getDefaultAction;
    updateState(state: PlayerState): void;
    reset(): void;
}
//# sourceMappingURL=easy.d.ts.map