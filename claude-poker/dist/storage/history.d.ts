import { GameRecord } from '../core/types.js';
/** Game history data structure */
interface HistoryData {
    games: GameRecord[];
    totalGames: number;
    totalHands: number;
    totalWinnings: number;
}
/** Load game history */
export declare function loadHistory(): HistoryData;
/** Save game history */
export declare function saveHistory(history: HistoryData): void;
/** Add a game record */
export declare function addGameRecord(record: GameRecord): HistoryData;
/** Get recent games */
export declare function getRecentGames(count?: number): GameRecord[];
/** Get statistics summary */
export declare function getStatistics(): {
    totalGames: number;
    totalHands: number;
    totalWinnings: number;
    averageHandsPerGame: number;
    averageWinningsPerGame: number;
    winRate: number;
};
/** Clear all history */
export declare function clearHistory(): void;
export {};
