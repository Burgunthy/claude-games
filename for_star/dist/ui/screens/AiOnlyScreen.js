import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// Texas Hold'em Poker - AI vs AI Screen
// ============================================================================
import { useEffect, useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { PokerEngine } from '../../core/engine.js';
import { Table } from '../components/Table.js';
import { AllThoughts } from '../components/ThoughtBubble.js';
import { GameLog, useGameLog } from '../components/GameLog.js';
import { EasyAI, NormalAI, HardAI, ManiacAI } from '../../ai/index.js';
export const AiOnlyScreen = ({ config, onExit }) => {
    const { exit } = useApp();
    const [game, setGame] = useState(null);
    const [speed, setSpeed] = useState('normal');
    const [showThoughts, setShowThoughts] = useState(true);
    const [showAllThoughts, setShowAllThoughts] = useState(false);
    const [autoPlay, setAutoPlay] = useState(true);
    const [handsPlayed, setHandsPlayed] = useState(0);
    const [maxHands, setMaxHands] = useState(100);
    const { entries, addInfo, addSuccess, addWarning, addError, clear } = useGameLog();
    // AI players state
    const [aiPlayers, setAiPlayers] = useState(new Map());
    // Initialize game
    useEffect(() => {
        const engine = new PokerEngine({
            ...config,
            aiOnly: true
        });
        // Create AI players
        const aiMap = new Map();
        const strategies = [EasyAI, NormalAI, HardAI, ManiacAI];
        const strategyNames = ['easy', 'normal', 'hard', 'maniac'];
        const state = engine.getState();
        for (const player of state.players) {
            const strategyIndex = Math.floor(Math.random() * strategies.length);
            const AI = strategies[strategyIndex];
            const ai = new AI(`${player.name} (${strategyNames[strategyIndex]})`);
            aiMap.set(player.id, {
                id: player.id,
                name: player.name,
                ai,
                thoughts: []
            });
        }
        setAiPlayers(aiMap);
        setGame(engine);
        // Start first hand
        setTimeout(() => {
            engine.startNewHand();
            setHandsPlayed(1);
            addInfo('Hand #1 started!');
        }, 500);
        // Set up event listeners
        const handlePlayerAction = () => {
            // AI will act after delay
        };
        engine.on('player:acted', handlePlayerAction);
        engine.on('hand:ended', (result) => {
            const winners = result.winners.map((w) => w.name).join(', ');
            addSuccess(`${winners} wins ${result.pot} chips!`);
            // Start next hand after delay
            setTimeout(() => {
                if (handsPlayed < maxHands) {
                    engine.startNewHand();
                    setHandsPlayed(h => h + 1);
                    addInfo(`Hand #${handsPlayed + 1} started!`);
                }
                else {
                    addWarning('Tournament complete!');
                    setAutoPlay(false);
                }
            }, getSpeedDelay(speed));
        });
        engine.on('showdown', (data) => {
            addInfo('Showdown!');
        });
        return () => {
            engine.off('player:acted', handlePlayerAction);
        };
    }, [config]);
    // Auto-play loop
    useEffect(() => {
        if (!game || !autoPlay)
            return;
        const playAI = () => {
            const state = game.getState();
            const currentPlayer = state.players[state.currentPlayerIndex];
            if (!currentPlayer || currentPlayer.isHuman || currentPlayer.folded || currentPlayer.isAllIn) {
                // Move to next player
                return;
            }
            const aiPlayer = aiPlayers.get(currentPlayer.id);
            if (!aiPlayer)
                return;
            // AI makes decision
            const context = {
                phase: state.phase,
                communityCards: state.communityCards,
                pot: state.pot,
                currentBet: state.currentBet,
                toCall: state.currentBet - currentPlayer.bet,
                potOdds: state.pot / Math.max(1, state.currentBet - currentPlayer.bet),
                position: 'middle',
                playersInHand: state.players.filter(p => !p.folded).length,
                bigBlind: config.bigBlind || 20
            };
            const decision = aiPlayer.ai.decideAction(currentPlayer.cards, state.communityCards, context);
            // Store thoughts
            const thoughts = aiPlayer.ai.generateThoughts(currentPlayer.cards, state.communityCards, context, decision);
            setAiPlayers(prev => {
                const newMap = new Map(prev);
                const existing = newMap.get(currentPlayer.id);
                existing.thoughts = thoughts;
                return newMap;
            });
            // Process action
            game.processAction({
                type: decision.action,
                playerId: currentPlayer.id,
                amount: decision.amount
            });
            addInfo(`${currentPlayer.name}: ${decision.action}${decision.amount ? ` ${decision.amount}` : ''}`);
        };
        const interval = setInterval(playAI, getSpeedDelay(speed));
        return () => clearInterval(interval);
    }, [game, autoPlay, speed, aiPlayers, handsPlayed, maxHands]);
    // Handle keyboard input
    useInput((input, key) => {
        if (key.escape || input === 'q') {
            onExit();
            return;
        }
        if (input === ' ') {
            setAutoPlay(prev => !prev);
            return;
        }
        if (input === 't') {
            setShowThoughts(prev => !prev);
            return;
        }
        if (input === 'h') {
            setShowAllThoughts(prev => !prev);
            return;
        }
        if (input === '1') {
            setSpeed('slow');
            return;
        }
        if (input === '2') {
            setSpeed('normal');
            return;
        }
        if (input === '3') {
            setSpeed('fast');
            return;
        }
    });
    if (!game) {
        return (_jsx(Box, { children: _jsx(Text, { children: "Loading AI game..." }) }));
    }
    const state = game.getState();
    const allThoughts = new Map(Array.from(aiPlayers.entries()).map(([id, ai]) => [id, ai.thoughts]));
    return (_jsxs(Box, { flexDirection: "column", padding: 1, children: [_jsxs(Box, { justifyContent: "space-between", marginBottom: 1, children: [_jsx(Text, { bold: true, color: "yellow", children: "\uD83E\uDD16 AI vs AI Mode" }), _jsxs(Text, { children: [_jsx(Text, { dimColor: true, children: "Hand: " }), _jsxs(Text, { color: "cyan", children: [handsPlayed, "/", maxHands] }), _jsx(Text, { dimColor: true, children: " | Speed: " }), _jsx(Text, { color: speed === 'fast' ? 'red' : speed === 'slow' ? 'blue' : 'green', children: speed.toUpperCase() }), _jsx(Text, { dimColor: true, children: " | Auto: " }), _jsx(Text, { color: autoPlay ? 'green' : 'red', children: autoPlay ? 'ON' : 'OFF' })] })] }), _jsx(Table, { players: state.players, communityCards: state.communityCards, pot: state.pot, phase: state.phase, currentPlayerIndex: state.currentPlayerIndex, dealerIndex: state.dealerIndex, showCards: state.phase === 'showdown' }), showThoughts && (_jsx(AllThoughts, { thoughts: allThoughts, showAll: showAllThoughts, currentPlayerId: state.players[state.currentPlayerIndex]?.id })), _jsx(GameLog, { entries: entries, maxEntries: 5 }), _jsx(Box, { marginTop: 1, justifyContent: "center", children: _jsx(Text, { dimColor: true, children: "[SPACE] Auto-Play [T] Thoughts [H] All Thoughts [1-3] Speed [Q]uit" }) })] }));
};
function getSpeedDelay(speed) {
    switch (speed) {
        case 'slow': return 1500;
        case 'fast': return 300;
        case 'normal':
        default: return 750;
    }
}
