import { Theme, ThemeName } from '../../core/types.js';
/** All available themes */
export declare const THEMES: Record<ThemeName, Theme>;
/** Get theme by name */
export declare function getTheme(name: ThemeName): Theme;
/** Get card art for a theme */
export declare function getCardArt(theme: ThemeName, rank: string, suit: string, hidden?: boolean): string;
/** Get compact card display for a theme */
export declare function getCompactCard(theme: ThemeName, rank: string, suit: string): string;
/** Get border characters for a theme */
export declare function getBorder(theme: ThemeName, type: 'box' | 'header' | 'separator'): string;
/** Get all theme names */
export declare function getThemeNames(): ThemeName[];
/** Get theme display name */
export declare function getThemeDisplayName(name: ThemeName): string;
/** Create a themed box */
export declare function createThemedBox(theme: ThemeName, content: string[], title?: string): string;
