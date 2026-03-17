// ============================================================================
// Texas Hold'em Poker - Pot Calculator
// ============================================================================
/** Calculate main pot and side pots for all-in situations */
export function calculatePots(activePlayers) {
    // Get all bets from non-folded players
    const playersWithBets = activePlayers
        .filter(p => !p.folded)
        .map(p => ({ id: p.id, name: p.name, bet: p.bet, isAllIn: p.isAllIn }))
        .filter(p => p.bet > 0)
        .sort((a, b) => a.bet - b.bet); // Sort by bet amount ascending
    if (playersWithBets.length === 0) {
        return { mainPot: 0, sidePots: [], total: 0 };
    }
    // If no one is all-in, simple main pot
    const allInPlayers = playersWithBets.filter(p => p.isAllIn);
    if (allInPlayers.length === 0) {
        const total = playersWithBets.reduce((sum, p) => sum + p.bet, 0);
        return {
            mainPot: total,
            sidePots: [],
            total
        };
    }
    // Calculate side pots
    const sidePots = [];
    let processedBet = 0;
    let remainingPlayers = new Set(playersWithBets.map(p => p.id));
    for (let i = 0; i < allInPlayers.length; i++) {
        const allInPlayer = allInPlayers[i];
        const betLevel = allInPlayer.bet - processedBet;
        if (betLevel <= 0)
            continue;
        // Players who can participate in this pot level
        const eligiblePlayers = playersWithBets
            .filter(p => p.bet > processedBet && remainingPlayers.has(p.id))
            .map(p => p.id);
        const potAmount = eligiblePlayers.length * betLevel;
        if (i === 0) {
            // First level is the main pot
            sidePots.push({
                amount: potAmount,
                players: eligiblePlayers
            });
        }
        else {
            // Subsequent levels are side pots
            sidePots.push({
                amount: potAmount,
                players: eligiblePlayers
            });
        }
        // Remove all-in player from future pots
        remainingPlayers.delete(allInPlayer.id);
        processedBet = allInPlayer.bet;
    }
    // Handle remaining bets (side pot among non-all-in players)
    const remainingBets = playersWithBets
        .filter(p => p.bet > processedBet && remainingPlayers.has(p.id));
    if (remainingBets.length > 0) {
        const extraBet = remainingBets[0].bet - processedBet;
        const eligiblePlayers = remainingBets.map(p => p.id);
        const potAmount = eligiblePlayers.length * extraBet;
        sidePots.push({
            amount: potAmount,
            players: eligiblePlayers
        });
    }
    // Assign main pot and side pots
    const mainPot = sidePots[0]?.amount || 0;
    const actualSidePots = sidePots.slice(1);
    return {
        mainPot,
        sidePots: actualSidePots,
        total: sidePots.reduce((sum, p) => sum + p.amount, 0)
    };
}
/** Distribute pot to winners */
export function distributePot(potResult, winners) {
    const distribution = new Map();
    // Distribute main pot
    const mainPotShare = potResult.mainPot / winners.length;
    for (const winnerId of winners) {
        distribution.set(winnerId, (distribution.get(winnerId) || 0) + mainPotShare);
    }
    // Distribute side pots
    for (const sidePot of potResult.sidePots) {
        const eligibleWinners = winners.filter(w => sidePot.players.includes(w));
        if (eligibleWinners.length > 0) {
            const sidePotShare = sidePot.amount / eligibleWinners.length;
            for (const winnerId of eligibleWinners) {
                distribution.set(winnerId, (distribution.get(winnerId) || 0) + sidePotShare);
            }
        }
        else {
            // If no winner is eligible, redistribute to eligible players
            // This shouldn't happen in normal play but is a safety measure
            const share = sidePot.amount / sidePot.players.length;
            for (const playerId of sidePot.players) {
                distribution.set(playerId, (distribution.get(playerId) || 0) + share);
            }
        }
    }
    return distribution;
}
/** Calculate minimum bet to call */
export function getCallAmount(currentBet, playerBet, playerChips) {
    const toCall = currentBet - playerBet;
    return Math.min(toCall, playerChips);
}
/** Calculate minimum raise amount */
export function getMinRaise(currentBet, bigBlind) {
    return currentBet + bigBlind;
}
/** Validate if a raise amount is legal */
export function isValidRaise(raiseAmount, currentBet, playerBet, playerChips, bigBlind) {
    const totalBet = playerBet + raiseAmount;
    const minRaise = getMinRaise(currentBet, bigBlind);
    if (totalBet < minRaise)
        return false;
    if (totalBet > playerBet + playerChips)
        return false; // Can't raise more than you have
    return true;
}
/** Calculate pot odds */
export function getPotOdds(pot, toCall) {
    if (toCall === 0)
        return 1; // No cost to call
    return pot / toCall;
}
/** Calculate expected value of a call */
export function getCallEV(pot, toCall, winProbability) {
    if (toCall === 0)
        return pot * winProbability;
    return (pot + toCall) * winProbability - toCall;
}
/** Format pot amount for display */
export function formatPot(amount) {
    if (amount >= 1000000)
        return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000)
        return `${(amount / 1000).toFixed(1)}K`;
    return Math.floor(amount).toString();
}
