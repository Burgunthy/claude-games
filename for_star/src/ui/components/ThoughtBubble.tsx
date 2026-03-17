// ============================================================================
// Texas Hold'em Poker - Thought Bubble Component
// ============================================================================

import React from 'react';
import { Box, Text } from 'ink';
import { Thought } from '../../core/types.js';
import { ThoughtStage } from '../../core/types.js';

interface ThoughtBubbleProps {
  playerName: string;
  thoughts: Thought[];
  compact?: boolean;
}

const STAGE_ICONS: Record<ThoughtStage, string> = {
  [ThoughtStage.PERCEIVE]: '📊',
  [ThoughtStage.ANALYZE]: '🧮',
  [ThoughtStage.DECIDE]: '💭'
};

const STAGE_COLORS: Record<ThoughtStage, string> = {
  [ThoughtStage.PERCEIVE]: 'cyan',
  [ThoughtStage.ANALYZE]: 'yellow',
  [ThoughtStage.DECIDE]: 'green'
};

export const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({
  playerName,
  thoughts,
  compact = false
}) => {
  if (thoughts.length === 0) return null;

  if (compact) {
    const latest = thoughts[thoughts.length - 1];
    return (
      <Box marginLeft={2}>
        <Text dimColor>
          🤖 {playerName}: {latest.emoji} {latest.content}
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1} paddingX={2}>
      <Box>
        <Text color="gray">┌{'─'.repeat(40)}┐</Text>
      </Box>
      <Box>
        <Text color="gray">│</Text>
        <Text bold color="white"> 🤖 {playerName} thinks... </Text>
        <Text color="gray">{' '.repeat(15)}│</Text>
      </Box>
      <Box>
        <Text color="gray">├{'─'.repeat(40)}┤</Text>
      </Box>

      {thoughts.map((thought, index) => (
        <Box key={index}>
          <Text color="gray">│</Text>
          <Text color={STAGE_COLORS[thought.stage]}>
            {thought.emoji} {thought.content}
          </Text>
          <Text color="gray">{' '.repeat(Math.max(0, 40 - thought.content.length - 3))}│</Text>
        </Box>
      ))}

      <Box>
        <Text color="gray">└{'─'.repeat(40)}┘</Text>
      </Box>
    </Box>
  );
};

interface AllThoughtsProps {
  thoughts: Map<string, Thought[]>;
  showAll?: boolean;
  currentPlayerId?: string;
}

export const AllThoughts: React.FC<AllThoughtsProps> = ({
  thoughts,
  showAll = false,
  currentPlayerId
}) => {
  if (thoughts.size === 0) return null;

  return (
    <Box flexDirection="column" marginTop={1}>
      {Array.from(thoughts.entries()).map(([playerId, playerThoughts]) => {
        // Only show current player's thoughts if not showing all
        if (!showAll && currentPlayerId && playerId !== currentPlayerId) {
          return null;
        }

        return (
          <ThoughtBubble
            key={playerId}
            playerName={playerId}
            thoughts={playerThoughts}
            compact={!showAll}
          />
        );
      })}
    </Box>
  );
};
