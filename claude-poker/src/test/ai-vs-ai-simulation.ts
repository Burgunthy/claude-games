// ============================================================================
// Texas Hold'em Poker - AI vs AI Simulation
// ============================================================================

import { Card, GamePhase, GameContext, AIStrategyType, Player } from '../core/types.js';
import { EasyAI, NormalAI, HardAI, ManiacAI } from '../ai/index.js';
import { createDeck, shuffle, dealOne } from '../core/deck.js';
import { evaluateHand } from '../core/hand-evaluator.js';
import { BLINDS } from '../core/constants.js';

// ============================================================================
// SIMULATION PLAYER
// ============================================================================

interface SimPlayer extends Player {
  ai: EasyAI | NormalAI | HardAI | ManiacAI;
  strategy: AIStrategyType;
}

// ============================================================================
// SIMULATION ENGINE
// ============================================================================

class AISimulation {
  private players: SimPlayer[] = [];
  private deck: Card[] = [];
  private communityCards: Card[] = [];
  private pot: number = 0;
  private currentBet: number = 0;
  private dealerIndex: number = 0;
  private currentPlayerIndex: number = 0;
  private phase: GamePhase = 'preflop';
  private handsPlayed: number = 0;
  private errors: string[] = [];
  private stats: Map<string, { folds: number; checks: number; calls: number; raises: number; allins: number; chipsWon: number }> = new Map();

  constructor(strategies: AIStrategyType[], startingChips: number = 1000) {
    // Create players
    const names = ['Alice', 'Bob', 'Charlie', 'Diana'];
    const avatars = ['🤖', '🎭', '🎪', '🎯'];

    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      let ai;

      switch (strategy) {
        case 'easy':
          ai = new EasyAI(names[i]);
          break;
        case 'normal':
          ai = new NormalAI(names[i]);
          break;
        case 'hard':
          ai = new HardAI(names[i]);
          break;
        case 'maniac':
          ai = new ManiacAI(names[i]);
          break;
      }

      this.players.push({
        id: `ai-${i}`,
        name: names[i],
        avatar: avatars[i],
        chips: startingChips,
        cards: [],
        bet: 0,
        folded: false,
        isHuman: false,
        isAllIn: false,
        ai,
        strategy
      });

      this.stats.set(`ai-${i}`, { folds: 0, checks: 0, calls: 0, raises: 0, allins: 0, chipsWon: 0 });
    }
  }

  // Run simulation for specified hands
  runSimulation(handCount: number): void {
    console.log(`\n🎰 Running AI vs AI Simulation - ${handCount} hands`);
    console.log('='.repeat(60));

    for (let i = 0; i < handCount; i++) {
      this.handsPlayed = i + 1;

      // Check if enough players remain
      const activePlayers = this.players.filter(p => p.chips > 0);
      if (activePlayers.length < 2) {
        console.log(`\n⚠️  Only ${activePlayers.length} player(s) remaining. Ending simulation.`);
        break;
      }

      try {
        this.playHand();
      } catch (error) {
        const errorMessage = `Hand ${i + 1} error: ${error instanceof Error ? error.message : String(error)}`;
        this.errors.push(errorMessage);
        console.error(`❌ ${errorMessage}`);
      }

      // Print progress every 10 hands
      if ((i + 1) % 10 === 0) {
        console.log(`  Completed ${i + 1} hands...`);
      }
    }

    this.printResults();
  }

  // Play a single hand
  private playHand(): void {
    // Reset for new hand
    this.deck = shuffle(createDeck());
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.phase = 'preflop';

    // Reset player states
    for (const player of this.players) {
      if (player.chips > 0) {
        player.cards = [];
        player.bet = 0;
        player.folded = false;
        player.isAllIn = false;
      } else {
        player.folded = true;
      }
    }

    // Move dealer button
    this.dealerIndex = this.findNextActivePlayer(this.dealerIndex);

    // Deal hole cards
    const activePlayers = this.players.filter(p => !p.folded);
    for (const player of activePlayers) {
      const { card: c1, remainingDeck: d1 } = dealOne(this.deck);
      const { card: c2, remainingDeck: d2 } = dealOne(d1);
      this.deck = d2;

      if (c1 && c2) {
        player.cards = [c1, c2];
      }
    }

    // Post blinds
    this.postBlinds();

    // Play betting rounds
    this.playBettingRounds();

    // Determine winner
    this.determineWinner();
  }

  // Post blinds
  private postBlinds(): void {
    const sbIndex = this.findNextActivePlayer(this.dealerIndex);
    const bbIndex = this.findNextActivePlayer(sbIndex);

    const sbPlayer = this.players[sbIndex];
    const bbPlayer = this.players[bbIndex];

    const sbAmount = Math.min(BLINDS.SMALL, sbPlayer.chips);
    const bbAmount = Math.min(BLINDS.BIG, bbPlayer.chips);

    sbPlayer.chips -= sbAmount;
    sbPlayer.bet = sbAmount;
    if (sbPlayer.chips === 0) sbPlayer.isAllIn = true;

    bbPlayer.chips -= bbAmount;
    bbPlayer.bet = bbAmount;
    if (bbPlayer.chips === 0) bbPlayer.isAllIn = true;

    this.pot = sbAmount + bbAmount;
    this.currentBet = bbAmount;
    this.currentPlayerIndex = this.findNextActivePlayer(bbIndex);
  }

  // Play all betting rounds
  private playBettingRounds(): void {
    const phases: GamePhase[] = ['preflop', 'flop', 'turn', 'river'];

    for (const phase of phases) {
      this.phase = phase;

      // Deal community cards
      if (phase === 'flop') {
        for (let i = 0; i < 3; i++) {
          const { card, remainingDeck } = dealOne(this.deck);
          if (card) {
            this.communityCards.push(card);
            this.deck = remainingDeck;
          }
        }
      } else if (phase === 'turn' || phase === 'river') {
        const { card, remainingDeck } = dealOne(this.deck);
        if (card) {
          this.communityCards.push(card);
          this.deck = remainingDeck;
        }
      }

      // Reset bets for new round
      if (phase !== 'preflop') {
        for (const player of this.players) {
          player.bet = 0;
        }
        this.currentBet = 0;
        this.currentPlayerIndex = this.findNextActivePlayer(this.dealerIndex);
      }

      // Play betting round
      if (!this.playBettingRound()) {
        // Everyone folded except one
        return;
      }
    }
  }

  // Play a single betting round
  private playBettingRound(): boolean {
    let actionsThisRound = 0;
    const maxActions = 20; // Prevent infinite loops
    const startingPlayerIndex = this.currentPlayerIndex;

    while (actionsThisRound < maxActions) {
      const currentPlayer = this.players[this.currentPlayerIndex];

      // Skip folded or all-in players
      if (currentPlayer.folded || currentPlayer.isAllIn) {
        this.moveToNextPlayer();
        if (this.currentPlayerIndex === startingPlayerIndex && actionsThisRound > 0) {
          break;
        }
        continue;
      }

      // Check if round is complete
      const activePlayers = this.players.filter(p => !p.folded && !p.isAllIn);
      const allMatched = activePlayers.every(p => p.bet === this.currentBet);

      if (allMatched && actionsThisRound >= activePlayers.length) {
        break;
      }

      // Get AI decision
      try {
        const context = this.buildContext(currentPlayer);
        const decision = currentPlayer.ai.decideAction(currentPlayer.cards, this.communityCards, context);

        // Track action
        this.recordAction(currentPlayer.id, decision.action);

        // Execute action
        this.executeAction(currentPlayer, decision);
        actionsThisRound++;

      } catch (error) {
        // AI made invalid decision - fold by default
        console.error(`  ⚠️  ${currentPlayer.name} AI error: ${error}. Folding.`);
        currentPlayer.folded = true;
        this.recordAction(currentPlayer.id, 'fold');
      }

      // Check if only one player remains
      const remainingPlayers = this.players.filter(p => !p.folded);
      if (remainingPlayers.length === 1) {
        return false; // Hand over
      }

      this.moveToNextPlayer();
    }

    return true; // Continue to next phase or showdown
  }

  // Build context for AI decision
  private buildContext(player: SimPlayer): GameContext {
    const activePlayers = this.players.filter(p => !p.folded);
    const playerIndex = this.players.indexOf(player);
    const dealerIndex = this.dealerIndex;

    // Calculate position
    let position: 'early' | 'middle' | 'late' = 'middle';
    const playersAfterDealer = (playerIndex - dealerIndex + this.players.length) % this.players.length;
    const totalActive = activePlayers.length;

    if (playersAfterDealer <= 1) position = 'early';
    else if (playersAfterDealer >= totalActive - 2) position = 'late';

    return {
      phase: this.phase,
      communityCards: [...this.communityCards],
      pot: this.pot,
      currentBet: this.currentBet,
      toCall: Math.min(this.currentBet - player.bet, player.chips),
      potOdds: this.currentBet > 0 ? this.pot / this.currentBet : 1,
      position,
      playersInHand: activePlayers.length,
      bigBlind: BLINDS.BIG
    };
  }

  // Execute player action
  private executeAction(player: SimPlayer, decision: any): void {
    const toCall = this.currentBet - player.bet;

    switch (decision.action) {
      case 'fold':
        player.folded = true;
        break;

      case 'check':
        // Can only check if no bet to call
        if (toCall !== 0) {
          // Invalid check - convert to fold
          player.folded = true;
        }
        break;

      case 'call':
        const callAmount = Math.min(toCall, player.chips);
        player.chips -= callAmount;
        player.bet += callAmount;
        this.pot += callAmount;
        if (player.chips === 0) player.isAllIn = true;
        break;

      case 'raise':
        let raiseAmount = decision.amount || toCall + BLINDS.BIG;
        const totalBet = player.bet + toCall + raiseAmount;

        if (totalBet > player.bet + player.chips) {
          // All-in
          const allInAmount = player.chips;
          player.chips = 0;
          player.bet += allInAmount;
          this.pot += allInAmount;
          player.isAllIn = true;
          if (player.bet > this.currentBet) this.currentBet = player.bet;
        } else {
          player.chips -= (toCall + raiseAmount);
          player.bet += toCall + raiseAmount;
          this.pot += toCall + raiseAmount;
          this.currentBet = player.bet;
        }
        break;

      case 'allin':
        const allIn = player.chips;
        player.chips = 0;
        player.bet += allIn;
        this.pot += allIn;
        player.isAllIn = true;
        if (player.bet > this.currentBet) this.currentBet = player.bet;
        break;
    }
  }

  // Record action for stats
  private recordAction(playerId: string, action: string): void {
    const stats = this.stats.get(playerId);
    if (!stats) return;

    switch (action) {
      case 'fold': stats.folds++; break;
      case 'check': stats.checks++; break;
      case 'call': stats.calls++; break;
      case 'raise': stats.raises++; break;
      case 'allin': stats.allins++; break;
    }
  }

  // Move to next player
  private moveToNextPlayer(): void {
    this.currentPlayerIndex = this.findNextActivePlayer(this.currentPlayerIndex);
  }

  // Find next active player
  private findNextActivePlayer(startIndex: number): number {
    let index = startIndex;
    let attempts = 0;

    do {
      index = (index + 1) % this.players.length;
      attempts++;

      const player = this.players[index];
      if (!player.folded && player.chips > 0) {
        return index;
      }
    } while (attempts < this.players.length);

    return startIndex;
  }

  // Determine winner and distribute pot
  private determineWinner(): void {
    const activePlayers = this.players.filter(p => !p.folded);

    if (activePlayers.length === 1) {
      // Only one player left
      const winner = activePlayers[0];
      winner.chips += this.pot;
      const stats = this.stats.get(winner.id);
      if (stats) stats.chipsWon += this.pot;
      return;
    }

    // Showdown - evaluate hands
    const evaluatedHands = activePlayers.map(player => ({
      player,
      hand: evaluateHand(player.cards, this.communityCards)
    }));

    // Find winner(s)
    const maxScore = Math.max(...evaluatedHands.map(e => e.hand.score));
    const winners = evaluatedHands.filter(e => e.hand.score === maxScore);

    // Distribute pot
    const winAmount = Math.floor(this.pot / winners.length);
    for (const winner of winners) {
      winner.player.chips += winAmount;
      const stats = this.stats.get(winner.player.id);
      if (stats) stats.chipsWon += winAmount;
    }
  }

  // Print simulation results
  private printResults(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 SIMULATION RESULTS');
    console.log('='.repeat(60));

    // Print player stats
    console.log('\n👥 Player Statistics:');
    console.log('-'.repeat(60));
    console.log(sprintf('%-12s %-8s %-6s %-6s %-6s %-6s %-6s %-10s', 'Player', 'Strat', 'Fold', 'Check', 'Call', 'Raise', 'AllIn', 'Chips'));
    console.log('-'.repeat(60));

    for (const player of this.players) {
      const stats = this.stats.get(player.id);
      if (stats) {
        console.log(sprintf('%-12s %-8s %-6d %-6d %-6d %-6d %-6d %-10d',
          player.name,
          player.strategy,
          stats.folds,
          stats.checks,
          stats.calls,
          stats.raises,
          stats.allins,
          player.chips
        ));
      }
    }

    // Calculate aggression factor for each strategy
    console.log('\n🎯 Aggression Analysis:');
    console.log('-'.repeat(60));

    for (const player of this.players) {
      const stats = this.stats.get(player.id);
      if (stats) {
        const aggressiveActions = stats.raises + stats.allins;
        const passiveActions = stats.folds + stats.checks + stats.calls;
        const total = aggressiveActions + passiveActions;
        const aggressionPercent = total > 0 ? ((aggressiveActions / total) * 100).toFixed(1) : '0.0';

        console.log(`  ${player.name} (${player.strategy}): ${aggressionPercent}% aggressive (${aggressiveActions}/${total} actions)`);
      }
    }

    // Print errors if any
    if (this.errors.length > 0) {
      console.log('\n⚠️  Errors Encountered:');
      console.log('-'.repeat(60));
      this.errors.forEach(error => console.log(`  ${error}`));
    } else {
      console.log('\n✅ No errors encountered during simulation!');
    }

    console.log('\n' + '='.repeat(60));
  }
}

// Simple sprintf for formatting
function sprintf(format: string, ...args: any[]): string {
  return format.replace(/%-?\d*\.?\d*[sdf]/g, (match) => {
    const arg = args.shift();
    if (match.includes('%-')) {
      // Left align
      const width = parseInt(match.match(/\d+/)?.[0] || '0');
      return String(arg).padEnd(width);
    } else {
      // Right align
      const width = parseInt(match.match(/\d+/)?.[0] || '0');
      return String(arg).padStart(width);
    }
  });
}

// ============================================================================
// RUN SIMULATIONS
// ============================================================================

export function runSimulation(): void {
  console.log('\n🔥 AI POKER STRATEGY SIMULATION 🔥');
  console.log('Testing all AI strategies against each other...\n');

  // Test 1: All strategies together
  console.log('\n🎮 Test 1: All Strategies Battle');
  const sim1 = new AISimulation(['easy', 'normal', 'hard', 'maniac'], 2000);
  sim1.runSimulation(50);

  // Test 2: Easy vs Normal
  console.log('\n🎮 Test 2: Easy vs Normal');
  const sim2 = new AISimulation(['easy', 'normal'], 2000);
  sim2.runSimulation(50);

  // Test 3: Maniac vs Hard
  console.log('\n🎮 Test 3: Maniac vs Hard');
  const sim3 = new AISimulation(['maniac', 'hard'], 2000);
  sim3.runSimulation(50);

  // Test 4: 4 Maniacs (chaos mode)
  console.log('\n🎮 Test 4: Maniacs Battle (4x Maniac)');
  const sim4 = new AISimulation(['maniac', 'maniac', 'maniac', 'maniac'], 2000);
  sim4.runSimulation(50);

  console.log('\n🏁 All simulations complete!');
}

// Run simulation
runSimulation();
