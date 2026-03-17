// ============================================================================
// Texas Hold'em Poker - Action Buttons Component
// ============================================================================

import React from 'react';
import { Box, Text } from 'ink';

interface ActionButtonsProps {
  canCheck: boolean;
  canCall: boolean;
  canRaise: boolean;
  minRaise: number;
  maxRaise: number;
  toCall: number;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  canCheck,
  canCall,
  canRaise,
  minRaise,
  maxRaise,
  toCall
}) => {
  const formatAmount = (amount: number): string => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box justifyContent="center">
        <Text bold color="white">Controls: </Text>
        <Text color="red">[F]old</Text>
        <Text> </Text>
        <Text color={canCheck ? 'yellow' : 'blue'}>
          [{canCheck ? 'C' : 'C'}]{canCheck ? 'heck' : 'all'}
        </Text>
        <Text> </Text>
        <Text color="green">[R]aise</Text>
        <Text> </Text>
        <Text color="magenta">[A]ll-In</Text>
        <Text dimColor> | [Q]uit</Text>
      </Box>

      {canRaise && (
        <Box justifyContent="center">
          <Text dimColor>
            Raise: {formatAmount(minRaise)} - {formatAmount(maxRaise)}
          </Text>
        </Box>
      )}

      {canCall && toCall > 0 && (
        <Box justifyContent="center">
          <Text dimColor>
            To call: <Text color="blue">{formatAmount(toCall)}</Text>
          </Text>
        </Box>
      )}
    </Box>
  );
};
