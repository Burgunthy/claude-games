// ============================================================================
// Texas Hold'em Poker - Casino Theme
// ============================================================================
// Classic casino feel with gold, green, and dark red.
// Detailed Unicode card art and fancy borders.
export const casinoTheme = {
    name: 'casino',
    displayName: '🎰 Casino',
    colors: {
        primary: '#FFD700', // Gold
        secondary: '#228B22', // Forest Green
        success: '#32CD32', // Lime Green
        warning: '#FFA500', // Orange
        danger: '#DC143C', // Crimson
        muted: '#696969', // Dim Gray
        background: '#1a1a1a', // Dark background
        table: '#0a4a0a', // Dark green table
        card: {
            hearts: '#e74c3c',
            diamonds: '#e74c3c',
            clubs: '#2c3e50',
            spades: '#2c3e50',
            back: '#c0392b'
        }
    },
    cardArt: 'unicode',
    borders: 'double',
    animations: {
        speed: 'normal',
        dealCards: true,
        chipMove: true,
        cardReveal: true
    }
};
/** Card ASCII art for casino theme */
export function casinoCardArt(rank, suit, hidden = false) {
    if (hidden) {
        return [
            '╔══════╗',
            '║░░░░░░║',
            '║░░░░░░║',
            '║░░░░░░║',
            '╚══════╝'
        ].join('\n');
    }
    const symbols = {
        hearts: '♥',
        diamonds: '♦',
        clubs: '♣',
        spades: '♠'
    };
    const symbol = symbols[suit] || '?';
    const color = (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';
    return [
        '╔══════╗',
        `║ ${rank.padEnd(2)} ║`,
        `║   ${symbol}   ║`,
        `║ ${' '.padEnd(2)}${symbol.padEnd(2)} ║`,
        '╚══════╝'
    ].join('\n');
}
/** Border styles for casino theme */
export function casinoBorder(type) {
    switch (type) {
        case 'box':
            return '╔═╗║╚═╝';
        case 'header':
            return '╔════════════════════════════════════════╗';
        case 'separator':
            return '╠────────────────────────────────────────╣';
    }
}
/** Compact card display for casino theme */
export function casinoCardCompact(rank, suit) {
    const symbols = {
        hearts: '♥',
        diamonds: '♦',
        clubs: '♣',
        spades: '♠'
    };
    return `${rank}${symbols[suit]}`;
}
