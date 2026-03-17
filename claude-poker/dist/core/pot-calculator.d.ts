import { Player, PotResult } from './types.js';
/** Calculate main pot and side pots for all-in situations */
export declare function calculatePots(activePlayers: Player[]): PotResult;
/** Distribute pot to winners */
export declare function distributePot(potResult: PotResult, winners: string[]): Map<string, number>;
/** Calculate minimum bet to call */
export declare function getCallAmount(currentBet: number, playerBet: number, playerChips: number): number;
/** Calculate minimum raise amount */
export declare function getMinRaise(currentBet: number, bigBlind: number): number;
/** Validate if a raise amount is legal */
export declare function isValidRaise(raiseAmount: number, currentBet: number, playerBet: number, playerChips: number, bigBlind: number): boolean;
/** Calculate pot odds */
export declare function getPotOdds(pot: number, toCall: number): number;
/** Calculate expected value of a call */
export declare function getCallEV(pot: number, toCall: number, winProbability: number): number;
/** Format pot amount for display */
export declare function formatPot(amount: number): string;
