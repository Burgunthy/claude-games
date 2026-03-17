import { DifficultyLevel } from '../../core/types.js';
/** AI player interface */
export interface AIPlayer {
    readonly id: string;
    readonly name: string;
    readonly isHuman: false;
    getAction(gameState: any, availableActions: any[]): any;
    updateState(state: any): void;
    reset(): void;
}
/** Dynamic difficulty manager */
export declare class DynamicDifficulty {
    private currentDifficulty;
    private humanWinRate;
    private handsPlayed;
    private handsWon;
    private readonly INCREASE_THRESHOLD;
    private readonly DECREASE_THRESHOLD;
    private readonly MIN_HANDS_FOR_ADJUSTMENT;
    constructor(initialDifficulty?: DifficultyLevel);
    /** Get current difficulty */
    getDifficulty(): DifficultyLevel;
    /** Record hand result */
    recordHandResult(humanWon: boolean): void;
    /** Adjust difficulty based on performance */
    private adjustDifficulty;
    /** Increase difficulty */
    private increaseDifficulty;
    /** Decrease difficulty */
    private decreaseDifficulty;
    /** Create AI player with current difficulty */
    createAIPlayer(id: string, name: string): AIPlayer;
    /** Get statistics */
    getStats(): {
        difficulty: DifficultyLevel;
        winRate: number;
        handsPlayed: number;
    };
    /** Reset statistics */
    reset(): void;
    /** Set difficulty manually */
    setDifficulty(difficulty: DifficultyLevel): void;
}
/** Create AI player based on difficulty */
export declare function createAIPlayer(id: string, name: string, difficulty: DifficultyLevel): AIPlayer;
//# sourceMappingURL=dynamic-difficulty.d.ts.map