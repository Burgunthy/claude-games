import { Card, Suit, Rank } from './types.js';
/** All suits in order */
export declare const SUITS: Suit[];
/** All ranks in order (low to high) */
export declare const RANKS: Rank[];
/** Create a fresh 52-card deck */
export declare function createDeck(): Card[];
/** Shuffle deck using Fisher-Yates algorithm */
export declare function shuffle(deck: Card[]): Card[];
/** Deal a specified number of cards from the deck */
export declare function deal(deck: Card[], count: number): {
    cards: Card[];
    remainingDeck: Card[];
};
/** Deal a single card from the deck */
export declare function dealOne(deck: Card[]): {
    card: Card | null;
    remainingDeck: Card[];
};
/** Create multiple shuffled decks (for multi-deck games) */
export declare function createMultiDeck(deckCount: number): Card[];
/** Check if a deck is complete (52 cards, all unique) */
export declare function isCompleteDeck(deck: Card[]): boolean;
/** Get card by rank and suit */
export declare function getCard(rank: Rank, suit: Suit): Card;
/** Parse card from string representation (e.g., "AH" -> Ace of Hearts) */
export declare function parseCard(str: string): Card | null;
/** Get all cards of a specific suit */
export declare function getCardsOfSuit(deck: Card[], suit: Suit): Card[];
/** Get all cards of a specific rank */
export declare function getCardsOfRank(deck: Card[], rank: Rank): Card[];
/** Sort cards by rank (descending) */
export declare function sortByRank(cards: Card[]): Card[];
/** Sort cards by suit then rank */
export declare function sortBySuitThenRank(cards: Card[]): Card[];
/** Calculate deck penetration (cards dealt / total cards) */
export declare function calculatePenetration(originalDeckSize: number, remainingCards: number): number;
/** Reshuffle if penetration is below threshold */
export declare function shouldReshuffle(originalDeckSize: number, remainingCards: number, threshold?: number): boolean;
/** Convert card to string representation */
export declare function cardToString(card: Card, format?: 'short' | 'long' | 'symbol'): string;
/** Create a card back for hidden cards */
export declare function createCardBack(): Card;
