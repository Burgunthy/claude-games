// ============================================================================
// Texas Hold'em Poker - Dynamic Difficulty System
// ============================================================================
import { EasyAI } from './strategies/easy.js';
import { NormalAI } from './strategies/normal.js';
import { HardAI } from './strategies/hard.js';
/** Dynamic difficulty manager */
export class DynamicDifficulty {
    currentDifficulty;
    humanWinRate = 0.5;
    handsPlayed = 0;
    handsWon = 0;
    // Difficulty adjustment thresholds
    INCREASE_THRESHOLD = 0.6; // Win rate to increase difficulty
    DECREASE_THRESHOLD = 0.4; // Win rate to decrease difficulty
    MIN_HANDS_FOR_ADJUSTMENT = 5;
    constructor(initialDifficulty = 'normal') {
        this.currentDifficulty = initialDifficulty;
    }
    /** Get current difficulty */
    getDifficulty() {
        return this.currentDifficulty;
    }
    /** Record hand result */
    recordHandResult(humanWon) {
        this.handsPlayed++;
        if (humanWon) {
            this.handsWon++;
        }
        this.humanWinRate = this.handsWon / this.handsPlayed;
        this.adjustDifficulty();
    }
    /** Adjust difficulty based on performance */
    adjustDifficulty() {
        if (this.handsPlayed < this.MIN_HANDS_FOR_ADJUSTMENT) {
            return;
        }
        if (this.humanWinRate >= this.INCREASE_THRESHOLD) {
            this.increaseDifficulty();
        }
        else if (this.humanWinRate <= this.DECREASE_THRESHOLD) {
            this.decreaseDifficulty();
        }
    }
    /** Increase difficulty */
    increaseDifficulty() {
        if (this.currentDifficulty === 'easy') {
            this.currentDifficulty = 'normal';
            console.log('📈 Difficulty increased to Normal!');
        }
        else if (this.currentDifficulty === 'normal') {
            this.currentDifficulty = 'hard';
            console.log('📈 Difficulty increased to Hard!');
        }
    }
    /** Decrease difficulty */
    decreaseDifficulty() {
        if (this.currentDifficulty === 'hard') {
            this.currentDifficulty = 'normal';
            console.log('📉 Difficulty decreased to Normal');
        }
        else if (this.currentDifficulty === 'normal') {
            this.currentDifficulty = 'easy';
            console.log('📉 Difficulty decreased to Easy');
        }
    }
    /** Create AI player with current difficulty */
    createAIPlayer(id, name) {
        switch (this.currentDifficulty) {
            case 'easy':
                return new EasyAI(id, name);
            case 'normal':
                return new NormalAI(id, name);
            case 'hard':
                return new HardAI(id, name);
            default:
                return new NormalAI(id, name);
        }
    }
    /** Get statistics */
    getStats() {
        return {
            difficulty: this.currentDifficulty,
            winRate: this.humanWinRate,
            handsPlayed: this.handsPlayed,
        };
    }
    /** Reset statistics */
    reset() {
        this.handsPlayed = 0;
        this.handsWon = 0;
        this.humanWinRate = 0.5;
    }
    /** Set difficulty manually */
    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
    }
}
/** Create AI player based on difficulty */
export function createAIPlayer(id, name, difficulty) {
    switch (difficulty) {
        case 'easy':
            return new EasyAI(id, name);
        case 'normal':
            return new NormalAI(id, name);
        case 'hard':
            return new HardAI(id, name);
        default:
            return new NormalAI(id, name);
    }
}
//# sourceMappingURL=dynamic-difficulty.js.map