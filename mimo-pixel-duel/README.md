# Pixel Duel ⚔️

> **BETA 0.0.9 — Still in Development**

**AI-Powered Card Battle Game** — A pixel art card battle game inspired by Yu-Gi-Oh, built for the [Xiaomi MiMo 100T Token Creator Incentive Program](https://100t.xiaomimimo.com/).

![Powered by MiMo](https://img.shields.io/badge/Powered%20by-Xiaomi%20MiMo%20AI-orange)
![Version](https://img.shields.io/badge/Version-0.0.9--beta-blue)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

## 🎮 Live Demo

**Play Now:** [https://mimo-pixel-duel-eopbmhoe.devinapps.com](https://mimo-pixel-duel-eopbmhoe.devinapps.com)

## 📖 About

Pixel Duel is a web-based card battle game with retro pixel art aesthetics. Every card features **true 8x8 pixel art** characters rendered with CSS grids. It features:

- **52 playable cards** (34 Monsters, 10 Spells, 8 Traps)
- **True pixel art graphics** — Each card has a unique 8x8 pixel character (knights, wizards, dragons, golems, etc.)
- **Fantasy-themed characters**: Knights, Wizards, Sorcerers, Dragons, Assassins, Paladins, and more
- **Turn-based duel system** with Draw → Main → Battle → End phases
- **AI Opponent** with 3 difficulty levels (Easy / Normal / Hard)
- **Xiaomi MiMo API integration** for enhanced AI decision-making
- **Pixel art retro style** with neon colors, scanlines, and glitch effects
- **Battle animations**: Slash effects, explosion particles, impact flash, screen shake
- **Sound effects** (8-bit style via Web Audio API)
- **Deck Builder** — Choose 20 cards from 52 available

## 🕹️ How to Play

1. Click **START DUEL** to begin a battle
2. Select a card from your hand → Click **SUMMON** (or **SET** for face-down)
3. Click **BATTLE** to enter Battle Phase → Select your monster → Click enemy monster to attack
4. Click **END TURN** when done
5. Reduce opponent's LP to 0 to win!

### Game Mechanics

- **Normal Summon**: Place 1 monster per turn (Level 1-4 are free)
- **Tribute Summon**: Level 5-6 require 1 tribute, Level 7+ require 2 tributes
- **Spell Cards**: Instant effects (heal, damage, boost, draw)
- **Trap Cards**: Set face-down, activate on opponent's turn
- **Battle**: ATK vs ATK (or ATK vs DEF if in defense mode)

## 🛠️ Tech Stack

- **HTML5** — Game structure with multiple screen views
- **CSS3** — Pure CSS pixel art styling, animations, retro effects
- **Vanilla JavaScript** — Complete game engine, AI system, no frameworks
- **CSS Grid Pixel Art** — True 8x8 pixel art rendered via CSS grids with 16-color palette
- **Web Audio API** — 8-bit sound effects
- **Xiaomi MiMo API** — Optional AI integration for smarter opponent

## 📂 Project Structure

```
pixel-duel/
├── index.html      # Main HTML with all game screens
├── styles.css      # Pixel art styling & animations
├── cards.js        # Card database (52 cards) + pixel art data & renderer
├── game.js         # Game engine, AI, battle system
└── README.md       # This file
```

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/pixel-duel.git
cd pixel-duel

# Start a local server (any of these work)
python3 -m http.server 8080
# or
npx serve .
# or just open index.html in your browser
```

Then open `http://localhost:8080` in your browser.

## 🤖 MiMo AI Integration

This game supports Xiaomi MiMo API for AI-powered opponent decisions:

1. Get your API key from [platform.xiaomimimo.com](https://platform.xiaomimimo.com)
2. Go to **Settings** in the game
3. Enter your API key
4. The AI opponent will now make smarter strategic decisions

## 🎨 Features

### Cards
| Type | Count | Examples |
|------|-------|---------|
| Monster | 34 | Dragon Knight, Silver Paladin, Arcane Wizard, Death Knight, Demon King |
| Spell | 10 | Holy Heal, Meteor Strike, Lightning Bolt, Berserker Rage |
| Trap | 8 | Counter Strike, Frozen Trap, Divine Shield, Last Stand |

### Pixel Art System
Each card features a unique 8x8 pixel art character using a 16-color palette:
- Monsters: Distinct silhouettes for each character type (dragons, knights, wizards, golems, etc.)
- Spells: Iconic symbols (swords, meteors, scrolls, lightning bolts)
- Traps: Recognizable icons (shields, crystals, castles, crossed swords)

### AI Difficulty
- **Easy**: Random plays, doesn't optimize attacks
- **Normal**: Basic strategy, some spell usage
- **Hard**: Optimal plays, tribute summons big monsters, uses combos

### Visual Effects
- Summon animation with spark burst
- Attack slash with neon trails
- Destroy animation with 12-particle explosion
- Direct attack energy beam
- Screen shake on impact
- Floating damage numbers

## 📋 Xiaomi MiMo 100T Program

This project was created as a submission for the [100T Token Creator Incentive Program](https://100t.xiaomimimo.com/). It demonstrates:

- AI-powered game logic (opponent decision-making)
- Creative use of AI API integration
- Full functional web application
- Intensive token usage for AI inference per duel

## 📄 License

MIT License — Free to use, modify, and distribute.

---

**Pixel Duel v0.0.9-beta** | Built with [Xiaomi MiMo AI](https://platform.xiaomimimo.com) | [100T Program](https://100t.xiaomimimo.com/)
