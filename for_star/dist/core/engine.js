// ============================================================================
// Texas Hold'em Poker - Game Engine
// ============================================================================
import { EventEmitter } from 'events';
import { createDeck, shuffle, dealOne } from './deck.js';
import { evaluateHand, determineWinner } from './hand-evaluator.js';
import { calculatePots, distributePot } from './pot-calculator.js';
import { BLINDS, MAX_PLAYERS, MIN_PLAYERS } from './constants.js';
/** Poker Game Engine */
export class PokerEngine extends EventEmitter {
    state;
    config;
    handHistory = [];
    potResult = null;
    currentHandPlayerCount = 0;
    constructor(config) {
        super();
        // Validate configuration
        if (config.playerCount < MIN_PLAYERS || config.playerCount > MAX_PLAYERS) {
            throw new Error(`Player count must be between ${MIN_PLAYERS} and ${MAX_PLAYERS}`);
        }
        this.config = {
            ...config,
            smallBlind: config.smallBlind || BLINDS.SMALL,
            bigBlind: config.bigBlind || BLINDS.BIG,
            aiOnly: config.aiOnly || false,
            aiDifficulty: config.aiDifficulty || 'normal',
            autoPlayDelay: config.autoPlayDelay || 750
        };
        // Initialize players
        const players = this.createPlayers(this.config);
        this.state = {
            deck: [],
            communityCards: [],
            pot: 0,
            players,
            currentPlayerIndex: 0,
            phase: 'preflop',
            currentBet: 0,
            dealerIndex: 0,
        };
    }
    /** Create players for the game */
    createPlayers(config) {
        const players = [];
        // Human player (unless AI-only mode)
        if (!config.aiOnly) {
            players.push({
                id: 'human',
                name: 'You',
                chips: config.startingChips,
                cards: [],
                bet: 0,
                folded: false,
                isHuman: true,
                isAllIn: false,
                avatar: '👤'
            });
        }
        // AI players
        const aiNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
        const aiAvatars = ['🤖', '🎭', '🎪', '🎯', '🎲', '🃏', '👑', '💎'];
        const aiCount = config.aiOnly ? config.playerCount : config.playerCount - 1;
        for (let i = 0; i < aiCount; i++) {
            players.push({
                id: `ai-${i}`,
                name: aiNames[i] || `AI ${i + 1}`,
                chips: config.startingChips,
                cards: [],
                bet: 0,
                folded: false,
                isHuman: false,
                isAllIn: false,
                avatar: aiAvatars[i] || '🤖'
            });
        }
        return players;
    }
    /** Get current game state */
    getState() {
        return this.state;
    }
    /** Get current configuration */
    getConfig() {
        return this.config;
    }
    /** Get pot calculation result */
    getPotResult() {
        return this.potResult;
    }
    /** Start a new hand */
    startNewHand() {
        // Reset for new hand
        this.state.deck = shuffle(createDeck());
        this.state.communityCards = [];
        this.state.pot = 0;
        this.state.currentBet = 0;
        this.potResult = null;
        // Reset player states for active players
        const activePlayers = this.state.players.filter(p => p.chips > 0);
        this.currentHandPlayerCount = activePlayers.length;
        for (const player of this.state.players) {
            player.cards = [];
            player.bet = 0;
            player.folded = player.chips === 0; // Bust out players stay folded
            player.isAllIn = false;
        }
        if (activePlayers.length < 2) {
            this.emitGameOver();
            return;
        }
        // Move dealer button
        this.state.dealerIndex = this.findNextActivePlayer(this.state.dealerIndex);
        // Deal hole cards
        for (const player of activePlayers) {
            const { card: card1, remainingDeck: deck1 } = dealOne(this.state.deck);
            const { card: card2, remainingDeck: deck2 } = dealOne(deck1);
            this.state.deck = deck2;
            if (card1 && card2) {
                player.cards = [card1, card2];
            }
        }
        // Post blinds
        this.postBlinds();
        this.state.phase = 'preflop';
        this.emit('hand:started', {
            players: activePlayers.map(p => ({ id: p.id, name: p.name, chips: p.chips }))
        });
    }
    /** Find next active player from index */
    findNextActivePlayer(startIndex) {
        let index = startIndex;
        let attempts = 0;
        do {
            index = (index + 1) % this.state.players.length;
            attempts++;
            const player = this.state.players[index];
            if (!player.folded && player.chips > 0) {
                return index;
            }
        } while (attempts < this.state.players.length);
        return startIndex;
    }
    /** Post blinds */
    postBlinds() {
        const sbIndex = this.findNextActivePlayer(this.state.dealerIndex);
        const bbIndex = this.findNextActivePlayer(sbIndex);
        const sbPlayer = this.state.players[sbIndex];
        const bbPlayer = this.state.players[bbIndex];
        const sbAmount = Math.min(this.config.smallBlind, sbPlayer.chips);
        const bbAmount = Math.min(this.config.bigBlind, bbPlayer.chips);
        // Post small blind
        sbPlayer.chips -= sbAmount;
        sbPlayer.bet = sbAmount;
        if (sbPlayer.chips === 0)
            sbPlayer.isAllIn = true;
        this.state.pot += sbAmount;
        // Post big blind
        bbPlayer.chips -= bbAmount;
        bbPlayer.bet = bbAmount;
        if (bbPlayer.chips === 0)
            bbPlayer.isAllIn = true;
        this.state.pot += bbAmount;
        this.state.currentBet = bbAmount;
        this.state.currentPlayerIndex = this.findNextActivePlayer(bbIndex);
        this.emit('blinds:posted', {
            sb: { player: sbPlayer.name, amount: sbAmount },
            bb: { player: bbPlayer.name, amount: bbAmount }
        });
        // Update pot calculation
        this.updatePotCalculation();
    }
    /** Update pot calculation with side pots */
    updatePotCalculation() {
        const activePlayers = this.state.players.filter(p => !p.folded && p.bet > 0);
        if (activePlayers.length > 0) {
            this.potResult = calculatePots(this.state.players);
            this.state.pot = this.potResult.total;
        }
    }
    /** Deal community cards */
    dealCommunityCards(count) {
        for (let i = 0; i < count; i++) {
            const { card, remainingDeck } = dealOne(this.state.deck);
            if (card) {
                this.state.communityCards.push(card);
                this.state.deck = remainingDeck;
            }
        }
        this.emit('community:dealt', {
            cards: this.state.communityCards,
            phase: this.state.phase
        });
    }
    /** Process a player action */
    processAction(action) {
        const player = this.state.players.find(p => p.id === action.playerId);
        if (!player || player.folded)
            return false;
        if (player.id !== this.state.players[this.state.currentPlayerIndex].id) {
            return false; // Not this player's turn
        }
        let success = false;
        switch (action.type) {
            case 'fold':
                success = this.actionFold(player);
                break;
            case 'check':
                success = this.actionCheck(player);
                break;
            case 'call':
                success = this.actionCall(player);
                break;
            case 'raise':
                success = this.actionRaise(player, action.amount || 0);
                break;
            case 'allin':
                success = this.actionAllIn(player);
                break;
        }
        if (success) {
            this.emit('player:acted', {
                player: player.name,
                action: action.type,
                amount: action.amount
            });
            this.updatePotCalculation();
            // Check if round is complete or move to next player
            if (!this.checkRoundComplete()) {
                this.moveToNextPlayer();
            }
        }
        return success;
    }
    /** Fold action */
    actionFold(player) {
        player.folded = true;
        return true;
    }
    /** Check action */
    actionCheck(player) {
        if (this.state.currentBet !== player.bet)
            return false;
        return true;
    }
    /** Call action */
    actionCall(player) {
        const toCall = this.state.currentBet - player.bet;
        if (toCall > player.chips) {
            // Not enough chips - must go all-in
            return this.actionAllIn(player);
        }
        player.chips -= toCall;
        player.bet = this.state.currentBet;
        this.state.pot += toCall;
        return true;
    }
    /** Raise action */
    actionRaise(player, raiseAmount) {
        const toCall = this.state.currentBet - player.bet;
        const minRaise = this.config.bigBlind;
        const totalBet = toCall + raiseAmount;
        if (totalBet < minRaise)
            return false;
        if (totalBet > player.chips) {
            // Not enough for full raise - go all-in
            return this.actionAllIn(player);
        }
        player.chips -= totalBet;
        player.bet += totalBet;
        this.state.pot += totalBet;
        this.state.currentBet = player.bet;
        return true;
    }
    /** All-in action */
    actionAllIn(player) {
        const allInAmount = player.chips;
        player.bet += allInAmount;
        this.state.pot += allInAmount;
        player.chips = 0;
        player.isAllIn = true;
        if (player.bet > this.state.currentBet) {
            this.state.currentBet = player.bet;
        }
        return true;
    }
    /** Move to next player */
    moveToNextPlayer() {
        this.state.currentPlayerIndex = this.findNextActivePlayer(this.state.currentPlayerIndex);
        const nextPlayer = this.state.players[this.state.currentPlayerIndex];
        this.emit('turn:changed', {
            player: nextPlayer.name,
            isHuman: nextPlayer.isHuman
        });
    }
    /** Check if betting round is complete */
    checkRoundComplete() {
        const activePlayers = this.state.players.filter(p => !p.folded);
        const playersWithChips = activePlayers.filter(p => p.chips > 0);
        // All players folded except one
        if (activePlayers.length === 1) {
            this.endHandEarly(activePlayers[0]);
            return true;
        }
        // Check if all active players have matched the current bet
        const allMatched = activePlayers.every(p => p.bet === this.state.currentBet || p.isAllIn);
        // Check if all players with chips have acted
        const allActed = playersWithChips.length <= 1 ||
            playersWithChips.every(p => p.bet > 0 || p === this.state.players[this.state.currentPlayerIndex]);
        if (allMatched && (allActed || activePlayers.length === playersWithChips.length)) {
            this.advancePhase();
            return true;
        }
        return false;
    }
    /** Advance to next phase */
    advancePhase() {
        // Reset bets
        for (const player of this.state.players) {
            player.bet = 0;
        }
        this.state.currentBet = 0;
        const phaseOrder = ['preflop', 'flop', 'turn', 'river', 'showdown'];
        const currentIndex = phaseOrder.indexOf(this.state.phase);
        if (currentIndex < phaseOrder.length - 1) {
            this.state.phase = phaseOrder[currentIndex + 1];
            if (this.state.phase === 'flop') {
                this.dealCommunityCards(3);
            }
            else if (this.state.phase === 'turn' || this.state.phase === 'river') {
                this.dealCommunityCards(1);
            }
            else if (this.state.phase === 'showdown') {
                this.runShowdown();
            }
            // Set first active player after preflop
            if (this.state.phase !== 'showdown') {
                this.state.currentPlayerIndex = this.findNextActivePlayer(this.state.dealerIndex);
                this.emit('turn:changed', {
                    player: this.state.players[this.state.currentPlayerIndex].name,
                    isHuman: this.state.players[this.state.currentPlayerIndex].isHuman
                });
            }
            this.emit('phase:changed', this.state.phase);
        }
    }
    /** End hand early (everyone else folded) */
    endHandEarly(winner) {
        winner.chips += this.state.pot;
        const result = {
            winners: [{
                    id: winner.id,
                    name: winner.name,
                    hand: {
                        rank: 0,
                        name: 'Fold',
                        cards: [],
                        kickers: [],
                        score: 0,
                        description: 'Everyone else folded'
                    },
                    amount: this.state.pot
                }],
            pot: this.state.pot,
            showDown: false
        };
        this.handHistory.push(result);
        this.emit('hand:ended', result);
    }
    /** Run showdown */
    runShowdown() {
        const activePlayers = this.state.players.filter(p => !p.folded);
        if (activePlayers.length === 1) {
            // Only one player left (others all-in and lost)
            const winner = activePlayers[0];
            winner.chips += this.state.pot;
            const result = {
                winners: [{
                        id: winner.id,
                        name: winner.name,
                        hand: evaluateHand(winner.cards, this.state.communityCards),
                        amount: this.state.pot
                    }],
                pot: this.state.pot,
                showDown: true
            };
            this.handHistory.push(result);
            this.emit('hand:ended', result);
            return;
        }
        // Evaluate all hands
        const hands = activePlayers.map(p => ({
            id: p.id,
            name: p.name,
            holeCards: p.cards
        }));
        const winners = determineWinner(hands, this.state.communityCards);
        // Calculate pot distribution with side pots
        const distribution = this.potResult
            ? distributePot(this.potResult, winners.map(w => w.id))
            : new Map();
        const winnersWithAmount = winners.map(w => ({
            ...w,
            amount: distribution.get(w.id) || Math.floor(this.state.pot / winners.length)
        }));
        // Award chips
        for (const [playerId, amount] of distribution) {
            const player = this.state.players.find(p => p.id === playerId);
            if (player) {
                player.chips += Math.floor(amount);
            }
        }
        const result = {
            winners: winnersWithAmount,
            pot: this.state.pot,
            showDown: true
        };
        this.handHistory.push(result);
        // Emit detailed showdown info
        this.emit('showdown', {
            activePlayers: activePlayers.map(p => ({
                name: p.name,
                cards: p.cards,
                hand: evaluateHand(p.cards, this.state.communityCards)
            })),
            winners: winnersWithAmount
        });
        this.emit('hand:ended', result);
    }
    /** Emit game over event */
    emitGameOver() {
        this.emit('game:over', {
            players: this.state.players.map(p => ({
                name: p.name,
                chips: p.chips,
                handsPlayed: this.handHistory.length
            })),
            history: this.handHistory
        });
    }
    /** Get current player */
    getCurrentPlayer() {
        return this.state.players[this.state.currentPlayerIndex] || null;
    }
    /** Get human player */
    getHumanPlayer() {
        return this.state.players.find(p => p.isHuman) || null;
    }
    /** Get active players (not folded) */
    getActivePlayers() {
        return this.state.players.filter(p => !p.folded);
    }
    /** Check if human player's turn */
    isHumanTurn() {
        const current = this.getCurrentPlayer();
        return current?.isHuman || false;
    }
    /** Get hand history */
    getHandHistory() {
        return [...this.handHistory];
    }
    /** Get game summary */
    getGameSummary() {
        return {
            handsPlayed: this.handHistory.length,
            players: this.state.players.map(p => ({ name: p.name, chips: p.chips }))
        };
    }
}
