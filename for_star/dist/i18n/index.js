// ============================================================================
// Texas Hold'em Poker - i18n System
// ============================================================================
import enTranslations from './en.json' with { type: 'json' };
import koTranslations from './ko.json' with { type: 'json' };
import jaTranslations from './ja.json' with { type: 'json' };
/** All translations */
const TRANSLATIONS = {
    en: enTranslations,
    ko: koTranslations,
    ja: jaTranslations
};
/** Current language (default: English) */
let currentLanguage = 'en';
/** Set current language */
export function setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
        currentLanguage = lang;
    }
}
/** Get current language */
export function getLanguage() {
    return currentLanguage;
}
/** Get available languages */
export function getAvailableLanguages() {
    return [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'ko', name: 'Korean', nativeName: '한국어' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語' }
    ];
}
/** Translate a key */
export function t(key, ...args) {
    const translations = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    // Navigate through nested keys
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
        value = value?.[k];
    }
    if (typeof value !== 'string') {
        // Fallback to English
        value = TRANSLATIONS.en;
        for (const k of keys) {
            value = value?.[k];
        }
    }
    if (typeof value !== 'string') {
        return key; // Return key if translation not found
    }
    // Replace placeholders with arguments
    if (args.length > 0) {
        return value.replace(/%s/g, () => String(args.shift()));
    }
    return value;
}
/** Get all translations for current language */
export function getTranslations() {
    return TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
}
/** Check if language is supported */
export function isLanguageSupported(lang) {
    return lang in TRANSLATIONS;
}
/** Detect language from locale */
export function detectLanguage() {
    const locale = process.env.LANG || process.env.LC_ALL || 'en_US';
    const langCode = locale.split('_')[0].split('.')[0];
    if (isLanguageSupported(langCode)) {
        return langCode;
    }
    return 'en';
}
/** Auto-detect and set language */
export function autoDetectLanguage() {
    setLanguage(detectLanguage());
}
/** Format with translated string */
export function tf(key, ...args) {
    return t(key, ...args);
}
/** Pluralize (basic implementation) */
export function tp(key, count) {
    // Simple pluralization - languages like Korean/Japanese don't have plurals
    if (currentLanguage === 'ko' || currentLanguage === 'ja') {
        return t(key);
    }
    // English plurals
    if (count === 1) {
        return t(key + '.singular', count);
    }
    return t(key + '.plural', count);
}
