// ============================================================================
// Texas Hold'em Poker - Core Types
// ============================================================================

/** Card suits */
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

/** Card ranks */
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

/** A playing card */
export interface Card {
  suit: Suit;
  rank: Rank;
}

/** Player state */
export interface Player {
  id: string;
  name: string;
  chips: number;
  cards: Card[];
  bet: number;
  folded: boolean;
  isHuman: boolean;
}

/** Game state */
export interface GameState {
  deck: Card[];
  communityCards: Card[];
  pot: number;
  players: Player[];
  currentPlayerIndex: number;
  phase: 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';
  currentBet: number;
  dealerIndex: number;
}

/** Action types */
export type ActionType = 'fold' | 'check' | 'call' | 'raise' | 'allin';

/** Player action */
export interface Action {
  type: ActionType;
  playerId: string;
  amount?: number;
}
