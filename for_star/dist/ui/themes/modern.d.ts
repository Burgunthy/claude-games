import { Theme } from '../../core/types.js';
export declare const modernTheme: Theme;
/** Card ASCII art for modern theme */
export declare function modernCardArt(rank: string, suit: string, hidden?: boolean): string;
/** Border styles for modern theme */
export declare function modernBorder(type: 'box' | 'header' | 'separator'): string;
/** Compact card display for modern theme */
export declare function modernCardCompact(rank: string, suit: string): string;
