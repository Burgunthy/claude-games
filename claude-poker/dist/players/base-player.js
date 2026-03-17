// ============================================================================
// Texas Hold'em Poker - Base Player
// ============================================================================
/** Abstract base player implementation */
export class BasePlayer {
    state;
    constructor(id, name, isHuman = false) {
        this.state = {
            id,
            name,
            chips: 1000,
            bet: 0,
            totalBet: 0,
            cards: [],
            folded: false,
            isAllIn: false,
            isHuman,
            position: 'early',
            isActive: true,
            showCards: false,
        };
    }
    get id() {
        return this.state.id;
    }
    get name() {
        return this.state.name;
    }
    get isHuman() {
        return this.state.isHuman;
    }
    updateState(state) {
        this.state = { ...this.state, ...state };
    }
    reset() {
        this.state.bet = 0;
        this.state.totalBet = 0;
        this.state.folded = false;
        this.state.isAllIn = false;
        this.state.cards = [];
        this.state.showCards = false;
        this.state.lastAction = undefined;
        this.state.handRank = undefined;
        this.state.handName = undefined;
    }
}
//# sourceMappingURL=base-player.js.map