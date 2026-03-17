// ============================================================================
// Texas Hold'em Poker - Settings Storage
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { DEFAULT_SETTINGS } from '../core/constants.js';
import { ensureDirectories, getSettingsFilePath } from './paths.js';
/** Load settings from storage */
export function loadSettings() {
    ensureDirectories();
    const filePath = getSettingsFilePath();
    if (!existsSync(filePath)) {
        return { ...DEFAULT_SETTINGS };
    }
    try {
        const data = JSON.parse(readFileSync(filePath, 'utf-8'));
        return { ...DEFAULT_SETTINGS, ...data };
    }
    catch (error) {
        console.error('Failed to load settings:', error);
        return { ...DEFAULT_SETTINGS };
    }
}
/** Save settings to storage */
export function saveSettings(settings) {
    ensureDirectories();
    const filePath = getSettingsFilePath();
    writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8');
}
/** Update a single setting */
export function updateSetting(key, value) {
    const settings = loadSettings();
    settings[key] = value;
    saveSettings(settings);
    return settings;
}
/** Reset settings to defaults */
export function resetSettings() {
    saveSettings({ ...DEFAULT_SETTINGS });
    return { ...DEFAULT_SETTINGS };
}
/** Validate theme name */
export function isValidTheme(theme) {
    return ['casino', 'modern', 'retro'].includes(theme);
}
/** Validate difficulty */
export function isValidDifficulty(difficulty) {
    return ['easy', 'normal', 'hard', 'maniac'].includes(difficulty);
}
/** Validate language code */
export function isValidLanguage(lang) {
    return ['en', 'ko', 'ja'].includes(lang);
}
