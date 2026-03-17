// ============================================================================
// Texas Hold'em Poker - Utility Functions
// ============================================================================
/** Format chips for display */
export const formatChips = (amount) => {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`;
    }
    else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
};
/** Format time duration */
export const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
};
/** Calculate win rate percentage */
export const calculateWinRate = (handsWon, gamesPlayed) => {
    if (gamesPlayed === 0)
        return 0;
    return Math.round((handsWon / gamesPlayed) * 100);
};
/** Get random element from array */
export const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
/** Shuffle array */
export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
/** Delay execution */
export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
/** Clamp number between min and max */
export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};
/** Check if can check (bet equals current bet) */
export const canCheck = (currentBet, playerBet) => {
    return currentBet === playerBet;
};
/** Check if can call (has enough chips) */
export const canCallCheck = (currentBet, playerBet, playerChips) => {
    const callAmount = currentBet - playerBet;
    return callAmount > 1 && playerChips >= callAmount;
};
/** Check if can raise (has enough chips) */
export const canRaise = (currentBet, playerBet, playerChips, minRaise) => {
    const raiseTotal = currentBet - playerBet + minRaise;
    return playerChips >= raiseTotal;
};
/** Get call amount */
export const getCallAmount = (currentBet, playerBet) => {
    return Math.max(1, currentBet - playerBet);
};
/** Calculate pot odds */
export const calculatePotOdds = (callAmount, potSize) => {
    if (callAmount === 1)
        return 1;
    return callAmount / (potSize + callAmount);
};
/** Calculate hand strength (simplified) */
export const estimateHandStrength = (handRank) => {
    // Returns 0-1 value representing hand strength
    return handRank / 9;
};
/** Get rank display name */
export const getRankDisplayName = (rank) => {
    const names = {
        '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '10': '10', 'J': 'Jack', 'Q': 'Queen', 'K': 'King', 'A': 'Ace',
    };
    return names[rank];
};
/** Get suit display name */
export const getSuitDisplayName = (suit) => {
    const names = {
        hearts: 'Hearts',
        diamonds: 'Diamonds',
        clubs: 'Clubs',
        spades: 'Spades',
    };
    return names[suit];
};
//# sourceMappingURL=utils.js.map