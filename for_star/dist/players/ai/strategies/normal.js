// ============================================================================
// Texas Hold'em Poker - Normal AI Strategy
// ============================================================================
import { ActionType, HandRank } from '../../../core/types.js';
import { evaluateHand } from '../../../core/hand-evaluator.js';
import { clamp } from '../../../core/utils.js';
/** Normal AI - Balanced play with position awareness */
export class NormalAI {
    id;
    name;
    isHuman = false;
    state;
    bluffFrequency = 0.15;
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
    /** Normal AI decision making - balanced with position awareness */
    getAction(gameState, availableActions) {
        const player = gameState.players.find(p => p.id === this.id);
        if (!player || player.folded) {
            return this.createFoldAction();
        }
        const handStrength = this.evaluateHandStrength(player, gameState);
        const positionValue = this.getPositionValue(player, gameState);
        const potOdds = this.calculatePotOdds(player, gameState);
        // Adjust decision based on position
        const adjustedStrength = handStrength + positionValue * 0.1;
        // Occasional bluff (15-20% of time)
        const shouldBluff = Math.random() < this.bluffFrequency && handStrength < 0.3;
        if (shouldBluff) {
            return this.executeBluff(player, gameState);
        }
        // Call amount
        const callAmount = gameState.currentBet - player.bet;
        // Decision based on hand strength and pot odds
        if (adjustedStrength >= 0.7) {
            // Strong hand - raise
            if (availableActions.includes(ActionType.Raise)) {
                const raiseAmount = this.calculateRaiseAmount(player, gameState, adjustedStrength);
                return this.createRaiseAction(raiseAmount);
            }
            return this.createCallAction();
        }
        if (adjustedStrength >= 0.5) {
            // Decent hand - call or check
            if (callAmount === 1) {
                return this.createCheckAction();
            }
            if (potOdds < adjustedStrength) {
                return this.createCallAction();
            }
            return this.createFoldAction();
        }
        if (adjustedStrength >= 0.3) {
            // Marginal hand
            if (callAmount === 1) {
                return this.createCheckAction();
            }
            if (callAmount <= player.chips * 0.1 && potOdds < 0.3) {
                return this.createCallAction();
            }
            return this.createFoldAction();
        }
        // Weak hand
        if (callAmount === 1) {
            return this.createCheckAction();
        }
        return this.createFoldAction();
    }
    evaluateHandStrength(player, gameState) {
        if (player.cards.length < 2)
            return 0;
        const handResult = evaluateHand(player.cards, gameState.communityCards);
        let strength = handResult.rank / 9;
        // Boost for made hands
        if (handResult.rank >= HandRank.OnePair)
            strength += 0.15;
        if (handResult.rank >= HandRank.threeOfAKind)
            strength += 0.25;
        if (handResult.rank >= HandRank.Flush)
            strength += 0.15;
        return Math.min(1, strength);
    }
    getPositionValue(player, gameState) {
        // Position matters - later position is better
        const totalPlayers = gameState.players.filter(p => !p.folded).length;
        const playerIndex = gameState.players.findIndex(p => p.id === player.id);
        const dealerIndex = gameState.dealerIndex;
        const relativePosition = (playerIndex - dealerIndex + totalPlayers) % totalPlayers;
        // Later position = higher value
        return relativePosition / totalPlayers;
    }
    calculatePotOdds(player, gameState) {
        const callAmount = gameState.currentBet - player.bet;
        if (callAmount <= 0)
            return 0;
        return callAmount / (gameState.pot + callAmount);
    }
    calculateRaiseAmount(player, gameState, strength) {
        const minRaise = gameState.minRaise;
        const maxRaise = player.chips - (gameState.currentBet - player.bet);
        // Raise more with stronger hands
        const multiplier = 1 + (strength - 0.5) * 2;
        let amount = Math.floor(minRaise * multiplier);
        return clamp(amount, minRaise, maxRaise);
    }
    executeBluff(player, gameState) {
        const callAmount = gameState.currentBet - player.bet;
        // Bluff by raising
        if (Math.random() < 0.4 && player.chips > gameState.minRaise * 2) {
            const bluffRaise = gameState.minRaise * (1 + Math.random());
            return this.createRaiseAction(Math.floor(bluffRaise));
        }
        // Or just call
        if (callAmount <= player.chips * 0.15) {
            return this.createCallAction();
        }
        return this.createFoldAction();
    }
    createFoldAction() {
        return { type: ActionType.Fold, playerId: this.id, timestamp: Date.now() };
    }
    createCheckAction() {
        return { type: ActionType.Check, playerId: this.id, timestamp: Date.now() };
    }
    createCallAction() {
        return { type: ActionType.Call, playerId: this.id, timestamp: Date.now() };
    }
    createRaiseAction(amount) {
        return { type: ActionType.Raise, playerId: this.id, amount, timestamp: Date.now() };
    }
    updateState(state) {
        this.state = { ...this.state, ...state };
    }
    reset() {
        this.state = this.createInitialState(this.id, this.name);
    }
}
//# sourceMappingURL=normal.js.map