// ============================================================================
// Texas Hold'em Poker - Theme Manager
// ============================================================================

import { Theme, ThemeName } from '../../core/types.js';
import { casinoTheme, casinoCardArt, casinoCardCompact, casinoBorder } from './casino.js';
import { modernTheme, modernCardArt, modernCardCompact, modernBorder } from './modern.js';
import { retroTheme, retroCardArt, retroCardCompact, retroBorder } from './retro.js';

/** All available themes */
export const THEMES: Record<ThemeName, Theme> = {
  casino: casinoTheme,
  modern: modernTheme,
  retro: retroTheme
} as const;

/** Get theme by name */
export function getTheme(name: ThemeName): Theme {
  return THEMES[name] || THEMES.casino;
}

/** Get card art for a theme */
export function getCardArt(
  theme: ThemeName,
  rank: string,
  suit: string,
  hidden: boolean = false
): string {
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
export function getCompactCard(
  theme: ThemeName,
  rank: string,
  suit: string
): string {
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
export function getBorder(
  theme: ThemeName,
  type: 'box' | 'header' | 'separator'
): string {
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
export function getThemeNames(): ThemeName[] {
  return Object.keys(THEMES) as ThemeName[];
}

/** Get theme display name */
export function getThemeDisplayName(name: ThemeName): string {
  return THEMES[name].displayName;
}

/** Create a themed box */
export function createThemedBox(
  theme: ThemeName,
  content: string[],
  title?: string
): string {
  const lines: string[] = [];

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
