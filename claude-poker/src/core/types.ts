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
  id?: string; // Unique identifier for deck tracking
}

/** Hand ranking from highest to lowest */
export enum HandRank {
  ROYAL_FLUSH = 10,
  STRAIGHT_FLUSH = 9,
  FOUR_OF_A_KIND = 8,
  FULL_HOUSE = 7,
  FLUSH = 6,
  STRAIGHT = 5,
  THREE_OF_A_KIND = 4,
  TWO_PAIR = 3,
  ONE_PAIR = 2,
  HIGH_CARD = 1
}

/** Evaluated hand result */
export interface EvaluatedHand {
  rank: HandRank;
  name: string;
  cards: Card[]; // The 5 cards that make the hand
  kickers: Card[]; // Remaining cards for tiebreaking
  score: number; // Numeric score for comparison
  description: string; // Human-readable description
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
  isAllIn: boolean;
  avatar?: string; // Avatar character for display
}

/** Game phases */
export type GamePhase = 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';

/** Action types */
export type ActionType = 'fold' | 'check' | 'call' | 'raise' | 'allin';

/** Player action */
export interface Action {
  type: ActionType;
  playerId: string;
  amount?: number;
}

/** AI Decision */
export interface Decision {
  action: ActionType;
  amount?: number;
  confidence: number; // 0-1
  reasoning?: string;
}

/** AI Thought Stage */
export enum ThoughtStage {
  PERCEIVE = 'perceive',
  ANALYZE = 'analyze',
  DECIDE = 'decide'
}

/** AI Thought */
export interface Thought {
  stage: ThoughtStage;
  content: string;
  emoji: string;
}

/** AI Strategy Type */
export type AIStrategyType = 'easy' | 'normal' | 'hard' | 'maniac';

/** Game Context for AI decisions */
export interface GameContext {
  phase: GamePhase;
  communityCards: Card[];
  pot: number;
  currentBet: number;
  toCall: number;
  potOdds: number;
  position: 'early' | 'middle' | 'late';
  playersInHand: number;
  bigBlind: number;
  aggressor?: string; // Player who made the last raise
}

/** Hand strength analysis */
export interface HandStrength {
  current: number; // 0-1 strength now
  potential: number; // 0-1 potential by showdown
  draw: boolean; // Has draw potential
  drawType: 'flush' | 'straight' | 'both' | null;
}

/** Side pot */
export interface SidePot {
  amount: number;
  players: string[]; // Player IDs eligible for this side pot
}

/** Pot calculation result */
export interface PotResult {
  mainPot: number;
  sidePots: SidePot[];
  total: number;
}

/** Game event types */
export type GameEventType =
  | 'hand:started'
  | 'cards:dealt'
  | 'blinds:posted'
  | 'player:acted'
  | 'community:dealt'
  | 'phase:changed'
  | 'turn:changed'
  | 'hand:ended'
  | 'ai:thought';

/** Game event */
export interface GameEvent {
  type: GameEventType;
  data?: any;
  timestamp: number;
}

/** Player data for storage */
export interface PlayerData {
  name: string;
  chips: number;
  tier: PlayerTier;
  xp: number;
  handsPlayed: number;
  handsWon: number;
  winRate: number;
  lastDailyBonus: string | null; // ISO date string
  achievements: Achievement[];
  stats: PlayerStats;
  createdAt: string;
}

/** Player tiers */
export type PlayerTier = 'Rookie' | 'Amateur' | 'Pro' | 'Shark' | 'Legend';

/** Player statistics */
export interface PlayerStats {
  totalWinnings: number;
  biggestWin: number;
  handsFolded: number;
  handsChecked: number;
  handsCalled: number;
  handsRaised: number;
  allInsCount: number;
  showdowWon: number;
  bestHand: string;
}

/** Achievement */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
}

/** Game settings */
export interface GameSettings {
  theme: ThemeName;
  language: string;
  difficulty: AIStrategyType;
  showAiThoughts: boolean;
  autoPlayDelay: number; // ms for AI vs AI mode
}

/** Theme names */
export type ThemeName = 'casino' | 'modern' | 'retro';

/** Theme definition */
export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: ThemeColors;
  cardArt: CardArtStyle;
  borders: BorderStyle;
  animations: AnimationStyle;
}

/** Theme colors */
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  muted: string;
  background: string;
  table: string;
  card: {
    hearts: string;
    diamonds: string;
    clubs: string;
    spades: string;
    back: string;
  };
}

/** Card art style */
export type CardArtStyle = 'unicode' | 'ascii' | 'minimal' | 'fancy';

/** Border style */
export type BorderStyle = 'single' | 'double' | 'rounded' | 'bold' | 'ascii';

/** Animation style */
export interface AnimationStyle {
  speed: 'instant' | 'fast' | 'normal' | 'slow';
  dealCards: boolean;
  chipMove: boolean;
  cardReveal: boolean;
}

/** Game history record */
export interface GameRecord {
  id: string;
  date: string;
  handsPlayed: number;
  handsWon: number;
  chipsWon: number;
  tier: PlayerTier;
  opponents: string[];
  duration: number; // seconds
}

/** Translation keys */
export interface Translation {
  welcome: string;
  pressEnter: string;
  yourCards: string;
  communityCards: string;
  pot: string;
  phase: Record<GamePhase, string>;
  action: Record<ActionType, string>;
  handRank: Record<number, string>;
  tier: Record<PlayerTier, string>;
  controls: {
    fold: string;
    check: string;
    call: string;
    raise: string;
    allin: string;
    quit: string;
  };
  messages: {
    yourTurn: string;
    youFolded: string;
    youChecked: string;
    youCalled: string;
    youRaised: string;
    youAllIn: string;
    winner: string;
    tie: string;
    newHand: string;
    handStarted: string;
    blindsPosted: string;
  };
  ai: {
    thinks: string;
    perceive: string;
    analyze: string;
    decide: string;
  };
  menu: {
    newGame: string;
    aiMode: string;
    settings: string;
    stats: string;
    quit: string;
  };
}

/** Game state */
export interface GameState {
  deck: Card[];
  communityCards: Card[];
  pot: number;
  players: Player[];
  currentPlayerIndex: number;
  phase: GamePhase;
  currentBet: number;
  dealerIndex: number;
}

/** Game configuration */
export interface GameConfig {
  playerCount: number;
  startingChips: number;
  smallBlind: number;
  bigBlind: number;
  aiOnly?: boolean;
  aiDifficulty?: AIStrategyType;
  autoPlayDelay?: number;
}

/** Default player data */
export const DEFAULT_PLAYER_DATA: {
  name: string;
  chips: number;
  tier: PlayerTier;
  xp: number;
  handsPlayed: number;
  handsWon: number;
  winRate: number;
  lastDailyBonus: string | null;
  achievements: Achievement[];
  stats: PlayerStats;
  createdAt: string;
} = {
  name: 'Player',
  chips: 1000,
  tier: 'Rookie',
  xp: 0,
  handsPlayed: 0,
  handsWon: 0,
  winRate: 0,
  lastDailyBonus: null,
  achievements: [],
  stats: {
    totalWinnings: 0,
    biggestWin: 0,
    handsFolded: 0,
    handsChecked: 0,
    handsCalled: 0,
    handsRaised: 0,
    allInsCount: 0,
    showdowWon: 0,
    bestHand: ''
  },
  createdAt: new Date().toISOString()
};

/** AI configuration */
export interface AIConfig {
  strategy: AIStrategyType;
  name: string;
  avatar: string;
  personality?: string;
}
