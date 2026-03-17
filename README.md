# 🎰 Claude Games

> Terminal games built for Claude Code - Play directly in your terminal with AI-powered features

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen)](https://nodejs.org)

## 🃏 Claude Poker

A fully-featured Texas Hold'em Poker game with AI opponents, playable directly in Claude Code.

### Features

- 🤖 **AI vs AI Mode** - Watch AI players battle it out with visible thoughts
- 💭 **Transparent AI** - See exactly what the AI is thinking in real-time
- 🎨 **3 Beautiful Themes** - Casino, Modern, and Retro visual styles
- 🏆 **Ranking System** - Progress from Rookie to Legend
- 💰 **Daily Bonus** - Claim free chips every day
- 🌍 **Multi-language** - English, Korean, and Japanese support
- ⚡ **4 AI Difficulties** - Easy, Normal, Hard, and Maniac

## 🚀 Quick Start (Claude Code)

If you're using Claude Code, simply run:

```
/claude-games:claude-poker
```

That's it! The game will start automatically.

## 📦 Installation

### Option 1: Clone and Play (Recommended for Claude Code)

```bash
git clone https://github.com/Burgunthy/claude-games.git
cd claude-games
npm install
```

Then use in Claude Code:
```
/claude-games:claude-poker
```

### Option 2: Global CLI

```bash
npm install -g ./claude-poker
poker
```

### Option 3: npx (No installation)

```bash
npx claude-poker
```

## 🎮 Controls

| Key | Action |
|-----|--------|
| `1` | New Game |
| `2` | AI vs AI Mode |
| `F` | Fold |
| `C` | Check/Call |
| `R` | Raise |
| `A` | All-In |
| `T` | Toggle AI Thoughts |
| `Q` | Quit/Return to Menu |

## 🎯 Hand Rankings

1. **Royal Flush** - A, K, Q, J, 10 of the same suit
2. **Straight Flush** - Five consecutive cards of the same suit
3. **Four of a Kind** - Four cards of the same rank
4. **Full House** - Three of a kind + a pair
5. **Flush** - Five cards of the same suit
6. **Straight** - Five consecutive cards
7. **Three of a Kind** - Three cards of the same rank
8. **Two Pair** - Two different pairs
9. **One Pair** - Two cards of the same rank
10. **High Card** - Highest card wins

## 🤖 AI Strategies

| Difficulty | Style |
|------------|-------|
| 🐢 Easy | Plays only premium hands, never bluffs |
| 🎭 Normal | Balanced play, position-aware, 15-20% bluff |
| 🦈 Hard | GTO-inspired, range-based, 25-30% bluff |
| 🔥 Maniac | Extremely aggressive (70%+), unpredictable |

## 📸 Screenshots

### Casino Theme
Classic casino feel with gold, green, and dark red accents

### AI vs AI Mode
Watch AIs battle with visible thoughts - see the decision-making process in real-time!

### Retro Theme
8-bit terminal style with green-on-black nostalgia

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/Burgunthy/claude-games.git
cd claude-games

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📁 Project Structure

```
claude-games/
├── claude-poker/          # Texas Hold'em Poker game
│   ├── src/
│   │   ├── cli.tsx       # Entry point
│   │   ├── core/         # Game engine
│   │   ├── ai/           # AI system
│   │   ├── ui/           # React/Ink UI components
│   │   ├── storage/      # Data persistence
│   │   ├── i18n/         # Translations
│   │   └── ranking/      # XP & Tiers
│   └── tests/            # Test suite
└── skill/                # Claude Code skills
    └── claude-poker.md   # Skill definition
```

## 🌐 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📜 License

MIT © [Burgunthy](https://github.com/Burgunthy)

## 🙏 Acknowledgments

- Built with [Ink](https://github.com/vadimdemedes/ink) - React for CLI
- AI strategies based on GTO principles
- Inspired by online poker platforms

---

⭐ **Star us on GitHub** if you enjoy the games!

Made with ❤️ by [Burgunthy](https://github.com/Burgunthy)
