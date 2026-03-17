import { GameState, Action } from './types.js';
/** Poker Game Engine */
export declare class PokerGame {
    private state;
    private listeners;
    constructor(playerCount?: number, startingChips?: number);
    /** Subscribe to events */
    on(event: string, callback: Function): void;
    /** Emit event */
    private emit;
    /** Get current state */
    getState(): GameState;
    /** Start new hand */
    startHand(): void;
    /** Post blinds */
    private postBlinds;
    /** Deal community cards */
    private dealCommunity;
    /** Process action */
    processAction(action: Action): boolean;
    /** Move to next player */
    private nextPlayer;
    /** Advance to next phase */
    private advancePhase;
    /** Determine winner */
    private determineWinner;
}
