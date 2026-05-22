export type OutcomeType =
  | "smallGems"
  | "mediumGems"
  | "bigGems"
  | "multiplier"
  | "bonusKey"
  | "cosmeticShard"
  | "trap"
  | "jackpot"
  | "bonusLife"
  | "shardJackpot";

export interface VaultOutcome {
  type: OutcomeType;
  label: string;
  gems?: number;
  multiplierDelta?: number;
  keys?: number;
  shards?: number;
}

export interface VaultOdds {
  type: OutcomeType;
  chance: number;
}

export interface Player {
  gems: number;
  keys: number;
  reviveTokens: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  lastDailyClaim: string | null;
  isSubscribed: boolean;
  subscriptionExpiry: string | null;
  isAdFree: boolean;
  totalGemsEarned: number;
  totalVaultsOpened: number;
  trapCount: number;
  jackpotCount: number;
  bestRunGems: number;
  longestStreak: number;
  longestRun: number;
  highestJackpot: number;
  weeklyScore: number;
  cosmeticShards: number;
  ownedCosmetics: string[];
  activeVaultSkin: string;
  activeAvatar: string;
  activeBadgeFrame: string;
}

export interface RunState {
  currentVault: number;
  unbankedGems: number;
  currentMultiplier: number;
  isTrapTriggered: boolean;
  isRunActive: boolean;
  history: VaultOutcome[];
  gemsBanked: number;
  reviveUsed: boolean;
}

export interface CosmeticBonuses {
  gemMultiplier: number;
  jackpotChanceBonus: number;
  mediumGemChanceBonus: number;
  trapReduction: number;
  shardMultiplier: number;
  xpMultiplier: number;
  reviveTokenBonus: number;
}

export interface CosmeticItem {
  id: string;
  name: string;
  type: "vaultSkin" | "avatar" | "badgeFrame";
  description: string;
  shardCost: number;
  icon: string;
  bonuses: CosmeticBonuses;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "gems" | "usd";
  quantity: number;
  type: "keys" | "reviveTokens" | "gems" | "shards" | "bundle" | "subscription" | "adFree";
  stripePriceId?: string;
  stripeMode?: "payment" | "subscription";
}

export interface LeaderboardEntry {
  rank: number;
  username?: string;
  display_name?: string;
  name?: string;
  score: number;
  isPlayer?: boolean;
  level?: number;
  active_vault_skin?: string;
  active_avatar?: string;
  active_badge_frame?: string;
  category?: "biggestRun" | "longestStreak" | "highestJackpot" | "weeklyScore";
}
