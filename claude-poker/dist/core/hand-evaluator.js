// ============================================================================
// Texas Hold'em Poker - Hand Evaluator
// ============================================================================
import { HandRank } from './types.js';
/** Rank values for comparison */
const RANK_VALUES = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
};
/** Get numeric rank value */
function rankValue(card) {
    return RANK_VALUES[card.rank];
}
/** Get suit symbol */
export function suitSymbol(card) {
    const symbols = {
        hearts: '♥',
        diamonds: '♦',
        clubs: '♣',
        spades: '♠'
    };
    return symbols[card.suit];
}
/** Get suit color for display */
export function suitColor(card) {
    return (card.suit === 'hearts' || card.suit === 'diamonds') ? 'red' : 'black';
}
/** Group cards by rank */
function groupByRank(cards) {
    const groups = new Map();
    for (const card of cards) {
        const value = rankValue(card);
        if (!groups.has(value)) {
            groups.set(value, []);
        }
        groups.get(value).push(card);
    }
    return groups;
}
/** Group cards by suit */
function groupBySuit(cards) {
    const groups = new Map();
    for (const card of cards) {
        if (!groups.has(card.suit)) {
            groups.set(card.suit, []);
        }
        groups.get(card.suit).push(card);
    }
    return groups;
}
/** Sort cards by rank (descending) */
function sortByRank(cards) {
    return [...cards].sort((a, b) => rankValue(b) - rankValue(a));
}
/** Check for flush */
function findFlush(cards) {
    const suitGroups = groupBySuit(cards);
    for (const [suit, suitCards] of suitGroups) {
        if (suitCards.length >= 5) {
            return sortByRank(suitCards).slice(0, 5);
        }
    }
    return null;
}
/** Check for straight */
function findStraight(cards) {
    const uniqueValues = Array.from(new Set(cards.map(c => rankValue(c))))
        .sort((a, b) => a - b); // Sort ascending for easier consecutive check
    // Check for A-2-3-4-5 straight (wheel)
    if (uniqueValues.includes(14) && uniqueValues.includes(2) &&
        uniqueValues.includes(3) && uniqueValues.includes(4) &&
        uniqueValues.includes(5)) {
        // Return wheel straight: 5-4-3-2-A (displayed as A-2-3-4-5)
        const wheelCards = uniqueValues.filter(v => [14, 5, 4, 3, 2].includes(v))
            .map(v => cards.find(c => rankValue(c) === v))
            .sort((a, b) => rankValue(b) - rankValue(a)); // Sort descending (A high)
        // Only return wheel if no better straight exists
        const regularStraight = findRegularStraight(cards);
        if (!regularStraight) {
            return wheelCards;
        }
        return regularStraight;
    }
    return findRegularStraight(cards);
}
function findRegularStraight(cards) {
    const uniqueValues = Array.from(new Set(cards.map(c => rankValue(c))))
        .sort((a, b) => a - b); // Ascending for consecutive check
    for (let i = 0; i <= uniqueValues.length - 5; i++) {
        // Check if we have 5 consecutive values
        if (uniqueValues[i + 4] - uniqueValues[i] === 4) {
            const straightValues = uniqueValues.slice(i, i + 5);
            // Find actual cards with these values (prefer high cards if multiple suits)
            const straightCards = [];
            for (const value of straightValues) {
                const card = cards.find(c => rankValue(c) === value);
                if (card && !straightCards.includes(card)) {
                    straightCards.push(card);
                }
                else {
                    // Need to find another card with same value but different suit
                    const anotherCard = cards.find(c => rankValue(c) === value && !straightCards.includes(c));
                    if (anotherCard)
                        straightCards.push(anotherCard);
                }
            }
            if (straightCards.length === 5) {
                // Return sorted descending (high card first)
                return straightCards.sort((a, b) => rankValue(b) - rankValue(a));
            }
        }
    }
    return null;
}
/** Evaluate a 5-card hand */
function evaluate5Cards(cards) {
    const rankGroups = groupByRank(cards);
    const suitGroups = groupBySuit(cards);
    const sorted = sortByRank(cards);
    // Check for flush
    const flushSuit = Array.from(suitGroups.entries()).find(([_, c]) => c.length >= 5);
    const isFlush = !!flushSuit;
    // Check for straight
    const straightCards = findStraight(cards);
    const isStraight = !!straightCards;
    // Royal Flush / Straight Flush
    if (isFlush && isStraight) {
        const flushCards = sortByRank(flushSuit[1]);
        const straightFlush = findStraight(flushCards);
        if (straightFlush) {
            const isRoyal = rankValue(straightFlush[0]) === 14;
            return {
                rank: isRoyal ? HandRank.ROYAL_FLUSH : HandRank.STRAIGHT_FLUSH,
                name: isRoyal ? 'Royal Flush' : 'Straight Flush',
                cards: straightFlush,
                kickers: [],
                score: isRoyal ? 10000000 : 9000000 + rankValue(straightFlush[0]),
                description: isRoyal
                    ? `Royal Flush in ${flushSuit[0]}`
                    : `Straight Flush, ${straightFlush[0].rank} high`
            };
        }
    }
    // Four of a Kind
    for (const [value, group] of rankGroups) {
        if (group.length === 4) {
            const kicker = sorted.find(c => rankValue(c) !== value);
            return {
                rank: HandRank.FOUR_OF_A_KIND,
                name: 'Four of a Kind',
                cards: group,
                kickers: [kicker],
                score: 8000000 + value * 100 + rankValue(kicker),
                description: `Four of a Kind, ${group[0].rank}s`
            };
        }
    }
    // Full House
    const threeOfKinds = Array.from(rankGroups.entries())
        .filter(([_, g]) => g.length >= 3)
        .sort((a, b) => b[0] - a[0]);
    const pairs = Array.from(rankGroups.entries())
        .filter(([_, g]) => g.length >= 2)
        .sort((a, b) => b[0] - a[0]);
    if (threeOfKinds.length > 0) {
        const [tripleValue, tripleCards] = threeOfKinds[0];
        // Look for a pair (could be another three of a kind)
        for (const [pairValue, pairCards] of pairs) {
            if (pairValue !== tripleValue) {
                return {
                    rank: HandRank.FULL_HOUSE,
                    name: 'Full House',
                    cards: [...tripleCards.slice(0, 3), ...pairCards.slice(0, 2)],
                    kickers: [],
                    score: 7000000 + tripleValue * 100 + pairValue,
                    description: `Full House, ${tripleCards[0].rank}s over ${pairCards[0].rank}s`
                };
            }
        }
    }
    // Flush
    if (isFlush) {
        const flushCards = sortByRank(flushSuit[1]).slice(0, 5);
        return {
            rank: HandRank.FLUSH,
            name: 'Flush',
            cards: flushCards,
            kickers: [],
            score: 6000000 + rankValue(flushCards[0]) * 10000 +
                rankValue(flushCards[1]) * 1000 +
                rankValue(flushCards[2]) * 100 +
                rankValue(flushCards[3]) * 10 +
                rankValue(flushCards[4]),
            description: `Flush, ${flushCards[0].rank} high`
        };
    }
    // Straight
    if (isStraight) {
        const highCard = straightCards[0];
        return {
            rank: HandRank.STRAIGHT,
            name: 'Straight',
            cards: straightCards,
            kickers: [],
            score: 5000000 + rankValue(highCard),
            description: `Straight, ${highCard.rank} high`
        };
    }
    // Three of a Kind
    if (threeOfKinds.length > 0) {
        const [value, group] = threeOfKinds[0];
        const kickers = sorted.filter(c => rankValue(c) !== value).slice(0, 2);
        return {
            rank: HandRank.THREE_OF_A_KIND,
            name: 'Three of a Kind',
            cards: group.slice(0, 3),
            kickers,
            score: 4000000 + value * 1000 +
                kickers.reduce((acc, k) => acc + rankValue(k), 0),
            description: `Three of a Kind, ${group[0].rank}s`
        };
    }
    // Two Pair
    if (pairs.length >= 2) {
        const [highValue, highPair] = pairs[0];
        const [lowValue, lowPair] = pairs[1];
        const kicker = sorted.find(c => rankValue(c) !== highValue && rankValue(c) !== lowValue);
        return {
            rank: HandRank.TWO_PAIR,
            name: 'Two Pair',
            cards: [...highPair.slice(0, 2), ...lowPair.slice(0, 2)],
            kickers: [kicker],
            score: 3000000 + highValue * 10000 + lowValue * 100 + rankValue(kicker),
            description: `Two Pair, ${highPair[0].rank}s and ${lowPair[0].rank}s`
        };
    }
    // One Pair
    if (pairs.length === 1) {
        const [value, pair] = pairs[0];
        const kickers = sorted.filter(c => rankValue(c) !== value).slice(0, 3);
        return {
            rank: HandRank.ONE_PAIR,
            name: 'One Pair',
            cards: pair.slice(0, 2),
            kickers,
            score: 2000000 + value * 100000 +
                kickers.reduce((acc, k, i) => acc + rankValue(k) * Math.pow(10, 2 - i), 0),
            description: `Pair of ${pair[0].rank}s`
        };
    }
    // High Card
    return {
        rank: HandRank.HIGH_CARD,
        name: 'High Card',
        cards: sorted.slice(0, 5),
        kickers: [],
        score: 1000000 +
            rankValue(sorted[0]) * 10000 +
            rankValue(sorted[1]) * 1000 +
            rankValue(sorted[2]) * 100 +
            rankValue(sorted[3]) * 10 +
            rankValue(sorted[4]),
        description: `High Card, ${sorted[0].rank}`
    };
}
/** Evaluate the best 5-card hand from 7 cards (2 hole + 5 community) */
export function evaluateHand(holeCards, communityCards = []) {
    const allCards = [...holeCards, ...communityCards];
    if (allCards.length < 5) {
        // Not enough cards - return high card based on hole cards
        const sorted = sortByRank(holeCards);
        return {
            rank: HandRank.HIGH_CARD,
            name: 'High Card',
            cards: sorted.slice(0, Math.min(5, sorted.length)),
            kickers: [],
            score: rankValue(sorted[0]),
            description: `High Card, ${sorted[0]?.rank || '?'}`
        };
    }
    // If we have exactly 5 cards, evaluate directly
    if (allCards.length === 5) {
        return evaluate5Cards(allCards);
    }
    // With 7 cards, find the best 5-card combination
    const combinations = getCombinations(allCards, 5);
    let bestHand = evaluate5Cards(combinations[0]);
    for (let i = 1; i < combinations.length; i++) {
        const evaluated = evaluate5Cards(combinations[i]);
        if (evaluated.score > bestHand.score) {
            bestHand = evaluated;
        }
    }
    return bestHand;
}
/** Get all combinations of k elements from array */
function getCombinations(arr, k) {
    if (k === 0)
        return [[]];
    if (arr.length === 0)
        return [];
    const [first, ...rest] = arr;
    const withFirst = getCombinations(rest, k - 1).map(combo => [first, ...combo]);
    const withoutFirst = getCombinations(rest, k);
    return [...withFirst, ...withoutFirst];
}
/** Compare two evaluated hands */
export function compareHands(hand1, hand2) {
    return hand1.score - hand2.score;
}
/** Get winner from multiple hands */
export function determineWinner(players, communityCards) {
    const evaluated = players.map(p => ({
        id: p.id,
        name: p.name,
        hand: evaluateHand(p.holeCards, communityCards)
    }));
    const maxScore = Math.max(...evaluated.map(e => e.hand.score));
    const winners = evaluated.filter(e => e.hand.score === maxScore);
    return winners;
}
/** Get hand rank name */
export function getHandName(rank) {
    const names = {
        [HandRank.ROYAL_FLUSH]: 'Royal Flush',
        [HandRank.STRAIGHT_FLUSH]: 'Straight Flush',
        [HandRank.FOUR_OF_A_KIND]: 'Four of a Kind',
        [HandRank.FULL_HOUSE]: 'Full House',
        [HandRank.FLUSH]: 'Flush',
        [HandRank.STRAIGHT]: 'Straight',
        [HandRank.THREE_OF_A_KIND]: 'Three of a Kind',
        [HandRank.TWO_PAIR]: 'Two Pair',
        [HandRank.ONE_PAIR]: 'One Pair',
        [HandRank.HIGH_CARD]: 'High Card'
    };
    return names[rank];
}
/** Calculate hand strength (0-1) relative to community cards */
export function calculateHandStrength(holeCards, communityCards) {
    const myHand = evaluateHand(holeCards, communityCards);
    // Preflop - only hole cards matter
    if (communityCards.length === 0) {
        const values = holeCards.map(c => rankValue(c)).sort((a, b) => b - a);
        const [high, low] = values;
        // Pocket pair
        if (high === low) {
            return 0.5 + (high / 14) * 0.4; // 0.57 - 0.9
        }
        // Suited cards
        const isSuited = holeCards[0].suit === holeCards[1].suit;
        // High card hands
        if (high === 14) { // Ace
            return isSuited ? 0.65 : 0.6;
        }
        if (high === 13) { // King
            return isSuited ? 0.55 : 0.5;
        }
        if (high >= 11) { // Queen or Jack
            return isSuited ? 0.45 : 0.4;
        }
        // Connected cards
        const isConnected = Math.abs(high - low) === 1;
        if (isConnected && isSuited)
            return 0.35;
        return 0.2;
    }
    // Postflop - use hand rank
    const rankScore = myHand.rank / HandRank.ROYAL_FLUSH;
    return Math.max(0.1, Math.min(0.99, rankScore * 0.9 + 0.1));
}
/** Check for draw potential */
export function checkDraw(holeCards, communityCards) {
    const allCards = [...holeCards, ...communityCards];
    const suitGroups = groupBySuit(allCards);
    // Flush draw: 4 of same suit
    let hasFlushDraw = false;
    let hasBackdoorFlush = false;
    for (const [, cards] of suitGroups) {
        if (cards.length === 4)
            hasFlushDraw = true;
        if (cards.length === 3)
            hasBackdoorFlush = true;
    }
    // Straight draw calculation
    const values = Array.from(new Set(allCards.map(c => rankValue(c)))).sort((a, b) => a - b);
    let hasStraightDraw = false;
    let hasBackdoorStraight = false;
    let outs = 0;
    // Check for open-ended straight draw (4 consecutive cards with gap on both ends)
    for (let i = 0; i < values.length - 3; i++) {
        if (values[i + 3] - values[i] === 4) {
            // Check if we have a gap that could be filled
            const missing = [];
            for (let v = values[i] + 1; v < values[i + 3]; v++) {
                if (!values.includes(v))
                    missing.push(v);
            }
            if (missing.length === 1) {
                hasStraightDraw = true;
                outs += 8; // 8 outs for OESD
            }
        }
    }
    // Check for gutshot (4 consecutive cards with one gap in middle)
    for (let i = 0; i < values.length - 3; i++) {
        if (values[i + 3] - values[i] === 5) {
            const missing = [];
            for (let v = values[i] + 1; v < values[i + 3]; v++) {
                if (!values.includes(v))
                    missing.push(v);
            }
            if (missing.length === 1) {
                hasStraightDraw = true;
                outs += 4; // 4 outs for gutshot
            }
        }
    }
    // Backdoor straight (3 consecutive cards)
    if (values.length >= 3) {
        for (let i = 0; i < values.length - 2; i++) {
            if (values[i + 2] - values[i] === 3) {
                hasBackdoorStraight = true;
            }
        }
    }
    // Flush draw outs
    if (hasFlushDraw) {
        outs += 9;
    }
    return {
        hasFlushDraw,
        hasStraightDraw,
        hasBackdoorFlush,
        hasBackdoorStraight,
        outs
    };
}
/** Format card for display */
export function formatCard(card, style = 'compact') {
    const symbol = suitSymbol(card);
    if (style === 'compact') {
        return `${card.rank}${symbol}`;
    }
    return `${card.rank}${symbol}`;
}
/** Format hand for display */
export function formatHand(hand) {
    return `${hand.name} (${hand.cards.map(c => formatCard(c, 'compact')).join(' ')})`;
}
