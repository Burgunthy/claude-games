import { BaseAI } from '../base.js';
import { Card, Decision, Thought, GameContext } from '../../core/types.js';
export declare class EasyAI extends BaseAI {
    constructor(name?: string);
    decideAction(holeCards: Card[], communityCards: Card[], context: GameContext): Decision;
    generateThoughts(holeCards: Card[], communityCards: Card[], context: GameContext, decision: Decision): Thought[];
    private makeDecision;
    private classifyHand;
    private isPremiumHand;
}
