import { BasePlayer } from './base-player.js';
import { PlayerAction, ActionType, GameState } from '../core/types.js';
/** Human player - actions are provided externally via UI */
export declare class HumanPlayer extends BasePlayer {
    private pendingAction;
    constructor(id?: string, name?: string);
    /** Set the action to be taken (called from UI) */
    setAction(action: PlayerAction): void;
    /** Get action - returns pending action if available */
    getAction(gameState: GameState, availableActions: ActionType[]): PlayerAction | Promise<PlayerAction>;
    reset(): void;
}
//# sourceMappingURL=human-player.d.ts.map