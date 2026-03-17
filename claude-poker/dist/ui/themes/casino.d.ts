import { Theme } from '../../core/types.js';
export declare const casinoTheme: Theme;
/** Card ASCII art for casino theme */
export declare function casinoCardArt(rank: string, suit: string, hidden?: boolean): string;
/** Border styles for casino theme */
export declare function casinoBorder(type: 'box' | 'header' | 'separator'): string;
/** Compact card display for casino theme */
export declare function casinoCardCompact(rank: string, suit: string): string;
