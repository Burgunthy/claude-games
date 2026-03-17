import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { ThoughtStage } from '../../core/types.js';
const STAGE_ICONS = {
    [ThoughtStage.PERCEIVE]: '📊',
    [ThoughtStage.ANALYZE]: '🧮',
    [ThoughtStage.DECIDE]: '💭'
};
const STAGE_COLORS = {
    [ThoughtStage.PERCEIVE]: 'cyan',
    [ThoughtStage.ANALYZE]: 'yellow',
    [ThoughtStage.DECIDE]: 'green'
};
export const ThoughtBubble = ({ playerName, thoughts, compact = false }) => {
    if (thoughts.length === 0)
        return null;
    if (compact) {
        const latest = thoughts[thoughts.length - 1];
        return (_jsx(Box, { marginLeft: 2, children: _jsxs(Text, { dimColor: true, children: ["\uD83E\uDD16 ", playerName, ": ", latest.emoji, " ", latest.content] }) }));
    }
    return (_jsxs(Box, { flexDirection: "column", marginTop: 1, paddingX: 2, children: [_jsx(Box, { children: _jsxs(Text, { color: "gray", children: ["\u250C", '─'.repeat(40), "\u2510"] }) }), _jsxs(Box, { children: [_jsx(Text, { color: "gray", children: "\u2502" }), _jsxs(Text, { bold: true, color: "white", children: [" \uD83E\uDD16 ", playerName, " thinks... "] }), _jsxs(Text, { color: "gray", children: [' '.repeat(15), "\u2502"] })] }), _jsx(Box, { children: _jsxs(Text, { color: "gray", children: ["\u251C", '─'.repeat(40), "\u2524"] }) }), thoughts.map((thought, index) => (_jsxs(Box, { children: [_jsx(Text, { color: "gray", children: "\u2502" }), _jsxs(Text, { color: STAGE_COLORS[thought.stage], children: [thought.emoji, " ", thought.content] }), _jsxs(Text, { color: "gray", children: [' '.repeat(Math.max(0, 40 - thought.content.length - 3)), "\u2502"] })] }, index))), _jsx(Box, { children: _jsxs(Text, { color: "gray", children: ["\u2514", '─'.repeat(40), "\u2518"] }) })] }));
};
export const AllThoughts = ({ thoughts, showAll = false, currentPlayerId }) => {
    if (thoughts.size === 0)
        return null;
    return (_jsx(Box, { flexDirection: "column", marginTop: 1, children: Array.from(thoughts.entries()).map(([playerId, playerThoughts]) => {
            // Only show current player's thoughts if not showing all
            if (!showAll && currentPlayerId && playerId !== currentPlayerId) {
                return null;
            }
            return (_jsx(ThoughtBubble, { playerName: playerId, thoughts: playerThoughts, compact: !showAll }, playerId));
        }) }));
};
