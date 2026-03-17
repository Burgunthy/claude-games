// ============================================================================
// Texas Hold'em Poker - Storage Module Index
// ============================================================================
export { loadPlayerData, savePlayerData, createDefaultPlayerData, addXP, updateHandStats, claimDailyBonus, canClaimDailyBonus, resetPlayerData, getStartingChips, formatChips } from './player-data.js';
export { loadSettings, saveSettings, updateSetting, resetSettings, isValidTheme, isValidDifficulty, isValidLanguage } from './settings.js';
export { loadHistory, saveHistory, addGameRecord, getRecentGames, getStatistics, clearHistory } from './history.js';
export { ensureDirectories, getBaseDir, getGameDir, getPlayerFilePath, getSettingsFilePath, getHistoryFilePath, isFreshInstall } from './paths.js';
