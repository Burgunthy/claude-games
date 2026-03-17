import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { formatChips } from '../../core/utils.js';
import { getTheme } from '../themes/index.js';
/**
 * Pot component for displaying the current pot
 */
export function Pot({ amount, theme = 'casino', showAnimation = false }) {
    const themeConfig = getTheme(theme);
    const formattedAmount = formatChips(amount);
    return (_jsxs(Box, { flexDirection: "column", alignItems: "center", borderStyle: "round", borderColor: "yellow", paddingX: 2, paddingY: 1, children: [_jsx(Box, { children: _jsx(Text, { bold: true, color: "yellow", children: "\uD83D\uDCB0 POT" }) }), _jsx(Box, { children: _jsx(Text, { bold: true, color: "yellow", children: formattedAmount }) })] }));
}
/**
 * PotBreakdown component for displaying pot details including side pots
 */
export function PotBreakdown({ mainPot, sidePots = [], theme = 'casino' }) {
    return (_jsxs(Box, { flexDirection: "column", alignItems: "center", children: [_jsx(Pot, { amount: mainPot, theme: theme }), sidePots.length > 0 && (_jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsx(Text, { dim: true, color: "gray", children: "Side Pots:" }), sidePots.map((pot, i) => (_jsxs(Box, { children: [_jsx(Text, { color: "yellow", children: formatChips(pot.amount) }), _jsxs(Text, { dim: true, color: "gray", children: [' ', "(", pot.players.join(', '), ")"] })] }, i)))] }))] }));
}
/**
 * PotWin component for displaying when someone wins the pot
 */
export function PotWin({ amount, winnerName, theme = 'casino' }) {
    return (_jsxs(Box, { flexDirection: "column", alignItems: "center", borderStyle: "double", borderColor: "green", paddingX: 2, paddingY: 1, children: [_jsx(Box, { children: _jsxs(Text, { bold: true, color: "green", children: ["\uD83C\uDF89 ", winnerName, " WINS! \uD83C\uDF89"] }) }), _jsx(Box, { children: _jsxs(Text, { bold: true, color: "yellow", children: ["+", formatChips(amount)] }) })] }));
}
//# sourceMappingURL=Pot.js.map