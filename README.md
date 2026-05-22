# 🎰 Vault Rush

A mobile-first gambling-inspired arcade risk/reward game built with Next.js, React, and TypeScript. **No real-money gambling** - all rewards are virtual gems and cosmetics only.

![Vault Rush](https://img.shields.io/badge/Status-MVP%20Complete-success)
![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 Game Concept

Players start with keys. Each run costs 1 key. During a run, players open a series of 5 vaults. Each vault can contain:
- 💎 Small/Medium/Big Gems
- ⚡ Multipliers
- 🔑 Bonus Keys
- ✨ Cosmetic Shards
- 💥 Traps
- 🎰 Jackpots

**The Risk/Reward Loop:** After each vault, players can **bank their rewards** or **risk it all** for bigger payouts. Hit a trap and lose everything unless you use a revive token!

## ✨ Features

### Core Gameplay
- ✅ 5-vault run system with escalating risk
- ✅ Bank or risk decision after each vault
- ✅ Fair virtual odds system with visible probabilities
- ✅ Multiplier stacking mechanics
- ✅ Revive token system
- ✅ Fast, satisfying mobile-first gameplay

### Progression System
- ✅ XP and leveling with rewards
- ✅ Player stats tracking (best run, jackpots, total vaults opened)
- ✅ Daily reward system with streak counter
- ✅ Weekly events with rotating bonuses

### Cosmetics & Collection
- ✅ Vault skins with gameplay bonuses
- ✅ Player avatars
- ✅ Badge frames
- ✅ Cosmetic shard unlock system
- ✅ Equippable cosmetics with stat bonuses

### Monetization (MVP Placeholders)
- ✅ Virtual shop with gem purchases
- ✅ Simulated rewarded ads (5-second countdown)
- ✅ Vault Rush Plus subscription placeholder
- ✅ Ad-free upgrade placeholder
- 🔜 Stripe/RevenueCat integration (see TODO)
- 🔜 AdMob/web ad integration (see TODO)

### UI/UX
- ✅ Mobile-first responsive design
- ✅ Dark casino/arcade aesthetic
- ✅ Glowing vaults and gem animations
- ✅ Confetti for jackpots
- ✅ Smooth transitions and haptic-style feedback
- ✅ Sound effects for all interactions
- ✅ Background music system

### Responsible Design
- ✅ Legal disclaimer: "Virtual currency only, no cash value"
- ✅ Visible odds information
- ✅ No real-money gambling mechanics
- ✅ Clear separation between virtual and real currency

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to play!

## 🏗️ Tech Stack

- **Framework:** Next.js 15.3.2 (App Router)
- **Language:** TypeScript 5.8.3
- **Styling:** Tailwind CSS 3.4.4
- **Icons:** Lucide React
- **Animations:** Canvas Confetti
- **Persistence:** LocalStorage (MVP)
- **State Management:** React Hooks

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles & animations
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main game container
├── components/
│   ├── HomeScreen.tsx        # Main menu
│   ├── VaultRunScreen.tsx    # Core gameplay screen
│   ├── ShopScreen.tsx        # Virtual shop
│   ├── CollectionScreen.tsx  # Cosmetics collection
│   ├── LeaderboardScreen.tsx # Local leaderboard
│   ├── DailyScreen.tsx       # Daily rewards
│   ├── ProfileScreen.tsx     # Player stats
│   ├── LevelUpModal.tsx      # Level up celebration
│   ├── AdModal.tsx           # Simulated ad modal
│   ├── LegalModal.tsx        # Legal disclaimer
│   ├── BackgroundMusic.tsx   # Audio system
│   └── BottomNav.tsx         # Navigation (deprecated)
├── hooks/
│   ├── useGameState.ts       # Central game state hook
│   └── useSound.ts           # Sound effect system
├── lib/
│   ├── gameLogic.ts          # Game mechanics & odds
│   └── utils.ts              # Utility functions
├── types/
│   └── game.ts               # TypeScript types
└── public/
    └── sounds/               # Sound effects & music
```

## 🎲 Game Mechanics

### Vault Odds (Example)

**Vault 1 (Low Risk):**
- 65% Small Gems
- 20% Medium Gems
- 10% Multiplier
- 3% Bonus Key
- 2% Trap

**Vault 5 (High Risk):**
- 32% Big Gems
- 12% Cosmetic Shard
- 18% Jackpot
- 38% Trap

### Cosmetic Bonuses

Cosmetics provide gameplay advantages:
- **Vault Skins:** Gem multipliers, jackpot chance boosts
- **Avatars:** Trap reduction, special bonuses
- **Badge Frames:** XP multipliers, shard bonuses

### Daily Events

Rotating daily bonuses:
- **Streak Sunday:** +15% XP
- **Shard Surge Tuesday:** +1 shard per vault
- **Frenzy Friday:** +20% gems on bank
- **Double Gems Saturday:** +30% gems on bank

## 🔧 Configuration

### LocalStorage Keys
- `vr_player` - Player data
- `vr_last_daily` - Daily reward tracking
- `vr_streak` - Streak counter

### Sound Files
Place audio files in `public/sounds/`:
- `button-press.wav`
- `vault-open.wav`
- `win-small.wav`
- `win-medium.wav`
- `win-large.wav`
- `lose.wav`
- `bank-button.wav`
- `purchase.wav`
- `jackpot.wav`
- `backgroundmusic.mp3`

## 📝 TODO / Roadmap

See [`todo.md`](./todo.md) for the complete roadmap.

### High Priority
- [ ] Supabase integration for auth & cloud saves
- [ ] Stripe integration for real payments
- [ ] AdMob/web ad integration
- [ ] Real leaderboard (Supabase)

### UI/UX Improvements
- [ ] Show equipped cosmetics on run screen
- [ ] Fix cosmetic page scroll
- [ ] Slow down level-up animation
- [ ] Loading states for async operations

### Polish
- [ ] Real cosmetic art/icons
- [ ] Error handling for network failures
- [ ] Progressive Web App (PWA) support

## 🎨 Design Philosophy

**Mobile-First:** Every interaction is optimized for touch. Large tap targets, smooth animations, and instant feedback.

**Addictive Loop:** Short runs (30-60 seconds) with clear risk/reward decisions keep players engaged.

**Premium Feel:** Dark aesthetic with glowing elements, satisfying sounds, and polished animations make it feel like a premium mobile game.

**Responsible:** Clear disclaimers, visible odds, and no real-money gambling mechanics ensure ethical design.

## 🤝 Contributing

This is an MVP project. Contributions welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project as a template for your own games!

## 🙏 Acknowledgments

- Built with Next.js and React
- Icons by Lucide
- Confetti by canvas-confetti
- Inspired by mobile arcade games and casino aesthetics

## 📧 Contact

For questions or support: support@vaultrush.game

---

**Remember:** Vault Rush uses virtual currency only. Rewards have no cash value and cannot be withdrawn. Play responsibly! 🎰✨
