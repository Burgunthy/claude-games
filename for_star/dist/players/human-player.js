// ============================================================================
// Texas Hold'em Poker - Human Player
// ============================================================================
import { BasePlayer } from './base-player.js';
/** Human player - actions are provided externally via UI */
export class HumanPlayer extends BasePlayer {
    pendingAction = null;
    constructor(id = 'human', name = 'You') {
        super(id, name, true);
    }
    /** Set the action to be taken (called from UI) */
    setAction(action) {
        this.pendingAction = action;
    }
    /** Get action - returns pending action if available */
    getAction(gameState, availableActions) {
        if (this.pendingAction) {
            const action = this.pendingAction;
            this.pendingAction = null;
            return action;
        }
        // Return a promise that will be resolved when setAction is called
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (this.pendingAction) {
                    clearInterval(checkInterval);
                    const action = this.pendingAction;
                    this.pendingAction = null;
                    resolve(action);
                }
            }, 100);
        });
    }
    reset() {
        super.reset();
        this.pendingAction = null;
    }
}
//# sourceMappingURL=human-player.js.map