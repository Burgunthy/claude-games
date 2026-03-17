/** Get the base directory for Claude Games */
export declare function getBaseDir(): string;
/** Get the game directory */
export declare function getGameDir(): string;
/** Get player data file path */
export declare function getPlayerFilePath(): string;
/** Get settings file path */
export declare function getSettingsFilePath(): string;
/** Get history file path */
export declare function getHistoryFilePath(): string;
/** Ensure all directories exist */
export declare function ensureDirectories(): void;
/** Check if this is a fresh install (no existing data) */
export declare function isFreshInstall(): boolean;
