// ============================================================================
// Texas Hold'em Poker - AI vs AI Screen
// ============================================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { PokerEngine } from '../../core/engine.js';
import { GameConfig, Thought, Decision } from '../../core/types.js';
import { Table } from '../components/Table.js';
import { AllThoughts } from '../components/ThoughtBubble.js';
import { GameLog, useGameLog } from '../components/GameLog.js';
import { EasyAI, NormalAI, HardAI, ManiacAI } from '../../ai/index.js';
import { t } from '../../i18n/index.js';

interface AiOnlyScreenProps {
  config: GameConfig;
  onExit: () => void;
}

interface AiPlayer {
  id: string;
  name: string;
  ai: any;
  thoughts: Thought[];
}

export const AiOnlyScreen: React.FC<AiOnlyScreenProps> = ({
  config,
  onExit
}) => {
  const { exit } = useApp();
  const [game, setGame] = useState<PokerEngine | null>(null);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [showThoughts, setShowThoughts] = useState<boolean>(true);
  const [showAllThoughts, setShowAllThoughts] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [handsPlayed, setHandsPlayed] = useState<number>(0);
  const [maxHands, setMaxHands] = useState<number>(100);

  const { entries, addInfo, addSuccess, addWarning, addError, clear } = useGameLog();

  // AI players state
  const [aiPlayers, setAiPlayers] = useState<Map<string, AiPlayer>>(new Map());

  // Initialize game
  useEffect(() => {
    const engine = new PokerEngine({
      ...config,
      aiOnly: true
    });

    // Create AI players
    const aiMap = new Map<string, AiPlayer>();
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
    engine.on('hand:ended', (result: any) => {
      const winners = result.winners.map((w: any) => w.name).join(', ');
      addSuccess(`${winners} wins ${result.pot} chips!`);

      // Start next hand after delay
      setTimeout(() => {
        if (handsPlayed < maxHands) {
          engine.startNewHand();
          setHandsPlayed(h => h + 1);
          addInfo(`Hand #${handsPlayed + 1} started!`);
        } else {
          addWarning('Tournament complete!');
          setAutoPlay(false);
        }
      }, getSpeedDelay(speed));
    });

    engine.on('showdown', (data: any) => {
      addInfo('Showdown!');
    });

    return () => {
      engine.off('player:acted', handlePlayerAction);
    };
  }, [config]);

  // Auto-play loop
  useEffect(() => {
    if (!game || !autoPlay) return;

    const playAI = () => {
      const state = game.getState();
      const currentPlayer = state.players[state.currentPlayerIndex];

      if (!currentPlayer || currentPlayer.isHuman || currentPlayer.folded || currentPlayer.isAllIn) {
        // Move to next player
        return;
      }

      const aiPlayer = aiPlayers.get(currentPlayer.id);
      if (!aiPlayer) return;

      // AI makes decision
      const context = {
        phase: state.phase,
        communityCards: state.communityCards,
        pot: state.pot,
        currentBet: state.currentBet,
        toCall: state.currentBet - currentPlayer.bet,
        potOdds: state.pot / Math.max(1, state.currentBet - currentPlayer.bet),
        position: 'middle' as const,
        playersInHand: state.players.filter(p => !p.folded).length,
        bigBlind: config.bigBlind || 20
      };

      const decision: Decision = aiPlayer.ai.decideAction(
        currentPlayer.cards,
        state.communityCards,
        context
      );

      // Store thoughts
      const thoughts = aiPlayer.ai.generateThoughts(
        currentPlayer.cards,
        state.communityCards,
        context,
        decision
      );

      setAiPlayers(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(currentPlayer.id)!;
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
    return (
      <Box>
        <Text>Loading AI game...</Text>
      </Box>
    );
  }

  const state = game.getState();
  const allThoughts = new Map(
    Array.from(aiPlayers.entries()).map(([id, ai]) => [id, ai.thoughts])
  );

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box justifyContent="space-between" marginBottom={1}>
        <Text bold color="yellow">🤖 AI vs AI Mode</Text>
        <Text>
          <Text dimColor>Hand: </Text>
          <Text color="cyan">{handsPlayed}/{maxHands}</Text>
          <Text dimColor> | Speed: </Text>
          <Text color={speed === 'fast' ? 'red' : speed === 'slow' ? 'blue' : 'green'}>
            {speed.toUpperCase()}
          </Text>
          <Text dimColor> | Auto: </Text>
          <Text color={autoPlay ? 'green' : 'red'}>{autoPlay ? 'ON' : 'OFF'}</Text>
        </Text>
      </Box>

      {/* Game Table */}
      <Table
        players={state.players}
        communityCards={state.communityCards}
        pot={state.pot}
        phase={state.phase}
        currentPlayerIndex={state.currentPlayerIndex}
        dealerIndex={state.dealerIndex}
        showCards={state.phase === 'showdown'}
      />

      {/* AI Thoughts */}
      {showThoughts && (
        <AllThoughts
          thoughts={allThoughts}
          showAll={showAllThoughts}
          currentPlayerId={state.players[state.currentPlayerIndex]?.id}
        />
      )}

      {/* Game Log */}
      <GameLog entries={entries} maxEntries={5} />

      {/* Controls */}
      <Box marginTop={1} justifyContent="center">
        <Text dimColor>
          [SPACE] Auto-Play [T] Thoughts [H] All Thoughts [1-3] Speed [Q]uit
        </Text>
      </Box>
    </Box>
  );
};

function getSpeedDelay(speed: 'slow' | 'normal' | 'fast'): number {
  switch (speed) {
    case 'slow': return 1500;
    case 'fast': return 300;
    case 'normal':
    default: return 750;
  }
}
