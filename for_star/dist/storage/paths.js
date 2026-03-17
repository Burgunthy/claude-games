// ============================================================================
// Texas Hold'em Poker - Storage Paths
// ============================================================================
import { homedir } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { STORAGE_PATHS } from '../core/constants.js';
/** Get the base directory for Claude Games */
export function getBaseDir() {
    const homeDir = homedir();
    return join(homeDir, STORAGE_PATHS.BASE_DIR);
}
/** Get the game directory */
export function getGameDir() {
    return join(getBaseDir(), STORAGE_PATHS.GAME_DIR);
}
/** Get player data file path */
export function getPlayerFilePath() {
    return join(getGameDir(), STORAGE_PATHS.PLAYER_FILE);
}
/** Get settings file path */
export function getSettingsFilePath() {
    return join(getGameDir(), STORAGE_PATHS.SETTINGS_FILE);
}
/** Get history file path */
export function getHistoryFilePath() {
    return join(getGameDir(), STORAGE_PATHS.HISTORY_FILE);
}
/** Ensure all directories exist */
export function ensureDirectories() {
    const dirs = [getBaseDir(), getGameDir()];
    for (const dir of dirs) {
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
    }
}
/** Check if this is a fresh install (no existing data) */
export function isFreshInstall() {
    const gameDir = getGameDir();
    return !existsSync(gameDir);
}
