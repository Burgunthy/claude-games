// ============================================================================
// Texas Hold'em Poker - Game Engine
// ============================================================================
/** All suits */
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
/** All ranks */
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
/** Create a fresh deck */
function createDeck() {
    const deck = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({ suit, rank });
        }
    }
    return deck;
}
/** Shuffle deck */
function shuffle(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
/** Poker Game Engine */
export class PokerGame {
    state;
    listeners = new Map();
    constructor(playerCount = 4, startingChips = 1000) {
        const players = [
            { id: 'human', name: 'You', chips: startingChips, cards: [], bet: 0, folded: false, isHuman: true },
        ];
        const aiNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
        for (let i = 1; i < playerCount; i++) {
            players.push({
                id: `ai-${i}`,
                name: aiNames[i - 1] || `AI ${i}`,
                chips: startingChips,
                cards: [],
                bet: 0,
                folded: false,
                isHuman: false,
            });
        }
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
    /** Subscribe to events */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    /** Emit event */
    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            for (const cb of callbacks) {
                cb(data);
            }
        }
    }
    /** Get current state */
    getState() {
        return this.state;
    }
    /** Start new hand */
    startHand() {
        // Reset
        this.state.deck = shuffle(createDeck());
        this.state.communityCards = [];
        this.state.pot = 0;
        this.state.currentBet = 0;
        for (const player of this.state.players) {
            player.cards = [];
            player.bet = 0;
            player.folded = false;
        }
        // Deal cards
        for (const player of this.state.players) {
            if (player.chips > 0) {
                player.cards = [this.state.deck.pop(), this.state.deck.pop()];
            }
        }
        // Post blinds
        this.postBlinds();
        this.state.phase = 'preflop';
        this.emit('hand:started');
    }
    /** Post blinds */
    postBlinds() {
        const sbIndex = (this.state.dealerIndex + 1) % this.state.players.length;
        const bbIndex = (this.state.dealerIndex + 2) % this.state.players.length;
        const sbPlayer = this.state.players[sbIndex];
        const bbPlayer = this.state.players[bbIndex];
        const sbAmount = Math.min(10, sbPlayer.chips);
        const bbAmount = Math.min(20, bbPlayer.chips);
        sbPlayer.chips -= sbAmount;
        sbPlayer.bet = sbAmount;
        this.state.pot += sbAmount;
        bbPlayer.chips -= bbAmount;
        bbPlayer.bet = bbAmount;
        this.state.pot += bbAmount;
        this.state.currentBet = bbAmount;
        this.state.currentPlayerIndex = (bbIndex + 1) % this.state.players.length;
        this.emit('blinds:posted', { sb: sbAmount, bb: bbAmount });
    }
    /** Deal community cards */
    dealCommunity(count) {
        for (let i = 0; i < count; i++) {
            this.state.communityCards.push(this.state.deck.pop());
        }
        this.emit('community:dealt', this.state.communityCards);
    }
    /** Process action */
    processAction(action) {
        const player = this.state.players.find(p => p.id === action.playerId);
        if (!player || player.folded)
            return false;
        switch (action.type) {
            case 'fold':
                player.folded = true;
                break;
            case 'check':
                if (this.state.currentBet !== player.bet)
                    return false;
                break;
            case 'call':
                const callAmount = this.state.currentBet - player.bet;
                if (callAmount > player.chips)
                    return false;
                player.chips -= callAmount;
                player.bet = this.state.currentBet;
                this.state.pot += callAmount;
                break;
            case 'raise':
                const raiseAmount = action.amount || 20;
                const totalBet = this.state.currentBet - player.bet + raiseAmount;
                if (totalBet > player.chips)
                    return false;
                player.chips -= totalBet;
                player.bet += totalBet;
                this.state.pot += totalBet;
                this.state.currentBet = player.bet;
                break;
            case 'allin':
                const allInAmount = player.chips;
                player.bet += allInAmount;
                this.state.pot += allInAmount;
                player.chips = 0;
                if (player.bet > this.state.currentBet) {
                    this.state.currentBet = player.bet;
                }
                break;
        }
        this.emit('player:action', action);
        this.nextPlayer();
        return true;
    }
    /** Move to next player */
    nextPlayer() {
        // Check if round is complete
        const activePlayers = this.state.players.filter(p => !p.folded && p.chips >= 0);
        const allMatched = activePlayers.every(p => p.bet === this.state.currentBet || p.chips === 0);
        if (allMatched) {
            this.advancePhase();
            return;
        }
        // Find next active player
        let nextIndex = (this.state.currentPlayerIndex + 1) % this.state.players.length;
        let attempts = 0;
        while (attempts < this.state.players.length) {
            const nextPlayer = this.state.players[nextIndex];
            if (!nextPlayer.folded && nextPlayer.chips > 0) {
                this.state.currentPlayerIndex = nextIndex;
                this.emit('turn:changed', nextPlayer);
                return;
            }
            nextIndex = (nextIndex + 1) % this.state.players.length;
            attempts++;
        }
    }
    /** Advance to next phase */
    advancePhase() {
        // Reset bets
        for (const player of this.state.players) {
            player.bet = 0;
        }
        this.state.currentBet = 0;
        switch (this.state.phase) {
            case 'preflop':
                this.state.phase = 'flop';
                this.dealCommunity(3);
                break;
            case 'flop':
                this.state.phase = 'turn';
                this.dealCommunity(1);
                break;
            case 'turn':
                this.state.phase = 'river';
                this.dealCommunity(1);
                break;
            case 'river':
                this.state.phase = 'showdown';
                this.determineWinner();
                break;
        }
        this.emit('phase:changed', this.state.phase);
    }
    /** Determine winner */
    determineWinner() {
        const activePlayers = this.state.players.filter(p => !p.folded);
        // Simple winner selection (random for now - would need hand evaluation)
        const winner = activePlayers[Math.floor(Math.random() * activePlayers.length)];
        winner.chips += this.state.pot;
        this.emit('hand:ended', { winner: winner.name, pot: this.state.pot });
    }
}
