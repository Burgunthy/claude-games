// ============================================================================
// Texas Hold'em Poker - Retro Theme
// ============================================================================
// 8-bit terminal style with green/black and block characters.
// Pixel-art inspired cards and ASCII borders.

import { Theme } from '../../core/types.js';

export const retroTheme: Theme = {
  name: 'retro',
  displayName: '👾 Retro',
  colors: {
    primary: '#00FF00',      // Bright Green (terminal)
    secondary: '#008000',    // Dark Green
    success: '#ADFF2F',      // Green Yellow
    warning: '#FFFF00',      // Yellow
    danger: '#FF0000',       // Red
    muted: '#808080',        // Gray
    background: '#000000',   // Pure Black
    table: '#001100',        // Very dark green
    card: {
      hearts: '#FF0000',
      diamonds: '#FFFF00',
      clubs: '#00FF00',
      spades: '#FFFFFF',
      back: '#0000FF'
    }
  },
  cardArt: 'ascii',
  borders: 'ascii',
  animations: {
    speed: 'instant',
    dealCards: false,
    chipMove: false,
    cardReveal: false
  }
};

/** Card ASCII art for retro theme (block style) */
export function retroCardArt(rank: string, suit: string, hidden: boolean = false): string {
  if (hidden) {
    return [
      '+======+',
      '|######|',
      '|######|',
      '|######|',
      '+======+'
    ].join('\n');
  }

  const symbols = {
    hearts: 'H',
    diamonds: 'D',
    clubs: 'C',
    spades: 'S'
  };

  const symbol = symbols[suit as keyof typeof symbols] || '?';

  return [
    '+======+',
    `| ${rank}    |`,
    `|   ${symbol}   |`,
    `|    ${rank} |`,
    '+======+'
  ].join('\n');
}

/** Border styles for retro theme */
export function retroBorder(type: 'box' | 'header' | 'separator'): string {
  switch (type) {
    case 'box':
      return '+-+|++';
    case 'header':
      return '+======================================+';
    case 'separator':
      return '+--------------------------------------+';
  }
}

/** Compact card display for retro theme */
export function retroCardCompact(rank: string, suit: string): string {
  const symbols = {
    hearts: 'H',
    diamonds: 'D',
    clubs: 'C',
    spades: 'S'
  };

  return `${rank}${symbols[suit as keyof typeof symbols]}`;
}

/** Get color codes for retro terminal */
export function retroColorCode(color: 'red' | 'yellow' | 'green' | 'blue' | 'white'): number {
  const codes = {
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    white: 37
  };

  return codes[color];
}
