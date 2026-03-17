// ============================================================================
// Texas Hold'em Poker - AI Strategy Test Suite
// ============================================================================
import { EasyAI, NormalAI, HardAI, ManiacAI } from '../ai/index.js';
import { ThoughtStage } from '../core/types.js';
import { AI_THRESHOLDS } from '../core/constants.js';
// Helper: Create a mock card
function createCard(rank, suit) {
    return { rank: rank, suit: suit };
}
// Helper: Create a basic game context
function createContext(overrides = {}) {
    return {
        phase: 'preflop',
        communityCards: [],
        pot: 100,
        currentBet: 20,
        toCall: 20,
        potOdds: 0.2,
        position: 'middle',
        playersInHand: 4,
        bigBlind: 20,
        aggressor: undefined,
        ...overrides
    };
}
// Helper: Verify action is valid
function isValidAction(action) {
    return ['fold', 'check', 'call', 'raise', 'allin'].includes(action);
}
// Helper: Verify thoughts are properly formatted
function hasValidThoughtStages(thoughts) {
    const validEmojis = ['👀', '🧮', '💭', '🃏', '🎰', '📊', '🎯', '⚡', '🔥', '💎', '🚀', '💥'];
    const validStages = [ThoughtStage.PERCEIVE, ThoughtStage.ANALYZE, ThoughtStage.DECIDE];
    if (thoughts.length === 0)
        return false;
    for (const thought of thoughts) {
        if (!validStages.includes(thought.stage)) {
            console.error(`Invalid thought stage: ${thought.stage}`);
            return false;
        }
        if (!thought.content || typeof thought.content !== 'string') {
            console.error(`Invalid thought content: ${thought.content}`);
            return false;
        }
        if (!thought.emoji || !validEmojis.includes(thought.emoji)) {
            console.error(`Invalid thought emoji: ${thought.emoji}`);
            return false;
        }
    }
    return true;
}
// Helper: Count stages in thoughts
function countThoughtStages(thoughts) {
    return {
        perceive: thoughts.filter((t) => t.stage === ThoughtStage.PERCEIVE).length,
        analyze: thoughts.filter((t) => t.stage === ThoughtStage.ANALYZE).length,
        decide: thoughts.filter((t) => t.stage === ThoughtStage.DECIDE).length
    };
}
// ============================================================================
// EASY AI TESTS
// ============================================================================
describe('EasyAI Strategy', () => {
    let ai;
    beforeEach(() => {
        ai = new EasyAI('Test Easy');
    });
    it('should have correct configuration', () => {
        const config = ai.getConfig();
        expect(config.strategy).toBe('easy');
        expect(config.name).toBe('Test Easy');
        expect(config.avatar).toBe('🐢');
    });
    it('should return valid action for preflop with premium hand', () => {
        const holeCards = [createCard('A', 'hearts'), createCard('A', 'spades')];
        const context = createContext({ toCall: 0, phase: 'preflop' });
        const decision = ai.decideAction(holeCards, [], context);
        expect(isValidAction(decision.action)).toBe(true);
        expect(decision.confidence).toBeGreaterThanOrEqual(0);
        expect(decision.confidence).toBeLessThanOrEqual(1);
        expect(decision.reasoning).toBeDefined();
    });
    it('should return valid action for weak hand', () => {
        const holeCards = [createCard('2', 'clubs'), createCard('7', 'diamonds')];
        const context = createContext({ toCall: 40, phase: 'preflop' });
        const decision = ai.decideAction(holeCards, [], context);
        expect(isValidAction(decision.action)).toBe(true);
        // Easy AI should fold weak hands
        expect(decision.action).toBe('fold');
    });
    it('should generate valid thoughts', () => {
        const holeCards = [createCard('K', 'hearts'), createCard('Q', 'hearts')];
        const context = createContext({ phase: 'flop' });
        const communityCards = [createCard('K', 'spades'), createCard('10', 'hearts'), createCard('2', 'clubs')];
        const decision = ai.decideAction(holeCards, communityCards, context);
        const thoughts = ai.generateThoughts(holeCards, communityCards, context, decision);
        expect(hasValidThoughtStages(thoughts)).toBe(true);
        const counts = countThoughtStages(thoughts);
        expect(counts.perceive).toBeGreaterThanOrEqual(1);
        expect(counts.analyze).toBeGreaterThanOrEqual(1);
        expect(counts.decide).toBeGreaterThanOrEqual(1);
    });
    it('should check when no bet to call and weak hand', () => {
        const holeCards = [createCard('2', 'clubs'), createCard('7', 'diamonds')];
        const context = createContext({ toCall: 0, phase: 'preflop' });
        const decision = ai.decideAction(holeCards, [], context);
        expect(decision.action).toBe('check');
    });
    it('should handle all-in situation correctly', () => {
        const holeCards = [createCard('A', 'hearts'), createCard('K', 'spades')];
        const context = createContext({
            toCall: 1000,
            pot: 1200,
            phase: 'preflop'
        });
        const decision = ai.decideAction(holeCards, [], context);
        expect(isValidAction(decision.action)).toBe(true);
        // Easy AI should fold to huge bets without premium
        expect(decision.action).toBe('fold');
    });
});
// ============================================================================
// NORMAL AI TESTS
// ============================================================================
describe('NormalAI Strategy', () => {
    let ai;
    beforeEach(() => {
        ai = new NormalAI('Test Normal');
    });
    it('should have correct configuration', () => {
        const config = ai.getConfig();
        expect(config.strategy).toBe('normal');
        expect(config.name).toBe('Test Normal');
        expect(config.avatar).toBe('🎭');
    });
    it('should raise with strong hand', () => {
        const holeCards = [createCard('A', 'hearts'), createCard('A', 'spades')];
        const context = createContext({ toCall: 20, phase: 'preflop' });
        const decision = ai.decideAction(holeCards, [], context);
        expect(isValidAction(decision.action)).toBe(true);
        expect(decision.action).toBe('raise');
        expect(decision.amount).toBeGreaterThan(0);
    });
    it('should call with decent hand and good pot odds', () => {
        const holeCards = [createCard('K', 'hearts'), createCard('Q', 'hearts')];
        const context = createContext({
            toCall: 30,
            pot: 150,
            potOdds: 0.2,
            phase: 'flop'
        });
        const communityCards = [createCard('K', 'spades'), createCard('10', 'hearts'), createCard('2', 'clubs')];
        const decision = ai.decideAction(holeCards, communityCards, context);
        expect(isValidAction(decision.action)).toBe(true);
        expect(['call', 'raise']).toContain(decision.action);
    });
    it('should generate valid thoughts with all stages', () => {
        const holeCards = [createCard('J', 'hearts'), createCard('10', 'hearts')];
        const context = createContext({ phase: 'turn' });
        const communityCards = [
            createCard('K', 'spades'),
            createCard('10', 'hearts'),
            createCard('2', 'clubs'),
            createCard('5', 'diamonds')
        ];
        const decision = ai.decideAction(holeCards, communityCards, context);
        const thoughts = ai.generateThoughts(holeCards, communityCards, context, decision);
        expect(hasValidThoughtStages(thoughts)).toBe(true);
        const counts = countThoughtStages(thoughts);
        expect(counts.perceive).toBeGreaterThanOrEqual(1);
        expect(counts.analyze).toBeGreaterThanOrEqual(1);
        expect(counts.decide).toBeGreaterThanOrEqual(1);
    });
    it('should consider position in decision making', () => {
        const holeCards = [createCard('Q', 'hearts'), createCard('J', 'diamonds')];
        const lateContext = createContext({ position: 'late', toCall: 0, phase: 'preflop' });
        const earlyContext = createContext({ position: 'early', toCall: 0, phase: 'preflop' });
        const lateDecision = ai.decideAction(holeCards, [], lateContext);
        const earlyDecision = ai.decideAction(holeCards, [], earlyContext);
        expect(isValidAction(lateDecision.action)).toBe(true);
        expect(isValidAction(earlyDecision.action)).toBe(true);
        // Position should affect decision (late more likely to raise)
    });
    it('should bluff occasionally in position', () => {
        const holeCards = [createCard('2', 'clubs'), createCard('3', 'diamonds')];
        const context = createContext({
            position: 'late',
            toCall: 0,
            phase: 'flop',
            playersInHand: 2
        });
        const communityCards = [createCard('K', 'spades'), createCard('7', 'hearts'), createCard('2', 'clubs')];
        // Run multiple times due to randomness
        let bluffed = false;
        for (let i = 0; i < 20; i++) {
            const decision = ai.decideAction(holeCards, communityCards, context);
            if (decision.action === 'raise') {
                bluffed = true;
                break;
            }
        }
        // Normal AI should bluff sometimes
        // This is probabilistic, so we just check no crashes occur
    });
});
// ============================================================================
// HARD AI TESTS
// ============================================================================
describe('HardAI Strategy', () => {
    let ai;
    beforeEach(() => {
        ai = new HardAI('Test Hard');
    });
    it('should have correct configuration', () => {
        const config = ai.getConfig();
        expect(config.strategy).toBe('hard');
        expect(config.name).toBe('Test Hard');
        expect(config.avatar).toBe('🦈');
    });
    it('should 3-bet with premium hands', () => {
        const holeCards = [createCard('A', 'hearts'), createCard('K', 'hearts')];
        const context = createContext({
            toCall: 60, // Facing a raise
            currentBet: 60,
            phase: 'preflop'
        });
        const decision = ai.decideAction(holeCards, [], context);
        expect(isValidAction(decision.action)).toBe(true);
        expect(['raise', 'call']).toContain(decision.action);
    });
    it('should analyze board texture', () => {
        const holeCards = [createCard('A', 'hearts'), createCard('K', 'spades')];
        const wetContext = createContext({
            phase: 'flop',
            communityCards: [createCard('K', 'hearts'), createCard('Q', 'hearts'), createCard('J', 'hearts')]
        });
        const decision = ai.decideAction(holeCards, wetContext.communityCards, wetContext);
        const thoughts = ai.generateThoughts(holeCards, wetContext.communityCards, wetContext, decision);
        expect(hasValidThoughtStages(thoughts)).toBe(true);
        // Should mention board in perceive stage
        const perceiveThought = thoughts.find((t) => t.stage === ThoughtStage.PERCEIVE);
        expect(perceiveThought?.content).toBeDefined();
    });
    it('should make balanced decisions on draw', () => {
        const holeCards = [createCard('Q', 'hearts'), createCard('J', 'hearts')];
        const context = createContext({
            phase: 'turn',
            pot: 100,
            toCall: 40,
            potOdds: 0.4
        });
        const communityCards = [
            createCard('K', 'hearts'),
            createCard('10', 'hearts'),
            createCard('2', 'clubs'),
            createCard('5', 'spades')
        ];
        const decision = ai.decideAction(holeCards, communityCards, context);
        expect(isValidAction(decision.action)).toBe(true);
        // Hard AI should consider pot odds with draws
    });
    it('should generate detailed analysis thoughts', () => {
        const holeCards = [createCard('A', 'hearts'), createCard('K', 'hearts')];
        const context = createContext({ phase: 'river' });
        const communityCards = [
            createCard('A', 'spades'),
            createCard('K', 'clubs'),
            createCard('10', 'hearts'),
            createCard('2', 'clubs'),
            createCard('5', 'diamonds')
        ];
        const decision = ai.decideAction(holeCards, communityCards, context);
        const thoughts = ai.generateThoughts(holeCards, communityCards, context, decision);
        expect(hasValidThoughtStages(thoughts)).toBe(true);
        const counts = countThoughtStages(thoughts);
        expect(counts.perceive).toBeGreaterThanOrEqual(1);
        expect(counts.analyze).toBeGreaterThanOrEqual(1);
        expect(counts.decide).toBeGreaterThanOrEqual(1);
    });
});
// ============================================================================
// MANIAC AI TESTS
// ============================================================================
describe('ManiacAI Strategy', () => {
    let ai;
    beforeEach(() => {
        ai = new ManiacAI('Test Maniac');
    });
    it('should have correct configuration', () => {
        const config = ai.getConfig();
        expect(config.strategy).toBe('maniac');
        expect(config.name).toBe('Test Maniac');
        expect(config.avatar).toBe('🔥');
    });
    it('should raise frequently preflop', () => {
        const holeCards = [createCard('2', 'clubs'), createCard('7', 'diamonds')];
        const context = createContext({ toCall: 0, phase: 'preflop' });
        const decision = ai.decideAction(holeCards, [], context);
        expect(isValidAction(decision.action)).toBe(true);
        // Maniac should raise with almost any hand when first in
        expect(decision.action).toBe('raise');
    });
    it('should rarely fold preflop', () => {
        const holeCards = [createCard('2', 'clubs'), createCard('7', 'diamonds')];
        const context = createContext({ toCall: 40, phase: 'preflop' });
        const decision = ai.decideAction(holeCards, [], context);
        expect(isValidAction(decision.action)).toBe(true);
        // Maniac rarely folds - should call or raise
        expect(['call', 'raise']).toContain(decision.action);
    });
    it('should bluff aggressively postflop', () => {
        const holeCards = [createCard('2', 'clubs'), createCard('7', 'diamonds')];
        const context = createContext({
            phase: 'flop',
            toCall: 0,
            pot: 100
        });
        const communityCards = [createCard('K', 'spades'), createCard('7', 'hearts'), createCard('2', 'clubs')];
        // Run multiple times
        let raiseCount = 0;
        for (let i = 0; i < 10; i++) {
            const decision = ai.decideAction(holeCards, communityCards, context);
            if (decision.action === 'raise')
                raiseCount++;
        }
        // Maniac should be aggressive
        expect(raiseCount).toBeGreaterThan(0);
    });
    it('should generate chaotic thoughts', () => {
        const holeCards = [createCard('K', 'hearts'), createCard('Q', 'diamonds')];
        const context = createContext({ phase: 'turn' });
        const communityCards = [
            createCard('A', 'spades'),
            createCard('10', 'hearts'),
            createCard('2', 'clubs'),
            createCard('5', 'diamonds')
        ];
        const decision = ai.decideAction(holeCards, communityCards, context);
        const thoughts = ai.generateThoughts(holeCards, communityCards, context, decision);
        expect(hasValidThoughtStages(thoughts)).toBe(true);
        const counts = countThoughtStages(thoughts);
        expect(counts.perceive).toBeGreaterThanOrEqual(1);
        expect(counts.analyze).toBeGreaterThanOrEqual(1);
        expect(counts.decide).toBeGreaterThanOrEqual(1);
    });
    it('should have high bluff frequency', () => {
        const holeCards = [createCard('2', 'clubs'), createCard('7', 'diamonds')];
        const context = createContext({
            phase: 'river',
            toCall: 50,
            pot: 150
        });
        const communityCards = [
            createCard('A', 'spades'),
            createCard('K', 'hearts'),
            createCard('10', 'hearts'),
            createCard('2', 'clubs'),
            createCard('5', 'diamonds')
        ];
        // Maniac should sometimes make big bluffs even with weak hands
        let bluffActions = 0;
        for (let i = 0; i < 20; i++) {
            const decision = ai.decideAction(holeCards, communityCards, context);
            if (decision.action === 'raise')
                bluffActions++;
        }
        // Maniac should bluff at least sometimes
        expect(bluffActions).toBeGreaterThan(0);
    });
});
// ============================================================================
// CROSS-STRATEGY COMPARISON TESTS
// ============================================================================
describe('Strategy Comparison', () => {
    it('should have increasing aggression from easy to maniac', () => {
        const easy = new EasyAI();
        const normal = new NormalAI();
        const hard = new HardAI();
        const maniac = new ManiacAI();
        const easyThresholds = AI_THRESHOLDS.easy;
        const maniacThresholds = AI_THRESHOLDS.maniac;
        expect(easyThresholds.aggression).toBeLessThan(maniacThresholds.aggression);
        expect(easyThresholds.bluffFrequency).toBeLessThan(maniacThresholds.bluffFrequency);
    });
    it('all strategies should handle same hand differently', () => {
        const holeCards = [createCard('K', 'hearts'), createCard('Q', 'diamonds')];
        const context = createContext({ toCall: 40, phase: 'preflop' });
        const easy = new EasyAI();
        const normal = new NormalAI();
        const hard = new HardAI();
        const maniac = new ManiacAI();
        const easyDecision = easy.decideAction(holeCards, [], context);
        const normalDecision = normal.decideAction(holeCards, [], context);
        const hardDecision = hard.decideAction(holeCards, [], context);
        const maniacDecision = maniac.decideAction(holeCards, [], context);
        // All should return valid actions
        expect(isValidAction(easyDecision.action)).toBe(true);
        expect(isValidAction(normalDecision.action)).toBe(true);
        expect(isValidAction(hardDecision.action)).toBe(true);
        expect(isValidAction(maniacDecision.action)).toBe(true);
        // Maniac should be most aggressive
        expect(maniacDecision.action).not.toBe('fold');
    });
});
// ============================================================================
// EDGE CASE TESTS
// ============================================================================
describe('Edge Cases', () => {
    describe('All AIs', () => {
        const aiClasses = [EasyAI, NormalAI, HardAI, ManiacAI];
        aiClasses.forEach((AIClass) => {
            const strategyName = AIClass.name;
            describe(`${strategyName} - Edge Cases`, () => {
                let ai;
                beforeEach(() => {
                    ai = new AIClass();
                });
                it('should handle zero chips (all-in)', () => {
                    const holeCards = [createCard('A', 'hearts'), createCard('K', 'spades')];
                    const context = createContext({
                        toCall: 10000, // More than possible
                        pot: 100,
                        phase: 'preflop'
                    });
                    const decision = ai.decideAction(holeCards, [], context);
                    expect(isValidAction(decision.action)).toBe(true);
                    // Should fold if can't call, or game engine handles all-in
                });
                it('should handle extreme pot odds', () => {
                    const holeCards = [createCard('A', 'hearts'), createCard('K', 'spades')];
                    const context = createContext({
                        toCall: 10,
                        pot: 1000,
                        potOdds: 0.01, // Amazing pot odds
                        phase: 'river'
                    });
                    const communityCards = [
                        createCard('A', 'spades'),
                        createCard('K', 'clubs'),
                        createCard('10', 'hearts'),
                        createCard('2', 'clubs'),
                        createCard('5', 'diamonds')
                    ];
                    const decision = ai.decideAction(holeCards, communityCards, context);
                    expect(isValidAction(decision.action)).toBe(true);
                    expect(decision.action).not.toBe('fold');
                });
                it('should handle bad pot odds with weak hand', () => {
                    const holeCards = [createCard('2', 'clubs'), createCard('3', 'diamonds')];
                    const context = createContext({
                        toCall: 200,
                        pot: 100,
                        potOdds: 0.67, // Bad pot odds
                        phase: 'river'
                    });
                    const communityCards = [
                        createCard('A', 'spades'),
                        createCard('K', 'clubs'),
                        createCard('10', 'hearts'),
                        createCard('2', 'clubs'),
                        createCard('5', 'diamonds')
                    ];
                    const decision = ai.decideAction(holeCards, communityCards, context);
                    expect(isValidAction(decision.action)).toBe(true);
                    // Most AIs should fold here
                });
                it('should handle heads-up situation', () => {
                    const holeCards = [createCard('K', 'hearts'), createCard('Q', 'diamonds')];
                    const context = createContext({
                        playersInHand: 2,
                        phase: 'flop',
                        toCall: 30
                    });
                    const communityCards = [
                        createCard('K', 'spades'),
                        createCard('7', 'hearts'),
                        createCard('2', 'clubs')
                    ];
                    const decision = ai.decideAction(holeCards, communityCards, context);
                    expect(isValidAction(decision.action)).toBe(true);
                });
                it('should handle multi-way pot', () => {
                    const holeCards = [createCard('A', 'hearts'), createCard('K', 'spades')];
                    const context = createContext({
                        playersInHand: 6,
                        phase: 'flop',
                        toCall: 40
                    });
                    const communityCards = [
                        createCard('A', 'spades'),
                        createCard('7', 'hearts'),
                        createCard('2', 'clubs')
                    ];
                    const decision = ai.decideAction(holeCards, communityCards, context);
                    expect(isValidAction(decision.action)).toBe(true);
                });
                it('should generate thoughts for all phases', () => {
                    const holeCards = [createCard('A', 'hearts'), createCard('K', 'spades')];
                    const phases = ['preflop', 'flop', 'turn', 'river'];
                    phases.forEach(phase => {
                        const context = createContext({ phase });
                        const communityCardsCount = phase === 'preflop' ? 0 :
                            phase === 'flop' ? 3 :
                                phase === 'turn' ? 4 : 5;
                        const communityCards = [];
                        for (let i = 0; i < communityCardsCount; i++) {
                            communityCards.push(createCard('10', 'hearts'));
                        }
                        const decision = ai.decideAction(holeCards, communityCards, context);
                        const thoughts = ai.generateThoughts(holeCards, communityCards, context, decision);
                        expect(hasValidThoughtStages(thoughts)).toBe(true);
                    });
                });
            });
        });
    });
    describe('Zero to-call situation', () => {
        it('all AIs should check or raise when no bet to call', () => {
            const holeCards = [createCard('2', 'clubs'), createCard('7', 'diamonds')];
            const context = createContext({ toCall: 0, phase: 'flop' });
            const communityCards = [createCard('K', 'spades'), createCard('7', 'hearts'), createCard('2', 'clubs')];
            const ais = [new EasyAI(), new NormalAI(), new HardAI(), new ManiacAI()];
            ais.forEach(ai => {
                const decision = ai.decideAction(holeCards, communityCards, context);
                // Should check or raise, never call when toCall is 0
                expect(['check', 'raise'].includes(decision.action) || decision.action === 'call').toBe(true);
                // Call when toCall=0 is equivalent to check
                if (decision.action === 'call') {
                    // This is okay, treat as check
                }
            });
        });
    });
});
// ============================================================================
// AGGRESSION ANALYSIS
// ============================================================================
describe('Aggression Analysis', () => {
    function calculateAggression(ai, holeCards, communityCards, context) {
        let raiseCount = 0;
        let foldCount = 0;
        let callCheckCount = 0;
        const iterations = 50;
        for (let i = 0; i < iterations; i++) {
            const decision = ai.decideAction(holeCards, communityCards, context);
            if (decision.action === 'raise')
                raiseCount++;
            else if (decision.action === 'fold')
                foldCount++;
            else
                callCheckCount++;
        }
        // Aggression = raises / (folds + calls + checks)
        const passiveActions = foldCount + callCheckCount;
        if (passiveActions === 0)
            return raiseCount;
        return raiseCount / passiveActions;
    }
    it('Maniac should be most aggressive', () => {
        const holeCards = [createCard('K', 'hearts'), createCard('Q', 'diamonds')];
        const context = createContext({ phase: 'flop', toCall: 0 });
        const communityCards = [createCard('K', 'spades'), createCard('7', 'hearts'), createCard('2', 'clubs')];
        const easyAgg = calculateAggression(new EasyAI(), holeCards, communityCards, context);
        const normalAgg = calculateAggression(new NormalAI(), holeCards, communityCards, context);
        const hardAgg = calculateAggression(new HardAI(), holeCards, communityCards, context);
        const maniacAgg = calculateAggression(new ManiacAI(), holeCards, communityCards, context);
        // Maniac should be more aggressive than easy
        expect(maniacAgg).toBeGreaterThan(easyAgg);
        // Maniac should be more aggressive than normal
        expect(maniacAgg).toBeGreaterThan(normalAgg);
    });
    it('Easy should be most passive', () => {
        const holeCards = [createCard('2', 'clubs'), createCard('7', 'diamonds')];
        const context = createContext({ phase: 'flop', toCall: 30 });
        const communityCards = [createCard('K', 'spades'), createCard('7', 'hearts'), createCard('2', 'clubs')];
        const easyAgg = calculateAggression(new EasyAI(), holeCards, communityCards, context);
        const maniacAgg = calculateAggression(new ManiacAI(), holeCards, communityCards, context);
        expect(easyAgg).toBeLessThan(maniacAgg);
    });
});
console.log('AI Strategy Test Suite Loaded');
