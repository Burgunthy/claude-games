import { Translation } from '../core/types.js';
/** Set current language */
export declare function setLanguage(lang: string): void;
/** Get current language */
export declare function getLanguage(): string;
/** Get available languages */
export declare function getAvailableLanguages(): Array<{
    code: string;
    name: string;
    nativeName: string;
}>;
/** Translate a key */
export declare function t(key: string, ...args: any[]): string;
/** Get all translations for current language */
export declare function getTranslations(): Translation;
/** Check if language is supported */
export declare function isLanguageSupported(lang: string): boolean;
/** Detect language from locale */
export declare function detectLanguage(): string;
/** Auto-detect and set language */
export declare function autoDetectLanguage(): void;
/** Format with translated string */
export declare function tf(key: string, ...args: any[]): string;
/** Pluralize (basic implementation) */
export declare function tp(key: string, count: number): string;
