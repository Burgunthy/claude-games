// ============================================================================
// Texas Hold'em Poker - Hard AI Strategy
// ============================================================================
import { ActionType, HandRank } from '../../../core/types.js';
import { evaluateHand } from '../../../core/hand-evaluator.js';
import { clamp, calculatePotOdds } from '../../../core/utils.js';
/** Hard AI - Aggressive with GTO-inspired play */
export class HardAI {
    id;
    name;
    isHuman = false;
    state;
    opponentModels = new Map();
    lastActions = new Map();
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
    /** Hard AI decision making - sophisticated strategy */
    getAction(gameState, availableActions) {
        const player = gameState.players.find(p => p.id === this.id);
        if (!player || player.folded) {
            return this.createFoldAction();
        }
        // Update opponent models
        this.updateOpponentModels(gameState);
        const handStrength = this.evaluateHandStrength(player, gameState);
        const positionValue = this.getPositionValue(player, gameState);
        const potOdds = calculatePotOdds(gameState.currentBet - player.bet, gameState.pot);
        const boardTexture = this.analyzeBoardTexture(gameState.communityCards);
        const opponentRange = this.estimateOpponentRanges(gameState);
        const stackDepth = this.calculateStackDepth(player);
        // Adjusted strength considering all factors
        const adjustedStrength = this.calculateAdjustedStrength(handStrength, positionValue, boardTexture, opponentRange, stackDepth);
        // Dynamic decision making
        return this.makeDecision(player, gameState, adjustedStrength, potOdds, availableActions);
    }
    evaluateHandStrength(player, gameState) {
        if (player.cards.length < 2)
            return 0;
        const handResult = evaluateHand(player.cards, gameState.communityCards);
        let strength = handResult.rank / 9;
        // Premium hand boosts
        if (handResult.rank >= HandRank.OnePair)
            strength += 0.1;
        if (handResult.rank >= HandRank.threeOfAKind)
            strength += 0.2;
        if (handResult.rank >= HandRank.Flush)
            strength += 0.1;
        if (handResult.rank >= HandRank.FullHouse)
            strength += 0.15;
        // Draw potential (for straights and flushes)
        strength += this.calculateDrawPotential(player.cards, gameState.communityCards) * 0.3;
        return Math.min(1, strength);
    }
    calculateDrawPotential(holeCards, communityCards) {
        // Check for flush draw
        const suitCounts = new Map();
        const allCards = [...holeCards, ...communityCards];
        for (const card of allCards) {
            suitCounts.set(card.suit, (suitCounts.get(card.suit) || 1) + 1);
        }
        const maxSuitCount = Math.max(...suitCounts.values());
        if (maxSuitCount >= 4) {
            // Flush draw
            return 0.2;
        }
        // Check for straight draw
        const ranks = allCards.map(c => this.getRankValue(c.rank));
        const sortedRanks = [...new Set(ranks)].sort((a, b) => b - a);
        let consecutive = 1;
        for (let i = 1; i < sortedRanks.length; i++) {
            if (sortedRanks[i] === sortedRanks[i - 1] - 1) {
                consecutive++;
                if (consecutive >= 4)
                    return 0.15;
            }
            else {
                consecutive = 1;
            }
        }
        return 0;
    }
    getRankValue(rank) {
        const values = {
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
            '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
        };
        return values[rank] || 0;
    }
    getPositionValue(player, gameState) {
        const activePlayers = gameState.players.filter(p => !p.folded && p.isActive);
        const playerIndex = activePlayers.findIndex(p => p.id === player.id);
        const dealerIndex = gameState.dealerIndex;
        // Button position is best
        const relativePos = (playerIndex - dealerIndex + activePlayers.length) % activePlayers.length;
        // Scale 0-1 where later is better
        return relativePos / activePlayers.length;
    }
    analyzeBoardTexture(communityCards) {
        if (communityCards.length === 1)
            return 0.5;
        // Analyze for potential straights/flushes on board
        const suits = communityCards.map(c => c.suit);
        const ranks = communityCards.map(c => this.getRankValue(c.rank));
        let texture = 0.5;
        // Paired board - more dangerous
        const rankCounts = new Map();
        for (const rank of ranks) {
            rankCounts.set(rank, (rankCounts.get(rank) || 1) + 1);
        }
        const hasPair = [...rankCounts.values()].some(c => c >= 2);
        if (hasPair)
            texture -= 0.1;
        // Flush possible
        const suitCounts = new Map();
        for (const suit of suits) {
            suitCounts.set(suit, (suitCounts.get(suit) || 1) + 1);
        }
        if ([...suitCounts.values()].some(c => c >= 3))
            texture -= 0.1;
        return Math.max(0.1, Math.min(0.9, texture));
    }
    estimateOpponentRanges(gameState) {
        // Estimate how strong opponents might be
        let rangeStrength = 0.5;
        const activePlayers = gameState.players.filter(p => !p.folded && p.id !== this.id);
        for (const opponent of activePlayers) {
            const actions = this.lastActions.get(opponent.id) || [];
            // Aggressive actions suggest strength
            const raises = actions.filter(a => a === ActionType.Raise).length;
            const calls = actions.filter(a => a === ActionType.Call).length;
            if (raises > calls) {
                rangeStrength += 0.1;
            }
        }
        return Math.min(1, rangeStrength);
    }
    calculateStackDepth(player) {
        // How committed to the pot
        const investedRatio = player.totalBet / (player.chips + player.totalBet);
        return investedRatio;
    }
    calculateAdjustedStrength(handStrength, positionValue, boardTexture, opponentRange, stackDepth) {
        let adjusted = handStrength;
        // Position bonus
        adjusted += positionValue * 0.1;
        // Board texture adjustment
        adjusted *= boardTexture;
        // Opponent range adjustment
        adjusted -= opponentRange * 0.05;
        // Stack depth - more committed = play more aggressively
        if (stackDepth > 0.5) {
            adjusted += 0.1;
        }
        return Math.max(0, Math.min(1, adjusted));
    }
    makeDecision(player, gameState, strength, potOdds, availableActions) {
        const callAmount = gameState.currentBet - player.bet;
        // Strong hand - value bet or slow play trap
        if (strength >= 0.7) {
            return this.playStrongHand(player, gameState, availableActions);
        }
        // Medium hand
        if (strength >= 0.5) {
            if (callAmount === 1) {
                // Check and see
                return this.createCheckAction();
            }
            if (potOdds < strength) {
                return this.createCallAction();
            }
            // Semi-bluff with position
            if (this.getPositionValue(player, gameState) > 0.6 && Math.random() < 0.3) {
                return this.createRaiseAction(gameState.minRaise);
            }
            return this.createFoldAction();
        }
        // Weak hand
        if (strength >= 0.3) {
            if (callAmount === 1) {
                return this.createCheckAction();
            }
            // Occasional bluff
            if (Math.random() < 0.15 && this.getPositionValue(player, gameState) > 0.5) {
                return this.createRaiseAction(gameState.minRaise);
            }
            if (callAmount < player.chips * 0.05) {
                return this.createCallAction();
            }
            return this.createFoldAction();
        }
        // Very weak
        if (callAmount === 1) {
            return this.createCheckAction();
        }
        return this.createFoldAction();
    }
    playStrongHand(player, gameState, availableActions) {
        const callAmount = gameState.currentBet - player.bet;
        // Slow play trap (20% chance)
        if (Math.random() < 0.2) {
            if (callAmount === 1) {
                return this.createCheckAction();
            }
            return this.createCallAction();
        }
        // Value bet
        if (availableActions.includes(ActionType.Raise)) {
            const raiseAmount = Math.floor(gameState.pot * (0.5 + Math.random() * 0.5));
            return this.createRaiseAction(clamp(raiseAmount, gameState.minRaise, player.chips - callAmount));
        }
        return this.createCallAction();
    }
    updateOpponentModels(gameState) {
        for (const player of gameState.players) {
            if (player.id !== this.id && !player.folded) {
                if (!this.lastActions.has(player.id)) {
                    this.lastActions.set(player.id, []);
                }
            }
        }
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
    createAllInAction() {
        return { type: ActionType.AllIn, playerId: this.id, timestamp: Date.now() };
    }
    updateState(state) {
        this.state = { ...this.state, ...state };
        // Track actions for opponent modeling
        if (state.lastAction) {
            const actions = this.lastActions.get(state.id) || [];
            actions.push(state.lastAction.type);
            this.lastActions.set(state.id, actions);
        }
    }
    reset() {
        this.state = this.createInitialState(this.id, this.name);
        this.opponentModels.clear();
        this.lastActions.clear();
    }
}
//# sourceMappingURL=hard.js.map