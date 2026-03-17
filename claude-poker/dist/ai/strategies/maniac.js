// ============================================================================
// Texas Hold'em Poker - Maniac AI Strategy
// ============================================================================
// Extremely aggressive AI that bets and raises constantly.
// High bluff frequency (~50%), unpredictable, creates chaos.
// Plays many hands and rarely folds.
import { BaseAI } from '../base.js';
import { ThoughtStage } from '../../core/types.js';
export class ManiacAI extends BaseAI {
    chaosFactor = 0.7 + Math.random() * 0.3; // 0.7-1.0
    bluffFrequency = 0.45 + Math.random() * 0.2; // 45-65%
    unpredictableLevel = Math.random(); // 0-1
    constructor(name = 'Maniac AI') {
        super({
            strategy: 'maniac',
            name,
            avatar: '🔥',
            personality: 'Chaotic and aggressive. Fearless bluffer!'
        });
    }
    decideAction(holeCards, communityCards, context) {
        this.clearThoughts();
        // Perceive stage
        const handStrength = this.analyzeHand(holeCards, communityCards);
        let perceiveText = `Cards: ${this.formatHand(holeCards)}`;
        if (communityCards.length > 0) {
            perceiveText += `. Board: ${this.formatHand(communityCards)}`;
        }
        perceiveText += `. Let's make some noise! 🎰`;
        this.addThought(ThoughtStage.PERCEIVE, perceiveText, '👀');
        // Analyze stage (minimal - maniacs don't overthink!)
        const aggressiveAction = Math.random() < this.chaosFactor;
        const shouldBluff = Math.random() < this.bluffFrequency;
        let analyzeText = `Strength: ${(handStrength.current * 100).toFixed(0)}%. `;
        if (aggressiveAction) {
            analyzeText += 'Time to apply pressure!';
        }
        else if (shouldBluff) {
            analyzeText += 'Maybe they\'ll fold...';
        }
        else {
            analyzeText += 'I can work with this.';
        }
        this.addThought(ThoughtStage.ANALYZE, analyzeText, '🧮');
        // Decide stage
        const decision = this.makeDecision(handStrength, context, aggressiveAction, shouldBluff);
        this.addThought(ThoughtStage.DECIDE, `${decision.reasoning} Confidence: ${(decision.confidence * 100).toFixed(0)}%`, '💭');
        return decision;
    }
    generateThoughts(holeCards, communityCards, context, decision) {
        return this.getThoughts();
    }
    makeDecision(strength, context, aggressive, bluffing) {
        const toCall = context.toCall;
        const pot = context.pot;
        const bb = context.bigBlind || 20;
        // Almost never fold preflop
        if (context.phase === 'preflop') {
            if (toCall === 0) {
                // Always raise when first in
                const raiseSize = bb * (2 + Math.floor(Math.random() * 4));
                return {
                    action: 'raise',
                    amount: raiseSize,
                    confidence: 0.7 + Math.random() * 0.3,
                    reasoning: 'Raising! They can\'t call everything!'
                };
            }
            // 3-bet or 4-bet frequently
            const willReraise = Math.random() < this.chaosFactor;
            if (willReraise || strength.current > 0.4) {
                const raiseSize = toCall + bb * (2 + Math.floor(Math.random() * 3));
                return {
                    action: 'raise',
                    amount: Math.min(raiseSize, context.pot * 2),
                    confidence: 0.6 + Math.random() * 0.3,
                    reasoning: toCall > bb * 2 ? '4-betting! 🚀' : '3-betting! 💥'
                };
            }
            // Even weak hands call
            return {
                action: 'call',
                confidence: 0.5,
                reasoning: 'I\'ll see a flop. Any two cards!'
            };
        }
        // Postflop - always lean toward aggression
        // Nut hands - huge bets
        if (strength.current > 0.85) {
            const shoveSize = context.pot * 2;
            return {
                action: 'raise',
                amount: shoveSize,
                confidence: 0.95,
                reasoning: 'I have the nuts! ALL THE CHIPS!'
            };
        }
        // Strong hands - big bets
        if (strength.current > 0.65) {
            if (toCall === 0 || aggressive) {
                return {
                    action: 'raise',
                    amount: pot * (0.75 + Math.random() * 0.5),
                    confidence: 0.85,
                    reasoning: 'Big bet with strong hand!'
                };
            }
            return {
                action: 'raise',
                amount: toCall + pot * 0.8,
                confidence: 0.8,
                reasoning: 'Raising big!'
            };
        }
        // Medium hands - lots of aggression
        if (strength.current > 0.35) {
            if (toCall === 0) {
                return {
                    action: 'raise',
                    amount: pot * (0.5 + Math.random() * 0.5),
                    confidence: 0.7,
                    reasoning: aggressive ? 'Applying pressure!' : 'Value betting.'
                };
            }
            // Often raise instead of call
            if (Math.random() < this.chaosFactor && toCall < pot) {
                return {
                    action: 'raise',
                    amount: toCall + pot * 0.75,
                    confidence: 0.6,
                    reasoning: 'I\'m not backing down!'
                };
            }
            return {
                action: 'call',
                confidence: 0.65,
                reasoning: 'Calling down. Might have you beat!'
            };
        }
        // Weak hands - still aggressive!
        if (aggressive || bluffing) {
            if (toCall === 0) {
                return {
                    action: 'raise',
                    amount: pot * (0.5 + Math.random() * 0.4),
                    confidence: 0.5,
                    reasoning: 'Bluffing! They\'ll fold...'
                };
            }
            // Sometimes raise as a bluff
            if (Math.random() < this.bluffFrequency * 0.7 && toCall < pot * 0.6) {
                return {
                    action: 'raise',
                    amount: toCall * (2 + Math.random()),
                    confidence: 0.4,
                    reasoning: 'Huge bluff! Good luck calling...'
                };
            }
        }
        // Even when weak, rarely fold to small bets
        if (toCall < pot * 0.3) {
            return {
                action: 'call',
                confidence: 0.5,
                reasoning: 'Cheap call. I\'m feeling lucky!'
            };
        }
        // The rare fold
        if (strength.current < 0.2 && toCall > pot * 0.7 && Math.random() > this.chaosFactor * 0.5) {
            return {
                action: 'fold',
                confidence: 0.5,
                reasoning: 'Fine, you win this one. For now...'
            };
        }
        // Default to call if not too expensive
        if (toCall < pot * 0.5) {
            return {
                action: 'call',
                confidence: 0.55,
                reasoning: 'I\'ll call. You might be bluffing!'
            };
        }
        // Check if possible
        if (toCall === 0) {
            return {
                action: 'check',
                confidence: 0.6,
                reasoning: 'Checking... plotting my next move 😈'
            };
        }
        // Final option - fold or bluff
        if (Math.random() < this.bluffFrequency) {
            return {
                action: 'raise',
                amount: pot * 1.5,
                confidence: 0.35,
                reasoning: 'ALL IN! You have to have a monster to call this!'
            };
        }
        return {
            action: 'fold',
            confidence: 0.4,
            reasoning: 'Okay okay, I fold. Next hand I\'m taking your chips!'
        };
    }
}
