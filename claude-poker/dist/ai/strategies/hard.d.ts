import { BaseAI } from '../base.js';
import { Card, Decision, Thought, GameContext } from '../../core/types.js';
export declare class HardAI extends BaseAI {
    private rangeTightness;
    private aggressionFactor;
    private bluffFrequency;
    private opponentAggression;
    constructor(name?: string);
    decideAction(holeCards: Card[], communityCards: Card[], context: GameContext): Decision;
    generateThoughts(holeCards: Card[], communityCards: Card[], context: GameContext, decision: Decision): Thought[];
    private deepAnalyze;
    private makeDecision;
    private handlePreflop;
    private analyzeBoardTexture;
    private shouldBluffBasedOnSituation;
    private calculateBetSize;
    private assessRangeAdvantage;
    private getDrawEquity;
    private classifyHand;
    private classifyHoleCards;
}
