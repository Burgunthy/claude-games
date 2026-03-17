import { Card, GameTheme, GamePhase } from '../../core/types.js';
interface CommunityCardsProps {
    cards: Card[];
    phase: GamePhase;
    theme?: GameTheme;
}
/**
 * CommunityCards component for displaying the board
 */
export declare function CommunityCards({ cards, phase, theme }: CommunityCardsProps): import("react/jsx-runtime").JSX.Element;
interface CommunityCardsCompactProps {
    cards: Card[];
    theme?: GameTheme;
}
/**
 * Compact version of community cards
 */
export declare function CommunityCardsCompact({ cards, theme }: CommunityCardsCompactProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CommunityCards.d.ts.map