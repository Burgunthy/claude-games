import { GameSettings, ThemeName, AIStrategyType } from '../core/types.js';
/** Load settings from storage */
export declare function loadSettings(): GameSettings;
/** Save settings to storage */
export declare function saveSettings(settings: GameSettings): void;
/** Update a single setting */
export declare function updateSetting<K extends keyof GameSettings>(key: K, value: GameSettings[K]): GameSettings;
/** Reset settings to defaults */
export declare function resetSettings(): GameSettings;
/** Validate theme name */
export declare function isValidTheme(theme: string): theme is ThemeName;
/** Validate difficulty */
export declare function isValidDifficulty(difficulty: string): difficulty is AIStrategyType;
/** Validate language code */
export declare function isValidLanguage(lang: string): boolean;
