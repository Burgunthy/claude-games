import { PlayerTier } from '../core/types.js';
/** XP gain event */
export type XPEvent = 'hand_played' | 'hand_won' | 'showdown_won' | 'allin_won' | 'busted_player' | 'knockout' | 'daily_bonus' | 'achievement' | 'higher_tier_bonus';
/** XP reward with description */
export interface XPReward {
    amount: number;
    reason: string;
    event: XPEvent;
}
/** Result of adding XP */
export interface XPResult {
    newXP: number;
    newTier: PlayerTier;
    previousTier: PlayerTier;
    tieredUp: boolean;
    tierProgress: number;
    xpToNextTier: number | null;
}
/** Calculate XP for a hand */
export declare function calculateHandXP(won: boolean, atShowdown: boolean, wentAllIn: boolean, bustedOpponents: number, opponentsWereHigherTier: boolean): XPReward[];
/** Add XP and calculate new tier */
export declare function addXP(currentXP: number, currentTier: PlayerTier, rewards: XPReward[]): XPResult;
/** Calculate XP needed for a specific tier */
export declare function getXPForTier(targetTier: PlayerTier): number;
/** Calculate total XP earned per level bracket */
export declare function getXPInBracket(tier: PlayerTier): number;
/** Get all tier milestones */
export declare function getTierMilestones(): Array<{
    tier: PlayerTier;
    xp: number;
    icon: string;
}>;
/** Format XP amount */
export declare function formatXP(amount: number): string;
/** Get XP bonus for achievement */
export declare function getAchievementXP(achievementId: string): number;
