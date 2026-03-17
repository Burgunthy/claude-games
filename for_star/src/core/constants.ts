// ============================================================================
// Texas Hold'em Poker - Game Constants
// ============================================================================

import { AIStrategyType, PlayerTier } from './types.js';

/** Blind structure */
export const BLINDS = {
  SMALL: 10,
  BIG: 20,
  MIN: 5,
  MAX: 1000
} as const;

/** Starting chips for different tiers */
export const STARTING_CHIPS = {
  default: 1000,
  high: 5000,
  tournament: 10000
} as const;

/** AI Names */
export const AI_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve',
  'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
  'Kate', 'Leo', 'Mia', 'Noah', 'Olivia',
  'Peter', 'Quinn', 'Rose', 'Sam', 'Tina'
] as const;

/** AI Avatars (emoji) */
export const AI_AVATARS = [
  '🤖', '🎭', '🎪', '🎯', '🎲',
  '🃏', '👑', '💎', '🔥', '⚡',
  '🌟', '🎨', '🎵', '🎸', '🎹',
  '🎬', '🎤', '🎧', '🎺', '🎻'
] as const;

/** Tier XP requirements */
export const TIER_XP: Record<PlayerTier, { min: number; max: number }> = {
  Rookie: { min: 0, max: 999 },
  Amateur: { min: 1000, max: 4999 },
  Pro: { min: 5000, max: 14999 },
  Shark: { min: 15000, max: 49999 },
  Legend: { min: 50000, max: Infinity }
} as const;

/** XP rewards */
export const XP_REWARDS = {
  HAND_PLAYED: 10,
  HAND_WON: 50,
  SHOWDOWN_WON: 100,
  ALLIN_WON: 200,
  BUSTED_PLAYER: 150,
  KNOCKOUT: 300
} as const;

/** Daily bonus rewards */
export const DAILY_BONUS = {
  BASE: 1000,
  STREAK_MULTIPLIER: 1.5,
  MAX_STREAK: 7,
  STREAK_BONUS: 500
} as const;

/** AI Strategy thresholds */
export const AI_THRESHOLDS: Record<AIStrategyType, {
  aggression: number; // 0-1, likelihood to raise/bluff
  bluffFrequency: number; // 0-1
  foldThreshold: number; // 0-1 hand strength below which to fold
  callThreshold: number; // 0-1 hand strength above which to call
  raiseThreshold: number; // 0-1 hand strength above which to raise
}> = {
  easy: {
    aggression: 0.2,
    bluffFrequency: 0.05,
    foldThreshold: 0.3,
    callThreshold: 0.5,
    raiseThreshold: 0.7
  },
  normal: {
    aggression: 0.5,
    bluffFrequency: 0.2,
    foldThreshold: 0.2,
    callThreshold: 0.35,
    raiseThreshold: 0.55
  },
  hard: {
    aggression: 0.65,
    bluffFrequency: 0.3,
    foldThreshold: 0.15,
    callThreshold: 0.3,
    raiseThreshold: 0.45
  },
  maniac: {
    aggression: 0.9,
    bluffFrequency: 0.5,
    foldThreshold: 0.05,
    callThreshold: 0.15,
    raiseThreshold: 0.2
  }
} as const;

/** Hand strength descriptions */
export const HAND_STRENGTH_DESC = {
  VERY_WEAK: { min: 0, max: 0.2, label: 'Very Weak' },
  WEAK: { min: 0.2, max: 0.35, label: 'Weak' },
  BELOW_AVERAGE: { min: 0.35, max: 0.45, label: 'Below Average' },
  AVERAGE: { min: 0.45, max: 0.55, label: 'Average' },
  ABOVE_AVERAGE: { min: 0.55, max: 0.7, label: 'Above Average' },
  STRONG: { min: 0.7, max: 0.85, label: 'Strong' },
  VERY_STRONG: { min: 0.85, max: 1, label: 'Very Strong' }
} as const;

/** Position definitions */
export const POSITION = {
  EARLY: ['first', 'second', 'third'],
  MIDDLE: ['fourth', 'fifth'],
  LATE: ['button', 'cutoff']
} as const;

/** Game speeds for AI vs AI mode */
export const GAME_SPEED = {
  SLOW: 1500, // ms between actions
  NORMAL: 750,
  FAST: 300,
  INSTANT: 0
} as const;

/** Keyboard shortcuts */
export const KEYBOARD_SHORTCUTS = {
  FOLD: ['f', 'F'],
  CHECK: ['c', 'C'],
  CALL: ['c', 'C'],
  RAISE: ['r', 'R'],
  ALL_IN: ['a', 'A'],
  QUIT: ['q', 'Q', 'escape'],
  TOGGLE_THOUGHTS: ['t', 'T'],
  THOUGHT_HISTORY: ['h', 'H'],
  SPEED_UP: ['+'],
  SPEED_DOWN: ['-'],
  NEXT_HAND: ['return', 'enter'],
  AUTO_PLAY: ['space']
} as const;

/** Storage paths */
export const STORAGE_PATHS = {
  BASE_DIR: '.claude-games',
  GAME_DIR: 'claude-poker',
  PLAYER_FILE: 'player.json',
  SETTINGS_FILE: 'settings.json',
  HISTORY_FILE: 'history.json'
} as const;

/** Maximum history records */
export const MAX_HISTORY_RECORDS = 100;

/** Maximum hands in a game before auto-save */
export const HANDS_PER_SAVE = 10;

/** Animation durations (ms) */
export const ANIMATION_DURATION = {
  CARD_DEAL: 100,
  CHIP_MOVE: 150,
  CARD_REVEAL: 200,
  PHASE_TRANSITION: 300
} as const;

/** Maximum players */
export const MAX_PLAYERS = 8;
export const MIN_PLAYERS = 2;

/** Seat positions around the table */
export const SEAT_POSITIONS = [
  // Top row
  { x: 50, y: 5, label: 'TOP' },
  { x: 65, y: 8, label: 'TOP_RIGHT' },
  { x: 75, y: 15, label: 'RIGHT' },
  // Bottom row
  { x: 50, y: 25, label: 'BOTTOM' },
  { x: 25, y: 15, label: 'LEFT' },
  { x: 35, y: 8, label: 'TOP_LEFT' }
] as const;

/** Card display dimensions */
export const CARD_DISPLAY = {
  WIDTH: 7,
  HEIGHT: 5,
  SPACING: 1
} as const;

/** Unicode card suits */
export const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
} as const;

/** ANSI color codes for terminals */
export const ANSI_COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
} as const;

/** Supported languages */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' }
] as const;

/** Default settings */
export const DEFAULT_SETTINGS = {
  theme: 'casino',
  language: 'en',
  difficulty: 'normal',
  showAiThoughts: true,
  autoPlayDelay: 750
} as const;

/** Default player data */
export const DEFAULT_PLAYER_DATA = {
  name: 'Player',
  chips: 1000,
  tier: 'Rookie' as PlayerTier,
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
} as const;
