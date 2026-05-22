# ⚡ Vault Rush - Quick Start Guide

## 🎮 Play Now (3 Steps)

```bash
# 1. Install dependencies
npm install

# 2. Start the game
npm run dev

# 3. Open in browser
# Visit http://localhost:3000
```

That's it! The game is now running locally.

## 🎯 First Time Playing?

### Starting Your First Run
1. **Home Screen** - You start with 3 keys
2. Click **"Start Run"** button (costs 1 key)
3. **Open Vaults** - Tap each vault to reveal rewards
4. **Bank or Risk** - After each vault, decide:
   - **Bank** = Keep your gems and end the run
   - **Continue** = Risk your gems for bigger rewards
5. **Watch for Traps!** - Hit a trap and lose everything (unless you use a revive token)

### Understanding Rewards
- 💎 **Gems** - Main currency (small/medium/big)
- 🔑 **Keys** - Start new runs
- ❤️ **Revive Tokens** - Save you from traps
- ✨ **Shards** - Unlock cosmetics
- ⚡ **Multipliers** - Increase gem rewards
- 🎰 **Jackpots** - Massive gem drops!

### The Risk/Reward System
Each vault gets riskier:
- **Vault 1** - 2% trap chance (safe)
- **Vault 2** - 7% trap chance
- **Vault 3** - 6% trap chance
- **Vault 4** - 18% trap chance
- **Vault 5** - 38% trap chance (high risk, high reward!)

**Strategy Tip:** Bank after Vault 3 for consistent gains, or push to Vault 5 for jackpots!

## 🎨 Progression System

### Leveling Up
- Open vaults to earn **XP**
- Level up to get **gems, keys, and shards**
- Higher levels = better rewards

### Daily Rewards
- Claim once per day
- Build a **streak** for bigger rewards
- Rewards rotate: gems → keys → revive tokens

### Cosmetics
- Unlock with **shards** in the Collection screen
- Each cosmetic gives **gameplay bonuses**:
  - **Vault Skins** - Gem multipliers (up to 4x!)
  - **Avatars** - Better odds, jackpot boosts
  - **Badge Frames** - XP and shard bonuses

### Shop
- Buy keys with gems
- Simulated purchases (no real money in MVP)
- Subscribe to **Vault Rush Plus** for bonuses

## 🎵 Audio Controls

The game has background music and sound effects:
- **Music** - Auto-plays on home screen
- **Sound Effects** - Button clicks, wins, losses
- **Mute** - Click the music icon to toggle

## 📱 Mobile Experience

**Best on mobile!** The game is designed for touch screens:
- Large tap targets
- Smooth animations
- Portrait orientation
- Works offline (LocalStorage)

**Add to Home Screen:**
1. Open in mobile browser
2. Tap "Share" → "Add to Home Screen"
3. Play like a native app!

## 🎲 Game Modes & Features

### Main Screens
- **Home** - Start runs, view stats, daily rewards
- **Run** - Core gameplay (5 vaults)
- **Shop** - Buy keys, gems, subscription
- **Collection** - Unlock and equip cosmetics
- **Leaderboard** - Compare scores (local for now)
- **Daily** - Claim daily rewards
- **Profile** - View detailed stats

### Stats Tracked
- Total gems earned
- Total vaults opened
- Best run (highest gems banked)
- Jackpot count
- Trap count
- Longest streak
- Weekly score

## 🔥 Pro Tips

1. **Early Banking** - Bank after Vault 2-3 when starting out
2. **Multiplier Stacking** - Multipliers compound! Get 2-3 multipliers then push for big gems
3. **Save Revives** - Use revive tokens on high-value runs only
4. **Daily Streaks** - Never miss a day for maximum rewards
5. **Cosmetic Strategy** - Unlock vault skins first for gem multipliers
6. **Weekly Events** - Play on weekends for +30% gem bonuses!
7. **Subscription** - Vault Rush Plus gives 10% gem boost + daily keys

## 🛠️ Development

### File Structure
```
src/
├── app/page.tsx          # Main game container
├── components/           # All UI components
├── hooks/useGameState.ts # Game state management
├── lib/gameLogic.ts      # Game mechanics
└── types/game.ts         # TypeScript types
```

### Key Files to Modify
- **Odds**: `src/lib/gameLogic.ts` → `VAULT_ODDS`
- **Cosmetics**: `src/components/CollectionScreen.tsx` → `COSMETICS`
- **Shop Items**: `src/components/ShopScreen.tsx` → `SHOP_ITEMS`
- **Styling**: `src/app/globals.css` and `tailwind.config.ts`

### Adding New Features
1. **New Outcome Type**: Add to `OutcomeType` in `types/game.ts`
2. **New Screen**: Create component in `components/`, add to `page.tsx`
3. **New Stat**: Add to `Player` interface in `types/game.ts`

## 🐛 Troubleshooting

### Game Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Lost Progress
- Progress is saved in **LocalStorage**
- Check browser console for errors
- Don't use incognito mode
- Clear browser cache may delete saves

### No Sound
- Check browser allows audio
- Click anywhere on page first (browser autoplay policy)
- Check volume settings
- Verify sound files exist in `public/sounds/`

### Performance Issues
- Close other browser tabs
- Disable browser extensions
- Use Chrome/Edge for best performance
- Check CPU usage

## 📚 Next Steps

### For Players
1. ✅ Complete your first run
2. ✅ Unlock your first cosmetic
3. ✅ Build a 7-day streak
4. ✅ Hit your first jackpot
5. ✅ Reach level 10

### For Developers
1. 📖 Read `README.md` for full documentation
2. 📋 Check `todo.md` for roadmap
3. 🚀 See `DEPLOYMENT.md` for hosting
4. 🎨 Review `FEATURES.md` for complete feature list

## 🎯 Goals & Achievements (Unofficial)

Try to achieve these milestones:
- 🥉 **Bronze Rusher** - Bank 100 gems in one run
- 🥈 **Silver Vaulter** - Bank 500 gems in one run
- 🥇 **Gold Master** - Bank 1,000 gems in one run
- 💎 **Diamond Legend** - Bank 2,000 gems in one run
- 🎰 **Jackpot Hunter** - Hit 10 jackpots
- 🔥 **Streak King** - Maintain a 30-day streak
- 👑 **Vault Royalty** - Reach level 50
- 🌟 **Completionist** - Unlock all cosmetics

## ⚖️ Legal Notice

**Virtual Currency Only**

Vault Rush uses virtual currency only. Rewards have no cash value and cannot be withdrawn, exchanged, or redeemed for real money. This is a game for entertainment purposes only.

All odds are visible in-game. No outcome is guaranteed. Play responsibly!

## 🎉 Have Fun!

Vault Rush is designed to be **fast, fun, and addictive**. Each run takes 30-60 seconds. The risk/reward loop keeps you coming back for "just one more run."

**Good luck, and may the vaults be ever in your favor!** 🎰✨

---

**Questions?** Check the full `README.md` or create an issue on GitHub.
