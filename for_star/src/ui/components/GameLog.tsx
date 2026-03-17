// ============================================================================
// Texas Hold'em Poker - Game Log Component
// ============================================================================

import React from 'react';
import { Box, Text } from 'ink';

interface LogEntry {
  timestamp: number;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface GameLogProps {
  entries: LogEntry[];
  maxEntries?: number;
}

export const GameLog: React.FC<GameLogProps> = ({
  entries,
  maxEntries = 5
}) => {
  const recentEntries = entries.slice(-maxEntries);

  if (recentEntries.length === 0) return null;

  const getEntryColor = (type?: string) => {
    switch (type) {
      case 'success': return 'green';
      case 'warning': return 'yellow';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Box marginBottom={1}>
        <Text bold color="gray">Recent Events:</Text>
      </Box>
      {recentEntries.map((entry, index) => (
        <Box key={index}>
          <Text dimColor color={getEntryColor(entry.type)}>
            {'> '}{entry.message}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

/** Hook to manage game log */
export function useGameLog(maxEntries: number = 50) {
  const [entries, setEntries] = React.useState<LogEntry[]>([]);

  const addEntry = React.useCallback((
    message: string,
    type?: 'info' | 'success' | 'warning' | 'error'
  ) => {
    const entry: LogEntry = {
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
    addInfo: (message: string) => addEntry(message, 'info'),
    addSuccess: (message: string) => addEntry(message, 'success'),
    addWarning: (message: string) => addEntry(message, 'warning'),
    addError: (message: string) => addEntry(message, 'error'),
    clear
  };
}
