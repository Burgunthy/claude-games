// ============================================================================
// Texas Hold'em Poker - Game Engine
// ============================================================================

import { EventEmitter } from 'events';
import {
  Card, Player, GameState, Action, ActionType, GamePhase,
  EvaluatedHand, GameEvent, SidePot, PotResult
} from './types.js';
import { createDeck, shuffle, dealOne } from './deck.js';
import { evaluateHand, determineWinner, formatHand } from './hand-evaluator.js';
import { calculatePots, distributePot, formatPot } from './pot-calculator.js';
import { BLINDS, MAX_PLAYERS, MIN_PLAYERS } from './constants.js';

/** Game configuration */
export interface GameConfig {
  playerCount: number;
  startingChips: number;
  smallBlind: number;
  bigBlind: number;
  aiOnly?: boolean; // AI vs AI mode
  aiDifficulty?: 'easy' | 'normal' | 'hard' | 'maniac';
  autoPlayDelay?: number; // For AI vs AI mode
}

/** Hand result */
export interface HandResult {
  winners: Array<{ id: string; name: string; hand: EvaluatedHand; amount: number }>;
  pot: number;
  showDown: boolean;
}

/** Poker Game Engine */
export class PokerEngine extends EventEmitter {
  private state: GameState;
  private config: GameConfig;
  private handHistory: HandResult[] = [];
  private potResult: PotResult | null = null;
  private currentHandPlayerCount: number = 0;

  constructor(config: GameConfig) {
    super();

    // Validate configuration
    if (config.playerCount < MIN_PLAYERS || config.playerCount > MAX_PLAYERS) {
      throw new Error(`Player count must be between ${MIN_PLAYERS} and ${MAX_PLAYERS}`);
    }

    this.config = {
      ...config,
      smallBlind: config.smallBlind || BLINDS.SMALL,
      bigBlind: config.bigBlind || BLINDS.BIG,
      aiOnly: config.aiOnly || false,
      aiDifficulty: config.aiDifficulty || 'normal',
      autoPlayDelay: config.autoPlayDelay || 750
    };

    // Initialize players
    const players = this.createPlayers(this.config);

    this.state = {
      deck: [],
      communityCards: [],
      pot: 0,
      players,
      currentPlayerIndex: 0,
      phase: 'preflop',
      currentBet: 0,
      dealerIndex: 0,
    };
  }

  /** Create players for the game */
  private createPlayers(config: GameConfig): Player[] {
    const players: Player[] = [];

    // Human player (unless AI-only mode)
    if (!config.aiOnly) {
      players.push({
        id: 'human',
        name: 'You',
        chips: config.startingChips,
        cards: [],
        bet: 0,
        folded: false,
        isHuman: true,
        isAllIn: false,
        avatar: '👤'
      });
    }

    // AI players
    const aiNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
    const aiAvatars = ['🤖', '🎭', '🎪', '🎯', '🎲', '🃏', '👑', '💎'];

    const aiCount = config.aiOnly ? config.playerCount : config.playerCount - 1;

    for (let i = 0; i < aiCount; i++) {
      players.push({
        id: `ai-${i}`,
        name: aiNames[i] || `AI ${i + 1}`,
        chips: config.startingChips,
        cards: [],
        bet: 0,
        folded: false,
        isHuman: false,
        isAllIn: false,
        avatar: aiAvatars[i] || '🤖'
      });
    }

    return players;
  }

  /** Get current game state */
  getState(): Readonly<GameState> {
    return this.state;
  }

  /** Get current configuration */
  getConfig(): Readonly<GameConfig> {
    return this.config;
  }

  /** Get pot calculation result */
  getPotResult(): PotResult | null {
    return this.potResult;
  }

  /** Start a new hand */
  startNewHand(): void {
    // Reset for new hand
    this.state.deck = shuffle(createDeck());
    this.state.communityCards = [];
    this.state.pot = 0;
    this.state.currentBet = 0;
    this.potResult = null;

    // Reset player states for active players
    const activePlayers = this.state.players.filter(p => p.chips > 0);
    this.currentHandPlayerCount = activePlayers.length;

    for (const player of this.state.players) {
      player.cards = [];
      player.bet = 0;
      player.folded = player.chips === 0; // Bust out players stay folded
      player.isAllIn = false;
    }

    if (activePlayers.length < 2) {
      this.emitGameOver();
      return;
    }

    // Move dealer button
    this.state.dealerIndex = this.findNextActivePlayer(this.state.dealerIndex);

    // Deal hole cards
    for (const player of activePlayers) {
      const { card: card1, remainingDeck: deck1 } = dealOne(this.state.deck);
      const { card: card2, remainingDeck: deck2 } = dealOne(deck1);
      this.state.deck = deck2;

      if (card1 && card2) {
        player.cards = [card1, card2];
      }
    }

    // Post blinds
    this.postBlinds();

    this.state.phase = 'preflop';
    this.emit('hand:started', {
      players: activePlayers.map(p => ({ id: p.id, name: p.name, chips: p.chips }))
    });
  }

  /** Find next active player from index */
  private findNextActivePlayer(startIndex: number): number {
    let index = startIndex;
    let attempts = 0;

    do {
      index = (index + 1) % this.state.players.length;
      attempts++;

      const player = this.state.players[index];
      if (!player.folded && player.chips > 0) {
        return index;
      }
    } while (attempts < this.state.players.length);

    return startIndex;
  }

  /** Post blinds */
  private postBlinds(): void {
    const sbIndex = this.findNextActivePlayer(this.state.dealerIndex);
    const bbIndex = this.findNextActivePlayer(sbIndex);

    const sbPlayer = this.state.players[sbIndex];
    const bbPlayer = this.state.players[bbIndex];

    const sbAmount = Math.min(this.config.smallBlind, sbPlayer.chips);
    const bbAmount = Math.min(this.config.bigBlind, bbPlayer.chips);

    // Post small blind
    sbPlayer.chips -= sbAmount;
    sbPlayer.bet = sbAmount;
    if (sbPlayer.chips === 0) sbPlayer.isAllIn = true;
    this.state.pot += sbAmount;

    // Post big blind
    bbPlayer.chips -= bbAmount;
    bbPlayer.bet = bbAmount;
    if (bbPlayer.chips === 0) bbPlayer.isAllIn = true;
    this.state.pot += bbAmount;

    this.state.currentBet = bbAmount;
    this.state.currentPlayerIndex = this.findNextActivePlayer(bbIndex);

    this.emit('blinds:posted', {
      sb: { player: sbPlayer.name, amount: sbAmount },
      bb: { player: bbPlayer.name, amount: bbAmount }
    });

    // Update pot calculation
    this.updatePotCalculation();
  }

  /** Update pot calculation with side pots */
  private updatePotCalculation(): void {
    const activePlayers = this.state.players.filter(p => !p.folded && p.bet > 0);
    if (activePlayers.length > 0) {
      this.potResult = calculatePots(this.state.players);
      this.state.pot = this.potResult.total;
    }
  }

  /** Deal community cards */
  private dealCommunityCards(count: number): void {
    for (let i = 0; i < count; i++) {
      const { card, remainingDeck } = dealOne(this.state.deck);
      if (card) {
        this.state.communityCards.push(card);
        this.state.deck = remainingDeck;
      }
    }

    this.emit('community:dealt', {
      cards: this.state.communityCards,
      phase: this.state.phase
    });
  }

  /** Process a player action */
  processAction(action: Action): boolean {
    const player = this.state.players.find(p => p.id === action.playerId);
    if (!player || player.folded) return false;

    if (player.id !== this.state.players[this.state.currentPlayerIndex].id) {
      return false; // Not this player's turn
    }

    let success = false;

    switch (action.type) {
      case 'fold':
        success = this.actionFold(player);
        break;

      case 'check':
        success = this.actionCheck(player);
        break;

      case 'call':
        success = this.actionCall(player);
        break;

      case 'raise':
        success = this.actionRaise(player, action.amount || 0);
        break;

      case 'allin':
        success = this.actionAllIn(player);
        break;
    }

    if (success) {
      this.emit('player:acted', {
        player: player.name,
        action: action.type,
        amount: action.amount
      });

      this.updatePotCalculation();

      // Check if round is complete or move to next player
      if (!this.checkRoundComplete()) {
        this.moveToNextPlayer();
      }
    }

    return success;
  }

  /** Fold action */
  private actionFold(player: Player): boolean {
    player.folded = true;
    return true;
  }

  /** Check action */
  private actionCheck(player: Player): boolean {
    if (this.state.currentBet !== player.bet) return false;
    return true;
  }

  /** Call action */
  private actionCall(player: Player): boolean {
    const toCall = this.state.currentBet - player.bet;
    if (toCall > player.chips) {
      // Not enough chips - must go all-in
      return this.actionAllIn(player);
    }

    player.chips -= toCall;
    player.bet = this.state.currentBet;
    this.state.pot += toCall;
    return true;
  }

  /** Raise action */
  private actionRaise(player: Player, raiseAmount: number): boolean {
    const toCall = this.state.currentBet - player.bet;
    const minRaise = this.config.bigBlind;
    const totalBet = toCall + raiseAmount;

    if (totalBet < minRaise) return false;
    if (totalBet > player.chips) {
      // Not enough for full raise - go all-in
      return this.actionAllIn(player);
    }

    player.chips -= totalBet;
    player.bet += totalBet;
    this.state.pot += totalBet;
    this.state.currentBet = player.bet;

    return true;
  }

  /** All-in action */
  private actionAllIn(player: Player): boolean {
    const allInAmount = player.chips;
    player.bet += allInAmount;
    this.state.pot += allInAmount;
    player.chips = 0;
    player.isAllIn = true;

    if (player.bet > this.state.currentBet) {
      this.state.currentBet = player.bet;
    }

    return true;
  }

  /** Move to next player */
  private moveToNextPlayer(): void {
    this.state.currentPlayerIndex = this.findNextActivePlayer(this.state.currentPlayerIndex);
    const nextPlayer = this.state.players[this.state.currentPlayerIndex];

    this.emit('turn:changed', {
      player: nextPlayer.name,
      isHuman: nextPlayer.isHuman
    });
  }

  /** Check if betting round is complete */
  private checkRoundComplete(): boolean {
    const activePlayers = this.state.players.filter(p => !p.folded);
    const playersWithChips = activePlayers.filter(p => p.chips > 0);

    // All players folded except one
    if (activePlayers.length === 1) {
      this.endHandEarly(activePlayers[0]);
      return true;
    }

    // Check if all active players have matched the current bet
    const allMatched = activePlayers.every(p =>
      p.bet === this.state.currentBet || p.isAllIn
    );

    // Check if all players with chips have acted
    const allActed = playersWithChips.length <= 1 ||
      playersWithChips.every(p => p.bet > 0 || p === this.state.players[this.state.currentPlayerIndex]);

    if (allMatched && (allActed || activePlayers.length === playersWithChips.length)) {
      this.advancePhase();
      return true;
    }

    return false;
  }

  /** Advance to next phase */
  private advancePhase(): void {
    // Reset bets
    for (const player of this.state.players) {
      player.bet = 0;
    }
    this.state.currentBet = 0;

    const phaseOrder: GamePhase[] = ['preflop', 'flop', 'turn', 'river', 'showdown'];
    const currentIndex = phaseOrder.indexOf(this.state.phase);

    if (currentIndex < phaseOrder.length - 1) {
      this.state.phase = phaseOrder[currentIndex + 1];

      if (this.state.phase === 'flop') {
        this.dealCommunityCards(3);
      } else if (this.state.phase === 'turn' || this.state.phase === 'river') {
        this.dealCommunityCards(1);
      } else if (this.state.phase === 'showdown') {
        this.runShowdown();
      }

      // Set first active player after preflop
      if (this.state.phase !== 'showdown') {
        this.state.currentPlayerIndex = this.findNextActivePlayer(this.state.dealerIndex);
        this.emit('turn:changed', {
          player: this.state.players[this.state.currentPlayerIndex].name,
          isHuman: this.state.players[this.state.currentPlayerIndex].isHuman
        });
      }

      this.emit('phase:changed', this.state.phase);
    }
  }

  /** End hand early (everyone else folded) */
  private endHandEarly(winner: Player): void {
    winner.chips += this.state.pot;

    const result: HandResult = {
      winners: [{
        id: winner.id,
        name: winner.name,
        hand: {
          rank: 0 as any,
          name: 'Fold',
          cards: [],
          kickers: [],
          score: 0,
          description: 'Everyone else folded'
        },
        amount: this.state.pot
      }],
      pot: this.state.pot,
      showDown: false
    };

    this.handHistory.push(result);

    this.emit('hand:ended', result);
  }

  /** Run showdown */
  private runShowdown(): void {
    const activePlayers = this.state.players.filter(p => !p.folded);

    if (activePlayers.length === 1) {
      // Only one player left (others all-in and lost)
      const winner = activePlayers[0];
      winner.chips += this.state.pot;

      const result: HandResult = {
        winners: [{
          id: winner.id,
          name: winner.name,
          hand: evaluateHand(winner.cards, this.state.communityCards),
          amount: this.state.pot
        }],
        pot: this.state.pot,
        showDown: true
      };

      this.handHistory.push(result);
      this.emit('hand:ended', result);
      return;
    }

    // Evaluate all hands
    const hands = activePlayers.map(p => ({
      id: p.id,
      name: p.name,
      holeCards: p.cards
    }));

    const winners = determineWinner(hands, this.state.communityCards);

    // Calculate pot distribution with side pots
    const distribution = this.potResult
      ? distributePot(this.potResult, winners.map(w => w.id))
      : new Map<string, number>();

    const winnersWithAmount = winners.map(w => ({
      ...w,
      amount: distribution.get(w.id) || Math.floor(this.state.pot / winners.length)
    }));

    // Award chips
    for (const [playerId, amount] of distribution) {
      const player = this.state.players.find(p => p.id === playerId);
      if (player) {
        player.chips += Math.floor(amount);
      }
    }

    const result: HandResult = {
      winners: winnersWithAmount,
      pot: this.state.pot,
      showDown: true
    };

    this.handHistory.push(result);

    // Emit detailed showdown info
    this.emit('showdown', {
      activePlayers: activePlayers.map(p => ({
        name: p.name,
        cards: p.cards,
        hand: evaluateHand(p.cards, this.state.communityCards)
      })),
      winners: winnersWithAmount
    });

    this.emit('hand:ended', result);
  }

  /** Emit game over event */
  private emitGameOver(): void {
    this.emit('game:over', {
      players: this.state.players.map(p => ({
        name: p.name,
        chips: p.chips,
        handsPlayed: this.handHistory.length
      })),
      history: this.handHistory
    });
  }

  /** Get current player */
  getCurrentPlayer(): Player | null {
    return this.state.players[this.state.currentPlayerIndex] || null;
  }

  /** Get human player */
  getHumanPlayer(): Player | null {
    return this.state.players.find(p => p.isHuman) || null;
  }

  /** Get active players (not folded) */
  getActivePlayers(): Player[] {
    return this.state.players.filter(p => !p.folded);
  }

  /** Check if human player's turn */
  isHumanTurn(): boolean {
    const current = this.getCurrentPlayer();
    return current?.isHuman || false;
  }

  /** Get hand history */
  getHandHistory(): HandResult[] {
    return [...this.handHistory];
  }

  /** Get game summary */
  getGameSummary(): {
    handsPlayed: number;
    players: Array<{ name: string; chips: number; }>;
  } {
    return {
      handsPlayed: this.handHistory.length,
      players: this.state.players.map(p => ({ name: p.name, chips: p.chips }))
    };
  }
}
