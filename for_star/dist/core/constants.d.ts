import { AIStrategyType, PlayerTier } from './types.js';
/** Blind structure */
export declare const BLINDS: {
    readonly SMALL: 10;
    readonly BIG: 20;
    readonly MIN: 5;
    readonly MAX: 1000;
};
/** Starting chips for different tiers */
export declare const STARTING_CHIPS: {
    readonly default: 1000;
    readonly high: 5000;
    readonly tournament: 10000;
};
/** AI Names */
export declare const AI_NAMES: readonly ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry", "Ivy", "Jack", "Kate", "Leo", "Mia", "Noah", "Olivia", "Peter", "Quinn", "Rose", "Sam", "Tina"];
/** AI Avatars (emoji) */
export declare const AI_AVATARS: readonly ["🤖", "🎭", "🎪", "🎯", "🎲", "🃏", "👑", "💎", "🔥", "⚡", "🌟", "🎨", "🎵", "🎸", "🎹", "🎬", "🎤", "🎧", "🎺", "🎻"];
/** Tier XP requirements */
export declare const TIER_XP: Record<PlayerTier, {
    min: number;
    max: number;
}>;
/** XP rewards */
export declare const XP_REWARDS: {
    readonly HAND_PLAYED: 10;
    readonly HAND_WON: 50;
    readonly SHOWDOWN_WON: 100;
    readonly ALLIN_WON: 200;
    readonly BUSTED_PLAYER: 150;
    readonly KNOCKOUT: 300;
};
/** Daily bonus rewards */
export declare const DAILY_BONUS: {
    readonly BASE: 1000;
    readonly STREAK_MULTIPLIER: 1.5;
    readonly MAX_STREAK: 7;
    readonly STREAK_BONUS: 500;
};
/** AI Strategy thresholds */
export declare const AI_THRESHOLDS: Record<AIStrategyType, {
    aggression: number;
    bluffFrequency: number;
    foldThreshold: number;
    callThreshold: number;
    raiseThreshold: number;
}>;
/** Hand strength descriptions */
export declare const HAND_STRENGTH_DESC: {
    readonly VERY_WEAK: {
        readonly min: 0;
        readonly max: 0.2;
        readonly label: "Very Weak";
    };
    readonly WEAK: {
        readonly min: 0.2;
        readonly max: 0.35;
        readonly label: "Weak";
    };
    readonly BELOW_AVERAGE: {
        readonly min: 0.35;
        readonly max: 0.45;
        readonly label: "Below Average";
    };
    readonly AVERAGE: {
        readonly min: 0.45;
        readonly max: 0.55;
        readonly label: "Average";
    };
    readonly ABOVE_AVERAGE: {
        readonly min: 0.55;
        readonly max: 0.7;
        readonly label: "Above Average";
    };
    readonly STRONG: {
        readonly min: 0.7;
        readonly max: 0.85;
        readonly label: "Strong";
    };
    readonly VERY_STRONG: {
        readonly min: 0.85;
        readonly max: 1;
        readonly label: "Very Strong";
    };
};
/** Position definitions */
export declare const POSITION: {
    readonly EARLY: readonly ["first", "second", "third"];
    readonly MIDDLE: readonly ["fourth", "fifth"];
    readonly LATE: readonly ["button", "cutoff"];
};
/** Game speeds for AI vs AI mode */
export declare const GAME_SPEED: {
    readonly SLOW: 1500;
    readonly NORMAL: 750;
    readonly FAST: 300;
    readonly INSTANT: 0;
};
/** Keyboard shortcuts */
export declare const KEYBOARD_SHORTCUTS: {
    readonly FOLD: readonly ["f", "F"];
    readonly CHECK: readonly ["c", "C"];
    readonly CALL: readonly ["c", "C"];
    readonly RAISE: readonly ["r", "R"];
    readonly ALL_IN: readonly ["a", "A"];
    readonly QUIT: readonly ["q", "Q", "escape"];
    readonly TOGGLE_THOUGHTS: readonly ["t", "T"];
    readonly THOUGHT_HISTORY: readonly ["h", "H"];
    readonly SPEED_UP: readonly ["+"];
    readonly SPEED_DOWN: readonly ["-"];
    readonly NEXT_HAND: readonly ["return", "enter"];
    readonly AUTO_PLAY: readonly ["space"];
};
/** Storage paths */
export declare const STORAGE_PATHS: {
    readonly BASE_DIR: ".claude-games";
    readonly GAME_DIR: "claude-poker";
    readonly PLAYER_FILE: "player.json";
    readonly SETTINGS_FILE: "settings.json";
    readonly HISTORY_FILE: "history.json";
};
/** Maximum history records */
export declare const MAX_HISTORY_RECORDS = 100;
/** Maximum hands in a game before auto-save */
export declare const HANDS_PER_SAVE = 10;
/** Animation durations (ms) */
export declare const ANIMATION_DURATION: {
    readonly CARD_DEAL: 100;
    readonly CHIP_MOVE: 150;
    readonly CARD_REVEAL: 200;
    readonly PHASE_TRANSITION: 300;
};
/** Maximum players */
export declare const MAX_PLAYERS = 8;
export declare const MIN_PLAYERS = 2;
/** Seat positions around the table */
export declare const SEAT_POSITIONS: readonly [{
    readonly x: 50;
    readonly y: 5;
    readonly label: "TOP";
}, {
    readonly x: 65;
    readonly y: 8;
    readonly label: "TOP_RIGHT";
}, {
    readonly x: 75;
    readonly y: 15;
    readonly label: "RIGHT";
}, {
    readonly x: 50;
    readonly y: 25;
    readonly label: "BOTTOM";
}, {
    readonly x: 25;
    readonly y: 15;
    readonly label: "LEFT";
}, {
    readonly x: 35;
    readonly y: 8;
    readonly label: "TOP_LEFT";
}];
/** Card display dimensions */
export declare const CARD_DISPLAY: {
    readonly WIDTH: 7;
    readonly HEIGHT: 5;
    readonly SPACING: 1;
};
/** Unicode card suits */
export declare const SUIT_SYMBOLS: {
    readonly hearts: "♥";
    readonly diamonds: "♦";
    readonly clubs: "♣";
    readonly spades: "♠";
};
/** ANSI color codes for terminals */
export declare const ANSI_COLORS: {
    readonly reset: "\u001B[0m";
    readonly bright: "\u001B[1m";
    readonly dim: "\u001B[2m";
    readonly red: "\u001B[31m";
    readonly green: "\u001B[32m";
    readonly yellow: "\u001B[33m";
    readonly blue: "\u001B[34m";
    readonly magenta: "\u001B[35m";
    readonly cyan: "\u001B[36m";
    readonly white: "\u001B[37m";
    readonly gray: "\u001B[90m";
};
/** Supported languages */
export declare const SUPPORTED_LANGUAGES: readonly [{
    readonly code: "en";
    readonly name: "English";
    readonly nativeName: "English";
}, {
    readonly code: "ko";
    readonly name: "Korean";
    readonly nativeName: "한국어";
}, {
    readonly code: "ja";
    readonly name: "Japanese";
    readonly nativeName: "日本語";
}];
/** Default settings */
export declare const DEFAULT_SETTINGS: {
    readonly theme: "casino";
    readonly language: "en";
    readonly difficulty: "normal";
    readonly showAiThoughts: true;
    readonly autoPlayDelay: 750;
};
/** Default player data */
export declare const DEFAULT_PLAYER_DATA: {
    readonly name: "Player";
    readonly chips: 1000;
    readonly tier: PlayerTier;
    readonly xp: 0;
    readonly handsPlayed: 0;
    readonly handsWon: 0;
    readonly winRate: 0;
    readonly lastDailyBonus: null;
    readonly achievements: readonly [];
    readonly stats: {
        readonly totalWinnings: 0;
        readonly biggestWin: 0;
        readonly handsFolded: 0;
        readonly handsChecked: 0;
        readonly handsCalled: 0;
        readonly handsRaised: 0;
        readonly allInsCount: 0;
        readonly showdowWon: 0;
        readonly bestHand: "";
    };
    readonly createdAt: string;
};
