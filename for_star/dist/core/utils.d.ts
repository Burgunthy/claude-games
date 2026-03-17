import { Rank, Suit } from './types.js';
/** Format chips for display */
export declare const formatChips: (amount: number) => string;
/** Format time duration */
export declare const formatDuration: (ms: number) => string;
/** Calculate win rate percentage */
export declare const calculateWinRate: (handsWon: number, gamesPlayed: number) => number;
/** Get random element from array */
export declare const getRandomElement: <T>(array: T[]) => T;
/** Shuffle array */
export declare const shuffleArray: <T>(array: T[]) => T[];
/** Delay execution */
export declare const delay: (ms: number) => Promise<void>;
/** Clamp number between min and max */
export declare const clamp: (value: number, min: number, max: number) => number;
/** Check if can check (bet equals current bet) */
export declare const canCheck: (currentBet: number, playerBet: number) => boolean;
/** Check if can call (has enough chips) */
export declare const canCallCheck: (currentBet: number, playerBet: number, playerChips: number) => boolean;
/** Check if can raise (has enough chips) */
export declare const canRaise: (currentBet: number, playerBet: number, playerChips: number, minRaise: number) => boolean;
/** Get call amount */
export declare const getCallAmount: (currentBet: number, playerBet: number) => number;
/** Calculate pot odds */
export declare const calculatePotOdds: (callAmount: number, potSize: number) => number;
/** Calculate hand strength (simplified) */
export declare const estimateHandStrength: (handRank: number) => number;
/** Get rank display name */
export declare const getRankDisplayName: (rank: Rank) => string;
/** Get suit display name */
export declare const getSuitDisplayName: (suit: Suit) => string;
//# sourceMappingURL=utils.d.ts.map