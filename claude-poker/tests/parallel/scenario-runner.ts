#!/usr/bin/env node
// ============================================================================
// Poker Game Scenario Runner - For Parallel Testing
// ============================================================================

import { PokerEngine } from '../../dist/core/engine.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

interface TestConfig {
  aiOnly: boolean;
  playerCount: number;
  startingChips: number;
  smallBlind: number;
  bigBlind: number;
  difficulty?: 'easy' | 'normal' | 'hard' | 'maniac';
  hands: number;
  agentId: number;
}

interface TestResult {
  agentId: number;
  config: TestConfig;
  handsPlayed: number;
  errors: string[];
  stats: {
    totalHands: number;
    folds: number;
    checks: number;
    calls: number;
    raises: number;
    allIns: number;
    sidePotsCreated: number;
    handsWithShowdown: number;
    handsEndedEarly: number;
  };
  winners: string[];
  finalChips: Array<{ name: string; chips: number }>;
  duration: number;
  success: boolean;
}

// Parse command line arguments
function parseArgs(): TestConfig {
  const args = process.argv.slice(2);
  const config: any = {
    aiOnly: false,
    playerCount: 4,
    startingChips: 1000,
    smallBlind: 10,
    bigBlind: 20,
    hands: 50,
    agentId: Math.floor(Math.random() * 10000)
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--aiOnly':
        config.aiOnly = true;
        break;
      case '--playerCount':
        config.playerCount = parseInt(args[++i]);
        break;
      case '--startingChips':
        config.startingChips = parseInt(args[++i]);
        break;
      case '--smallBlind':
        config.smallBlind = parseInt(args[++i]);
        break;
      case '--bigBlind':
        config.bigBlind = parseInt(args[++i]);
        break;
      case '--difficulty':
        config.difficulty = args[++i];
        break;
      case '--hands':
        config.hands = parseInt(args[++i]);
        break;
      case '--agentId':
        config.agentId = parseInt(args[++i]);
        break;
    }
  }

  return config as TestConfig;
}

// Run scenario test
async function runScenario(config: TestConfig): Promise<TestResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const stats = {
    totalHands: 0,
    folds: 0,
    checks: 0,
    calls: 0,
    raises: 0,
    allIns: 0,
    sidePotsCreated: 0,
    handsWithShowdown: 0,
    handsEndedEarly: 0
  };
  const winners: string[] = [];

  try {
    const engine = new PokerEngine({
      playerCount: config.playerCount,
      startingChips: config.startingChips,
      smallBlind: config.smallBlind,
      bigBlind: config.bigBlind,
      aiOnly: config.aiOnly,
      aiDifficulty: config.difficulty || 'normal',
      autoPlayDelay: 0 // Instant for testing
    });

    // Track events
    engine.on('player:acted', (data: any) => {
      switch (data.action) {
        case 'fold': stats.folds++; break;
        case 'check': stats.checks++; break;
        case 'call': stats.calls++; break;
        case 'raise': stats.raises++; break;
        case 'allin': stats.allIns++; break;
      }
    });

    engine.on('hand:ended', (data: any) => {
      if (data.showDown) {
        stats.handsWithShowdown++;
      } else {
        stats.handsEndedEarly++;
      }
      if (data.winners && data.winners.length > 0) {
        winners.push(data.winners[0].name);
      }
    });

    // Play specified number of hands
    for (let i = 0; i < config.hands; i++) {
      try {
        engine.startNewHand();

        // Play out the hand with AI actions
        let maxActions = 100; // Prevent infinite loops
        let actions = 0;

        while (actions < maxActions) {
          const state = engine.getState();
          const currentPlayer = engine.getCurrentPlayer();

          if (!currentPlayer || state.phase === 'showdown') {
            break;
          }

          // Simulate AI action
          const action = simulateAIAction(state, currentPlayer);
          if (!engine.processAction(action)) {
            break;
          }
          actions++;
        }

        stats.totalHands++;

        // Check for side pots
        const potResult = engine.getPotResult();
        if (potResult && potResult.sidePots.length > 0) {
          stats.sidePotsCreated += potResult.sidePots.length;
        }

      } catch (err: any) {
        errors.push(`Hand ${i + 1}: ${err.message}`);
      }
    }

    const finalState = engine.getState();
    const finalChips = finalState.players.map(p => ({
      name: p.name,
      chips: p.chips
    }));

    const duration = Date.now() - startTime;

    return {
      agentId: config.agentId,
      config,
      handsPlayed: stats.totalHands,
      errors,
      stats,
      winners,
      finalChips,
      duration,
      success: errors.length === 0
    };

  } catch (err: any) {
    return {
      agentId: config.agentId,
      config,
      handsPlayed: stats.totalHands,
      errors: [err.message],
      stats,
      winners,
      finalChips: [],
      duration: Date.now() - startTime,
      success: false
    };
  }
}

// Simulate AI action based on game state
function simulateAIAction(state: any, player: any): { type: string; playerId: string; amount?: number } {
  const toCall = state.currentBet - player.bet;
  const potOdds = toCall / (state.pot + toCall);

  // Simple AI logic for testing
  const random = Math.random();

  if (toCall === 0) {
    // Can check
    if (random < 0.7) {
      return { type: 'check', playerId: player.id };
    }
    return { type: 'raise', playerId: player.id, amount: state.bigBlind * 2 };
  }

  // Need to call or fold
  if (random < 0.3) {
    return { type: 'fold', playerId: player.id };
  }
  if (random < 0.8 || toCall > player.chips * 0.5) {
    return { type: 'call', playerId: player.id };
  }
  if (random < 0.95) {
    return { type: 'raise', playerId: player.id, amount: toCall + state.bigBlind * 2 };
  }
  return { type: 'allin', playerId: player.id };
}

// Main
async function main() {
  const config = parseArgs();

  console.log(`\n========================================`);
  console.log(`Agent #${config.agentId} Starting Test`);
  console.log(`========================================`);
  console.log(`Players: ${config.playerCount}`);
  console.log(`Starting Chips: ${config.startingChips}`);
  console.log(`Blinds: ${config.smallBlind}/${config.bigBlind}`);
  console.log(`Difficulty: ${config.difficulty || 'normal'}`);
  console.log(`Hands to Play: ${config.hands}`);
  console.log(`Mode: ${config.aiOnly ? 'AI vs AI' : 'Human vs AI'}`);
  console.log(``);

  const result = await runScenario(config);

  console.log(`\n========================================`);
  console.log(`Agent #${config.agentId} Test Complete`);
  console.log(`========================================`);
  console.log(`Status: ${result.success ? '✓ SUCCESS' : '✗ FAILED'}`);
  console.log(`Hands Played: ${result.handsPlayed}`);
  console.log(`Duration: ${result.duration}ms`);
  console.log(`\nAction Stats:`);
  console.log(`  Folds: ${result.stats.folds}`);
  console.log(`  Checks: ${result.stats.checks}`);
  console.log(`  Calls: ${result.stats.calls}`);
  console.log(`  Raises: ${result.stats.raises}`);
  console.log(`  All-Ins: ${result.stats.allIns}`);
  console.log(`\nHand Stats:`);
  console.log(`  Showdowns: ${result.stats.handsWithShowdown}`);
  console.log(`  Early Ends: ${result.stats.handsEndedEarly}`);
  console.log(`  Side Pots: ${result.stats.sidePotsCreated}`);

  if (result.errors.length > 0) {
    console.log(`\nErrors (${result.errors.length}):`);
    result.errors.slice(0, 5).forEach(e => console.log(`  - ${e}`));
    if (result.errors.length > 5) {
      console.log(`  ... and ${result.errors.length - 5} more`);
    }
  }

  console.log(`\nFinal Chip Counts:`);
  result.finalChips.sort((a, b) => b.chips - a.chips).forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name}: ${p.chips}`);
  });

  // Save result to file
  try {
    const resultsDir = join(process.cwd(), 'tests', 'parallel', 'results');
    await mkdir(resultsDir, { recursive: true });
    await writeFile(
      join(resultsDir, `agent-${config.agentId}.json`),
      JSON.stringify(result, null, 2)
    );
  } catch (err) {
    // Ignore save errors
  }

  process.exit(result.success ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
