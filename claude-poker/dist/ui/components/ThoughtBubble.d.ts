import React from 'react';
import { Thought } from '../../core/types.js';
interface ThoughtBubbleProps {
    playerName: string;
    thoughts: Thought[];
    compact?: boolean;
}
export declare const ThoughtBubble: React.FC<ThoughtBubbleProps>;
interface AllThoughtsProps {
    thoughts: Map<string, Thought[]>;
    showAll?: boolean;
    currentPlayerId?: string;
}
export declare const AllThoughts: React.FC<AllThoughtsProps>;
export {};
