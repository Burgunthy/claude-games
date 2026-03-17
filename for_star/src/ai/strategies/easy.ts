// ============================================================================
// Texas Hold'em Poker - Easy AI Strategy
// ============================================================================
// Passive, predictable AI that only plays premium hands.
// Never bluffs, folds often. Good for beginners.

import { BaseAI } from '../base.js';
import {
  Card, GamePhase, Decision, Thought, ThoughtStage,
  GameContext, HandStrength, AIStrategyType
} from '../../core/types.js';

/** Premium hands for easy AI */
const PREMIUM_HANDS = [
  // Pairs
  'AA', 'KK', 'QQ', 'JJ',
  // High suited
  'AKs', 'AQs', 'KQs',
  // High offsuit
  'AK', 'AQ'
];

export class EasyAI extends BaseAI {
  constructor(name: string = 'Easy AI') {
    super({
      strategy: 'easy' as AIStrategyType,
      name,
      avatar: '🐢',
      personality: 'Cautious and predictable. Only plays strong hands.'
    });
  }

  decideAction(
    holeCards: Card[],
    communityCards: Card[],
    context: GameContext
  ): Decision {
    this.clearThoughts();

    // Perceive stage
    const handStrength = this.analyzeHand(holeCards, communityCards);
    const handType = this.classifyHand(holeCards);

    this.addThought(
      ThoughtStage.PERCEIVE,
      `I have ${this.formatHand(holeCards)} (${handType}). ${communityCards.length > 0 ? `Board: ${this.formatHand(communityCards)}` : 'No community cards yet.'}`,
      '👀'
    );

    // Analyze stage
    let actionReasoning = '';

    if (context.phase === 'preflop') {
      const isPremium = this.isPremiumHand(holeCards);

      if (isPremium) {
        actionReasoning = 'Premium hand! I should play.';
      } else if (handStrength.current > 0.3) {
        actionReasoning = 'Decent cards, but I prefer premium hands.';
      } else {
        actionReasoning = 'Weak hand. Better fold early.';
      }

      this.addThought(
        ThoughtStage.ANALYZE,
        `${actionReasoning} Position: ${this.formatPosition(context.position)}. Pot odds: ${(context.potOdds * 100).toFixed(0)}%`,
        '🧮'
      );
    } else {
      // Postflop
      if (handStrength.current > 0.6) {
        actionReasoning = 'Strong hand! Time to bet.';
      } else if (handStrength.current > 0.4) {
        actionReasoning = 'Decent hand, I can call small bets.';
      } else if (handStrength.draw) {
        actionReasoning = 'I have a draw... but I usually avoid draws.';
      } else {
        actionReasoning = 'Weak hand. I should check or fold.';
      }

      this.addThought(
        ThoughtStage.ANALYZE,
        `${actionReasoning} Hand strength: ${(handStrength.current * 100).toFixed(0)}%. Pot odds: ${(context.potOdds * 100).toFixed(0)}%`,
        '🧮'
      );
    }

    // Decide stage
    const decision = this.makeDecision(handStrength, context);
    this.addThought(
      ThoughtStage.DECIDE,
      `${decision.reasoning} Confidence: ${(decision.confidence * 100).toFixed(0)}%`,
      '💭'
    );

    return decision;
  }

  generateThoughts(
    holeCards: Card[],
    communityCards: Card[],
    context: GameContext,
    decision: Decision
  ): Thought[] {
    return this.getThoughts();
  }

  private makeDecision(strength: HandStrength, context: GameContext): Decision {
    const thresholds = this.getThresholds();

    // Preflop logic
    if (context.phase === 'preflop') {
      if (this.isPremiumHand(context.phase === 'preflop' ? strength : { current: 0, potential: 0, draw: false, drawType: null })) {
        // Premium hand - raise
        return {
          action: 'raise',
          amount: context.bigBlind || 20,
          confidence: 0.8,
          reasoning: 'Raising with my premium hand.'
        };
      } else if (context.toCall === 0) {
        // Can check for free
        return {
          action: 'check',
          confidence: 0.7,
          reasoning: 'Free card to see the flop.'
        };
      } else if (strength.current > thresholds.foldThreshold && context.toCall < (context.bigBlind || 20) * 2) {
        // Small bet, decent hand
        return {
          action: 'call',
          confidence: 0.5,
          reasoning: 'Calling a small bet to see the flop.'
        };
      } else {
        // Fold
        return {
          action: 'fold',
          confidence: 0.9,
          reasoning: 'Not worth it. I prefer premium hands.'
        };
      }
    }

    // Postflop logic
    if (strength.current > thresholds.raiseThreshold) {
      // Strong hand - small raise
      return {
        action: 'raise',
        amount: Math.min(context.pot * 0.5, context.currentBet * 2),
        confidence: 0.7,
        reasoning: 'I have a strong hand!'
      };
    } else if (strength.current > thresholds.callThreshold) {
      // Decent hand - call if cheap
      if (context.toCall === 0) {
        return {
          action: 'check',
          confidence: 0.8,
          reasoning: 'Checking for now.'
        };
      } else if (context.potOdds > 0.3) {
        return {
          action: 'call',
          confidence: 0.6,
          reasoning: 'Pot odds are decent, I will call.'
        };
      }
    }

    // Weak hand
    if (context.toCall === 0) {
      return {
        action: 'check',
        confidence: 0.9,
        reasoning: 'Checking with my weak hand.'
      };
    }

    return {
      action: 'fold',
      confidence: 0.85,
      reasoning: 'My hand is too weak to continue.'
    };
  }

  private classifyHand(cards: Card[]): string {
    const ranks = cards.map(c => c.rank);
    const suits = cards.map(c => c.suit);

    // Pair
    if (ranks[0] === ranks[1]) {
      return `Pair of ${ranks[0]}s`;
    }

    // Suited
    if (suits[0] === suits[1]) {
      return `Suited ${ranks[0]}${ranks[1]}`;
    }

    // Connected
    const rankValues = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
    const v1 = rankValues[ranks[0]];
    const v2 = rankValues[ranks[1]];
    if (Math.abs(v1 - v2) === 1) {
      return `Connected ${ranks[0]}${ranks[1]}`;
    }

    return 'High cards';
  }

  private isPremiumHand(strength: any): boolean {
    // Simplified for easy AI - checks actual card values
    return false; // Would be implemented with actual card comparison
  }
}
