import { EventEmitter } from 'events';
import { Player, GameState, Action, EvaluatedHand, PotResult } from './types.js';
/** Game configuration */
export interface GameConfig {
    playerCount: number;
    startingChips: number;
    smallBlind: number;
    bigBlind: number;
    aiOnly?: boolean;
    aiDifficulty?: 'easy' | 'normal' | 'hard' | 'maniac';
    autoPlayDelay?: number;
}
/** Hand result */
export interface HandResult {
    winners: Array<{
        id: string;
        name: string;
        hand: EvaluatedHand;
        amount: number;
    }>;
    pot: number;
    showDown: boolean;
}
/** Poker Game Engine */
export declare class PokerEngine extends EventEmitter {
    private state;
    private config;
    private handHistory;
    private potResult;
    private currentHandPlayerCount;
    constructor(config: GameConfig);
    /** Create players for the game */
    private createPlayers;
    /** Get current game state */
    getState(): Readonly<GameState>;
    /** Get current configuration */
    getConfig(): Readonly<GameConfig>;
    /** Get pot calculation result */
    getPotResult(): PotResult | null;
    /** Start a new hand */
    startNewHand(): void;
    /** Find next active player from index */
    private findNextActivePlayer;
    /** Post blinds */
    private postBlinds;
    /** Update pot calculation with side pots */
    private updatePotCalculation;
    /** Deal community cards */
    private dealCommunityCards;
    /** Process a player action */
    processAction(action: Action): boolean;
    /** Fold action */
    private actionFold;
    /** Check action */
    private actionCheck;
    /** Call action */
    private actionCall;
    /** Raise action */
    private actionRaise;
    /** All-in action */
    private actionAllIn;
    /** Move to next player */
    private moveToNextPlayer;
    /** Check if betting round is complete */
    private checkRoundComplete;
    /** Advance to next phase */
    private advancePhase;
    /** End hand early (everyone else folded) */
    private endHandEarly;
    /** Run showdown */
    private runShowdown;
    /** Emit game over event */
    private emitGameOver;
    /** Get current player */
    getCurrentPlayer(): Player | null;
    /** Get human player */
    getHumanPlayer(): Player | null;
    /** Get active players (not folded) */
    getActivePlayers(): Player[];
    /** Check if human player's turn */
    isHumanTurn(): boolean;
    /** Get hand history */
    getHandHistory(): HandResult[];
    /** Get game summary */
    getGameSummary(): {
        handsPlayed: number;
        players: Array<{
            name: string;
            chips: number;
        }>;
    };
}
