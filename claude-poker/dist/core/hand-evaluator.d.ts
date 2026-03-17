import { Card, HandRank, EvaluatedHand } from './types.js';
/** Get suit symbol */
export declare function suitSymbol(card: Card): string;
/** Get suit color for display */
export declare function suitColor(card: Card): string;
/** Evaluate the best 5-card hand from 7 cards (2 hole + 5 community) */
export declare function evaluateHand(holeCards: Card[], communityCards?: Card[]): EvaluatedHand;
/** Compare two evaluated hands */
export declare function compareHands(hand1: EvaluatedHand, hand2: EvaluatedHand): number;
/** Get winner from multiple hands */
export declare function determineWinner(players: Array<{
    id: string;
    name: string;
    holeCards: Card[];
}>, communityCards: Card[]): Array<{
    id: string;
    name: string;
    hand: EvaluatedHand;
}>;
/** Get hand rank name */
export declare function getHandName(rank: HandRank): string;
/** Calculate hand strength (0-1) relative to community cards */
export declare function calculateHandStrength(holeCards: Card[], communityCards: Card[]): number;
/** Check for draw potential */
export declare function checkDraw(holeCards: Card[], communityCards: Card[]): {
    hasFlushDraw: boolean;
    hasStraightDraw: boolean;
    hasBackdoorFlush: boolean;
    hasBackdoorStraight: boolean;
    outs: number;
};
/** Format card for display */
export declare function formatCard(card: Card, style?: 'compact' | 'full'): string;
/** Format hand for display */
export declare function formatHand(hand: EvaluatedHand): string;
