import { Thought, ThoughtStage } from '../core/types.js';
/** Format a single thought for display */
export declare function formatThought(thought: Thought, compact?: boolean): string;
/** Format all thoughts from a player */
export declare function formatThoughts(thoughts: Thought[], showStages?: boolean): string[];
/** Create a thought bubble display */
export declare function createThoughtBubble(playerName: string, thoughts: Thought[], width?: number): string;
/** Format thoughts for compact UI (single line) */
export declare function formatThoughtsCompact(thoughts: Thought[]): string;
/** Get thought color based on stage */
export declare function getThoughtStageColor(stage: ThoughtStage): string;
/** Create a scrolling thought history display */
export declare class ThoughtHistory {
    private history;
    private maxSize;
    add(playerId: string, thought: Thought): void;
    get(playerId: string): Thought[];
    getAll(): Map<string, Thought[]>;
    clear(playerId?: string): void;
    getLatest(playerId: string, count?: number): Thought[];
}
