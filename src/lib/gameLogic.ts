import { VaultOdds, VaultOutcome, OutcomeType, Player, RunState, CosmeticBonuses } from "@/types/game";

export const COSMETIC_BONUSES: Record<string, CosmeticBonuses> = {
  // Vault Skins — smaller bonuses, cheapest
  "vault-default": { gemMultiplier: 1, jackpotChanceBonus: 0, mediumGemChanceBonus: 0, trapReduction: 0, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 0 },
  "vault-blue-sapphire": { gemMultiplier: 1.1, jackpotChanceBonus: 0, mediumGemChanceBonus: 2, trapReduction: 0, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 0 },
  "vault-red-ruby": { gemMultiplier: 1, jackpotChanceBonus: 0, mediumGemChanceBonus: 0, trapReduction: 2, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 0 },
  "vault-purple-cosmic": { gemMultiplier: 1.5, jackpotChanceBonus: 5, mediumGemChanceBonus: 3, trapReduction: 0, shardMultiplier: 1, xpMultiplier: 1.05, reviveTokenBonus: 0 },
  "vault-plus": { gemMultiplier: 1.5, jackpotChanceBonus: 0, mediumGemChanceBonus: 0, trapReduction: 0, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 0 },

  // Banners (Badge Frames) — medium bonuses, medium price
  "banner-default": { gemMultiplier: 1, jackpotChanceBonus: 0, mediumGemChanceBonus: 0, trapReduction: 0, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 0 },
  "banner-heart": { gemMultiplier: 1, jackpotChanceBonus: 0, mediumGemChanceBonus: 0, trapReduction: 0, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 1 },
  "banner-ice": { gemMultiplier: 1, jackpotChanceBonus: 0, mediumGemChanceBonus: 0, trapReduction: 3, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 0 },
  "banner-emerald": { gemMultiplier: 1.1, jackpotChanceBonus: 0, mediumGemChanceBonus: 3, trapReduction: 0, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 0 },
  "banner-ruby": { gemMultiplier: 1.2, jackpotChanceBonus: 2, mediumGemChanceBonus: 0, trapReduction: 0, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 0 },
  "banner-diamond": { gemMultiplier: 1, jackpotChanceBonus: 5, mediumGemChanceBonus: 5, trapReduction: 0, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 0 },
  "banner-galaxy": { gemMultiplier: 1, jackpotChanceBonus: 0, mediumGemChanceBonus: 0, trapReduction: 0, shardMultiplier: 1.3, xpMultiplier: 1.08, reviveTokenBonus: 0 },
  "banner-golden-bird": { gemMultiplier: 1, jackpotChanceBonus: 0, mediumGemChanceBonus: 0, trapReduction: 0, shardMultiplier: 1, xpMultiplier: 1.12, reviveTokenBonus: 0 },
  "banner-champion": { gemMultiplier: 1.15, jackpotChanceBonus: 4, mediumGemChanceBonus: 3, trapReduction: 2, shardMultiplier: 1.2, xpMultiplier: 1.1, reviveTokenBonus: 0 },

  // Avatars — strongest bonuses, most expensive
  "avatar-basic": { gemMultiplier: 1, jackpotChanceBonus: 0, mediumGemChanceBonus: 0, trapReduction: 0, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 0 },
  "avatar-champion": { gemMultiplier: 1.2, jackpotChanceBonus: 3, mediumGemChanceBonus: 5, trapReduction: 0, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 0 },
  "avatar-galaxy": { gemMultiplier: 1, jackpotChanceBonus: 8, mediumGemChanceBonus: 0, trapReduction: 0, shardMultiplier: 1.25, xpMultiplier: 1, reviveTokenBonus: 0 },
  "avatar-pirate": { gemMultiplier: 1.3, jackpotChanceBonus: 0, mediumGemChanceBonus: 0, trapReduction: 4, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 0 },
  "avatar-joker": { gemMultiplier: 1, jackpotChanceBonus: 12, mediumGemChanceBonus: 0, trapReduction: -2, shardMultiplier: 1, xpMultiplier: 1, reviveTokenBonus: 0 },
  "avatar-shadow": { gemMultiplier: 1, jackpotChanceBonus: 0, mediumGemChanceBonus: 8, trapReduction: 6, shardMultiplier: 1, xpMultiplier: 1.05, reviveTokenBonus: 0 },
  "avatar-dragon": { gemMultiplier: 1.4, jackpotChanceBonus: 6, mediumGemChanceBonus: 5, trapReduction: 3, shardMultiplier: 1.3, xpMultiplier: 1.1, reviveTokenBonus: 0 },
};

export function getActiveCosmeticBonuses(player: Player): CosmeticBonuses {
  const skin = COSMETIC_BONUSES[player.activeVaultSkin] ?? COSMETIC_BONUSES["vault-default"];
  const avatar = COSMETIC_BONUSES[player.activeAvatar] ?? COSMETIC_BONUSES["avatar-basic"];
  const banner = COSMETIC_BONUSES[player.activeBadgeFrame] ?? COSMETIC_BONUSES["banner-default"];

  return {
    gemMultiplier: skin.gemMultiplier * avatar.gemMultiplier * banner.gemMultiplier,
    jackpotChanceBonus: skin.jackpotChanceBonus + avatar.jackpotChanceBonus + banner.jackpotChanceBonus,
    mediumGemChanceBonus: skin.mediumGemChanceBonus + avatar.mediumGemChanceBonus + banner.mediumGemChanceBonus,
    trapReduction: skin.trapReduction + avatar.trapReduction + banner.trapReduction,
    shardMultiplier: skin.shardMultiplier * avatar.shardMultiplier * banner.shardMultiplier,
    xpMultiplier: skin.xpMultiplier * avatar.xpMultiplier * banner.xpMultiplier,
    reviveTokenBonus: skin.reviveTokenBonus + avatar.reviveTokenBonus + banner.reviveTokenBonus,
  };
}

export const VAULT_ODDS: Record<number, VaultOdds[]> = {
  1: [
    { type: "smallGems", chance: 65 },
    { type: "mediumGems", chance: 20 },
    { type: "multiplier", chance: 10 },
    { type: "bonusKey", chance: 3 },
    { type: "trap", chance: 2 },
  ],
  2: [
    { type: "smallGems", chance: 42 },
    { type: "mediumGems", chance: 25 },
    { type: "multiplier", chance: 15 },
    { type: "bonusKey", chance: 4 },
    { type: "cosmeticShard", chance: 5 },
    { type: "trap", chance: 9 },
  ],
  3: [
    { type: "smallGems", chance: 27 },
    { type: "mediumGems", chance: 28 },
    { type: "bigGems", chance: 10 },
    { type: "multiplier", chance: 15 },
    { type: "bonusKey", chance: 3 },
    { type: "cosmeticShard", chance: 6 },
    { type: "bonusLife", chance: 1 },
    { type: "trap", chance: 10 },
  ],
  4: [
    { type: "mediumGems", chance: 26 },
    { type: "bigGems", chance: 18 },
    { type: "multiplier", chance: 18 },
    { type: "bonusKey", chance: 3 },
    { type: "cosmeticShard", chance: 10 },
    { type: "jackpot", chance: 11 },
    { type: "shardJackpot", chance: 2 },
    { type: "trap", chance: 12 },
  ],
  5: [
    { type: "smallGems", chance: 12 },
    { type: "bigGems", chance: 27 },
    { type: "cosmeticShard", chance: 12 },
    { type: "jackpot", chance: 15 },
    { type: "multiplier", chance: 16 },
    { type: "bonusLife", chance: 1 },
    { type: "shardJackpot", chance: 2 },
    { type: "trap", chance: 15 },
  ],
  6: [
    { type: "mediumGems", chance: 11 },
    { type: "bigGems", chance: 31 },
    { type: "cosmeticShard", chance: 10 },
    { type: "jackpot", chance: 16 },
    { type: "multiplier", chance: 10 },
    { type: "bonusLife", chance: 1 },
    { type: "shardJackpot", chance: 2 },
    { type: "trap", chance: 19 },
  ],
  7: [
    { type: "mediumGems", chance: 6 },
    { type: "bigGems", chance: 34 },
    { type: "cosmeticShard", chance: 8 },
    { type: "jackpot", chance: 18 },
    { type: "multiplier", chance: 8 },
    { type: "bonusLife", chance: 1 },
    { type: "shardJackpot", chance: 2 },
    { type: "trap", chance: 23 },
  ],
  8: [
    { type: "bigGems", chance: 36 },
    { type: "cosmeticShard", chance: 5 },
    { type: "jackpot", chance: 20 },
    { type: "multiplier", chance: 8 },
    { type: "bonusLife", chance: 1 },
    { type: "shardJackpot", chance: 2 },
    { type: "trap", chance: 28 },
  ],
  9: [
    { type: "bigGems", chance: 33 },
    { type: "cosmeticShard", chance: 3 },
    { type: "jackpot", chance: 22 },
    { type: "multiplier", chance: 6 },
    { type: "bonusLife", chance: 1 },
    { type: "shardJackpot", chance: 2 },
    { type: "trap", chance: 33 },
  ],
  10: [
    { type: "bigGems", chance: 28 },
    { type: "cosmeticShard", chance: 1 },
    { type: "jackpot", chance: 26 },
    { type: "multiplier", chance: 4 },
    { type: "bonusLife", chance: 1 },
    { type: "shardJackpot", chance: 2 },
    { type: "trap", chance: 38 },
  ],
};

function weightedRandom(odds: VaultOdds[]): OutcomeType {
  const total = odds.reduce((sum, o) => sum + o.chance, 0);
  let rand = Math.random() * total;
  for (const o of odds) {
    rand -= o.chance;
    if (rand <= 0) return o.type;
  }
  return odds[odds.length - 1].type;
}

function applyOddsBonuses(odds: VaultOdds[], bonuses: CosmeticBonuses): VaultOdds[] {
  const adjusted = odds.map((o) => ({ ...o }));

  // Boost jackpot chance
  if (bonuses.jackpotChanceBonus > 0) {
    const trapIdx = adjusted.findIndex((o) => o.type === "trap");
    if (trapIdx !== -1) {
      adjusted[trapIdx].chance = Math.max(1, adjusted[trapIdx].chance - bonuses.jackpotChanceBonus);
    }
    const jackpotIdx = adjusted.findIndex((o) => o.type === "jackpot");
    if (jackpotIdx !== -1) {
      adjusted[jackpotIdx].chance += bonuses.jackpotChanceBonus;
    } else {
      // If no jackpot in this vault, convert a small portion of trap to jackpot
      const trap = adjusted.find((o) => o.type === "trap");
      if (trap) {
        trap.chance = Math.max(1, trap.chance - bonuses.jackpotChanceBonus);
        adjusted.push({ type: "jackpot", chance: bonuses.jackpotChanceBonus });
      }
    }
  }

  // Boost medium gem chance
  if (bonuses.mediumGemChanceBonus > 0) {
    const trapIdx = adjusted.findIndex((o) => o.type === "trap");
    if (trapIdx !== -1) {
      adjusted[trapIdx].chance = Math.max(1, adjusted[trapIdx].chance - bonuses.mediumGemChanceBonus);
    }
    const medIdx = adjusted.findIndex((o) => o.type === "mediumGems");
    if (medIdx !== -1) {
      adjusted[medIdx].chance += bonuses.mediumGemChanceBonus;
    }
  }

  // Reduce trap chance
  if (bonuses.trapReduction !== 0) {
    const trapIdx = adjusted.findIndex((o) => o.type === "trap");
    if (trapIdx !== -1) {
      const removed = Math.min(adjusted[trapIdx].chance - 1, bonuses.trapReduction);
      adjusted[trapIdx].chance -= removed;
      // Distribute removed to smallGems or mediumGems
      const smIdx = adjusted.findIndex((o) => o.type === "smallGems");
      if (smIdx !== -1) {
        adjusted[smIdx].chance += removed;
      } else {
        const medIdx = adjusted.findIndex((o) => o.type === "mediumGems");
        if (medIdx !== -1) adjusted[medIdx].chance += removed;
      }
    }
  }

  return adjusted;
}

export const OUTCOME_BASE_LABELS: Record<OutcomeType, string> = {
  smallGems: "12 gems",
  mediumGems: "30 gems",
  bigGems: "75 gems",
  multiplier: "+0.5x",
  bonusKey: "1 key",
  cosmeticShard: "2 shards",
  trap: "Lose all",
  jackpot: "500 gems",
  bonusLife: "15 gems + 1 life",
  shardJackpot: "25 shards",
};

const MAX_DEFINED_VAULT = Math.max(...Object.keys(VAULT_ODDS).map(Number));

export function resolveVault(vaultNumber: number, multiplier: number, player: Player): VaultOutcome {
  const bonuses = getActiveCosmeticBonuses(player);
  const baseOdds = VAULT_ODDS[vaultNumber] ?? VAULT_ODDS[MAX_DEFINED_VAULT];
  const odds = applyOddsBonuses(baseOdds, bonuses);
  const type = weightedRandom(odds);

  switch (type) {
    case "smallGems":
      return { type, label: "Small Gems", gems: Math.round(12 * multiplier * bonuses.gemMultiplier) };
    case "mediumGems":
      return { type, label: "Medium Gems", gems: Math.round(30 * multiplier * bonuses.gemMultiplier) };
    case "bigGems":
      return { type, label: "Big Gems", gems: Math.round(75 * multiplier * bonuses.gemMultiplier) };
    case "multiplier":
      return { type, label: "Multiplier Up!", multiplierDelta: 0.5 };
    case "bonusKey":
      return { type, label: "Bonus Key!", keys: 1 };
    case "cosmeticShard":
      return { type, label: "Cosmetic Shard!", shards: Math.round(2 * bonuses.shardMultiplier) };
    case "trap":
      return { type, label: "TRAP!", gems: 0 };
    case "jackpot":
      return { type, label: "JACKPOT!", gems: Math.round(500 * multiplier * bonuses.gemMultiplier) };
    case "bonusLife":
      return { type, label: "Bonus Life!", gems: Math.round(15 * multiplier * bonuses.gemMultiplier) };
    case "shardJackpot":
      return { type, label: "SHARD JACKPOT!", shards: Math.round(25 * bonuses.shardMultiplier) };
    default:
      return { type: "smallGems", label: "Small Gems", gems: Math.round(3 * multiplier * bonuses.gemMultiplier) };
  }
}

export function getRiskPercent(vaultNumber: number): number {
  const odds = VAULT_ODDS[vaultNumber] ?? VAULT_ODDS[5];
  const trap = odds.find((o) => o.type === "trap");
  return trap ? trap.chance : 30;
}

export function xpForLevel(level: number): number {
  return Math.floor(200 * Math.pow(1.35, level - 1));
}

export function getDefaultPlayer(): Player {
  return {
    gems: 0,
    keys: 3,
    reviveTokens: 1,
    level: 1,
    xp: 0,
    xpToNextLevel: xpForLevel(1),
    streak: 0,
    lastDailyClaim: null,
    isSubscribed: false,
    subscriptionExpiry: null,
    isAdFree: false,
    totalGemsEarned: 0,
    totalVaultsOpened: 0,
    trapCount: 0,
    jackpotCount: 0,
    bestRunGems: 0,
    longestStreak: 0,
    longestRun: 0,
    highestJackpot: 0,
    weeklyScore: 0,
    cosmeticShards: 0,
    ownedCosmetics: ["vault-default", "avatar-basic", "banner-default"],
    activeVaultSkin: "vault-default",
    activeAvatar: "avatar-basic",
    activeBadgeFrame: "banner-default",
  };
}

export interface DailyEvent {
  name: string;
  description: string;
  gemMultiplier: number;
  shardBonus: number;
  xpMultiplier: number;
}

export function getDailyEvent(): DailyEvent {
  const day = new Date().getDay();
  const events: DailyEvent[] = [
    { name: "Streak Sunday", description: "+15% XP from runs", gemMultiplier: 1, shardBonus: 0, xpMultiplier: 1.15 },
    { name: "Key Rush Monday", description: "+1 shard from vaults", gemMultiplier: 1, shardBonus: 1, xpMultiplier: 1 },
    { name: "Shard Surge Tuesday", description: "+1 shard from vaults", gemMultiplier: 1, shardBonus: 1, xpMultiplier: 1 },
    { name: "Hump Day Boost", description: "+10% gems on bank", gemMultiplier: 1.1, shardBonus: 0, xpMultiplier: 1 },
    { name: "Lucky Thursday", description: "+10% gems on bank", gemMultiplier: 1.1, shardBonus: 0, xpMultiplier: 1 },
    { name: "Frenzy Friday", description: "+20% gems on bank", gemMultiplier: 1.2, shardBonus: 0, xpMultiplier: 1 },
    { name: "Double Gems Saturday", description: "+30% gems on bank", gemMultiplier: 1.3, shardBonus: 0, xpMultiplier: 1 },
  ];
  return events[day];
}

export function getDefaultRunState(): RunState {
  return {
    currentVault: 0,
    unbankedGems: 0,
    currentMultiplier: 1,
    isTrapTriggered: false,
    isRunActive: false,
    history: [],
    gemsBanked: 0,
    reviveUsed: false,
  };
}
