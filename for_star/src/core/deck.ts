// ============================================================================
// Texas Hold'em Poker - Deck Management
// ============================================================================

import { Card, Suit, Rank } from './types.js';

/** All suits in order */
export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

/** All ranks in order (low to high) */
export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

/** Create a fresh 52-card deck */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  let id = 0;

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, id: `card-${id++}` });
    }
  }

  return deck;
}

/** Shuffle deck using Fisher-Yates algorithm */
export function shuffle(deck: Card[]): Card[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/** Deal a specified number of cards from the deck */
export function deal(deck: Card[], count: number): { cards: Card[]; remainingDeck: Card[] } {
  if (count > deck.length) {
    throw new Error(`Cannot deal ${count} cards from deck of ${deck.length}`);
  }

  const cards = deck.slice(0, count);
  const remaining = deck.slice(count);

  return { cards, remainingDeck: remaining };
}

/** Deal a single card from the deck */
export function dealOne(deck: Card[]): { card: Card | null; remainingDeck: Card[] } {
  if (deck.length === 0) {
    return { card: null, remainingDeck: deck };
  }

  const [card, ...remaining] = deck;
  return { card, remainingDeck: remaining };
}

/** Create multiple shuffled decks (for multi-deck games) */
export function createMultiDeck(deckCount: number): Card[] {
  const decks: Card[] = [];

  for (let i = 0; i < deckCount; i++) {
    decks.push(...createDeck());
  }

  return shuffle(decks);
}

/** Check if a deck is complete (52 cards, all unique) */
export function isCompleteDeck(deck: Card[]): boolean {
  if (deck.length !== 52) return false;

  const seen = new Set<string>();
  for (const card of deck) {
    const key = `${card.rank}-${card.suit}`;
    if (seen.has(key)) return false;
    seen.add(key);
  }

  return seen.size === 52;
}

/** Get card by rank and suit */
export function getCard(rank: Rank, suit: Suit): Card {
  return { suit, rank, id: `card-${rank}-${suit}` };
}

/** Parse card from string representation (e.g., "AH" -> Ace of Hearts) */
export function parseCard(str: string): Card | null {
  const trimmed = str.trim().toUpperCase();

  // Parse rank
  let rank: Rank;
  const rankPart = trimmed.slice(0, -1);

  if (RANKS.includes(rankPart as Rank)) {
    rank = rankPart as Rank;
  } else if (rankPart === '1') {
    rank = 'A'; // Some write Ace as 1
  } else {
    return null;
  }

  // Parse suit
  const suitChar = trimmed.slice(-1);
  let suit: Suit;

  switch (suitChar) {
    case 'H':
      suit = 'hearts';
      break;
    case 'D':
      suit = 'diamonds';
      break;
    case 'C':
      suit = 'clubs';
      break;
    case 'S':
      suit = 'spades';
      break;
    default:
      return null;
  }

  return { suit, rank, id: `card-${trimmed}` };
}

/** Get all cards of a specific suit */
export function getCardsOfSuit(deck: Card[], suit: Suit): Card[] {
  return deck.filter(card => card.suit === suit);
}

/** Get all cards of a specific rank */
export function getCardsOfRank(deck: Card[], rank: Rank): Card[] {
  return deck.filter(card => card.rank === rank);
}

/** Sort cards by rank (descending) */
export function sortByRank(cards: Card[]): Card[] {
  const rankOrder: Record<Rank, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
  };

  return [...cards].sort((a, b) => rankOrder[b.rank] - rankOrder[a.rank]);
}

/** Sort cards by suit then rank */
export function sortBySuitThenRank(cards: Card[]): Card[] {
  const suitOrder: Record<Suit, number> = {
    spades: 0,
    hearts: 1,
    diamonds: 2,
    clubs: 3
  };

  const rankOrder: Record<Rank, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
  };

  return [...cards].sort((a, b) => {
    if (a.suit !== b.suit) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return rankOrder[b.rank] - rankOrder[a.rank];
  });
}

/** Calculate deck penetration (cards dealt / total cards) */
export function calculatePenetration(originalDeckSize: number, remainingCards: number): number {
  return (originalDeckSize - remainingCards) / originalDeckSize;
}

/** Reshuffle if penetration is below threshold */
export function shouldReshuffle(
  originalDeckSize: number,
  remainingCards: number,
  threshold: number = 0.25
): boolean {
  return calculatePenetration(originalDeckSize, remainingCards) >= (1 - threshold);
}

/** Convert card to string representation */
export function cardToString(card: Card, format: 'short' | 'long' | 'symbol' = 'short'): string {
  switch (format) {
    case 'short':
      return `${card.rank}${card.suit[0].toUpperCase()}`;
    case 'long':
      return `${card.rank} of ${card.suit}`;
    case 'symbol':
      const symbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
      return `${card.rank}${symbols[card.suit]}`;
  }
}

/** Create a card back for hidden cards */
export function createCardBack(): Card {
  return { suit: 'spades', rank: 'A', id: 'card-back' };
}
