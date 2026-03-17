// ============================================================================
// Texas Hold'em Poker - Tier System
// ============================================================================
import { TIER_XP } from '../core/constants.js';
/** Tier definitions with display info */
export const TIER_DEFINITIONS = {
    Rookie: {
        name: 'Rookie',
        color: 'gray',
        icon: '🌱',
        description: 'Just starting your poker journey.',
        benefits: ['1000 starting chips', 'Basic AI opponents']
    },
    Amateur: {
        name: 'Amateur',
        color: 'blue',
        icon: '🎯',
        description: 'Learning the ropes and improving.',
        benefits: ['1500 starting chips', 'Normal AI unlocked']
    },
    Pro: {
        name: 'Pro',
        color: 'purple',
        icon: '⭐',
        description: 'Experienced player with solid skills.',
        benefits: ['2500 starting chips', 'Hard AI unlocked']
    },
    Shark: {
        name: 'Shark',
        color: 'red',
        icon: '🦈',
        description: 'Dominating the tables with expertise.',
        benefits: ['4000 starting chips', 'Maniac AI unlocked', 'Theme customization']
    },
    Legend: {
        name: 'Legend',
        icon: '👑',
        color: 'yellow',
        description: 'Poker royalty. Feared by all.',
        benefits: ['6000 starting chips', 'All features unlocked', 'Exclusive avatar']
    }
};
/** Get tier requirements */
export function getTierRequirements(tier) {
    const tierXP = TIER_XP[tier];
    // Calculate progress percentage within current tier
    const tierKeys = Object.keys(TIER_XP);
    const tierIndex = tierKeys.indexOf(tier);
    let progressFrom = 0;
    for (let i = 0; i < tierIndex; i++) {
        progressFrom += (TIER_XP[tierKeys[i]].max - TIER_XP[tierKeys[i]].min) + 1;
    }
    return {
        minXP: tierXP.min,
        maxXP: tierXP.max === Infinity ? tierXP.min * 2 : tierXP.max,
        progressFrom
    };
}
/** Calculate progress percentage within current tier */
export function getTierProgress(xp) {
    const tier = calculateTier(xp);
    const requirements = getTierRequirements(tier);
    const progressInTier = xp - requirements.minXP;
    const tierSize = requirements.maxXP - requirements.minXP;
    return Math.max(0, Math.min(100, (progressInTier / tierSize) * 100));
}
/** Calculate tier from XP */
export function calculateTier(xp) {
    for (const [tier, range] of Object.entries(TIER_XP)) {
        if (xp >= range.min && xp <= range.max) {
            return tier;
        }
    }
    return 'Rookie';
}
/** Get XP needed for next tier */
export function getXPToNextTier(xp) {
    const currentTier = calculateTier(xp);
    const tierKeys = Object.keys(TIER_XP);
    const tierIndex = tierKeys.indexOf(currentTier);
    if (tierIndex >= tierKeys.length - 1) {
        return null; // Already at max tier
    }
    const nextTier = tierKeys[tierIndex + 1];
    return TIER_XP[nextTier].min - xp + 1;
}
/** Format tier for display */
export function formatTier(tier) {
    const def = TIER_DEFINITIONS[tier];
    return `${def.icon} ${def.name}`;
}
/** Get tier color */
export function getTierColor(tier) {
    return TIER_DEFINITIONS[tier].color;
}
/** Get all tier information */
export function getAllTiers() {
    return Object.entries(TIER_XP).map(([tier, range]) => ({
        tier: tier,
        name: TIER_DEFINITIONS[tier].name,
        icon: TIER_DEFINITIONS[tier].icon,
        minXP: range.min
    }));
}
