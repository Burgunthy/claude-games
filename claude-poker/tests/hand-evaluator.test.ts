// ============================================================================
// Texas Hold'em Poker - Hand Evaluator Tests
// ============================================================================

import { describe, it, expect } from 'vitest';
import { evaluateHand, compareHands, formatCard, calculateHandStrength } from '../src/core/hand-evaluator.js';
import { HandRank } from '../src/core/types.js';
import { Card } from '../src/core/types.js';

describe('Hand Evaluator', () => {
  describe('evaluateHand', () => {
    it('should evaluate high card', () => {
      const holeCards: Card[] = [
        { suit: 'hearts', rank: '2' },
        { suit: 'clubs', rank: '7' }
      ];
      const communityCards: Card[] = [
        { suit: 'diamonds', rank: '9' },
        { suit: 'spades', rank: 'J' },
        { suit: 'hearts', rank: 'K' }
      ];

      const result = evaluateHand(holeCards, communityCards);

      expect(result.rank).toBe(HandRank.HIGH_CARD);
      expect(result.name).toBe('High Card');
    });

    it('should evaluate a pair', () => {
      const holeCards: Card[] = [
        { suit: 'hearts', rank: 'K' },
        { suit: 'clubs', rank: 'K' }
      ];
      const communityCards: Card[] = [
        { suit: 'diamonds', rank: '2' },
        { suit: 'spades', rank: '5' },
        { suit: 'hearts', rank: '9' }
      ];

      const result = evaluateHand(holeCards, communityCards);

      expect(result.rank).toBe(HandRank.ONE_PAIR);
      expect(result.name).toBe('One Pair');
    });

    it('should evaluate two pair', () => {
      const holeCards: Card[] = [
        { suit: 'hearts', rank: 'K' },
        { suit: 'clubs', rank: 'K' }
      ];
      const communityCards: Card[] = [
        { suit: 'diamonds', rank: '2' },
        { suit: 'spades', rank: '2' },
        { suit: 'hearts', rank: '9' }
      ];

      const result = evaluateHand(holeCards, communityCards);

      expect(result.rank).toBe(HandRank.TWO_PAIR);
      expect(result.name).toBe('Two Pair');
    });

    it('should evaluate three of a kind', () => {
      const holeCards: Card[] = [
        { suit: 'hearts', rank: 'K' },
        { suit: 'clubs', rank: 'K' }
      ];
      const communityCards: Card[] = [
        { suit: 'diamonds', rank: 'K' },
        { suit: 'spades', rank: '2' },
        { suit: 'hearts', rank: '9' }
      ];

      const result = evaluateHand(holeCards, communityCards);

      expect(result.rank).toBe(HandRank.THREE_OF_A_KIND);
      expect(result.name).toBe('Three of a Kind');
    });

    it('should evaluate a straight', () => {
      const holeCards: Card[] = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '6' }
      ];
      const communityCards: Card[] = [
        { suit: 'diamonds', rank: '7' },
        { suit: 'spades', rank: '8' },
        { suit: 'hearts', rank: '9' }
      ];

      const result = evaluateHand(holeCards, communityCards);

      expect(result.rank).toBe(HandRank.STRAIGHT);
      expect(result.name).toBe('Straight');
    });

    it('should evaluate a flush', () => {
      const holeCards: Card[] = [
        { suit: 'hearts', rank: '2' },
        { suit: 'hearts', rank: '7' }
      ];
      const communityCards: Card[] = [
        { suit: 'hearts', rank: 'K' },
        { suit: 'hearts', rank: '9' },
        { suit: 'hearts', rank: '5' },
        { suit: 'diamonds', rank: '3' }
      ];

      const result = evaluateHand(holeCards, communityCards);

      expect(result.rank).toBe(HandRank.FLUSH);
      expect(result.name).toBe('Flush');
    });

    it('should evaluate a full house', () => {
      const holeCards: Card[] = [
        { suit: 'hearts', rank: 'K' },
        { suit: 'clubs', rank: 'K' }
      ];
      const communityCards: Card[] = [
        { suit: 'diamonds', rank: 'K' },
        { suit: 'spades', rank: '2' },
        { suit: 'hearts', rank: '2' }
      ];

      const result = evaluateHand(holeCards, communityCards);

      expect(result.rank).toBe(HandRank.FULL_HOUSE);
      expect(result.name).toBe('Full House');
    });

    it('should evaluate four of a kind', () => {
      const holeCards: Card[] = [
        { suit: 'hearts', rank: 'A' },
        { suit: 'clubs', rank: 'A' }
      ];
      const communityCards: Card[] = [
        { suit: 'diamonds', rank: 'A' },
        { suit: 'spades', rank: 'A' },
        { suit: 'hearts', rank: '2' }
      ];

      const result = evaluateHand(holeCards, communityCards);

      expect(result.rank).toBe(HandRank.FOUR_OF_A_KIND);
      expect(result.name).toBe('Four of a Kind');
    });

    it('should evaluate a straight flush', () => {
      const holeCards: Card[] = [
        { suit: 'hearts', rank: '5' },
        { suit: 'hearts', rank: '6' }
      ];
      const communityCards: Card[] = [
        { suit: 'hearts', rank: '7' },
        { suit: 'hearts', rank: '8' },
        { suit: 'hearts', rank: '9' },
        { suit: 'diamonds', rank: '2' }
      ];

      const result = evaluateHand(holeCards, communityCards);

      expect(result.rank).toBe(HandRank.STRAIGHT_FLUSH);
      expect(result.name).toBe('Straight Flush');
    });

    it('should evaluate a royal flush', () => {
      const holeCards: Card[] = [
        { suit: 'hearts', rank: 'J' },
        { suit: 'hearts', rank: 'Q' }
      ];
      const communityCards: Card[] = [
        { suit: 'hearts', rank: 'K' },
        { suit: 'hearts', rank: '10' },
        { suit: 'hearts', rank: 'A' },
        { suit: 'diamonds', rank: '2' }
      ];

      const result = evaluateHand(holeCards, communityCards);

      expect(result.rank).toBe(HandRank.ROYAL_FLUSH);
      expect(result.name).toBe('Royal Flush');
    });
  });

  describe('compareHands', () => {
    it('should correctly compare two hands', () => {
      const hand1 = evaluateHand(
        [{ suit: 'hearts', rank: 'A' }, { suit: 'clubs', rank: 'A' }],
        []
      );
      const hand2 = evaluateHand(
        [{ suit: 'hearts', rank: 'K' }, { suit: 'clubs', rank: 'K' }],
        []
      );

      expect(compareHands(hand1, hand2)).toBeGreaterThan(0);
    });

    it('should return 0 for equal hands', () => {
      const hand1 = evaluateHand(
        [{ suit: 'hearts', rank: 'A' }, { suit: 'clubs', rank: 'K' }],
        []
      );
      const hand2 = evaluateHand(
        [{ suit: 'diamonds', rank: 'A' }, { suit: 'spades', rank: 'K' }],
        []
      );

      expect(compareHands(hand1, hand2)).toBe(0);
    });
  });

  describe('formatCard', () => {
    it('should format card correctly', () => {
      const card: Card = { suit: 'hearts', rank: 'A' };
      expect(formatCard(card, 'compact')).toBe('A♥');
    });
  });

  describe('calculateHandStrength', () => {
    it('should return higher strength for pocket aces', () => {
      const pocketAces: Card[] = [
        { suit: 'hearts', rank: 'A' },
        { suit: 'clubs', rank: 'A' }
      ];

      const strength = calculateHandStrength(pocketAces, []);

      expect(strength).toBeGreaterThan(0.7);
    });

    it('should return lower strength for weak cards', () => {
      const weakCards: Card[] = [
        { suit: 'hearts', rank: '2' },
        { suit: 'clubs', rank: '7' }
      ];

      const strength = calculateHandStrength(weakCards, []);

      expect(strength).toBeLessThan(0.4);
    });
  });
});
