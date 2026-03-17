import { Theme } from '../../core/types.js';
export declare const retroTheme: Theme;
/** Card ASCII art for retro theme (block style) */
export declare function retroCardArt(rank: string, suit: string, hidden?: boolean): string;
/** Border styles for retro theme */
export declare function retroBorder(type: 'box' | 'header' | 'separator'): string;
/** Compact card display for retro theme */
export declare function retroCardCompact(rank: string, suit: string): string;
/** Get color codes for retro terminal */
export declare function retroColorCode(color: 'red' | 'yellow' | 'green' | 'blue' | 'white'): number;
