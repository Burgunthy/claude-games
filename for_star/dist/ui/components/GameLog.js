import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// Texas Hold'em Poker - Game Log Component
// ============================================================================
import React from 'react';
import { Box, Text } from 'ink';
export const GameLog = ({ entries, maxEntries = 5 }) => {
    const recentEntries = entries.slice(-maxEntries);
    if (recentEntries.length === 0)
        return null;
    const getEntryColor = (type) => {
        switch (type) {
            case 'success': return 'green';
            case 'warning': return 'yellow';
            case 'error': return 'red';
            default: return 'gray';
        }
    };
    return (_jsxs(Box, { flexDirection: "column", marginTop: 1, paddingX: 1, children: [_jsx(Box, { marginBottom: 1, children: _jsx(Text, { bold: true, color: "gray", children: "Recent Events:" }) }), recentEntries.map((entry, index) => (_jsx(Box, { children: _jsxs(Text, { dimColor: true, color: getEntryColor(entry.type), children: ['> ', entry.message] }) }, index)))] }));
};
/** Hook to manage game log */
export function useGameLog(maxEntries = 50) {
    const [entries, setEntries] = React.useState([]);
    const addEntry = React.useCallback((message, type) => {
        const entry = {
            timestamp: Date.now(),
            message,
            type
        };
        setEntries(prev => {
            const updated = [...prev, entry];
            return updated.slice(-maxEntries);
        });
    }, [maxEntries]);
    const clear = React.useCallback(() => {
        setEntries([]);
    }, []);
    return {
        entries,
        addEntry,
        addInfo: (message) => addEntry(message, 'info'),
        addSuccess: (message) => addEntry(message, 'success'),
        addWarning: (message) => addEntry(message, 'warning'),
        addError: (message) => addEntry(message, 'error'),
        clear
    };
}
