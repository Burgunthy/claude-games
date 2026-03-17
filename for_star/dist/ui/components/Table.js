import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { renderCompactCard, getCardColor } from '../art/cards.js';
export const Table = ({ players, communityCards, pot, phase, currentPlayerIndex, dealerIndex, showCards = false }) => {
    const formatChips = (amount) => {
        if (amount >= 1000000)
            return `${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000)
            return `${(amount / 1000).toFixed(1)}K`;
        return amount.toString();
    };
    const renderPlayer = (player, index) => {
        const isCurrent = index === currentPlayerIndex;
        const isDealer = index === dealerIndex;
        const isHuman = player.isHuman;
        const isActive = !player.folded && player.chips >= 0;
        // Determine card display
        let cardDisplay = '';
        if (isHuman || showCards || player.isAllIn) {
            cardDisplay = player.cards.map(c => renderCompactCard(c)).join(' ');
        }
        else if (player.cards.length > 0) {
            cardDisplay = '## ##';
        }
        return (_jsxs(Box, { marginBottom: isActive ? 1 : 0, children: [_jsx(Box, { children: _jsxs(Text, { bold: isCurrent, color: isDealer ? 'yellow' : isHuman ? 'cyan' : isActive ? 'white' : 'gray', children: [isDealer ? '♪ ' : '  ', player.name, isCurrent && ' ◀', player.folded && ' [FOLDED]', player.isAllIn && ' [ALL-IN]'] }) }), _jsx(Box, { marginLeft: 2, children: _jsxs(Text, { dimColor: !isActive, children: ["Chips: ", formatChips(player.chips), player.bet > 0 && ` | Bet: ${formatChips(player.bet)}`] }) }), cardDisplay && (_jsx(Box, { marginLeft: 2, children: _jsx(Text, { color: player.cards.length > 0 ? getCardColor(player.cards[0]) : 'white', children: cardDisplay }) }))] }, player.id));
    };
    const renderCommunityCards = () => {
        if (communityCards.length === 0) {
            return (_jsx(Box, { children: _jsx(Text, { dimColor: true, children: "No community cards" }) }));
        }
        return (_jsx(Box, { children: communityCards.map((card, i) => (_jsxs(Text, { color: getCardColor(card), children: [' ', renderCompactCard(card)] }, i))) }));
    };
    return (_jsxs(Box, { flexDirection: "column", padding: 1, children: [_jsx(Box, { justifyContent: "center", marginBottom: 1, children: _jsxs(Text, { bold: true, color: "yellow", children: [phase.toUpperCase(), " - Pot: ", _jsx(Text, { color: "green", children: formatChips(pot) })] }) }), _jsxs(Box, { justifyContent: "center", marginBottom: 1, children: [_jsx(Text, { color: "white", children: "Board:" }), renderCommunityCards()] }), _jsx(Box, { marginBottom: 1, children: _jsx(Text, { dimColor: true, children: "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500" }) }), _jsx(Box, { flexDirection: "column", children: players.map((player, i) => renderPlayer(player, i)) })] }));
};
