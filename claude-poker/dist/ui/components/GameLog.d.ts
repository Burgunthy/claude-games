import React from 'react';
interface LogEntry {
    timestamp: number;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
}
interface GameLogProps {
    entries: LogEntry[];
    maxEntries?: number;
}
export declare const GameLog: React.FC<GameLogProps>;
/** Hook to manage game log */
export declare function useGameLog(maxEntries?: number): {
    entries: LogEntry[];
    addEntry: (message: string, type?: "info" | "success" | "warning" | "error") => void;
    addInfo: (message: string) => void;
    addSuccess: (message: string) => void;
    addWarning: (message: string) => void;
    addError: (message: string) => void;
    clear: () => void;
};
export {};
