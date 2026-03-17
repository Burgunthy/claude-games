import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
export const ActionButtons = ({ canCheck, canCall, canRaise, minRaise, maxRaise, toCall }) => {
    const formatAmount = (amount) => {
        if (amount >= 1000000)
            return `${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000)
            return `${(amount / 1000).toFixed(1)}K`;
        return amount.toString();
    };
    return (_jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsxs(Box, { justifyContent: "center", children: [_jsx(Text, { bold: true, color: "white", children: "Controls: " }), _jsx(Text, { color: "red", children: "[F]old" }), _jsx(Text, { children: " " }), _jsxs(Text, { color: canCheck ? 'yellow' : 'blue', children: ["[", canCheck ? 'C' : 'C', "]", canCheck ? 'heck' : 'all'] }), _jsx(Text, { children: " " }), _jsx(Text, { color: "green", children: "[R]aise" }), _jsx(Text, { children: " " }), _jsx(Text, { color: "magenta", children: "[A]ll-In" }), _jsx(Text, { dimColor: true, children: " | [Q]uit" })] }), canRaise && (_jsx(Box, { justifyContent: "center", children: _jsxs(Text, { dimColor: true, children: ["Raise: ", formatAmount(minRaise), " - ", formatAmount(maxRaise)] }) })), canCall && toCall > 0 && (_jsx(Box, { justifyContent: "center", children: _jsxs(Text, { dimColor: true, children: ["To call: ", _jsx(Text, { color: "blue", children: formatAmount(toCall) })] }) }))] }));
};
