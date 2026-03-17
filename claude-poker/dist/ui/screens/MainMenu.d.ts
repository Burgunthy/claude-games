import { PlayerData } from '../../storage/player-data.js';
interface MainMenuProps {
    playerData: PlayerData | null;
    onStartGame: () => void;
    onSettings: () => void;
    onStats: () => void;
    onQuit: () => void;
}
/**
 * MainMenu screen component
 */
export declare function MainMenu({ playerData, onStartGame, onSettings, onStats, onQuit }: MainMenuProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MainMenu.d.ts.map