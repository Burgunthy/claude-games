// ============================================================================
// Texas Hold'em Poker - AI Base Interface
// ============================================================================

import {
  Card, Player, GamePhase, Decision, Thought, ThoughtStage,
  GameContext, HandStrength, AIStrategyType
} from '../core/types.js';
import { calculateHandStrength, checkDraw } from '../core/hand-evaluator.js';
import { getPotOdds } from '../core/pot-calculator.js';
import { AI_THRESHOLDS, POSITION } from '../core/constants.js';

/** AI Player Configuration */
export interface AIConfig {
  strategy: AIStrategyType;
  name: string;
  avatar: string;
  personality?: string;
}

/** Base AI Player */
export abstract class BaseAI {
  protected config: AIConfig;
  protected thoughtHistory: Thought[] = [];

  constructor(config: AIConfig) {
    this.config = config;
  }

  /** Get AI configuration */
  getConfig(): AIConfig {
    return this.config;
  }

  /** Get strategy thresholds */
  protected getThresholds() {
    return AI_THRESHOLDS[this.config.strategy];
  }

  /** Main decision method - to be implemented by strategies */
  abstract decideAction(
    holeCards: Card[],
    communityCards: Card[],
    context: GameContext
  ): Decision;

  /** Generate thoughts for the decision */
  abstract generateThoughts(
    holeCards: Card[],
    communityCards: Card[],
    context: GameContext,
    decision: Decision
  ): Thought[];

  /** Get thought history */
  getThoughts(): Thought[] {
    return [...this.thoughtHistory];
  }

  /** Clear thought history */
  clearThoughts(): void {
    this.thoughtHistory = [];
  }

  /** Add thought to history */
  protected addThought(stage: ThoughtStage, content: string, emoji: string): void {
    this.thoughtHistory.push({ stage, content, emoji });

    // Keep only recent thoughts (last 10)
    if (this.thoughtHistory.length > 10) {
      this.thoughtHistory = this.thoughtHistory.slice(-10);
    }
  }

  /** Calculate hand strength with position consideration */
  protected analyzeHand(holeCards: Card[], communityCards: Card[]): HandStrength {
    const current = calculateHandStrength(holeCards, communityCards);
    const draw = checkDraw(holeCards, communityCards);

    // Adjust potential based on draw type
    let potential = current;
    if (draw.hasFlushDraw || draw.hasStraightDraw) {
      potential = Math.max(0.4, current + 0.25);
    }

    // Backdoor draws add some potential
    if (draw.hasBackdoorFlush || draw.hasBackdoorStraight) {
      potential = Math.max(0.3, current + 0.1);
    }

    return {
      current,
      potential,
      draw: draw.hasFlushDraw || draw.hasStraightDraw,
      drawType: draw.hasFlushDraw && draw.hasStraightDraw ? 'both' :
               draw.hasFlushDraw ? 'flush' :
               draw.hasStraightDraw ? 'straight' : null
    };
  }

  /** Get position at table */
  protected getPosition(
    playerId: string,
    dealerIndex: number,
    playerCount: number
  ): 'early' | 'middle' | 'late' {
    const position = (parseInt(playerId.split('-')[1] || '0') - dealerIndex + playerCount) % playerCount;

    if (position <= 2) return 'early';
    if (position >= playerCount - 2) return 'late';
    return 'middle';
  }

  /** Determine if we should bluff based on strategy */
  protected shouldBluff(strength: HandStrength, context: GameContext): boolean {
    const thresholds = this.getThresholds();
    const random = Math.random();

    // Maniacs bluff more often
    if (this.config.strategy === 'maniac' && random < 0.4) {
      return true;
    }

    // Check if pot odds justify bluff
    if (context.potOdds < 0.3 && random < thresholds.bluffFrequency) {
      return true;
    }

    // Semi-bluff with draws
    if (strength.draw && context.phase === 'flop' && random < thresholds.bluffFrequency * 2) {
      return true;
    }

    return false;
  }

  /** Format hand for display */
  protected formatHand(cards: Card[]): string {
    return cards.map(c => `${c.rank}${c.suit[0]}`).join(' ');
  }

  /** Format position name */
  protected formatPosition(position: 'early' | 'middle' | 'late'): string {
    return position.charAt(0).toUpperCase() + position.slice(1);
  }
}
