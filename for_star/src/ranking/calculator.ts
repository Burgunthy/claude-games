// ============================================================================
// Texas Hold'em Poker - XP Calculator
// ============================================================================

import { PlayerTier } from '../core/types.js';
import { XP_REWARDS, TIER_XP } from '../core/constants.js';
import { calculateTier, getTierRequirements } from './tiers.js';

/** XP gain event */
export type XPEvent =
  | 'hand_played'
  | 'hand_won'
  | 'showdown_won'
  | 'allin_won'
  | 'busted_player'
  | 'knockout'
  | 'daily_bonus'
  | 'achievement'
  | 'higher_tier_bonus';

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
export function calculateHandXP(
  won: boolean,
  atShowdown: boolean,
  wentAllIn: boolean,
  bustedOpponents: number,
  opponentsWereHigherTier: boolean
): XPReward[] {
  const rewards: XPReward[] = [];

  // Base XP for playing
  rewards.push({
    amount: XP_REWARDS.HAND_PLAYED,
    reason: 'Played a hand',
    event: 'hand_played'
  });

  // Won the hand
  if (won) {
    rewards.push({
      amount: XP_REWARDS.HAND_WON,
      reason: 'Won a hand',
      event: 'hand_won'
    });

    // Won at showdown
    if (atShowdown) {
      rewards.push({
        amount: XP_REWARDS.SHOWDOWN_WON,
        reason: 'Won at showdown',
        event: 'showdown_won'
      });
    }

    // All-in and won
    if (wentAllIn) {
      rewards.push({
        amount: XP_REWARDS.ALLIN_WON,
        reason: 'Won all-in',
        event: 'allin_won'
      });
    }

    // Busted opponents
    if (bustedOpponents > 0) {
      rewards.push({
        amount: XP_REWARDS.BUSTED_PLAYER * bustedOpponents,
        reason: `Busted ${bustedOpponents} player${bustedOpponents > 1 ? 's' : ''}`,
        event: 'busted_player'
      });
    }

    // Bonus for beating higher tier
    if (opponentsWereHigherTier) {
      rewards.push({
        amount: XP_REWARDS.KNOCKOUT,
        reason: 'Beat a higher tier opponent',
        event: 'higher_tier_bonus'
      });
    }
  }

  return rewards;
}

/** Add XP and calculate new tier */
export function addXP(
  currentXP: number,
  currentTier: PlayerTier,
  rewards: XPReward[]
): XPResult {
  const previousTier = currentTier;
  const totalXP = rewards.reduce((sum, r) => sum + r.amount, currentXP);
  const newTier = calculateTier(totalXP);
  const tieredUp = newTier !== previousTier;

  const requirements = getTierRequirements(newTier);
  const tierProgress = ((totalXP - requirements.minXP) / (requirements.maxXP - requirements.minXP)) * 100;

  // Calculate XP to next tier
  const tierKeys = Object.keys(TIER_XP) as PlayerTier[];
  const tierIndex = tierKeys.indexOf(newTier);
  const xpToNextTier = tierIndex < tierKeys.length - 1
    ? TIER_XP[tierKeys[tierIndex + 1]].min - totalXP
    : null;

  return {
    newXP: totalXP,
    newTier,
    previousTier,
    tieredUp,
    tierProgress: Math.max(0, Math.min(100, tierProgress)),
    xpToNextTier
  };
}

/** Calculate XP needed for a specific tier */
export function getXPForTier(targetTier: PlayerTier): number {
  return TIER_XP[targetTier].min;
}

/** Calculate total XP earned per level bracket */
export function getXPInBracket(tier: PlayerTier): number {
  const range = TIER_XP[tier];
  return range.max === Infinity ? range.min : (range.max - range.min + 1);
}

/** Get all tier milestones */
export function getTierMilestones(): Array<{ tier: PlayerTier; xp: number; icon: string }> {
  const milestones: Array<{ tier: PlayerTier; xp: number; icon: string }> = [];

  for (const [tier, range] of Object.entries(TIER_XP)) {
    milestones.push({
      tier: tier as PlayerTier,
      xp: range.min,
      icon: getTierIcon(tier as PlayerTier)
    });
  }

  return milestones;
}

/** Get tier icon */
function getTierIcon(tier: PlayerTier): string {
  const icons: Record<PlayerTier, string> = {
    Rookie: '🌱',
    Amateur: '🎯',
    Pro: '⭐',
    Shark: '🦈',
    Legend: '👑'
  };
  return icons[tier];
}

/** Format XP amount */
export function formatXP(amount: number): string {
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return amount.toString();
}

/** Get XP bonus for achievement */
export function getAchievementXP(achievementId: string): number {
  const achievements: Record<string, number> = {
    first_win: 50,
    first_showdown: 75,
    first_allin: 100,
    winning_streak_3: 150,
    winning_streak_5: 300,
    knockout_king: 200,
    flush_master: 150,
    quad_queens: 500
  };

  return achievements[achievementId] || 25;
}
