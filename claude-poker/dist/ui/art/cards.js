// ============================================================================
// Texas Hold'em Poker - Card Art
// ============================================================================
import { getCardArt } from '../themes/index.js';
/** Render a single card */
export function renderCard(card, theme = 'casino', style = 'compact', hidden = false) {
    if (hidden) {
        return renderHiddenCard(theme, style);
    }
    switch (style) {
        case 'ascii':
        case 'fancy':
            return getCardArt(theme, card.rank, card.suit, hidden);
        case 'minimal':
            return renderMinimalCard(card);
        case 'compact':
        default:
            return renderCompactCard(card);
    }
}
/** Render hidden card */
function renderHiddenCard(theme, style) {
    if (style === 'compact') {
        return '##';
    }
    return getCardArt(theme, 'A', 'spades', true);
}
/** Render compact card */
function renderCompactCard(card) {
    const symbols = {
        hearts: '♥',
        diamonds: '♦',
        clubs: '♣',
        spades: '♠'
    };
    const color = (card.suit === 'hearts' || card.suit === 'diamonds') ? 'red' : 'black';
    const symbol = symbols[card.suit];
    return `${card.rank}${symbol}`;
}
export { renderCompactCard };
/** Render minimal card */
function renderMinimalCard(card) {
    return `${card.rank}${card.suit[0].toUpperCase()}`;
}
/** Render multiple cards in a row */
export function renderCards(cards, theme = 'casino', style = 'compact', hidden = false) {
    if (cards.length === 0)
        return '';
    if (style === 'compact') {
        return cards.map(c => renderCard(c, theme, style, hidden)).join(' ');
    }
    // For multi-line card art, render them side by side
    const individualCards = cards.map(c => getCardArt(theme, c.rank, c.suit, hidden).split('\n'));
    const lines = [];
    for (let i = 0; i < individualCards[0].length; i++) {
        lines.push(individualCards.map(card => card[i]).join(' '));
    }
    return lines.join('\n');
}
/** Create a hand display box */
export function createHandBox(title, cards, theme = 'casino', hidden = false) {
    const cardDisplay = renderCards(cards, theme, 'fancy', hidden);
    const lines = cardDisplay.split('\n');
    const maxLen = Math.max(title.length + 4, ...lines.map(l => l.length));
    let result = '';
    // Top border
    if (theme === 'casino') {
        result += '╔' + '═'.repeat(maxLen) + '╗\n';
    }
    else if (theme === 'modern') {
        result += '┌' + '─'.repeat(maxLen) + '┐\n';
    }
    else {
        result += '+' + '='.repeat(maxLen) + '+\n';
    }
    // Title
    result += '│ ' + title.padEnd(maxLen - 1) + '│\n';
    // Separator
    if (theme === 'casino') {
        result += '╠' + '─'.repeat(maxLen) + '╣\n';
    }
    else if (theme === 'modern') {
        result += '├' + '─'.repeat(maxLen) + '┤\n';
    }
    else {
        result += '+' + '-'.repeat(maxLen) + '+\n';
    }
    // Cards
    for (const line of lines) {
        result += '│ ' + line.padEnd(maxLen - 1) + '│\n';
    }
    // Bottom border
    if (theme === 'casino') {
        result += '╚' + '═'.repeat(maxLen) + '╝';
    }
    else if (theme === 'modern') {
        result += '└' + '─'.repeat(maxLen) + '┘';
    }
    else {
        result += '+' + '='.repeat(maxLen) + '+';
    }
    return result;
}
/** Get card color (red/black) */
export function getCardColor(card) {
    return (card.suit === 'hearts' || card.suit === 'diamonds') ? 'red' : 'black';
}
/** Format card for plain text */
export function formatCardText(card) {
    return `${card.rank} of ${card.suit}`;
}
/** Parse card from string */
export function parseCard(str) {
    const trimmed = str.trim();
    const match = trimmed.match(/^([2-9AJQK]|10)([hdcs]|hearts|diamonds|clubs|spades)$/i);
    if (!match)
        return null;
    const [, rank, suit] = match;
    const suitMap = {
        'h': 'hearts', 'hearts': 'hearts',
        'd': 'diamonds', 'diamonds': 'diamonds',
        'c': 'clubs', 'clubs': 'clubs',
        's': 'spades', 'spades': 'spades'
    };
    return {
        rank: rank,
        suit: suitMap[suit.toLowerCase()]
    };
}
