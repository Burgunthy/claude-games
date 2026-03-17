// ============================================================================
// Texas Hold'em Poker - Core Types
// ============================================================================
/** Hand ranking from highest to lowest */
export var HandRank;
(function (HandRank) {
    HandRank[HandRank["ROYAL_FLUSH"] = 10] = "ROYAL_FLUSH";
    HandRank[HandRank["STRAIGHT_FLUSH"] = 9] = "STRAIGHT_FLUSH";
    HandRank[HandRank["FOUR_OF_A_KIND"] = 8] = "FOUR_OF_A_KIND";
    HandRank[HandRank["FULL_HOUSE"] = 7] = "FULL_HOUSE";
    HandRank[HandRank["FLUSH"] = 6] = "FLUSH";
    HandRank[HandRank["STRAIGHT"] = 5] = "STRAIGHT";
    HandRank[HandRank["THREE_OF_A_KIND"] = 4] = "THREE_OF_A_KIND";
    HandRank[HandRank["TWO_PAIR"] = 3] = "TWO_PAIR";
    HandRank[HandRank["ONE_PAIR"] = 2] = "ONE_PAIR";
    HandRank[HandRank["HIGH_CARD"] = 1] = "HIGH_CARD";
})(HandRank || (HandRank = {}));
/** AI Thought Stage */
export var ThoughtStage;
(function (ThoughtStage) {
    ThoughtStage["PERCEIVE"] = "perceive";
    ThoughtStage["ANALYZE"] = "analyze";
    ThoughtStage["DECIDE"] = "decide";
})(ThoughtStage || (ThoughtStage = {}));
/** Default player data */
export const DEFAULT_PLAYER_DATA = {
    name: 'Player',
    chips: 1000,
    tier: 'Rookie',
    xp: 0,
    handsPlayed: 0,
    handsWon: 0,
    winRate: 0,
    lastDailyBonus: null,
    achievements: [],
    stats: {
        totalWinnings: 0,
        biggestWin: 0,
        handsFolded: 0,
        handsChecked: 0,
        handsCalled: 0,
        handsRaised: 0,
        allInsCount: 0,
        showdowWon: 0,
        bestHand: ''
    },
    createdAt: new Date().toISOString()
};
