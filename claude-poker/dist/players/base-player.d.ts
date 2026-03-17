import { PlayerState, PlayerAction, ActionType, GameState } from '../core/types.js';
/** Base player interface */
export interface IPlayer {
    readonly id: string;
    readonly name: string;
    readonly isHuman: boolean;
    /** Get player's action */
    getAction(gameState: GameState, availableActions: ActionType[]): PlayerAction | Promise<PlayerAction>;
    /** Update player state */
    updateState(state: PlayerState): void;
    /** Reset player for new hand */
    reset(): void;
}
/** Abstract base player implementation */
export declare abstract class BasePlayer implements IPlayer {
    protected state: PlayerState;
    constructor(id: string, name: string, isHuman?: boolean);
    get id(): string;
    get name(): string;
    get isHuman(): boolean;
    abstract getAction(gameState: GameState, availableActions: ActionType[]): PlayerAction | Promise<PlayerAction>;
    updateState(state: PlayerState): void;
    reset(): void;
}
//# sourceMappingURL=base-player.d.ts.map