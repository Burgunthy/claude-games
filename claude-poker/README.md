# 🎰 Claude Poker

> A fancy Texas Hold'em Poker CLI game with AI vs AI mode and visible AI thoughts

[![npm version](https://badge.fury.io/js/claude-poker.svg)](https://www.npmjs.org/package/claude-poker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen)](https://nodejs.org)

## Features

- 🤖 **AI vs AI Mode** - Watch AI players battle it out
- 💭 **Visible AI Thoughts** - See what the AI is thinking in real-time
- 🎨 **3 Beautiful Themes** - Casino, Modern, and Retro visual styles
- 🏆 **Ranking System** - Progress from Rookie to Legend
- 💰 **Daily Bonus** - Claim free chips every day
- 🌍 **Multi-language** - English, Korean, and Japanese support
- ⚡ **4 AI Difficulties** - Easy, Normal, Hard, and Maniac
- 🃏 **Full Hand Evaluation** - Royal Flush to High Card
- 🎮 **Side Pot Support** - Proper all-in handling

## Screenshots

### Casino Theme
*Classic casino feel with gold, green, and dark red*

### AI vs AI Mode
*Watch AIs battle with visible thoughts*

### Retro Theme
*8-bit terminal style with green-on-black*

## Installation

```bash
# Install globally
npm install -g claude-poker

# Or use npx
npx claude-poker
```

## Quick Start

```bash
# Run the game
poker

# Or via npx
npx claude-poker
```

## Controls

| Key | Action |
|-----|--------|
| `1` | New Game |
| `2` | AI vs AI Mode |
| `F` | Fold |
| `C` | Check/Call |
| `R` | Raise |
| `A` | All-In |
| `T` | Toggle AI Thoughts |
| `H` | Show All Thoughts (AI mode) |
| `1/2/3` | Set Speed (AI mode) |
| `SPACE` | Pause/Resume (AI mode) |
| `Q` | Quit/Return to Menu |

## Game Rules

### Blinds
- Small Blind: 10 chips
- Big Blind: 20 chips

### Hand Rankings (Highest to Lowest)
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

### Tiers & XP
- **Rookie** (0-999 XP) - 1000 starting chips
- **Amateur** (1000-4999 XP) - 1500 starting chips
- **Pro** (5000-14999 XP) - 2500 starting chips
- **Shark** (15000-49999 XP) - 4000 starting chips
- **Legend** (50000+ XP) - 6000 starting chips

## AI Strategies

### Easy 🐢
- Plays only premium hands
- Never bluffs
- Folds often to aggression

### Normal 🎭
- Balanced play
- Position-aware decisions
- 15-20% bluff frequency
- Basic pot odds calculation

### Hard 🦈
- GTO-inspired strategy
- Range-based thinking
- Board texture analysis
- 25-30% bluff frequency
- Semi-bluffs with draws

### Maniac 🔥
- Extremely aggressive (70%+)
- Random bluffs
- Unpredictable play
- Creates chaos at the table

## AI Thoughts System

The AI shows its thinking process in three stages:

1. **📊 Perceive** - What the AI sees (cards, position, pot)
2. **🧮 Analyze** - Hand strength, pot odds, draws
3. **💭 Decide** - The chosen action with reasoning

```
🤖 Alice thinks...
┌──────────────────────────────────────┐
│ 📊 Perceive: I have K♥Q♥, Board shows A♥7♥2♣ │
│ 🧮 Analyze: Flush draw (35%), weak pair │
│ 💭 Decide: Call - pot odds justify draw │
└──────────────────────────────────────┘
```

## Themes

### Casino 🎰
- Gold and green colors
- Detailed Unicode card art
- Fancy double borders

### Modern ⬡
- Cyan and white minimal design
- Clean ASCII cards
- Fast animations

### Retro 👾
- Green-on-black terminal style
- Block character cards
- No animations

## Data Storage

Game data is stored in `~/.claude-games/claude-poker/`:

```
~/.claude-games/claude-poker/
├── player.json      # Progress, chips, tier, XP
├── settings.json    # Theme, language, difficulty
└── history.json     # Game history
```

## Development

```bash
# Clone the repository
git clone https://github.com/anthropics/claude-poker.git
cd claude-poker

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
claude-poker/
├── src/
│   ├── cli.tsx              # Entry point
│   ├── core/                # Game engine
│   │   ├── types.ts         # TypeScript types
│   │   ├── engine.ts        # Poker game engine
│   │   ├── hand-evaluator.ts # Hand ranking
│   │   ├── pot-calculator.ts # Side pots
│   │   ├── deck.ts          # Deck operations
│   │   └── constants.ts     # Game constants
│   ├── ai/                  # AI system
│   │   ├── base.ts          # Base AI interface
│   │   ├── strategies/      # AI strategies
│   │   └── thoughts.ts      # Thought display
│   ├── ui/                  # React/Ink UI
│   │   ├── components/      # UI components
│   │   ├── screens/         # Game screens
│   │   ├── themes/          # Visual themes
│   │   └── art/             # ASCII art
│   ├── storage/             # Data persistence
│   ├── i18n/                # Translations
│   └── ranking/             # XP & Tiers
└── tests/                   # Test suite
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Claude](https://github.com/anthropics)

## Acknowledgments

- Built with [Ink](https://github.com/vadimdemedes/ink) - React for CLI
- Inspired by online poker platforms
- AI strategies based on GTO principles

---

Made with ❤️ by [Claude](https://claude.ai)
