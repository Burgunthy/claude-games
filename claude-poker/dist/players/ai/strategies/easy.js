// ============================================================================
// Texas Hold'em Poker - Easy AI Strategy
// ============================================================================
import { ActionType, HandRank } from '../../../core/types.js';
import { evaluateHand } from '../../../core/hand-evaluator.js';
/** Easy AI - Passive and predictable */
export class EasyAI {
    id;
    name;
    isHuman = false;
    state;
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.state = this.createInitialState(id, name);
    }
    createInitialState(id, name) {
        return {
            id,
            name,
            chips: 1000,
            bet: 0,
            totalBet: 0,
            cards: [],
            folded: false,
            isAllIn: false,
            isHuman: false,
            position: 'early',
            isActive: true,
            showCards: false,
        };
    }
    /** Easy AI decision making - very passive */
    getAction(gameState, availableActions) {
        const player = gameState.players.find(p => p.id === this.id);
        if (!player || player.folded) {
            return this.createFoldAction();
        }
        // Evaluate hand strength
        const handStrength = this.evaluateHandStrength(player, gameState);
        // Easy AI plays very tight - only premium hands
        const foldThreshold = 0.3; // Fold if hand strength < 30%
        if (handStrength < foldThreshold) {
            // High chance to fold weak hands
            if (Math.random() < 0.7) {
                return this.createFoldAction();
            }
        }
        // Check or call based on situation
        const callAmount = gameState.currentBet - player.bet;
        // Never bluff
        if (handStrength < 0.5) {
            if (callAmount === 0) {
                return this.createCheckAction();
            }
            else if (callAmount <= player.chips * 0.2) {
                // Only call small amounts with decent hands
                return this.createCallAction();
            }
            return this.createFoldAction();
        }
        // With strong hands, still passive
        if (handStrength >= 0.5) {
            if (callAmount === 0) {
                return this.createCheckAction();
            }
            return this.createCallAction();
        }
        // Default to check/call
        return this.getDefaultAction(player, gameState);
    }
    evaluateHandStrength(player, gameState) {
        if (player.cards.length < 2)
            return 0;
        // Evaluate hand
        const handResult = evaluateHand(player.cards, gameState.communityCards);
        // Base strength from hand rank
        let strength = handResult.rank / 9;
        // Boost for premium hands
        if (handResult.rank >= HandRank.OnePair) {
            strength += 0.2;
        }
        if (handResult.rank >= HandRank.threeOfAKind) {
            strength += 0.3;
        }
        return Math.min(1, strength);
    }
    createFoldAction() {
        return {
            type: ActionType.Fold,
            playerId: this.id,
            timestamp: Date.now(),
        };
    }
    createCheckAction() {
        return {
            type: ActionType.Check,
            playerId: this.id,
            timestamp: Date.now(),
        };
    }
    createCallAction() {
        return {
            type: ActionType.Call,
            playerId: this.id,
            timestamp: Date.now(),
        };
    }
    getDefaultAction(player, gameState) {
        const callAmount = gameState.currentBet - player.bet;
        if (callAmount === 0) {
            return this.createCheckAction();
        }
        if (callAmount <= player.chips * 0.3) {
            return this.createCallAction();
        }
        return this.createFoldAction();
    }
    updateState(state) {
        this.state = { ...this.state, ...state };
    }
    reset() {
        this.state = this.createInitialState(this.id, this.name);
    }
}
//# sourceMappingURL=easy.js.map