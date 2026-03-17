// ============================================================================
// Texas Hold'em Poker - AI Base Interface
// ============================================================================
import { calculateHandStrength, checkDraw } from '../core/hand-evaluator.js';
import { AI_THRESHOLDS } from '../core/constants.js';
/** Base AI Player */
export class BaseAI {
    config;
    thoughtHistory = [];
    constructor(config) {
        this.config = config;
    }
    /** Get AI configuration */
    getConfig() {
        return this.config;
    }
    /** Get strategy thresholds */
    getThresholds() {
        return AI_THRESHOLDS[this.config.strategy];
    }
    /** Get thought history */
    getThoughts() {
        return [...this.thoughtHistory];
    }
    /** Clear thought history */
    clearThoughts() {
        this.thoughtHistory = [];
    }
    /** Add thought to history */
    addThought(stage, content, emoji) {
        this.thoughtHistory.push({ stage, content, emoji });
        // Keep only recent thoughts (last 10)
        if (this.thoughtHistory.length > 10) {
            this.thoughtHistory = this.thoughtHistory.slice(-10);
        }
    }
    /** Calculate hand strength with position consideration */
    analyzeHand(holeCards, communityCards) {
        const current = calculateHandStrength(holeCards, communityCards);
        const draw = checkDraw(holeCards, communityCards);
        // Adjust potential based on draw type
        let potential = current;
        if (draw.hasFlushDraw || draw.hasStraightDraw) {
            potential = Math.max(0.4, current + 0.25);
        }
        // Backdoor draws add some potential
        if (draw.hasBackdoorFlush || draw.hasBackdoorStraight) {
            potential = Math.max(0.3, current + 0.1);
        }
        return {
            current,
            potential,
            draw: draw.hasFlushDraw || draw.hasStraightDraw,
            drawType: draw.hasFlushDraw && draw.hasStraightDraw ? 'both' :
                draw.hasFlushDraw ? 'flush' :
                    draw.hasStraightDraw ? 'straight' : null
        };
    }
    /** Get position at table */
    getPosition(playerId, dealerIndex, playerCount) {
        const position = (parseInt(playerId.split('-')[1] || '0') - dealerIndex + playerCount) % playerCount;
        if (position <= 2)
            return 'early';
        if (position >= playerCount - 2)
            return 'late';
        return 'middle';
    }
    /** Determine if we should bluff based on strategy */
    shouldBluff(strength, context) {
        const thresholds = this.getThresholds();
        const random = Math.random();
        // Maniacs bluff more often
        if (this.config.strategy === 'maniac' && random < 0.4) {
            return true;
        }
        // Check if pot odds justify bluff
        if (context.potOdds < 0.3 && random < thresholds.bluffFrequency) {
            return true;
        }
        // Semi-bluff with draws
        if (strength.draw && context.phase === 'flop' && random < thresholds.bluffFrequency * 2) {
            return true;
        }
        return false;
    }
    /** Format hand for display */
    formatHand(cards) {
        return cards.map(c => `${c.rank}${c.suit[0]}`).join(' ');
    }
    /** Format position name */
    formatPosition(position) {
        return position.charAt(0).toUpperCase() + position.slice(1);
    }
}
