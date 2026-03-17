import { Card, Decision, Thought, ThoughtStage, GameContext, HandStrength, AIStrategyType } from '../core/types.js';
/** AI Player Configuration */
export interface AIConfig {
    strategy: AIStrategyType;
    name: string;
    avatar: string;
    personality?: string;
}
/** Base AI Player */
export declare abstract class BaseAI {
    protected config: AIConfig;
    protected thoughtHistory: Thought[];
    constructor(config: AIConfig);
    /** Get AI configuration */
    getConfig(): AIConfig;
    /** Get strategy thresholds */
    protected getThresholds(): {
        aggression: number;
        bluffFrequency: number;
        foldThreshold: number;
        callThreshold: number;
        raiseThreshold: number;
    };
    /** Main decision method - to be implemented by strategies */
    abstract decideAction(holeCards: Card[], communityCards: Card[], context: GameContext): Decision;
    /** Generate thoughts for the decision */
    abstract generateThoughts(holeCards: Card[], communityCards: Card[], context: GameContext, decision: Decision): Thought[];
    /** Get thought history */
    getThoughts(): Thought[];
    /** Clear thought history */
    clearThoughts(): void;
    /** Add thought to history */
    protected addThought(stage: ThoughtStage, content: string, emoji: string): void;
    /** Calculate hand strength with position consideration */
    protected analyzeHand(holeCards: Card[], communityCards: Card[]): HandStrength;
    /** Get position at table */
    protected getPosition(playerId: string, dealerIndex: number, playerCount: number): 'early' | 'middle' | 'late';
    /** Determine if we should bluff based on strategy */
    protected shouldBluff(strength: HandStrength, context: GameContext): boolean;
    /** Format hand for display */
    protected formatHand(cards: Card[]): string;
    /** Format position name */
    protected formatPosition(position: 'early' | 'middle' | 'late'): string;
}
