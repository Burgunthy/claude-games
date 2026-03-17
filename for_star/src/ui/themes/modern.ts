// ============================================================================
// Texas Hold'em Poker - Modern Theme
// ============================================================================
// Clean, minimal design with cyan, white, and gray.
// Simple ASCII cards and thin borders.

import { Theme } from '../../core/types.js';

export const modernTheme: Theme = {
  name: 'modern',
  displayName: '⬡ Modern',
  colors: {
    primary: '#00CED1',      // Dark Turquoise
    secondary: '#4682B4',    // Steel Blue
    success: '#3CB371',      // Medium Sea Green
    warning: '#FFB347',      // Pastel Orange
    danger: '#FF6B6B',       // Pastel Red
    muted: '#708090',        // Slate Gray
    background: '#0f0f0f',   // Very dark
    table: '#1a2a3a',        // Blue-gray table
    card: {
      hearts: '#FF6B6B',
      diamonds: '#FFD93D',
      clubs: '#6BCB77',
      spades: '#4D96FF',
      back: '#6C5CE7'
    }
  },
  cardArt: 'minimal',
  borders: 'single',
  animations: {
    speed: 'fast',
    dealCards: true,
    chipMove: false,
    cardReveal: false
  }
};

/** Card ASCII art for modern theme */
export function modernCardArt(rank: string, suit: string, hidden: boolean = false): string {
  if (hidden) {
    return [
      '┌──────┐',
      '│██████│',
      '│██████│',
      '│██████│',
      '└──────┘'
    ].join('\n');
  }

  const symbols = {
    hearts: '♥',
    diamonds: '◆',
    clubs: '♣',
    spades: '♠'
  };

  const symbol = symbols[suit as keyof typeof symbols] || '?';

  return [
    '┌──────┐',
    `│ ${rank}    │`,
    `│   ${symbol}   │`,
    `│    ${rank} │`,
    '└──────┘'
  ].join('\n');
}

/** Border styles for modern theme */
export function modernBorder(type: 'box' | 'header' | 'separator'): string {
  switch (type) {
    case 'box':
      return '┌─┐│└┘';
    case 'header':
      return '┌────────────────────────────────────────┐';
    case 'separator':
      return '├────────────────────────────────────────┤';
  }
}

/** Compact card display for modern theme */
export function modernCardCompact(rank: string, suit: string): string {
  const symbols = {
    hearts: '♥',
    diamonds: '◆',
    clubs: '♣',
    spades: '♠'
  };

  return `${rank}${symbols[suit as keyof typeof symbols]}`;
}
