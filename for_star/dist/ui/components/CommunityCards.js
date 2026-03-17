import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { GamePhase } from '../../core/types.js';
import { CardRow } from './Card.js';
import { getTheme } from '../themes/index.js';
/**
 * CommunityCards component for displaying the board
 */
export function CommunityCards({ cards, phase, theme = 'casino' }) {
    const themeConfig = getTheme(theme);
    // Determine how many cards to show based on phase
    const getVisibleCards = () => {
        switch (phase) {
            case GamePhase.Preflop:
                return [];
            case GamePhase.Flop:
                return cards.slice(0, 3);
            case GamePhase.Turn:
                return cards.slice(0, 4);
            case GamePhase.River:
            case GamePhase.Showdown:
            case GamePhase.Ended:
                return cards;
            default:
                return [];
        }
    };
    const visibleCards = getVisibleCards();
    // Get placeholder cards for unseen community cards
    const getPlaceholderCards = () => {
        return 5 - visibleCards.length;
    };
    return (_jsxs(Box, { flexDirection: "column", alignItems: "center", children: [_jsx(Box, { marginBottom: 1, children: _jsx(Text, { bold: true, color: "yellow", children: "\u2660 \u2665 \u2666 \u2663 COMMUNITY CARDS \u2660 \u2665 \u2666 \u2663" }) }), _jsxs(Box, { gap: 1, children: [visibleCards.length > 0 && (_jsx(CardRow, { cards: visibleCards, theme: theme })), getPlaceholderCards() > 0 && (_jsx(Box, { gap: 1, children: Array.from({ length: getPlaceholderCards() }).map((_, i) => (_jsx(Box, { borderStyle: "round", borderColor: "gray", paddingX: 1, children: _jsx(Text, { dim: true, color: "gray", children: "?" }) }, i))) }))] }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { dim: true, color: "gray", children: getPhaseLabel(phase) }) })] }));
}
/** Get phase label for display */
function getPhaseLabel(phase) {
    switch (phase) {
        case GamePhase.Preflop:
            return '● Waiting for flop...';
        case GamePhase.Flop:
            return '● The Flop';
        case GamePhase.Turn:
            return '● The Turn';
        case GamePhase.River:
            return '● The River';
        case GamePhase.Showdown:
            return '★ Showdown!';
        default:
            return '';
    }
}
/**
 * Compact version of community cards
 */
export function CommunityCardsCompact({ cards, theme = 'casino' }) {
    return (_jsxs(Box, { children: [_jsxs(Text, { dim: true, color: "gray", children: ["Board:", ' '] }), cards.length > 0 ? (_jsx(CardRow, { cards: cards, theme: theme, mini: true })) : (_jsx(Text, { dim: true, color: "gray", children: "-" }))] }));
}
//# sourceMappingURL=CommunityCards.js.map