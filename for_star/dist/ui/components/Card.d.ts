import React from 'react';
import { Card as CardType, GameTheme } from '../../core/types.js';
interface CardProps {
    card: CardType;
    hidden?: boolean;
    theme?: GameTheme;
    mini?: boolean;
    style?: React.CSSProperties;
}
/**
 * Card component for displaying a single card
 */
export declare function Card({ card, hidden, theme, mini, style }: CardProps): import("react/jsx-runtime").JSX.Element;
interface CardRowProps {
    cards: CardType[];
    hidden?: boolean;
    theme?: GameTheme;
    mini?: boolean;
}
/**
 * CardRow component for displaying multiple cards
 */
export declare function CardRow({ cards, hidden, theme, mini }: CardRowProps): import("react/jsx-runtime").JSX.Element;
interface HiddenCardProps {
    theme?: GameTheme;
    mini?: boolean;
}
/**
 * HiddenCard component for face-down cards
 */
export declare function HiddenCard({ theme, mini }: HiddenCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Card.d.ts.map