// ============================================================================
// Texas Hold'em Poker - Game History Storage
// ============================================================================

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { GameRecord } from '../core/types.js';
import { MAX_HISTORY_RECORDS } from '../core/constants.js';
import { ensureDirectories, getHistoryFilePath } from './paths.js';

/** Game history data structure */
interface HistoryData {
  games: GameRecord[];
  totalGames: number;
  totalHands: number;
  totalWinnings: number;
}

/** Load game history */
export function loadHistory(): HistoryData {
  ensureDirectories();

  const filePath = getHistoryFilePath();

  if (!existsSync(filePath)) {
    return {
      games: [],
      totalGames: 0,
      totalHands: 0,
      totalWinnings: 0
    };
  }

  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return data;
  } catch (error) {
    console.error('Failed to load history:', error);
    return {
      games: [],
      totalGames: 0,
      totalHands: 0,
      totalWinnings: 0
    };
  }
}

/** Save game history */
export function saveHistory(history: HistoryData): void {
  ensureDirectories();

  const filePath = getHistoryFilePath();
  writeFileSync(filePath, JSON.stringify(history, null, 2), 'utf-8');
}

/** Add a game record */
export function addGameRecord(record: GameRecord): HistoryData {
  const history = loadHistory();

  history.games.unshift(record);

  // Keep only recent records
  if (history.games.length > MAX_HISTORY_RECORDS) {
    history.games = history.games.slice(0, MAX_HISTORY_RECORDS);
  }

  history.totalGames++;
  history.totalHands += record.handsPlayed;
  history.totalWinnings += record.chipsWon;

  saveHistory(history);

  return history;
}

/** Get recent games */
export function getRecentGames(count: number = 10): GameRecord[] {
  const history = loadHistory();
  return history.games.slice(0, count);
}

/** Get statistics summary */
export function getStatistics(): {
  totalGames: number;
  totalHands: number;
  totalWinnings: number;
  averageHandsPerGame: number;
  averageWinningsPerGame: number;
  winRate: number;
} {
  const history = loadHistory();

  const winRate = history.totalGames > 0
    ? (history.games.filter(g => g.chipsWon > 0).length / history.totalGames) * 100
    : 0;

  return {
    totalGames: history.totalGames,
    totalHands: history.totalHands,
    totalWinnings: history.totalWinnings,
    averageHandsPerGame: history.totalGames > 0
      ? Math.round(history.totalHands / history.totalGames)
      : 0,
    averageWinningsPerGame: history.totalGames > 0
      ? Math.round(history.totalWinnings / history.totalGames)
      : 0,
    winRate: Math.round(winRate)
  };
}

/** Clear all history */
export function clearHistory(): void {
  saveHistory({
    games: [],
    totalGames: 0,
    totalHands: 0,
    totalWinnings: 0
  });
}
