import { PlayerState, GameTheme } from '../../core/types.js';
interface PlayerSeatProps {
    player: PlayerState;
    theme?: GameTheme;
    isCurrentPlayer?: boolean;
    showCards?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
}
/**
 * PlayerSeat component for displaying a player at the table
 */
export declare function PlayerSeat({ player, theme, isCurrentPlayer, showCards, position, }: PlayerSeatProps): import("react/jsx-runtime").JSX.Element;
interface PlayerSeatsProps {
    players: PlayerState[];
    theme?: GameTheme;
    currentPlayerIndex: number;
    showCards?: boolean;
    humanPlayerId?: string;
}
/**
 * PlayerSeats component for displaying all players around the table
 */
export declare function PlayerSeats({ players, theme, currentPlayerIndex, showCards, humanPlayerId, }: PlayerSeatsProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PlayerSeat.d.ts.map