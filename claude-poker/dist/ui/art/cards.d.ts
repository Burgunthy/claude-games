import { Card } from '../../core/types.js';
/** Card display styles */
export type CardDisplayStyle = 'compact' | 'ascii' | 'fancy' | 'minimal';
/** Render a single card */
export declare function renderCard(card: Card, theme?: 'casino' | 'modern' | 'retro', style?: CardDisplayStyle, hidden?: boolean): string;
/** Render compact card */
declare function renderCompactCard(card: Card): string;
export { renderCompactCard };
/** Render multiple cards in a row */
export declare function renderCards(cards: Card[], theme?: 'casino' | 'modern' | 'retro', style?: CardDisplayStyle, hidden?: boolean): string;
/** Create a hand display box */
export declare function createHandBox(title: string, cards: Card[], theme?: 'casino' | 'modern' | 'retro', hidden?: boolean): string;
/** Get card color (red/black) */
export declare function getCardColor(card: Card): 'red' | 'black';
/** Format card for plain text */
export declare function formatCardText(card: Card): string;
/** Parse card from string */
export declare function parseCard(str: string): Card | null;
