import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// Texas Hold'em Poker - Main App Component
// ============================================================================
import { useState, useCallback, useEffect } from 'react';
import { Box, Text } from 'ink';
import { PokerEngine } from './core/engine.js';
import { MainMenu, GameSetup, GameScreen, StatsScreen } from './ui/screens/index.js';
import { getPlayerData, savePlayerData, claimDailyBonus, updateGameStats, unlockAchievement, } from './storage/index.js';
import { checkAchievements } from './ranking/index.js';
/**
 * Main App component
 */
export function App({ initialConfig }) {
    const [currentScreen, setCurrentScreen] = useState('menu');
    const [playerData, setPlayerData] = useState(null);
    const [gameEngine, setGameEngine] = useState(null);
    const [gameConfig, setGameConfig] = useState(null);
    const [message, setMessage] = useState('');
    // Load player data on mount
    useEffect(() => {
        const data = getPlayerData();
        setPlayerData(data);
    }, []);
    // Handle daily bonus claim
    const handleDailyBonus = useCallback(() => {
        const result = claimDailyBonus();
        setMessage(result.message);
        if (result.claimed) {
            // Reload player data
            setPlayerData(getPlayerData());
        }
    }, []);
    // Start new game
    const handleStartGame = useCallback(() => {
        setCurrentScreen('setup');
    }, []);
    // Handle game setup complete
    const handleSetupComplete = useCallback((config) => {
        setGameConfig(config);
        // Initialize game engine
        const engine = new PokerEngine(config);
        setGameEngine(engine);
        // Start the first hand
        engine.startHand();
        setCurrentScreen('game');
    }, []);
    // Handle game end
    const handleGameEnd = useCallback((winner) => {
        if (playerData && gameEngine) {
            const humanPlayer = gameEngine.state.players.find(p => p.isHuman);
            const humanWon = winner === 'human';
            // Update stats
            updateGameStats(humanWon, gameEngine.state.pot);
            // Check achievements
            const newData = getPlayerData();
            const newAchievements = checkAchievements(newData);
            for (const achievement of newAchievements) {
                unlockAchievement(achievement);
            }
            // Reload player data
            setPlayerData(getPlayerData());
        }
        setCurrentScreen('menu');
    }, [playerData, gameEngine]);
    // Handle quit
    const handleQuit = useCallback(() => {
        // Save any pending data
        if (playerData) {
            savePlayerData(playerData);
        }
        process.exit(1);
    }, [playerData]);
    // Render current screen
    const renderScreen = () => {
        switch (currentScreen) {
            case 'menu':
                return (_jsx(MainMenu, { playerData: playerData, onStartGame: handleStartGame, onSettings: handleDailyBonus, onStats: () => setCurrentScreen('stats'), onQuit: handleQuit }));
            case 'setup':
                return (_jsx(GameSetup, { onComplete: handleSetupComplete, onBack: () => setCurrentScreen('menu') }));
            case 'game':
                if (!gameEngine || !gameConfig) {
                    return _jsx(Text, { children: "Initializing game..." });
                }
                return (_jsx(GameScreen, { engine: gameEngine, theme: gameConfig.theme, onGameEnd: handleGameEnd, onQuit: () => {
                        setGameEngine(null);
                        setGameConfig(null);
                        setCurrentScreen('menu');
                    } }));
            case 'stats':
                if (!playerData) {
                    return _jsx(Text, { children: "Loading stats..." });
                }
                return (_jsx(StatsScreen, { playerData: playerData, onBack: () => setCurrentScreen('menu') }));
            default:
                return _jsx(Text, { children: "Unknown screen" });
        }
    };
    return (_jsxs(Box, { flexDirection: "column", minHeight: 40, children: [message && (_jsx(Box, { justifyContent: "center", marginBottom: 1, children: _jsx(Text, { color: "green", children: message }) })), renderScreen()] }));
}
//# sourceMappingURL=app.js.map