import { PlayerTier } from '../core/types.js';
/** Tier definitions with display info */
export declare const TIER_DEFINITIONS: Record<PlayerTier, {
    name: string;
    color: string;
    icon: string;
    description: string;
    benefits: string[];
}>;
/** Get tier requirements */
export declare function getTierRequirements(tier: PlayerTier): {
    minXP: number;
    maxXP: number;
    progressFrom: number;
};
/** Calculate progress percentage within current tier */
export declare function getTierProgress(xp: number): number;
/** Calculate tier from XP */
export declare function calculateTier(xp: number): PlayerTier;
/** Get XP needed for next tier */
export declare function getXPToNextTier(xp: number): number | null;
/** Format tier for display */
export declare function formatTier(tier: PlayerTier): string;
/** Get tier color */
export declare function getTierColor(tier: PlayerTier): string;
/** Get all tier information */
export declare function getAllTiers(): Array<{
    tier: PlayerTier;
    name: string;
    icon: string;
    minXP: number;
}>;
