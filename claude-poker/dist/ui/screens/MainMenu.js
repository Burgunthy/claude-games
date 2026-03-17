import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// Texas Hold'em Poker - Main Menu Screen
// ============================================================================
import { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import figlet from 'figlet';
import { getSubtitle } from '../art/title.js';
/**
 * MainMenu screen component
 */
export function MainMenu({ playerData, onStartGame, onSettings, onStats, onQuit }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [titleArt, setTitleArt] = useState([]);
    const menuItems = [
        { key: 'play', label: '🎮 Play Poker', action: onStartGame },
        { key: 'daily', label: '🎁 Claim Daily Bonus', action: onDailyBonus },
        { key: 'settings', label: '⚙️ Settings', action: onSettings },
        { key: 'stats', label: '📊 Statistics', action: onStats },
        { key: 'quit', label: '🚪 Quit', action: onQuit },
    ];
    // Generate title art on mount
    useEffect(() => {
        const art = figlet.textSync('POKER', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default',
        });
        setTitleArt(art.split('\n'));
    }, []);
    // Handle keyboard input
    useInput((input, key) => {
        if (key.upArrow) {
            setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
        }
        else if (key.downArrow) {
            setSelectedIndex((prev) => (prev + 1) % menuItems.length);
        }
        else if (key.return) {
            menuItems[selectedIndex].action();
        }
        else {
            // Keyboard shortcuts
            const shortcuts = {
                '1': 0,
                '2': 1,
                '3': 2,
                '4': 3,
                '5': 4,
            };
            const index = shortcuts[input];
            if (index !== undefined) {
                menuItems[index].action();
            }
        }
    });
    const onDailyBonus = () => {
        // This will be handled by parent
        console.log('Daily bonus claimed!');
    };
    // Check if can claim daily bonus
    const canClaimDaily = !playerData?.lastBonusClaim ||
        (Date.now() - playerData.lastBonusClaim > 24 * 60 * 60 * 1000);
    return (_jsxs(Box, { flexDirection: "column", alignItems: "center", paddingY: 1, children: [_jsx(Box, { marginBottom: 1, children: titleArt.map((line, i) => (_jsx(Text, { bold: true, color: "yellow", children: line }, i))) }), _jsx(Box, { marginBottom: 2, children: _jsx(Text, { color: "cyan", children: getSubtitle('casino') }) }), playerData && (_jsxs(Box, { marginBottom: 2, borderStyle: "round", borderColor: "gray", paddingX: 2, children: [_jsx(Box, { marginRight: 2, children: _jsxs(Text, { color: "yellow", children: ["\uD83D\uDCB0 ", playerData.totalChips.toLocaleString(), " chips"] }) }), _jsx(Box, { children: _jsxs(Text, { color: "green", children: ["\uD83C\uDFC6 ", playerData.handsWon, " wins"] }) })] })), _jsx(Box, { flexDirection: "column", alignItems: "center", children: menuItems.map((item, index) => (_jsx(Box, { marginY: 0, children: _jsxs(Text, { bold: index === selectedIndex, color: index === selectedIndex ? 'yellow' : 'white', children: [index === selectedIndex ? '▶ ' : '  ', item.label, item.key === 'daily' && canClaimDaily && (_jsx(Text, { color: "green", children: " [Available!]" }))] }) }, item.key))) }), _jsx(Box, { marginTop: 2, children: _jsx(Text, { dim: true, color: "gray", children: "\u2191\u2193 Navigate | Enter Select | 1-5 Quick Select" }) }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { dim: true, color: "gray", children: "v1.0.0" }) })] }));
}
//# sourceMappingURL=MainMenu.js.map