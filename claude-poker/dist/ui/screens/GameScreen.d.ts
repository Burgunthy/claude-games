import { GameTheme } from '../../core/types.js';
import { PokerEngine } from '../../core/engine.js';
interface GameScreenProps {
    engine: PokerEngine;
    theme?: GameTheme;
    onGameEnd: (winner: string) => void;
    onQuit: () => void;
}
/**
 * Main game screen component
 */
export declare function GameScreen({ engine, theme, onGameEnd, onQuit }: GameScreenProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=GameScreen.d.ts.map