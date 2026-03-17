import { PlayerData, PlayerTier } from '../core/types.js';
/** Load player data from storage */
export declare function loadPlayerData(): PlayerData;
/** Save player data to storage */
export declare function savePlayerData(data: PlayerData): void;
/** Create default player data */
export declare function createDefaultPlayerData(): PlayerData;
/** Add XP and check for tier up */
export declare function addXP(data: PlayerData, xp: number): {
    newData: PlayerData;
    tieredUp: boolean;
    newTier?: PlayerTier;
};
/** Calculate tier from XP */
export declare function calculateTier(xp: number): PlayerTier;
/** Update stats after a hand */
export declare function updateHandStats(data: PlayerData, won: boolean, atShowdown: boolean, action: 'fold' | 'check' | 'call' | 'raise' | 'allin', amountWon?: number): PlayerData;
/** Claim daily bonus */
export declare function claimDailyBonus(data: PlayerData): {
    newData: PlayerData;
    success: boolean;
    amount: number;
    streak: number;
};
/** Check if daily bonus is available */
export declare function canClaimDailyBonus(data: PlayerData): boolean;
/** Reset player data (start over) */
export declare function resetPlayerData(): PlayerData;
/** Get starting chips based on tier */
export declare function getStartingChips(tier: PlayerTier): number;
/** Format chips for display */
export declare function formatChips(amount: number): string;
