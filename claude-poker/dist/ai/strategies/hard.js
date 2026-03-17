// ============================================================================
// Texas Hold'em Poker - Hard AI Strategy
// ============================================================================
// Aggressive, GTO-inspired AI. Uses range estimation, position awareness,
// board texture analysis, and balanced bluffing frequencies.
import { BaseAI } from '../base.js';
import { ThoughtStage } from '../../core/types.js';
/** Rank values */
const RANK_VALUES = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
};
export class HardAI extends BaseAI {
    rangeTightness = 0.6 + Math.random() * 0.2;
    aggressionFactor = 0.65 + Math.random() * 0.2;
    bluffFrequency = 0.25 + Math.random() * 0.15;
    // Track opponent tendencies (simplified)
    opponentAggression = new Map();
    constructor(name = 'Hard AI') {
        super({
            strategy: 'hard',
            name,
            avatar: '🦈',
            personality: 'Calculated and aggressive. Uses range-based thinking.'
        });
    }
    decideAction(holeCards, communityCards, context) {
        this.clearThoughts();
        // Perceive stage - detailed observation
        const handStrength = this.analyzeHand(holeCards, communityCards);
        const handType = this.classifyHand(holeCards, communityCards);
        const boardTexture = this.analyzeBoardTexture(communityCards);
        const position = context.position;
        let perceiveText = `Hole cards: ${this.formatHand(holeCards)} (${handType})`;
        if (communityCards.length > 0) {
            perceiveText += `. Board: ${this.formatHand(communityCards)} (${boardTexture.type})`;
        }
        perceiveText += `. Position: ${this.formatPosition(position)}`;
        perceiveText += `. Players: ${context.playersInHand}`;
        this.addThought(ThoughtStage.PERCEIVE, perceiveText, '👀');
        // Analyze stage - deep thinking
        const analysis = this.deepAnalyze(handStrength, context, communityCards);
        this.addThought(ThoughtStage.ANALYZE, analysis, '🧮');
        // Decide stage
        const decision = this.makeDecision(handStrength, context, boardTexture);
        this.addThought(ThoughtStage.DECIDE, `${decision.reasoning} Confidence: ${(decision.confidence * 100).toFixed(0)}%`, '💭');
        return decision;
    }
    generateThoughts(holeCards, communityCards, context, decision) {
        return this.getThoughts();
    }
    deepAnalyze(strength, context, communityCards) {
        const parts = [];
        // Hand strength
        parts.push(`Strength: ${(strength.current * 100).toFixed(0)}%`);
        // Draw assessment
        if (strength.draw) {
            parts.push(`Has ${strength.drawType} draw (potential: ${(strength.potential * 100).toFixed(0)}%)`);
        }
        // Pot odds vs equity
        const potOdds = context.potOdds;
        const myEquity = strength.potential;
        parts.push(`Pot odds: ${(potOdds * 100).toFixed(0)}%, My equity: ${(myEquity * 100).toFixed(0)}%`);
        if (myEquity > potOdds) {
            parts.push('✓ Positive EV call');
        }
        else if (potOdds > 0.4 && myEquity > 0.3) {
            parts.push('~ Marginal - considering implied odds');
        }
        // Range analysis
        const rangeAdvantage = this.assessRangeAdvantage(context, communityCards);
        if (rangeAdvantage > 0.2) {
            parts.push('Range advantage: Me');
        }
        else if (rangeAdvantage < -0.2) {
            parts.push('Range advantage: Opponent');
        }
        return parts.join('. ');
    }
    makeDecision(strength, context, boardTexture) {
        const toCall = context.toCall;
        const pot = context.pot;
        const isHeadsUp = context.playersInHand === 2;
        const shouldBarrel = boardTexture.wetness < 0.5 && context.phase !== 'preflop';
        // Monster hands - max value
        if (strength.current > 0.9) {
            if (toCall === 0) {
                return {
                    action: 'raise',
                    amount: this.calculateBetSize(pot, context.phase, 'value'),
                    confidence: 0.98,
                    reasoning: 'Monster! Maximum value bet.'
                };
            }
            return {
                action: 'raise',
                amount: toCall + this.calculateBetSize(pot, context.phase, 'value'),
                confidence: 0.95,
                reasoning: 'Raising for maximum value with my nuts!'
            };
        }
        // Very strong hands
        if (strength.current > 0.75) {
            if (toCall === 0) {
                return {
                    action: 'raise',
                    amount: this.calculateBetSize(pot, context.phase, 'value'),
                    confidence: 0.9,
                    reasoning: 'Strong hand, betting for value.'
                };
            }
            // Consider trapping on dry boards
            if (boardTexture.wetness < 0.3 && Math.random() < 0.3) {
                return {
                    action: 'call',
                    confidence: 0.7,
                    reasoning: 'Slow playing on this dry board.'
                };
            }
            return {
                action: 'raise',
                amount: toCall + pot * 0.75,
                confidence: 0.85,
                reasoning: 'Raising for value with strong hand.'
            };
        }
        // Preflop logic
        if (context.phase === 'preflop') {
            return this.handlePreflop(strength, context);
        }
        // Draw with good odds
        if (strength.draw && strength.potential > 0.5) {
            const drawEquity = this.getDrawEquity(strength, context.communityCards.length);
            if (drawEquity > context.potOdds || toCall < pot * 0.35) {
                // Sometimes raise with strong draws (semi-bluff)
                if (Math.random() < this.aggressionFactor && toCall === 0) {
                    return {
                        action: 'raise',
                        amount: pot * 0.6,
                        confidence: 0.65,
                        reasoning: 'Semi-bluffing with strong draw.'
                    };
                }
                return {
                    action: toCall === 0 ? 'check' : 'call',
                    confidence: 0.75,
                    reasoning: `Calling with ${strength.drawType} draw.`
                };
            }
        }
        // Medium strength - depends on board and position
        if (strength.current > 0.45) {
            if (toCall === 0) {
                // Consider betting on dry boards
                if (shouldBarrel && context.position === 'late' && Math.random() < this.aggressionFactor) {
                    return {
                        action: 'raise',
                        amount: pot * 0.5,
                        confidence: 0.6,
                        reasoning: 'Barreling on dry board.'
                    };
                }
                return {
                    action: 'check',
                    confidence: 0.7,
                    reasoning: 'Checking with medium strength.'
                };
            }
            // Call with decent pot odds
            if (context.potOdds > 0.3) {
                return {
                    action: 'call',
                    confidence: 0.65,
                    reasoning: 'Pot odds good enough to call.'
                };
            }
            // Might call down in position
            if (context.position === 'late' && toCall < pot * 0.5) {
                return {
                    action: 'call',
                    confidence: 0.55,
                    reasoning: 'Calling in position with showdown value.'
                };
            }
        }
        // Bluff frequency
        if (this.shouldBluffBasedOnSituation(context, boardTexture)) {
            const bluffSize = this.calculateBetSize(pot, context.phase, 'bluff');
            return {
                action: toCall === 0 ? 'raise' : (toCall < bluffSize ? 'raise' : 'fold'),
                amount: bluffSize,
                confidence: toCall === 0 ? 0.5 : 0.4,
                reasoning: toCall === 0 ? 'Bluffing at this pot.' : 'Folded to bet, considering raise.'
            };
        }
        // Weak hands
        if (toCall === 0) {
            return {
                action: 'check',
                confidence: 0.9,
                reasoning: 'Checking with weak hand.'
            };
        }
        // Fold weak hands to aggression
        if (strength.current < 0.3 && toCall > pot * 0.25) {
            return {
                action: 'fold',
                confidence: 0.8,
                reasoning: 'Too weak to continue against this bet.'
            };
        }
        // Default
        return {
            action: toCall === 0 ? 'check' : 'fold',
            confidence: 0.7,
            reasoning: 'Best to avoid this spot.'
        };
    }
    handlePreflop(strength, context) {
        const toCall = context.toCall;
        const isLate = context.position === 'late';
        const bb = context.bigBlind || 20;
        // Premium hands
        if (strength.current > 0.65) {
            if (toCall === 0) {
                return {
                    action: 'raise',
                    amount: bb * 3,
                    confidence: 0.95,
                    reasoning: 'Raising with premium hand.'
                };
            }
            // 3-bet or 4-bet
            return {
                action: 'raise',
                amount: toCall + bb * (toCall > bb * 2 ? 2.5 : 3),
                confidence: 0.9,
                reasoning: toCall > bb * 2 ? '4-betting!' : '3-betting for value.'
            };
        }
        // Strong hands
        if (strength.current > 0.45) {
            if (toCall === 0) {
                return isLate ? {
                    action: 'raise',
                    amount: bb * 2.5,
                    confidence: 0.7,
                    reasoning: 'Opening from late position.'
                } : {
                    action: 'check',
                    confidence: 0.6,
                    reasoning: 'Limping from early position.'
                };
            }
            // Call 3-bets in position with strong hands
            if (toCall < bb * 5 && context.position === 'late') {
                return {
                    action: 'call',
                    confidence: 0.7,
                    reasoning: 'Calling 3-bet in position.'
                };
            }
            return toCall < bb * 3 ? {
                action: 'call',
                confidence: 0.75,
                reasoning: 'Calling to see the flop.'
            } : {
                action: 'fold',
                confidence: 0.6,
                reasoning: 'Too expensive to continue.'
            };
        }
        // Speculative hands
        if (strength.draw && isLate && toCall <= bb) {
            return {
                action: 'check',
                confidence: 0.6,
                reasoning: 'Limping with speculative hand.'
            };
        }
        // Weak hands - fold to any action
        if (toCall > 0) {
            return {
                action: 'fold',
                confidence: 0.8,
                reasoning: 'Not worth pursuing.'
            };
        }
        return {
            action: 'check',
            confidence: 0.5,
            reasoning: 'Checking to see free flop.'
        };
    }
    analyzeBoardTexture(cards) {
        if (cards.length === 0) {
            return { type: 'Preflop', wetness: 0 };
        }
        const suits = cards.map(c => c.suit);
        const ranks = cards.map(c => RANK_VALUES[c.rank]);
        const uniqueSuits = new Set(suits).size;
        const sortedRanks = [...ranks].sort((a, b) => a - b);
        // Check for flush possibilities
        const flushPossible = uniqueSuits <= 2;
        // Check for straight possibilities
        let connectedCount = 0;
        for (let i = 1; i < sortedRanks.length; i++) {
            if (sortedRanks[i] - sortedRanks[i - 1] <= 2)
                connectedCount++;
        }
        const straightPossible = connectedCount >= 2;
        // Calculate wetness (how much the board favors draws/strong hands)
        let wetness = 0;
        if (flushPossible)
            wetness += 0.3;
        if (straightPossible)
            wetness += 0.3;
        if (cards.length >= 3 && uniqueSuits === 1)
            wetness += 0.4; // Monotone
        // Paired board (less wet)
        const uniqueRanks = new Set(ranks).size;
        if (uniqueRanks < cards.length)
            wetness -= 0.2;
        // Type classification
        let type = 'Dry';
        if (wetness > 0.6)
            type = 'Very Wet';
        else if (wetness > 0.4)
            type = 'Wet';
        else if (wetness > 0.2)
            type = 'Medium';
        return { type, wetness: Math.max(0, Math.min(1, wetness)) };
    }
    shouldBluffBasedOnSituation(context, boardTexture) {
        // Fewer players = more bluffing
        if (context.playersInHand > 2)
            return Math.random() < this.bluffFrequency * 0.3;
        // More bluffing on dry boards
        const bluffChance = boardTexture.wetness < 0.3
            ? this.bluffFrequency * 1.5
            : this.bluffFrequency * 0.7;
        // Position-based bluffing
        if (context.position === 'late') {
            return Math.random() < bluffChance * 1.5;
        }
        // Continuation bets
        if (context.phase === 'flop' && context.toCall === 0) {
            return Math.random() < this.bluffFrequency * 2;
        }
        return Math.random() < bluffChance;
    }
    calculateBetSize(pot, phase, type) {
        const baseMultipliers = {
            preflop: 2.5,
            flop: 0.65,
            turn: 0.75,
            river: 0.8,
            showdown: 0
        };
        const multiplier = baseMultipliers[phase] || 0.7;
        const variance = type === 'value' ? 0.1 : 0.2;
        return Math.floor(pot * multiplier * (1 + (Math.random() - 0.5) * variance));
    }
    assessRangeAdvantage(context, communityCards) {
        // Simplified range advantage calculation
        // In a real implementation, this would track opponent ranges
        if (context.position === 'late')
            return 0.15;
        if (context.position === 'early')
            return -0.1;
        return 0;
    }
    getDrawEquity(strength, _communityCount) {
        if (strength.drawType === 'both')
            return 0.45;
        if (strength.drawType === 'flush')
            return _communityCount === 3 ? 0.35 : 0.2;
        if (strength.drawType === 'straight')
            return _communityCount === 3 ? 0.32 : 0.18;
        return 0.25;
    }
    classifyHand(holeCards, communityCards) {
        if (communityCards.length === 0) {
            return this.classifyHoleCards(holeCards);
        }
        // Would analyze made hand + draw potential
        return 'Analyzing...';
    }
    classifyHoleCards(cards) {
        const ranks = cards.map(c => c.rank);
        const suits = cards.map(c => c.suit);
        const values = ranks.map(r => RANK_VALUES[r]).sort((a, b) => b - a);
        if (ranks[0] === ranks[1]) {
            if (values[0] >= 10)
                return 'Premium pair';
            if (values[0] >= 7)
                return 'Medium pair';
            return 'Small pair';
        }
        if (values[0] === 14 && values[1] >= 10) {
            return suits[0] === suits[1] ? 'Suited broadway' : 'Big ace';
        }
        const isConnected = Math.abs(values[0] - values[1]) === 1;
        const isSuited = suits[0] === suits[1];
        if (isConnected && isSuited && values[0] >= 10)
            return 'Premium suited connectors';
        if (isConnected && isSuited)
            return 'Speculative suited connectors';
        if (isSuited && values[0] >= 10)
            return 'Suited high cards';
        if (isConnected)
            return 'Connected cards';
        return 'High card';
    }
}
