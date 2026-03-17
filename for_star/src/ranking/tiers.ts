// ============================================================================
// Texas Hold'em Poker - Tier System
// ============================================================================

import { PlayerTier } from '../core/types.js';
import { TIER_XP } from '../core/constants.js';

/** Tier definitions with display info */
export const TIER_DEFINITIONS: Record<PlayerTier, {
  name: string;
  color: string;
  icon: string;
  description: string;
  benefits: string[];
}> = {
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
} as const;

/** Get tier requirements */
export function getTierRequirements(tier: PlayerTier): { minXP: number; maxXP: number; progressFrom: number } {
  const tierXP = TIER_XP[tier];

  // Calculate progress percentage within current tier
  const tierKeys = Object.keys(TIER_XP) as PlayerTier[];
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
export function getTierProgress(xp: number): number {
  const tier = calculateTier(xp);
  const requirements = getTierRequirements(tier);
  const progressInTier = xp - requirements.minXP;
  const tierSize = requirements.maxXP - requirements.minXP;

  return Math.max(0, Math.min(100, (progressInTier / tierSize) * 100));
}

/** Calculate tier from XP */
export function calculateTier(xp: number): PlayerTier {
  for (const [tier, range] of Object.entries(TIER_XP)) {
    if (xp >= range.min && xp <= range.max) {
      return tier as PlayerTier;
    }
  }
  return 'Rookie';
}

/** Get XP needed for next tier */
export function getXPToNextTier(xp: number): number | null {
  const currentTier = calculateTier(xp);
  const tierKeys = Object.keys(TIER_XP) as PlayerTier[];
  const tierIndex = tierKeys.indexOf(currentTier);

  if (tierIndex >= tierKeys.length - 1) {
    return null; // Already at max tier
  }

  const nextTier = tierKeys[tierIndex + 1];
  return TIER_XP[nextTier].min - xp + 1;
}

/** Format tier for display */
export function formatTier(tier: PlayerTier): string {
  const def = TIER_DEFINITIONS[tier];
  return `${def.icon} ${def.name}`;
}

/** Get tier color */
export function getTierColor(tier: PlayerTier): string {
  return TIER_DEFINITIONS[tier].color;
}

/** Get all tier information */
export function getAllTiers(): Array<{
  tier: PlayerTier;
  name: string;
  icon: string;
  minXP: number;
}> {
  return Object.entries(TIER_XP).map(([tier, range]) => ({
    tier: tier as PlayerTier,
    name: TIER_DEFINITIONS[tier as PlayerTier].name,
    icon: TIER_DEFINITIONS[tier as PlayerTier].icon,
    minXP: range.min
  }));
}
