import { GameConfig } from '../../core/types.js';
interface GameSetupProps {
    onComplete: (config: GameConfig) => void;
    onBack: () => void;
}
/**
 * GameSetup screen for configuring game settings
 */
export declare function GameSetup({ onComplete, onBack }: GameSetupProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=GameSetup.d.ts.map