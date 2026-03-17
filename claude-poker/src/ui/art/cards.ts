// ============================================================================
// Texas Hold'em Poker - Card Art
// ============================================================================

import { Card } from '../../core/types.js';
import { getTheme, getCardArt } from '../themes/index.js';

/** Card display styles */
export type CardDisplayStyle = 'compact' | 'ascii' | 'fancy' | 'minimal';

/** Render a single card */
export function renderCard(
  card: Card,
  theme: 'casino' | 'modern' | 'retro' = 'casino',
  style: CardDisplayStyle = 'compact',
  hidden: boolean = false
): string {
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
function renderHiddenCard(theme: 'casino' | 'modern' | 'retro', style: CardDisplayStyle): string {
  if (style === 'compact') {
    return '##';
  }
  return getCardArt(theme, 'A', 'spades', true);
}

/** Render compact card */
function renderCompactCard(card: Card): string {
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
function renderMinimalCard(card: Card): string {
  return `${card.rank}${card.suit[0].toUpperCase()}`;
}

/** Render multiple cards in a row */
export function renderCards(
  cards: Card[],
  theme: 'casino' | 'modern' | 'retro' = 'casino',
  style: CardDisplayStyle = 'compact',
  hidden: boolean = false
): string {
  if (cards.length === 0) return '';

  if (style === 'compact') {
    return cards.map(c => renderCard(c, theme, style, hidden)).join(' ');
  }

  // For multi-line card art, render them side by side
  const individualCards = cards.map(c => getCardArt(theme, c.rank, c.suit, hidden).split('\n'));

  const lines: string[] = [];
  for (let i = 0; i < individualCards[0].length; i++) {
    lines.push(individualCards.map(card => card[i]).join(' '));
  }

  return lines.join('\n');
}

/** Create a hand display box */
export function createHandBox(
  title: string,
  cards: Card[],
  theme: 'casino' | 'modern' | 'retro' = 'casino',
  hidden: boolean = false
): string {
  const cardDisplay = renderCards(cards, theme, 'fancy', hidden);
  const lines = cardDisplay.split('\n');

  const maxLen = Math.max(title.length + 4, ...lines.map(l => l.length));

  let result = '';

  // Top border
  if (theme === 'casino') {
    result += '╔' + '═'.repeat(maxLen) + '╗\n';
  } else if (theme === 'modern') {
    result += '┌' + '─'.repeat(maxLen) + '┐\n';
  } else {
    result += '+' + '='.repeat(maxLen) + '+\n';
  }

  // Title
  result += '│ ' + title.padEnd(maxLen - 1) + '│\n';

  // Separator
  if (theme === 'casino') {
    result += '╠' + '─'.repeat(maxLen) + '╣\n';
  } else if (theme === 'modern') {
    result += '├' + '─'.repeat(maxLen) + '┤\n';
  } else {
    result += '+' + '-'.repeat(maxLen) + '+\n';
  }

  // Cards
  for (const line of lines) {
    result += '│ ' + line.padEnd(maxLen - 1) + '│\n';
  }

  // Bottom border
  if (theme === 'casino') {
    result += '╚' + '═'.repeat(maxLen) + '╝';
  } else if (theme === 'modern') {
    result += '└' + '─'.repeat(maxLen) + '┘';
  } else {
    result += '+' + '='.repeat(maxLen) + '+';
  }

  return result;
}

/** Get card color (red/black) */
export function getCardColor(card: Card): 'red' | 'black' {
  return (card.suit === 'hearts' || card.suit === 'diamonds') ? 'red' : 'black';
}

/** Format card for plain text */
export function formatCardText(card: Card): string {
  return `${card.rank} of ${card.suit}`;
}

/** Parse card from string */
export function parseCard(str: string): Card | null {
  const trimmed = str.trim();
  const match = trimmed.match(/^([2-9AJQK]|10)([hdcs]|hearts|diamonds|clubs|spades)$/i);

  if (!match) return null;

  const [, rank, suit] = match;

  const suitMap: Record<string, 'hearts' | 'diamonds' | 'clubs' | 'spades'> = {
    'h': 'hearts', 'hearts': 'hearts',
    'd': 'diamonds', 'diamonds': 'diamonds',
    'c': 'clubs', 'clubs': 'clubs',
    's': 'spades', 'spades': 'spades'
  };

  return {
    rank: rank as any,
    suit: suitMap[suit.toLowerCase()]
  };
}
