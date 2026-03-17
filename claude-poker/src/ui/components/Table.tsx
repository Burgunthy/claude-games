// ============================================================================
// Texas Hold'em Poker - Table Component
// ============================================================================

import React from 'react';
import { Box, Text } from 'ink';
import { Card, Player, GamePhase } from '../../core/types.js';
import { renderCompactCard, getCardColor } from '../art/cards.js';

interface TableProps {
  players: Player[];
  communityCards: Card[];
  pot: number;
  phase: GamePhase;
  currentPlayerIndex: number;
  dealerIndex: number;
  showCards?: boolean; // For AI vs AI mode
}

export const Table: React.FC<TableProps> = ({
  players,
  communityCards,
  pot,
  phase,
  currentPlayerIndex,
  dealerIndex,
  showCards = false
}) => {
  const formatChips = (amount: number): string => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  const renderPlayer = (player: Player, index: number) => {
    const isCurrent = index === currentPlayerIndex;
    const isDealer = index === dealerIndex;
    const isHuman = player.isHuman;
    const isActive = !player.folded && player.chips >= 0;

    // Determine card display
    let cardDisplay = '';
    if (isHuman || showCards || player.isAllIn) {
      cardDisplay = player.cards.map(c => renderCompactCard(c)).join(' ');
    } else if (player.cards.length > 0) {
      cardDisplay = '## ##';
    }

    return (
      <Box key={player.id} marginBottom={isActive ? 1 : 0}>
        <Box>
          <Text
            bold={isCurrent}
            color={isDealer ? 'yellow' : isHuman ? 'cyan' : isActive ? 'white' : 'gray'}
          >
            {isDealer ? '♪ ' : '  '}
            {player.name}
            {isCurrent && ' ◀'}
            {player.folded && ' [FOLDED]'}
            {player.isAllIn && ' [ALL-IN]'}
          </Text>
        </Box>
        <Box marginLeft={2}>
          <Text dimColor={!isActive}>
            Chips: {formatChips(player.chips)}
            {player.bet > 0 && ` | Bet: ${formatChips(player.bet)}`}
          </Text>
        </Box>
        {cardDisplay && (
          <Box marginLeft={2}>
            <Text
              color={player.cards.length > 0 ? getCardColor(player.cards[0]) : 'white'}
            >
              {cardDisplay}
            </Text>
          </Box>
        )}
      </Box>
    );
  };

  const renderCommunityCards = () => {
    if (communityCards.length === 0) {
      return (
        <Box>
          <Text dimColor>No community cards</Text>
        </Box>
      );
    }

    return (
      <Box>
        {communityCards.map((card, i) => (
          <Text key={i} color={getCardColor(card)}>
            {' '}{renderCompactCard(card)}
          </Text>
        ))}
      </Box>
    );
  };

  return (
    <Box flexDirection="column" padding={1}>
      {/* Phase and Pot */}
      <Box justifyContent="center" marginBottom={1}>
        <Text bold color="yellow">
          {phase.toUpperCase()} - Pot: <Text color="green">{formatChips(pot)}</Text>
        </Text>
      </Box>

      {/* Community Cards */}
      <Box justifyContent="center" marginBottom={1}>
        <Text color="white">Board:</Text>
        {renderCommunityCards()}
      </Box>

      {/* Separator */}
      <Box marginBottom={1}>
        <Text dimColor>──────────────────────────────────</Text>
      </Box>

      {/* Players */}
      <Box flexDirection="column">
        {players.map((player, i) => renderPlayer(player, i))}
      </Box>
    </Box>
  );
};
