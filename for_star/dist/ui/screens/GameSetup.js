import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// Texas Hold'em Poker - Game Setup Screen
// ============================================================================
import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { DEFAULT_CONFIG } from '../../core/types.js';
/**
 * GameSetup screen for configuring game settings
 */
export function GameSetup({ onComplete, onBack }) {
    const [config, setConfig] = useState({
        playerCount: DEFAULT_CONFIG.playerCount,
        difficulty: DEFAULT_CONFIG.difficulty,
        theme: DEFAULT_CONFIG.theme,
        startingChips: DEFAULT_CONFIG.startingChips,
    });
    const [currentField, setCurrentField] = useState('players');
    const [editing, setEditing] = useState(false);
    const fields = ['players', 'difficulty', 'theme', 'chips'];
    const playerOptions = [2, 3, 4, 5, 6];
    const difficultyOptions = ['easy', 'normal', 'hard'];
    const themeOptions = ['casino', 'modern', 'retro'];
    const chipOptions = [500, 1000, 2000, 5000, 10000];
    // Handle keyboard input
    useInput((input, key) => {
        if (key.escape) {
            onBack();
            return;
        }
        const fieldIndex = fields.indexOf(currentField);
        if (key.upArrow && !editing) {
            const prevIndex = (fieldIndex - 1 + fields.length) % fields.length;
            setCurrentField(fields[prevIndex]);
        }
        else if (key.downArrow && !editing) {
            const nextIndex = (fieldIndex + 1) % fields.length;
            setCurrentField(fields[nextIndex]);
        }
        else if (key.return || key.rightArrow) {
            if (currentField === 'start') {
                onComplete(config);
            }
            else {
                setEditing(!editing);
            }
        }
        else if (key.leftArrow && editing) {
            adjustValue(-1);
        }
        else if (key.rightArrow && editing) {
            adjustValue(1);
        }
    });
    const adjustValue = (direction) => {
        switch (currentField) {
            case 'players':
                const playerIdx = playerOptions.indexOf(config.playerCount || DEFAULT_CONFIG.playerCount);
                const newPlayerIdx = (playerIdx + direction + playerOptions.length) % playerOptions.length;
                setConfig({ ...config, playerCount: playerOptions[newPlayerIdx] });
                break;
            case 'difficulty':
                const diffIdx = difficultyOptions.indexOf(config.difficulty || DEFAULT_CONFIG.difficulty);
                const newDiffIdx = (diffIdx + direction + difficultyOptions.length) % difficultyOptions.length;
                setConfig({ ...config, difficulty: difficultyOptions[newDiffIdx] });
                break;
            case 'theme':
                const themeIdx = themeOptions.indexOf(config.theme || DEFAULT_CONFIG.theme);
                const newThemeIdx = (themeIdx + direction + themeOptions.length) % themeOptions.length;
                setConfig({ ...config, theme: themeOptions[newThemeIdx] });
                break;
            case 'chips':
                const chipIdx = chipOptions.indexOf(config.startingChips || DEFAULT_CONFIG.startingChips);
                const newChipIdx = (chipIdx + direction + chipOptions.length) % chipOptions.length;
                setConfig({ ...config, startingChips: chipOptions[newChipIdx] });
                break;
        }
    };
    const getDifficultyEmoji = (diff) => {
        switch (diff) {
            case 'easy': return '🌱';
            case 'normal': return '⚡';
            case 'hard': return '🔥';
        }
    };
    const getThemeEmoji = (theme) => {
        switch (theme) {
            case 'casino': return '🎰';
            case 'modern': return '💎';
            case 'retro': return '👾';
        }
    };
    return (_jsxs(Box, { flexDirection: "column", alignItems: "center", paddingY: 1, children: [_jsx(Box, { marginBottom: 2, children: _jsx(Text, { bold: true, color: "yellow", children: "\u2550\u2550\u2550 GAME SETUP \u2550\u2550\u2550" }) }), _jsxs(Box, { flexDirection: "column", width: 50, children: [_jsxs(Box, { borderStyle: currentField === 'players' ? 'bold' : 'single', borderColor: currentField === 'players' ? 'yellow' : 'gray', paddingX: 1, marginBottom: 1, children: [_jsxs(Box, { justifyContent: "space-between", children: [_jsx(Text, { bold: currentField === 'players', color: "white", children: "Players" }), _jsxs(Text, { color: "cyan", children: [config.playerCount, " players"] })] }), editing && currentField === 'players' && (_jsx(Box, { children: _jsxs(Text, { dim: true, color: "gray", children: ["\u25C4 ", playerOptions.join(' | '), " \u25BA"] }) }))] }), _jsxs(Box, { borderStyle: currentField === 'difficulty' ? 'bold' : 'single', borderColor: currentField === 'difficulty' ? 'yellow' : 'gray', paddingX: 1, marginBottom: 1, children: [_jsxs(Box, { justifyContent: "space-between", children: [_jsx(Text, { bold: currentField === 'difficulty', color: "white", children: "Difficulty" }), _jsxs(Text, { color: "cyan", children: [getDifficultyEmoji(config.difficulty || DEFAULT_CONFIG.difficulty), ' ', (config.difficulty || DEFAULT_CONFIG.difficulty).toUpperCase()] })] }), editing && currentField === 'difficulty' && (_jsx(Box, { children: _jsxs(Text, { dim: true, color: "gray", children: ["\u25C4 ", difficultyOptions.join(' | '), " \u25BA"] }) }))] }), _jsxs(Box, { borderStyle: currentField === 'theme' ? 'bold' : 'single', borderColor: currentField === 'theme' ? 'yellow' : 'gray', paddingX: 1, marginBottom: 1, children: [_jsxs(Box, { justifyContent: "space-between", children: [_jsx(Text, { bold: currentField === 'theme', color: "white", children: "Theme" }), _jsxs(Text, { color: "cyan", children: [getThemeEmoji(config.theme || DEFAULT_CONFIG.theme), ' ', (config.theme || DEFAULT_CONFIG.theme).toUpperCase()] })] }), editing && currentField === 'theme' && (_jsx(Box, { children: _jsxs(Text, { dim: true, color: "gray", children: ["\u25C4 ", themeOptions.join(' | '), " \u25BA"] }) }))] }), _jsxs(Box, { borderStyle: currentField === 'chips' ? 'bold' : 'single', borderColor: currentField === 'chips' ? 'yellow' : 'gray', paddingX: 1, marginBottom: 1, children: [_jsxs(Box, { justifyContent: "space-between", children: [_jsx(Text, { bold: currentField === 'chips', color: "white", children: "Starting Chips" }), _jsxs(Text, { color: "cyan", children: ["\uD83D\uDCB0 ", (config.startingChips || DEFAULT_CONFIG.startingChips).toLocaleString()] })] }), editing && currentField === 'chips' && (_jsx(Box, { children: _jsxs(Text, { dim: true, color: "gray", children: ["\u25C4 ", chipOptions.map(c => c.toLocaleString()).join(' | '), " \u25BA"] }) }))] }), _jsx(Box, { borderStyle: "bold", borderColor: "green", paddingX: 1, marginTop: 1, children: _jsx(Text, { bold: true, color: "green", children: "\u25B6 START GAME" }) })] }), _jsx(Box, { marginTop: 2, children: _jsx(Text, { dim: true, color: "gray", children: "\u2191\u2193 Navigate | Enter/\u2192 Edit | \u2190\u2192 Adjust | Esc Back" }) })] }));
}
//# sourceMappingURL=GameSetup.js.map