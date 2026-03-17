import { BaseAI } from '../base.js';
import { Card, Decision, Thought, GameContext } from '../../core/types.js';
export declare class NormalAI extends BaseAI {
    private aggressionFactor;
    private bluffFrequency;
    constructor(name?: string);
    decideAction(holeCards: Card[], communityCards: Card[], context: GameContext): Decision;
    generateThoughts(holeCards: Card[], communityCards: Card[], context: GameContext, decision: Decision): Thought[];
    private makeDecision;
    private handlePreflop;
    private classifyHoleCards;
    private calculateImpliedOdds;
    private calculateBetSize;
    private shouldBluffBasedOnSituation;
    private getDrawOdds;
    private isPremiumHand;
}
