import { GameTheme } from '../../core/types.js';
interface PotProps {
    amount: number;
    theme?: GameTheme;
    showAnimation?: boolean;
}
/**
 * Pot component for displaying the current pot
 */
export declare function Pot({ amount, theme, showAnimation }: PotProps): import("react/jsx-runtime").JSX.Element;
interface PotBreakdownProps {
    mainPot: number;
    sidePots?: Array<{
        amount: number;
        players: string[];
    }>;
    theme?: GameTheme;
}
/**
 * PotBreakdown component for displaying pot details including side pots
 */
export declare function PotBreakdown({ mainPot, sidePots, theme }: PotBreakdownProps): import("react/jsx-runtime").JSX.Element;
interface PotWinProps {
    amount: number;
    winnerName: string;
    theme?: GameTheme;
}
/**
 * PotWin component for displaying when someone wins the pot
 */
export declare function PotWin({ amount, winnerName, theme }: PotWinProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Pot.d.ts.map