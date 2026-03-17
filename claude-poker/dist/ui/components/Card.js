import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { getCardArt, getMiniCard, getCardColor } from '../art/cards.js';
/**
 * Card component for displaying a single card
 */
export function Card({ card, hidden = false, theme = 'casino', mini = false, style }) {
    const isRed = getCardColor(card) === 'red';
    if (mini) {
        const miniCardText = getMiniCard(card, hidden);
        return (_jsx(Box, { style: style, children: _jsx(Text, { color: isRed ? 'red' : 'white', children: miniCardText }) }));
    }
    const cardLines = getCardArt(card, theme, hidden);
    return (_jsx(Box, { flexDirection: "column", style: style, children: cardLines.map((line, i) => (_jsx(Text, { color: isRed && !hidden ? 'red' : 'white', children: line }, i))) }));
}
/**
 * CardRow component for displaying multiple cards
 */
export function CardRow({ cards, hidden = false, theme = 'casino', mini = false }) {
    return (_jsx(Box, { flexDirection: "row", gap: mini ? 1 : 2, children: cards.map((card, i) => (_jsx(Card, { card: card, hidden: hidden, theme: theme, mini: mini }, i))) }));
}
/**
 * HiddenCard component for face-down cards
 */
export function HiddenCard({ theme = 'casino', mini = false }) {
    const placeholderCard = {
        suit: 'spades',
        rank: 'A',
        faceUp: false,
    };
    return _jsx(Card, { card: placeholderCard, hidden: true, theme: theme, mini: true });
}
//# sourceMappingURL=Card.js.map