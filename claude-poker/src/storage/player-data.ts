// ============================================================================
// Texas Hold'em Poker - Player Data Storage
// ============================================================================

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { PlayerData, PlayerTier, DEFAULT_PLAYER_DATA } from '../core/types.js';
import { TIER_XP, XP_REWARDS, DAILY_BONUS, STARTING_CHIPS } from '../core/constants.js';
import { ensureDirectories, getPlayerFilePath } from './paths.js';

/** Load player data from storage */
export function loadPlayerData(): PlayerData {
  ensureDirectories();

  const filePath = getPlayerFilePath();

  if (!existsSync(filePath)) {
    return createDefaultPlayerData();
  }

  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return migratePlayerData(data);
  } catch (error) {
    console.error('Failed to load player data:', error);
    return createDefaultPlayerData();
  }
}

/** Save player data to storage */
export function savePlayerData(data: PlayerData): void {
  ensureDirectories();

  const filePath = getPlayerFilePath();
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/** Create default player data */
export function createDefaultPlayerData(): PlayerData {
  return {
    ...DEFAULT_PLAYER_DATA,
    id: generatePlayerId(),
    createdAt: new Date().toISOString()
  } as any;
}

/** Migrate player data from older versions */
function migratePlayerData(data: any): PlayerData {
  // Add missing fields with defaults
  const migrated: PlayerData = {
    ...DEFAULT_PLAYER_DATA,
    ...data,
    stats: {
      ...DEFAULT_PLAYER_DATA.stats,
      ...data.stats
    }
  } as any;

  return migrated;
}

/** Generate unique player ID */
function generatePlayerId(): string {
  return `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** Add XP and check for tier up */
export function addXP(data: PlayerData, xp: number): { newData: PlayerData; tieredUp: boolean; newTier?: PlayerTier } {
  const newData = { ...data };
  newData.xp += xp;

  // Check for tier up
  const currentTier = data.tier;
  const newTier = calculateTier(newData.xp);

  if (newTier !== currentTier) {
    newData.tier = newTier;
    return { newData, tieredUp: true, newTier };
  }

  return { newData, tieredUp: false };
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

/** Update stats after a hand */
export function updateHandStats(
  data: PlayerData,
  won: boolean,
  atShowdown: boolean,
  action: 'fold' | 'check' | 'call' | 'raise' | 'allin',
  amountWon: number = 0
): PlayerData {
  const newData = { ...data };
  newData.handsPlayed++;

  if (won) {
    newData.handsWon++;
    newData.stats.totalWinnings += amountWon;
    if (amountWon > newData.stats.biggestWin) {
      newData.stats.biggestWin = amountWon;
    }
    if (atShowdown) {
      newData.stats.showdowWon++;
    }
  }

  // Update action stats
  switch (action) {
    case 'fold':
      newData.stats.handsFolded++;
      break;
    case 'check':
      newData.stats.handsChecked++;
      break;
    case 'call':
      newData.stats.handsCalled++;
      break;
    case 'raise':
      newData.stats.handsRaised++;
      break;
    case 'allin':
      newData.stats.allInsCount++;
      break;
  }

  // Update win rate
  newData.winRate = newData.handsPlayed > 0
    ? Math.round((newData.handsWon / newData.handsPlayed) * 100)
    : 0;

  // Add XP
  const xpResult = addXP(newData, XP_REWARDS.HAND_PLAYED + (won ? XP_REWARDS.HAND_WON : 0));
  newData.xp = xpResult.newData.xp;
  newData.tier = xpResult.newData.tier;

  return newData;
}

/** Claim daily bonus */
export function claimDailyBonus(data: PlayerData): {
  newData: PlayerData;
  success: boolean;
  amount: number;
  streak: number;
} {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const lastBonus = data.lastDailyBonus;

  // Check if already claimed today
  if (lastBonus === today) {
    return {
      newData: data,
      success: false,
      amount: 0,
      streak: 0
    };
  }

  // Calculate streak
  let streak = 0;
  if (lastBonus) {
    const lastDate = new Date(lastBonus);
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      // Continuation - would need to track actual streak
      streak = Math.min(7, (diffDays === 0 ? 0 : 1) + 1);
    }
  }

  // Calculate bonus amount
  let amount = DAILY_BONUS.BASE;
  if (streak >= 2) {
    amount += DAILY_BONUS.STREAK_BONUS * Math.min(streak - 1, DAILY_BONUS.MAX_STREAK);
  }

  // Update data
  const newData = { ...data };
  newData.chips += amount;
  newData.lastDailyBonus = today;

  return {
    newData,
    success: true,
    amount,
    streak
  };
}

/** Check if daily bonus is available */
export function canClaimDailyBonus(data: PlayerData): boolean {
  const today = new Date().toISOString().split('T')[0];
  return data.lastDailyBonus !== today;
}

/** Reset player data (start over) */
export function resetPlayerData(): PlayerData {
  const filePath = getPlayerFilePath();

  // Delete existing file
  if (existsSync(filePath)) {
    // In a real implementation, would delete the file
    // For now, just overwrite with new data
  }

  return createDefaultPlayerData();
}

/** Get starting chips based on tier */
export function getStartingChips(tier: PlayerTier): number {
  const bonus = {
    Rookie: 0,
    Amateur: 500,
    Pro: 1500,
    Shark: 3000,
    Legend: 5000
  };

  return STARTING_CHIPS.default + bonus[tier];
}

/** Format chips for display */
export function formatChips(amount: number): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return Math.floor(amount).toString();
}
