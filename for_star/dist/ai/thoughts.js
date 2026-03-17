// ============================================================================
// Texas Hold'em Poker - AI Thoughts Display System
// ============================================================================
import { ThoughtStage } from '../core/types.js';
/** Format a single thought for display */
export function formatThought(thought, compact = false) {
    const stageEmoji = {
        [ThoughtStage.PERCEIVE]: '📊',
        [ThoughtStage.ANALYZE]: '🧮',
        [ThoughtStage.DECIDE]: '💭'
    };
    if (compact) {
        return `${thought.emoji} ${thought.content}`;
    }
    const stageLabel = {
        [ThoughtStage.PERCEIVE]: 'Perceive',
        [ThoughtStage.ANALYZE]: 'Analyze',
        [ThoughtStage.DECIDE]: 'Decide'
    };
    return `${stageEmoji[thought.stage]} ${stageLabel[thought.stage]}: ${thought.content}`;
}
/** Format all thoughts from a player */
export function formatThoughts(thoughts, showStages = true) {
    if (thoughts.length === 0) {
        return ['No thoughts available.'];
    }
    const lines = [];
    for (const thought of thoughts) {
        lines.push(formatThought(thought, !showStages));
    }
    return lines;
}
/** Create a thought bubble display */
export function createThoughtBubble(playerName, thoughts, width = 40) {
    const lines = [];
    // Header
    lines.push('┌' + '─'.repeat(width - 2) + '┐');
    lines.push('│ ' + `🤖 ${playerName} thinks...`.padEnd(width - 3) + '│');
    lines.push('├' + '─'.repeat(width - 2) + '┤');
    // Thoughts
    for (const thought of thoughts) {
        const content = `${thought.emoji} ${thought.content}`;
        const wrapped = wrapText(content, width - 4);
        for (const line of wrapped) {
            lines.push('│ ' + line.padEnd(width - 4) + ' │');
        }
    }
    // Footer
    lines.push('└' + '─'.repeat(width - 2) + '┘');
    return lines.join('\n');
}
/** Simple text wrapper */
function wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
        if (currentLine.length + word.length + 1 <= maxWidth) {
            currentLine += (currentLine ? ' ' : '') + word;
        }
        else {
            if (currentLine) {
                lines.push(currentLine);
            }
            currentLine = word;
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines;
}
/** Format thoughts for compact UI (single line) */
export function formatThoughtsCompact(thoughts) {
    if (thoughts.length === 0)
        return '';
    const latest = thoughts[thoughts.length - 1];
    return `${latest.emoji} ${latest.content}`;
}
/** Get thought color based on stage */
export function getThoughtStageColor(stage) {
    switch (stage) {
        case ThoughtStage.PERCEIVE:
            return 'cyan';
        case ThoughtStage.ANALYZE:
            return 'yellow';
        case ThoughtStage.DECIDE:
            return 'green';
    }
}
/** Create a scrolling thought history display */
export class ThoughtHistory {
    history = new Map();
    maxSize = 20;
    add(playerId, thought) {
        if (!this.history.has(playerId)) {
            this.history.set(playerId, []);
        }
        const playerThoughts = this.history.get(playerId);
        playerThoughts.push(thought);
        // Keep only recent thoughts
        if (playerThoughts.length > this.maxSize) {
            playerThoughts.shift();
        }
    }
    get(playerId) {
        return this.history.get(playerId) || [];
    }
    getAll() {
        return new Map(this.history);
    }
    clear(playerId) {
        if (playerId) {
            this.history.delete(playerId);
        }
        else {
            this.history.clear();
        }
    }
    getLatest(playerId, count = 3) {
        const thoughts = this.get(playerId);
        return thoughts.slice(-count);
    }
}
