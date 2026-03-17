// ============================================================================
// Texas Hold'em Poker - Normal AI Strategy
// ============================================================================
// Balanced AI that considers position, pot odds, and hand strength.
// Bluffs occasionally (~20%), plays fundamentally sound poker.

import { BaseAI } from '../base.js';
import {
  Card, GamePhase, Decision, Thought, ThoughtStage,
  GameContext, HandStrength, AIStrategyType
} from '../../core/types.js';

/** Rank values for comparison */
const RANK_VALUES: Record<string, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

export class NormalAI extends BaseAI {
  private aggressionFactor: number = 0.5 + Math.random() * 0.2; // 0.5-0.7
  private bluffFrequency: number = 0.15 + Math.random() * 0.1; // 15-25%

  constructor(name: string = 'Normal AI') {
    super({
      strategy: 'normal' as AIStrategyType,
      name,
      avatar: '🎭',
      personality: 'Balanced and thoughtful. Knows the fundamentals.'
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
    const handType = this.classifyHoleCards(holeCards);
    const position = context.position;

    let perceiveText = `I have ${this.formatHand(holeCards)} (${handType})`;

    if (communityCards.length > 0) {
      perceiveText += `. Board: ${this.formatHand(communityCards)}`;
    }

    this.addThought(
      ThoughtStage.PERCEIVE,
      `${perceiveText}. Position: ${this.formatPosition(position)}.`,
      '👀'
    );

    // Analyze stage
    const potOdds = context.potOdds;
    const impliedOdds = this.calculateImpliedOdds(handStrength, context);
    const shouldBluff = this.shouldBluffBasedOnSituation(context, handStrength);

    let analyzeText = `Hand strength: ${(handStrength.current * 100).toFixed(0)}%`;

    if (handStrength.draw) {
      analyzeText += ` with ${handStrength.drawType} draw`;
    }

    analyzeText += `. Pot odds: ${(potOdds * 100).toFixed(0)}%`;

    if (impliedOdds > potOdds) {
      analyzeText += `. Implied odds look good!`;
    }

    if (shouldBluff && context.toCall > 0) {
      analyzeText += `. Might consider a bluff...`;
    }

    this.addThought(ThoughtStage.ANALYZE, analyzeText, '🧮');

    // Decide stage
    const decision = this.makeDecision(handStrength, context, shouldBluff);
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

  private makeDecision(
    strength: HandStrength,
    context: GameContext,
    canBluff: boolean
  ): Decision {
    const thresholds = this.getThresholds();
    const toCall = context.toCall;
    const potSize = context.pot;
    const isHeadsUp = context.playersInHand === 2;

    // All-in with very strong hands
    if (strength.current > 0.85 && context.phase !== 'preflop') {
      return {
        action: 'raise',
        amount: toCall + Math.max(potSize, context.bigBlind || 20) * 2,
        confidence: 0.95,
        reasoning: 'Very strong hand! I am going to bet big!'
      };
    }

    // Preflop logic
    if (context.phase === 'preflop') {
      return this.handlePreflop(strength, context);
    }

    // Postflop with draw
    if (strength.draw && strength.potential > 0.45) {
      const drawOdds = this.getDrawOdds(strength);
      if (drawOdds > context.potOdds || toCall < potSize * 0.3) {
        return {
          action: toCall === 0 ? 'raise' : 'call',
          amount: toCall === 0 ? potSize * 0.5 : toCall,
          confidence: 0.7,
          reasoning: `I have a ${strength.drawType} draw with good odds.`
        };
      }
    }

    // Strong hand
    if (strength.current > thresholds.raiseThreshold) {
      if (toCall === 0) {
        // Value bet
        const betSize = this.calculateBetSize(potSize, context.phase);
        return {
          action: 'raise',
          amount: betSize,
          confidence: 0.85,
          reasoning: 'Value betting with my strong hand.'
        };
      } else {
        // Raise for value or call depending on situation
        if (strength.current > 0.7 || isHeadsUp) {
          return {
            action: 'raise',
            amount: toCall + potSize * 0.75,
            confidence: 0.8,
            reasoning: 'Raising for value with my strong hand.'
          };
        }
        return {
          action: 'call',
          confidence: 0.75,
          reasoning: 'Calling with my strong hand.'
        };
      }
    }

    // Medium strength hand
    if (strength.current > thresholds.callThreshold) {
      if (toCall === 0) {
        return {
          action: 'check',
          confidence: 0.7,
          reasoning: 'Checking with medium strength.'
        };
      }

      // Call if pot odds are good
      if (context.potOdds > 0.25 || toCall < potSize * 0.4) {
        return {
          action: 'call',
          confidence: 0.65,
          reasoning: 'Pot odds justify a call.'
        };
      }
    }

    // Bluff attempt
    if (canBluff && toCall === 0 && context.phase === 'flop') {
      if (Math.random() < this.bluffFrequency * 2) {
        return {
          action: 'raise',
          amount: potSize * 0.5,
          confidence: 0.5,
          reasoning: 'Taking a stab at this pot.'
        };
      }
    }

    // Weak hand
    if (toCall === 0) {
      return {
        action: 'check',
        confidence: 0.8,
        reasoning: 'Checking with weak hand.'
      };
    }

    // Fold weak hands to significant bets
    if (strength.current < thresholds.foldThreshold && toCall > potSize * 0.3) {
      return {
        action: 'fold',
        confidence: 0.75,
        reasoning: 'Hand is too weak to call this bet.'
      };
    }

    // Default to fold or check
    return {
      action: toCall === 0 ? 'check' : 'fold',
      confidence: 0.6,
      reasoning: toCall === 0 ? 'Checking.' : 'Time to let this one go.'
    };
  }

  private handlePreflop(strength: HandStrength, context: GameContext): Decision {
    const toCall = context.toCall;
    const isPremium = this.isPremiumHand(context.phase === 'preflop' ? strength : { current: 0, potential: 0, draw: false, drawType: null });
    const position = context.position;
    const isLate = position === 'late';

    // Big pairs or premium
    if (strength.current > 0.6) {
      if (toCall === 0) {
        return {
          action: 'raise',
          amount: (context.bigBlind || 20) * (2.5 + Math.random()),
          confidence: 0.9,
          reasoning: 'Raising with my premium hand.'
        };
      }
      return {
        action: 'raise',
        amount: toCall + (context.bigBlind || 20) * 3,
        confidence: 0.85,
        reasoning: '3-betting with a strong hand!'
      };
    }

    // Medium hands
    if (strength.current > 0.35) {
      if (toCall === 0) {
        if (isLate && Math.random() < this.aggressionFactor) {
          return {
            action: 'raise',
            amount: (context.bigBlind || 20) * 2.5,
            confidence: 0.6,
            reasoning: 'Stealing from late position.'
          };
        }
        return {
          action: 'check',
          confidence: 0.7,
          reasoning: 'Limping in to see a cheap flop.'
        };
      }

      if (toCall < (context.bigBlind || 20) * 3) {
        return {
          action: 'call',
          confidence: 0.7,
          reasoning: 'Calling to see the flop.'
        };
      }
    }

    // Weak hands - only play if cheap
    if (toCall === 0) {
      return {
        action: 'check',
        confidence: 0.6,
        reasoning: 'Free card to see the flop.'
      };
    }

    if (toCall === (context.bigBlind || 20) && isLate && strength.current > 0.25) {
      return {
        action: 'call',
        confidence: 0.5,
        reasoning: 'Calling from the big blind.'
      };
    }

    return {
      action: 'fold',
      confidence: 0.8,
      reasoning: 'Not worth pursuing this hand.'
    };
  }

  private classifyHoleCards(cards: Card[]): string {
    const ranks = cards.map(c => c.rank);
    const suits = cards.map(c => c.suit);
    const values = ranks.map(r => RANK_VALUES[r]).sort((a, b) => b - a);

    // Pair
    if (ranks[0] === ranks[1]) {
      if (values[0] >= 10) return `Premium pair`;
      if (values[0] >= 7) return `Medium pair`;
      return `Small pair`;
    }

    // High card hands
    if (values[0] === 14 && values[1] >= 10) {
      return suits[0] === suits[1] ? 'Suited broadway' : 'Broadway cards';
    }
    if (values[0] >= 12 && values[1] >= 10) {
      return suits[0] === suits[1] ? 'Suited connectors' : 'High cards';
    }

    // Connected/suited
    const isConnected = Math.abs(values[0] - values[1]) === 1;
    const isSuited = suits[0] === suits[1];

    if (isConnected && isSuited) return 'Suited connectors';
    if (isConnected) return 'Connected cards';
    if (isSuited) return 'Suited cards';

    return 'High card';
  }

  private calculateImpliedOdds(strength: HandStrength, context: GameContext): number {
    if (strength.draw) {
      // Better implied odds for draws in multiway pots
      return context.potOdds * (1 + context.playersInHand * 0.2);
    }
    return context.potOdds;
  }

  private calculateBetSize(pot: number, phase: GamePhase): number {
    const multipliers: Record<GamePhase, number> = {
      preflop: 2.5,
      flop: 0.6,
      turn: 0.7,
      river: 0.75,
      showdown: 0
    };
    return Math.floor(pot * multipliers[phase] * this.aggressionFactor);
  }

  private shouldBluffBasedOnSituation(context: GameContext, strength: HandStrength): boolean {
    // Don't bluff multiway
    if (context.playersInHand > 2) return false;

    // Bluff more in late position
    if (context.position === 'late' && Math.random() < this.bluffFrequency * 2) {
      return true;
    }

    // Continuation bet if preflop raiser
    if (context.phase === 'flop' && Math.random() < this.bluffFrequency * 1.5) {
      return true;
    }

    return Math.random() < this.bluffFrequency;
  }

  private getDrawOdds(strength: HandStrength): number {
    if (strength.drawType === 'both') return 0.45;
    if (strength.drawType === 'flush') return 0.35;
    if (strength.drawType === 'straight') return 0.32;
    return 0.25;
  }

  private isPremiumHand(_strength: any): boolean {
    // Simplified - would compare actual card values
    return Math.random() < 0.1;
  }
}
