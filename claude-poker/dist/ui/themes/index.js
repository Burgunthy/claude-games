// ============================================================================
// Texas Hold'em Poker - Theme Manager
// ============================================================================
import { casinoTheme, casinoCardArt, casinoCardCompact, casinoBorder } from './casino.js';
import { modernTheme, modernCardArt, modernCardCompact, modernBorder } from './modern.js';
import { retroTheme, retroCardArt, retroCardCompact, retroBorder } from './retro.js';
/** All available themes */
export const THEMES = {
    casino: casinoTheme,
    modern: modernTheme,
    retro: retroTheme
};
/** Get theme by name */
export function getTheme(name) {
    return THEMES[name] || THEMES.casino;
}
/** Get card art for a theme */
export function getCardArt(theme, rank, suit, hidden = false) {
    switch (theme) {
        case 'casino':
            return casinoCardArt(rank, suit, hidden);
        case 'modern':
            return modernCardArt(rank, suit, hidden);
        case 'retro':
            return retroCardArt(rank, suit, hidden);
    }
}
/** Get compact card display for a theme */
export function getCompactCard(theme, rank, suit) {
    switch (theme) {
        case 'casino':
            return casinoCardCompact(rank, suit);
        case 'modern':
            return modernCardCompact(rank, suit);
        case 'retro':
            return retroCardCompact(rank, suit);
    }
}
/** Get border characters for a theme */
export function getBorder(theme, type) {
    switch (theme) {
        case 'casino':
            return casinoBorder(type);
        case 'modern':
            return modernBorder(type);
        case 'retro':
            return retroBorder(type);
    }
}
/** Get all theme names */
export function getThemeNames() {
    return Object.keys(THEMES);
}
/** Get theme display name */
export function getThemeDisplayName(name) {
    return THEMES[name].displayName;
}
/** Create a themed box */
export function createThemedBox(theme, content, title) {
    const lines = [];
    const border = getBorder(theme, 'header');
    lines.push(border);
    if (title) {
        const centered = title.padStart(Math.floor((border.length - title.length) / 2) + title.length);
        lines.push(`| ${centered.slice(0, border.length - 4)} |`);
        lines.push(getBorder(theme, 'separator'));
    }
    for (const line of content) {
        lines.push(`| ${line.padEnd(border.length - 4)} |`);
    }
    const bottomBorder = border.replace(/[╔╠]/g, '╚').replace(/[╗╗]/g, '╝').replace(/═/g, '═');
    lines.push(bottomBorder.replace('╠', '╚').replace('╗', '╝'));
    return lines.join('\n');
}
