import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// ============================================================================
// Texas Hold'em Poker - Game Screen
// ============================================================================
import { useState, useEffect, useCallback } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { GamePhase, ActionType } from '../../core/types.js';
import { Table } from '../components/Table.js';
import { ActionButtons } from '../components/ActionButtons.js';
import { formatChips } from '../../core/utils.js';
import { createAIPlayer } from '../../players/ai/dynamic-difficulty.js';
import { AI_DELAY_RANGE } from '../../core/constants.js';
/**
 * Main game screen component
 */
export function GameScreen({ engine, theme = 'casino', onGameEnd, onQuit }) {
    const [gameState, setGameState] = useState(engine.state);
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { exit } = useApp();
    // Subscribe to engine events
    useEffect(() => {
        const handleStateUpdate = () => {
            setGameState({ ...engine.state });
        };
        const handlePlayerAction = (action) => {
            const player = gameState.players.find(p => p.id === action.playerId);
            if (player) {
                setMessage(`${player.name} ${getActionDescription(action)}`);
            }
        };
        const handleHandEnded = ({ winners, pot }) => {
            if (winners.length > 0) {
                const winnerNames = winners
                    .map(id => gameState.players.find(p => p.id === id)?.name)
                    .filter(Boolean)
                    .join(', ');
                setMessage(`🏆 ${winnerNames} wins ${formatChips(pot)}!`);
            }
        };
        const handleGameEnded = ({ winner }) => {
            setTimeout(() => {
                onGameEnd(winner);
            }, 2000);
        };
        // Set up event listeners
        engine.on('state:updated', handleStateUpdate);
        engine.on('player:action', handlePlayerAction);
        engine.on('hand:ended', handleHandEnded);
        engine.on('game:ended', handleGameEnded);
        return () => {
            engine.off('state:updated', handleStateUpdate);
            engine.off('player:action', handlePlayerAction);
            engine.off('hand:ended', handleHandEnded);
            engine.off('game:ended', handleGameEnded);
        };
    }, [engine, gameState.players]);
    // Handle AI turns
    useEffect(() => {
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        if (!currentPlayer || currentPlayer.isHuman || currentPlayer.folded || isProcessing) {
            return;
        }
        // AI thinking delay
        const thinkDelay = AI_DELAY_RANGE.min +
            Math.random() * (AI_DELAY_RANGE.max - AI_DELAY_RANGE.min);
        setIsProcessing(true);
        const timeout = setTimeout(async () => {
            try {
                const ai = createAIPlayer(currentPlayer.id, currentPlayer.name, engine.config.difficulty);
                const availableActions = engine.getAvailableActions();
                const action = ai.getAction(gameState, availableActions);
                engine.processAIAction(currentPlayer.id, action);
            }
            catch (error) {
                console.error('AI error:', error);
            }
            finally {
                setIsProcessing(false);
            }
        }, thinkDelay);
        return () => clearTimeout(timeout);
    }, [gameState.currentPlayerIndex, gameState.players, isProcessing]);
    // Handle human player action
    const handleAction = useCallback((action, amount) => {
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        if (!currentPlayer?.isHuman || isProcessing) {
            return;
        }
        setIsProcessing(true);
        const playerAction = {
            type: action,
            playerId: currentPlayer.id,
            amount,
            timestamp: Date.now(),
        };
        const success = engine.processAction(playerAction);
        if (!success) {
            setMessage('Invalid action!');
        }
        setIsProcessing(false);
    }, [engine, gameState.currentPlayerIndex, gameState.players, isProcessing]);
    // Global keyboard shortcuts
    useInput((input, key) => {
        if (key.escape || input.toLowerCase() === 'q') {
            onQuit();
        }
    });
    // Get current player for human
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isHumanTurn = currentPlayer?.isHuman && !currentPlayer?.folded && gameState.phase !== GamePhase.Ended;
    return (_jsxs(Box, { flexDirection: "column", padding: 1, children: [_jsxs(Box, { justifyContent: "space-between", marginBottom: 1, children: [_jsx(Box, { children: _jsxs(Text, { bold: true, color: "yellow", children: ["Hand #", gameState.handCount] }) }), _jsx(Box, { children: _jsxs(Text, { color: "gray", children: ["Round: ", gameState.roundNumber] }) }), _jsx(Box, { children: _jsx(Text, { color: "magenta", children: "Esc/Q to Quit" }) })] }), _jsx(Box, { marginBottom: 1, children: _jsx(Table, { gameState: gameState, theme: theme }) }), message && (_jsx(Box, { justifyContent: "center", marginBottom: 1, children: _jsx(Text, { color: "cyan", children: message }) })), isProcessing && !isHumanTurn && (_jsx(Box, { justifyContent: "center", marginBottom: 1, children: _jsxs(Text, { color: "yellow", children: ["\uD83E\uDD14 ", currentPlayer?.name, " is thinking..."] }) })), isHumanTurn && !isProcessing && (_jsx(Box, { justifyContent: "center", children: _jsx(ActionButtons, { availableActions: engine.getAvailableActions(), currentBet: gameState.currentBet, playerBet: currentPlayer.bet, playerChips: currentPlayer.chips, minRaise: engine.getMinRaise(), theme: theme, onAction: handleAction }) })), _jsx(Box, { justifyContent: "center", marginTop: 1, children: _jsxs(Text, { dim: true, color: "gray", children: ["Phase: ", gameState.phase.toUpperCase(), gameState.phase === GamePhase.Showdown && ' - Showing cards...'] }) })] }));
}
/** Get action description for message */
function getActionDescription(action) {
    switch (action.type) {
        case ActionType.Fold:
            return 'folds';
        case ActionType.Check:
            return 'checks';
        case ActionType.Call:
            return `calls ${formatChips(action.amount || 0)}`;
        case ActionType.Raise:
            return `raises to ${formatChips(action.amount || 1)}`;
        case ActionType.AllIn:
            return `goes ALL-IN for ${formatChips(action.amount || 1)}`;
        default:
            return 'does something';
    }
}
//# sourceMappingURL=GameScreen.js.map