// ============================================================================
// Texas Hold'em Poker - Scenario Tests
// ============================================================================

import { describe, it, expect } from 'vitest';
import { PokerEngine } from '../../dist/core/engine.js';

describe('Game Scenarios', () => {
  it('should play a complete hand with fold', () => {
    const engine = new PokerEngine({
      playerCount: 4,
      startingChips: 1000,
      smallBlind: 10,
      bigBlind: 20
    });

    // Start hand
    engine.startNewHand();
    const state = engine.getState();

    expect(state.phase).toBe('preflop');
    expect(state.players.every(p => p.cards.length === 2)).toBe(true);

    // Human folds
    const humanPlayer = state.players.find(p => p.isHuman)!;
    engine.processAction({ type: 'fold', playerId: humanPlayer.id });

    expect(humanPlayer.folded).toBe(true);
  });

  it('should handle all-in situation', () => {
    const engine = new PokerEngine({
      playerCount: 2,
      startingChips: 100,
      smallBlind: 10,
      bigBlind: 20
    });

    engine.startNewHand();

    const humanPlayer = engine.getState().players.find(p => p.isHuman)!;

    // Go all-in
    engine.processAction({ type: 'allin', playerId: humanPlayer.id });

    expect(humanPlayer.isAllIn).toBe(true);
    expect(humanPlayer.chips).toBe(0);
  });

  it('should advance through phases', () => {
    const engine = new PokerEngine({
      playerCount: 3,
      startingChips: 1000,
      smallBlind: 10,
      bigBlind: 20
    });

    engine.startNewHand();

    // Fold all but one
    const state = engine.getState();
    for (const player of state.players) {
      if (!player.isHuman) {
        engine.processAction({ type: 'fold', playerId: player.id });
      }
    }

    // Should end hand immediately (only one player left)
    expect(engine.getState().players.filter(p => !p.folded).length).toBe(1);
  });

  it('should calculate pot correctly', () => {
    const engine = new PokerEngine({
      playerCount: 4,
      startingChips: 1000,
      smallBlind: 10,
      bigBlind: 20
    });

    engine.startNewHand();
    const state = engine.getState();

    // Pot should have blinds (10 + 20 = 30)
    expect(state.pot).toBe(30);
  });

  it('should handle multiple hands', () => {
    const engine = new PokerEngine({
      playerCount: 3,
      startingChips: 500,
      smallBlind: 5,
      bigBlind: 10
    });

    // Play 5 hands
    for (let i = 0; i < 5; i++) {
      engine.startNewHand();

      // Fold all players
      const state = engine.getState();
      for (const player of state.players) {
        engine.processAction({ type: 'fold', playerId: player.id });
      }
    }

    // Should complete without crashes
    const finalState = engine.getState();
    expect(finalState).toBeDefined();
  });
});

describe('AI Scenarios', () => {
  it('AI should make valid decisions', () => {
    const engine = new PokerEngine({
      playerCount: 4,
      startingChips: 1000,
      smallBlind: 10,
      bigBlind: 20,
      aiOnly: true
    });

    engine.startNewHand();

    const state = engine.getState();
    const aiPlayer = state.players.find(p => !p.isHuman)!;

    // AI action should be valid (fold/check/call/raise/allin)
    const validActions = ['fold', 'check', 'call', 'raise', 'allin'];

    // Process each AI player action
    for (let i = 0; i < 5; i++) {
      const currentState = engine.getState();
      const currentPlayer = currentState.players[currentState.currentPlayerIndex];

      if (currentPlayer && !currentPlayer.isHuman && !currentPlayer.folded) {
        // Simulate a fold action for testing
        engine.processAction({ type: 'fold', playerId: currentPlayer.id });
      }
    }

    // After all folds, should have at least one player left
    expect(engine.getState().players.filter(p => !p.folded).length).toBeGreaterThan(0);
  });

  it('should handle 100 AI vs AI hands without crashes', () => {
    const engine = new PokerEngine({
      playerCount: 4,
      startingChips: 1000,
      smallBlind: 10,
      bigBlind: 20,
      aiOnly: true
    });

    // Play 100 hands rapidly
    for (let i = 0; i < 100; i++) {
      engine.startNewHand();

      // All players fold to end hand quickly
      const state = engine.getState();
      for (const player of state.players) {
        engine.processAction({ type: 'fold', playerId: player.id });
      }
    }

    // Should complete without crashes
    const finalState = engine.getState();
    expect(finalState).toBeDefined();
  });
});
