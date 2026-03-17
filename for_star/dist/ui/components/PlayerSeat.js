import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import chalk from 'chalk';
import { ActionType } from '../../core/types.js';
import { CardRow } from './Card.js';
import { formatChips } from '../../core/utils.js';
import { getTheme } from '../themes/index.js';
/**
 * PlayerSeat component for displaying a player at the table
 */
export function PlayerSeat({ player, theme = 'casino', isCurrentPlayer = false, showCards = false, position = 'bottom', }) {
    const themeConfig = getTheme(theme);
    const isHuman = player.isHuman;
    // Determine player status display
    const getStatusDisplay = () => {
        if (player.folded)
            return 'FOLDED';
        if (player.isAllIn)
            return 'ALL-IN';
        if (player.chips <= 0)
            return 'ELIMINATED';
        return '';
    };
    // Get action display
    const getActionDisplay = () => {
        if (!player.lastAction)
            return '';
        switch (player.lastAction.type) {
            case ActionType.Fold:
                return 'FOLD';
            case ActionType.Check:
                return 'CHECK';
            case ActionType.Call:
                return 'CALL';
            case ActionType.Raise:
                return `RAISE ${formatChips(player.lastAction.amount || 0)}`;
            case ActionType.AllIn:
                return 'ALL-IN';
            default:
                return '';
        }
    };
    const status = getStatusDisplay();
    const action = getActionDisplay();
    // Player name with styling
    const nameDisplay = isHuman
        ? chalk.bold.cyan(player.name)
        : chalk.white(player.name);
    // Chips display
    const chipsDisplay = formatChips(player.chips);
    // Current player indicator
    const indicator = isCurrentPlayer ? ' ◀' : '';
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: isCurrentPlayer ? 'yellow' : player.folded ? 'gray' : 'green', paddingX: 1, children: [_jsx(Box, { children: _jsxs(Text, { bold: isCurrentPlayer, color: player.folded ? 'gray' : 'white', children: [nameDisplay, player.chips <= 0 && ' (OUT)', indicator] }) }), _jsx(Box, { children: _jsxs(Text, { color: "yellow", children: ["\uD83D\uDCB0 ", chipsDisplay] }) }), player.bet > 0 && (_jsx(Box, { children: _jsxs(Text, { color: "cyan", children: ["Bet: ", formatChips(player.bet)] }) })), player.cards.length > 0 && !player.folded && (_jsx(Box, { marginTop: 1, children: _jsx(CardRow, { cards: player.cards, hidden: !showCards && !player.showCards, theme: theme, mini: true }) })), player.handName && showCards && (_jsx(Box, { children: _jsx(Text, { bold: true, color: "green", children: player.handName }) })), action && (_jsx(Box, { children: _jsxs(Text, { color: "yellow", children: ["\u2192 ", action] }) })), status && (_jsx(Box, { children: _jsxs(Text, { color: player.folded ? 'red' : 'yellow', children: ["[", status, "]"] }) }))] }));
}
/**
 * PlayerSeats component for displaying all players around the table
 */
export function PlayerSeats({ players, theme = 'casino', currentPlayerIndex, showCards = false, humanPlayerId = 'human', }) {
    // Layout players around the table
    const totalPlayers = players.length;
    const positions = getPlayerPositions(totalPlayers);
    return (_jsx(Box, { flexDirection: "column", alignItems: "center", children: players.map((player, index) => (_jsx(Box, { marginBottom: 1, children: _jsx(PlayerSeat, { player: player, theme: theme, isCurrentPlayer: index === currentPlayerIndex, showCards: showCards || player.id === humanPlayerId, position: positions[index] }) }, player.id))) }));
}
/** Get position labels for N players */
function getPlayerPositions(total) {
    switch (total) {
        case 2:
            return ['bottom', 'top'];
        case 3:
            return ['bottom', 'left', 'right'];
        case 4:
            return ['bottom', 'left', 'top', 'right'];
        case 5:
            return ['bottom', 'left', 'top-left', 'top-right', 'right'];
        case 6:
            return ['bottom', 'left', 'top-left', 'top', 'top-right', 'right'];
        default:
            return Array(total).fill('bottom');
    }
}
//# sourceMappingURL=PlayerSeat.js.map