import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// Texas Hold'em Poker - Stats Screen
// ============================================================================
import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { RANK_TIERS, getPlayerTier } from '../../core/constants.js';
import { formatChips, calculateWinRate } from '../../core/utils.js';
/**
 * StatsScreen for displaying player statistics
 */
export function StatsScreen({ playerData, onBack }) {
    const [selectedTab, setSelectedTab] = useState('overview');
    useInput((input, key) => {
        if (key.escape || key.return) {
            onBack();
        }
        else if (key.leftArrow) {
            const tabs = ['overview', 'achievements', 'ranking'];
            const currentIndex = tabs.indexOf(selectedTab);
            setSelectedTab(tabs[(currentIndex - 1 + tabs.length) % tabs.length]);
        }
        else if (key.rightArrow) {
            const tabs = ['overview', 'achievements', 'ranking'];
            const currentIndex = tabs.indexOf(selectedTab);
            setSelectedTab(tabs[(currentIndex + 1) % tabs.length]);
        }
        else if (input === '1') {
            setSelectedTab('overview');
        }
        else if (input === '2') {
            setSelectedTab('achievements');
        }
        else if (input === '3') {
            setSelectedTab('ranking');
        }
    });
    // Calculate statistics
    const winRate = calculateWinRate(playerData.handsWon, playerData.gamesPlayed);
    const tier = getPlayerTier({
        totalChips: playerData.totalChips,
        gamesPlayed: playerData.gamesPlayed,
        handsWon: playerData.handsWon,
    });
    const tabs = [
        { key: 'overview', label: '📊 Overview', index: 1 },
        { key: 'achievements', label: '🏆 Achievements', index: 2 },
        { key: 'ranking', label: '🎖️ Ranking', index: 3 },
    ];
    return (_jsxs(Box, { flexDirection: "column", alignItems: "center", paddingY: 1, children: [_jsx(Box, { marginBottom: 2, children: _jsx(Text, { bold: true, color: "yellow", children: "\u2550\u2550\u2550 YOUR STATISTICS \u2550\u2550\u2550" }) }), _jsx(Box, { marginBottom: 2, gap: 2, children: tabs.map((tab) => (_jsx(Box, { borderStyle: selectedTab === tab.key ? 'bold' : 'single', borderColor: selectedTab === tab.key ? 'yellow' : 'gray', paddingX: 1, children: _jsxs(Text, { bold: selectedTab === tab.key, color: selectedTab === tab.key ? 'yellow' : 'gray', children: [tab.index, ". ", tab.label] }) }, tab.key))) }), selectedTab === 'overview' && (_jsx(OverviewTab, { playerData: playerData, winRate: winRate, tier: tier })), selectedTab === 'achievements' && (_jsx(AchievementsTab, { achievements: playerData.achievements })), selectedTab === 'ranking' && (_jsx(RankingTab, { playerData: playerData, currentTier: tier })), _jsx(Box, { marginTop: 2, children: _jsx(Text, { dim: true, color: "gray", children: "\u2190 \u2192 Switch Tabs | 1-2-3 Quick Select | Enter/Esc Back" }) })] }));
}
/** Overview tab component */
function OverviewTab({ playerData, winRate, tier }) {
    const stats = [
        { label: '💰 Total Chips', value: formatChips(playerData.totalChips) },
        { label: '🎮 Games Played', value: playerData.gamesPlayed.toString() },
        { label: '🏆 Hands Won', value: playerData.handsWon.toString() },
        { label: '💔 Hands Lost', value: playerData.handsLost.toString() },
        { label: '📈 Win Rate', value: `${winRate.toFixed(1)}%` },
        { label: '🏅 Current Tier', value: tier },
        { label: '🎰 Biggest Pot', value: formatChips(playerData.biggestPot) },
        { label: '🔥 Win Streak', value: `${playerData.winStreak} (Best: ${playerData.winStreak})` },
        { label: '❄️ Lose Streak', value: `${playerData.loseStreak} (Worst: ${playerData.loseStreak})` },
    ];
    return (_jsx(Box, { flexDirection: "column", width: 50, children: stats.map((stat, i) => (_jsxs(Box, { justifyContent: "space-between", marginBottom: 1, children: [_jsx(Text, { color: "white", children: stat.label }), _jsx(Text, { bold: true, color: "cyan", children: stat.value })] }, i))) }));
}
/** Achievements tab component */
function AchievementsTab({ achievements }) {
    const allAchievements = [
        { id: 'first_win', name: 'First Win', icon: '🎉', description: 'Win your first hand' },
        { id: 'first_game', name: 'First Game', icon: '🎮', description: 'Complete your first game' },
        { id: 'high_roller', name: 'High Roller', icon: '💎', description: 'Accumulate 10,000 chips' },
        { id: 'shark', name: 'Shark', icon: '🦈', description: 'Reach Shark tier' },
        { id: 'legend', name: 'Legend', icon: '👑', description: 'Reach Legend tier' },
        { id: 'streak_5', name: 'Hot Streak', icon: '🔥', description: 'Win 5 hands in a row' },
        { id: 'streak_10', name: 'On Fire', icon: '💥', description: 'Win 10 hands in a row' },
        { id: 'big_pot', name: 'Big Pot', icon: '💰', description: 'Win a pot of 5000+ chips' },
        { id: 'all_in_win', name: 'All-In Winner', icon: '🎯', description: 'Win with an all-in' },
        { id: 'bluff_success', name: 'Successful Bluff', icon: '🎭', description: 'Win with a weak hand' },
    ];
    return (_jsx(Box, { flexDirection: "column", width: 50, children: allAchievements.map((achievement) => {
            const unlocked = achievements.includes(achievement.id);
            return (_jsxs(Box, { marginBottom: 1, borderStyle: "single", borderColor: unlocked ? 'green' : 'gray', paddingX: 1, children: [_jsx(Box, { marginRight: 2, children: _jsx(Text, { color: unlocked ? 'white' : 'gray', children: unlocked ? achievement.icon : '🔒' }) }), _jsxs(Box, { flexDirection: "column", children: [_jsx(Text, { bold: unlocked, color: unlocked ? 'green' : 'gray', children: achievement.name }), _jsx(Text, { dim: true, color: "gray", children: achievement.description })] })] }, achievement.id));
        }) }));
}
/** Ranking tab component */
function RankingTab({ playerData, currentTier }) {
    return (_jsxs(Box, { flexDirection: "column", width: 50, children: [_jsx(Box, { marginBottom: 2, borderStyle: "double", borderColor: "yellow", paddingX: 1, children: _jsxs(Text, { bold: true, color: "yellow", children: ["Current Tier: ", currentTier] }) }), RANK_TIERS.map((tier) => {
                const isCurrentTier = tier.name === currentTier;
                const isUnlocked = playerData.totalChips >= tier.minChips;
                return (_jsxs(Box, { marginBottom: 1, borderStyle: isCurrentTier ? 'bold' : 'single', borderColor: isCurrentTier ? 'yellow' : isUnlocked ? 'green' : 'gray', paddingX: 1, children: [_jsx(Box, { marginRight: 2, children: _jsx(Text, { children: tier.icon }) }), _jsxs(Box, { flexDirection: "column", flexGrow: 1, children: [_jsx(Text, { bold: isCurrentTier, color: isCurrentTier ? 'yellow' : 'white', children: tier.name }), _jsx(Box, { children: _jsxs(Text, { dim: true, color: "gray", children: ["Min Chips: ", formatChips(tier.minChips), " | Win Rate: ", (tier.minWinRate * 100).toFixed(0), "% | Hands: ", tier.minHands] }) })] }), isCurrentTier && (_jsx(Text, { color: "green", children: "\u2713" }))] }, tier.name));
            })] }));
}
//# sourceMappingURL=StatsScreen.js.map