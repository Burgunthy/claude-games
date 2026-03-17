#!/usr/bin/env node
// ============================================================================
// Texas Hold'em Poker - CLI Entry Point
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import { PokerEngine } from './core/engine.js';
import { Table } from './ui/components/Table.js';
import { ActionButtons } from './ui/components/ActionButtons.js';
import { AllThoughts } from './ui/components/ThoughtBubble.js';
import { GameLog, useGameLog } from './ui/components/GameLog.js';
import { AiOnlyScreen } from './ui/screens/AiOnlyScreen.js';
import { NormalAI, HardAI, ManiacAI } from './ai/index.js';
import { GameConfig, Thought, Decision } from './core/types.js';
import { loadSettings, loadPlayerData, addXP } from './storage/index.js';
import { t } from './i18n/index.js';
import { getTitleBanner, getSmallTitle } from './ui/art/title.js';

/** Main App Component */
function App() {
  const { exit } = useApp();
  const [screen, setScreen] = useState<'menu' | 'game' | 'aiOnly' | 'stats'>('menu');
  const [game, setGame] = useState<PokerEngine | null>(null);
  const [message, setMessage] = useState('');
  const [showThoughts, setShowThoughts] = useState(true);

  // Load settings
  const [settings] = useState(() => loadSettings());
  const [playerData] = useState(() => loadPlayerData());

  // AI thoughts tracking
  const [aiThoughts, setAiThoughts] = useState<Map<string, Thought[]>>(new Map());

  // Game log
  const { entries, addInfo, addSuccess, addWarning, addError, clear } = useGameLog();

  // AI players for AI actions
  const [aiPlayers] = useState<Map<string, any>>(() => {
    const map = new Map();
    // Store AI instances
    return map;
  });

  // Start new game
  const startNewGame = useCallback((aiOnly: boolean = false) => {
    const config: GameConfig = {
      playerCount: 4,
      startingChips: 1000,
      smallBlind: 10,
      bigBlind: 20,
      aiOnly,
      aiDifficulty: settings.difficulty as any,
      autoPlayDelay: 750
    };

    const engine = new PokerEngine(config);

    // Set up event listeners
    engine.on('hand:started', (data: any) => {
      setMessage(t('messages.handStarted', 1));
      addInfo(t('messages.handStarted', 1));
    });

    engine.on('blinds:posted', (data: any) => {
      addInfo(t('messages.blindsPosted', data.sb.amount, data.bb.amount));
    });

    engine.on('player:acted', (data: any) => {
      addInfo(`${data.player}: ${data.action}`);
    });

    engine.on('community:dealt', (data: any) => {
      addInfo(`${data.phase} dealt`);
    });

    engine.on('phase:changed', (phase: string) => {
      setMessage(`Phase: ${phase.toUpperCase()}`);
    });

    engine.on('turn:changed', (data: any) => {
      if (data.isHuman) {
        setMessage(t('messages.yourTurn'));
      }

      // Trigger AI action if it's an AI player's turn
      if (!data.isHuman && !aiOnly) {
        setTimeout(() => processAIAction(engine, data.player), 500);
      }
    });

    engine.on('hand:ended', (result: any) => {
      const winnerNames = result.winners.map((w: any) => w.name).join(', ');
      addSuccess(`${winnerNames} wins ${result.pot} chips!`);

      // Update player XP
      if (!aiOnly) {
        const humanPlayer = engine.getHumanPlayer();
        if (humanPlayer) {
          const won = result.winners.some((w: any) => w.id === humanPlayer.id);
          const xpResult = addXP(playerData, won ? 100 : 10);
          // Would save player data here
        }
      }

      setMessage(result.showDown ? 'Showdown! Press ENTER for next hand.' : 'Press ENTER for next hand.');
    });

    engine.on('showdown', (data: any) => {
      addInfo('Showdown! ' + data.activePlayers.map((p: any) => `${p.name}: ${p.hand.name}`).join(', '));
    });

    setGame(engine);
    setScreen(aiOnly ? 'aiOnly' : 'game');
    clear();

    // Start first hand
    setTimeout(() => {
      engine.startNewHand();
    }, 100);
  }, [settings, playerData, aiPlayers]);

  // Process AI action
  const processAIAction = useCallback((engine: PokerEngine, playerName: string) => {
    if (!engine) return;

    const state = engine.getState();
    const player = state.players.find((p: any) => p.name === playerName);

    if (!player || player.isHuman || player.folded || player.isAllIn) {
      return;
    }

    // Get or create AI for this player
    let ai = aiPlayers.get(player.id);
    if (!ai) {
      const AIStrategy = settings.difficulty === 'hard' ? HardAI :
                        settings.difficulty === 'maniac' ? ManiacAI : NormalAI;
      ai = new AIStrategy(player.name);
      aiPlayers.set(player.id, ai);
    }

    // AI decision
    const context = {
      phase: state.phase,
      communityCards: state.communityCards,
      pot: state.pot,
      currentBet: state.currentBet,
      toCall: state.currentBet - player.bet,
      potOdds: state.pot / Math.max(1, state.currentBet - player.bet),
      position: 'middle' as const,
      playersInHand: state.players.filter((p: any) => !p.folded).length,
      bigBlind: 20
    };

    const decision: Decision = ai.decideAction(player.cards, state.communityCards, context);
    const thoughts = ai.generateThoughts(player.cards, state.communityCards, context, decision);

    // Store thoughts
    setAiThoughts(prev => {
      const newMap = new Map(prev);
      newMap.set(player.id, thoughts);
      return newMap;
    });

    // Process action
    engine.processAction({
      type: decision.action,
      playerId: player.id,
      amount: decision.amount
    });
  }, [settings.difficulty]);

  // Handle keyboard input
  useInput((input, key) => {
    if (screen === 'menu') {
      if (input === '1') {
        startNewGame(false);
      } else if (input === '2') {
        startNewGame(true);
      } else if (input === 'q') {
        exit();
      }
      return;
    }

    if (input === 'q' || key.escape) {
      setScreen('menu');
      setGame(null);
      return;
    }

    if (input === 't') {
      setShowThoughts(prev => !prev);
      return;
    }

    if (!game) return;

    const state = game.getState();
    const humanPlayer = state.players.find((p: any) => p.isHuman);

    // Hand ended - press Enter to continue
    if (state.phase === 'showdown' && key.return) {
      game.startNewHand();
      setAiThoughts(new Map());
      return;
    }

    // Game controls
    if (!humanPlayer || humanPlayer.folded) return;

    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer || !currentPlayer.isHuman) return;

    const toCall = state.currentBet - humanPlayer.bet;

    if (input === 'f') {
      game.processAction({ type: 'fold', playerId: 'human' });
      setMessage(t('messages.youFolded'));
    } else if (input === 'c') {
      if (toCall === 0) {
        game.processAction({ type: 'check', playerId: 'human' });
        setMessage(t('messages.youChecked'));
      } else {
        game.processAction({ type: 'call', playerId: 'human' });
        setMessage(t('messages.youCalled', toCall));
      }
    } else if (input === 'r') {
      const raiseAmount = Math.min(toCall + 50, humanPlayer.chips);
      game.processAction({ type: 'raise', playerId: 'human', amount: raiseAmount });
      setMessage(t('messages.youRaised', raiseAmount));
    } else if (input === 'a') {
      game.processAction({ type: 'allin', playerId: 'human' });
      setMessage(t('messages.youAllIn'));
    }
  });

  // Render menu
  if (screen === 'menu') {
    return (
      <Box flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
        <Box marginBottom={1}>
          <Text bold color="yellow">
            {getSmallTitle(settings.theme as any)}
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Text color="cyan">
            {t('welcome')}
          </Text>
        </Box>

        <Box marginBottom={1}>
          <Text>
            <Text color="white">[1]</Text> <Text dimColor>{t('menu.newGame')}</Text>
          </Text>
        </Box>
        <Box marginBottom={1}>
          <Text>
            <Text color="white">[2]</Text> <Text dimColor>{t('menu.aiMode')}</Text>
          </Text>
        </Box>
        <Box marginBottom={1}>
          <Text>
            <Text color="white">[Q]</Text> <Text dimColor>{t('menu.quit')}</Text>
          </Text>
        </Box>

        <Box marginTop={2}>
          <Text dimColor>
            Tier: <Text color="purple">{playerData.tier}</Text> | Chips: <Text color="green">{playerData.chips}</Text> | Theme: {settings.theme}
          </Text>
        </Box>
      </Box>
    );
  }

  // Render AI vs AI mode
  if (screen === 'aiOnly' && game) {
    return (
      <AiOnlyScreen
        config={{
          playerCount: 4,
          startingChips: 1000,
          smallBlind: 10,
          bigBlind: 20,
          aiOnly: true,
          aiDifficulty: settings.difficulty as any
        }}
        onExit={() => setScreen('menu')}
      />
    );
  }

  // Render game
  if (screen === 'game' && game) {
    const state = game.getState();
    const humanPlayer = state.players.find((p: any) => p.isHuman);
    const toCall = humanPlayer ? state.currentBet - humanPlayer.bet : 0;

    return (
      <Box flexDirection="column" padding={1}>
        {/* Title */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="yellow">
            {getSmallTitle(settings.theme as any)}
          </Text>
        </Box>

        {/* Table */}
        <Table
          players={state.players}
          communityCards={state.communityCards}
          pot={state.pot}
          phase={state.phase}
          currentPlayerIndex={state.currentPlayerIndex}
          dealerIndex={state.dealerIndex}
        />

        {/* Your Cards */}
        {humanPlayer && humanPlayer.cards.length > 0 && (
          <Box justifyContent="center" marginBottom={1}>
            <Text color="green" bold>
              {t('yourCards')}: {humanPlayer.cards.map((c: any) => `${c.rank}${c.suit[0]}`).join(' ')}
            </Text>
          </Box>
        )}

        {/* Message */}
        <Box justifyContent="center" marginBottom={1}>
          <Text color="yellow">{message}</Text>
        </Box>

        {/* AI Thoughts */}
        {showThoughts && (
          <AllThoughts
            thoughts={aiThoughts}
            showAll={false}
            currentPlayerId={state.players[state.currentPlayerIndex]?.id}
          />
        )}

        {/* Game Log */}
        <GameLog entries={entries} maxEntries={3} />

        {/* Action Buttons */}
        {humanPlayer && !humanPlayer.folded && state.phase !== 'showdown' && (
          <ActionButtons
            canCheck={toCall === 0}
            canCall={toCall > 0}
            canRaise={humanPlayer.chips > toCall}
            minRaise={toCall + 20}
            maxRaise={humanPlayer.chips}
            toCall={toCall}
          />
        )}

        {/* Controls hint */}
        <Box justifyContent="center">
          <Text dimColor>
            [T]oggle Thoughts [Q]uit
          </Text>
        </Box>
      </Box>
    );
  }

  return null;
}

// Render app
render(React.createElement(App));
