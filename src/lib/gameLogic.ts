import { VaultOutcome, OutcomeType, Player, RunState, CosmeticBonuses, RewardWeights } from "@/types/game";

export const COSMETIC_BONUS_CAPS = {
  maxGemMultiplier: 1.35,
  maxShardMultiplier: 1.25,
  maxXpMultiplier: 1.30,
  maxJackpotRewardMultiplier: 1.25,

  maxMediumGemWeightBonus: 10,
  maxBigGemWeightBonus: 6,
  maxShardWeightBonus: 8,
  maxBonusKeyWeightBonus: 5,
  maxReviveTokenWeightBonus: 4,
  maxJackpotWeightBonus: 6,
  maxTrapWeightReduction: 8,

  minTrapWeight: 2,
};

export const COSMETIC_BONUSES: Record<string, CosmeticBonuses> = {
  // Vault Skins — smaller bonuses, cheapest
  "vault-default": { gemMultiplier: 1, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1, mediumGemWeightBonus: 0, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 0, trapWeightReduction: 0, reviveTokenBonus: 0 },
  "vault-blue-sapphire": { gemMultiplier: 1.1, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1.1, mediumGemWeightBonus: 2, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 0, trapWeightReduction: 0, reviveTokenBonus: 0 },
  "vault-red-ruby": { gemMultiplier: 1, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1, mediumGemWeightBonus: 0, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 0, trapWeightReduction: 2, reviveTokenBonus: 0 },
  "vault-purple-cosmic": { gemMultiplier: 1.5, shardMultiplier: 1, xpMultiplier: 1.05, jackpotRewardMultiplier: 1.5, mediumGemWeightBonus: 3, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 5, trapWeightReduction: 0, reviveTokenBonus: 0 },
  "vault-plus": { gemMultiplier: 1.5, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1.5, mediumGemWeightBonus: 0, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 0, trapWeightReduction: 0, reviveTokenBonus: 0 },

  // Banners (Badge Frames) — medium bonuses, medium price
  "banner-default": { gemMultiplier: 1, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1, mediumGemWeightBonus: 0, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 0, trapWeightReduction: 0, reviveTokenBonus: 0 },
  "banner-heart": { gemMultiplier: 1, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1, mediumGemWeightBonus: 0, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 0, trapWeightReduction: 0, reviveTokenBonus: 1 },
  "banner-ice": { gemMultiplier: 1, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1, mediumGemWeightBonus: 0, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 0, trapWeightReduction: 3, reviveTokenBonus: 0 },
  "banner-emerald": { gemMultiplier: 1.1, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1.1, mediumGemWeightBonus: 3, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 0, trapWeightReduction: 0, reviveTokenBonus: 0 },
  "banner-ruby": { gemMultiplier: 1.2, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1.2, mediumGemWeightBonus: 0, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 2, trapWeightReduction: 0, reviveTokenBonus: 0 },
  "banner-diamond": { gemMultiplier: 1, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1, mediumGemWeightBonus: 5, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 5, trapWeightReduction: 0, reviveTokenBonus: 0 },
  "banner-galaxy": { gemMultiplier: 1, shardMultiplier: 1.3, xpMultiplier: 1.08, jackpotRewardMultiplier: 1, mediumGemWeightBonus: 0, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 0, trapWeightReduction: 0, reviveTokenBonus: 0 },
  "banner-golden-bird": { gemMultiplier: 1, shardMultiplier: 1, xpMultiplier: 1.12, jackpotRewardMultiplier: 1, mediumGemWeightBonus: 0, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 0, trapWeightReduction: 0, reviveTokenBonus: 0 },
  "banner-champion": { gemMultiplier: 1.15, shardMultiplier: 1.2, xpMultiplier: 1.1, jackpotRewardMultiplier: 1.15, mediumGemWeightBonus: 3, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 4, trapWeightReduction: 2, reviveTokenBonus: 0 },

  // Avatars — strongest bonuses, most expensive
  "avatar-basic": { gemMultiplier: 1, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1, mediumGemWeightBonus: 0, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 0, trapWeightReduction: 0, reviveTokenBonus: 0 },
  "avatar-champion": { gemMultiplier: 1.2, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1.2, mediumGemWeightBonus: 5, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 3, trapWeightReduction: 0, reviveTokenBonus: 0 },
  "avatar-galaxy": { gemMultiplier: 1, shardMultiplier: 1.25, xpMultiplier: 1, jackpotRewardMultiplier: 1, mediumGemWeightBonus: 0, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 8, trapWeightReduction: 0, reviveTokenBonus: 0 },
  "avatar-pirate": { gemMultiplier: 1.3, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1.3, mediumGemWeightBonus: 0, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 0, trapWeightReduction: 4, reviveTokenBonus: 0 },
  "avatar-joker": { gemMultiplier: 1, shardMultiplier: 1, xpMultiplier: 1, jackpotRewardMultiplier: 1, mediumGemWeightBonus: 0, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 12, trapWeightReduction: -2, reviveTokenBonus: 0 },
  "avatar-shadow": { gemMultiplier: 1, shardMultiplier: 1, xpMultiplier: 1.05, jackpotRewardMultiplier: 1, mediumGemWeightBonus: 8, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 0, trapWeightReduction: 6, reviveTokenBonus: 0 },
  "avatar-dragon": { gemMultiplier: 1.4, shardMultiplier: 1.3, xpMultiplier: 1.1, jackpotRewardMultiplier: 1.4, mediumGemWeightBonus: 5, bigGemWeightBonus: 0, shardWeightBonus: 0, bonusKeyWeightBonus: 0, reviveTokenWeightBonus: 0, jackpotWeightBonus: 6, trapWeightReduction: 3, reviveTokenBonus: 0 },
};

export function getActiveCosmeticBonuses(player: Player): CosmeticBonuses {
  const skin = COSMETIC_BONUSES[player.activeVaultSkin] ?? COSMETIC_BONUSES["vault-default"];
  const avatar = COSMETIC_BONUSES[player.activeAvatar] ?? COSMETIC_BONUSES["avatar-basic"];
  const banner = COSMETIC_BONUSES[player.activeBadgeFrame] ?? COSMETIC_BONUSES["banner-default"];

  const raw: CosmeticBonuses = {
    gemMultiplier: skin.gemMultiplier * avatar.gemMultiplier * banner.gemMultiplier,
    shardMultiplier: skin.shardMultiplier * avatar.shardMultiplier * banner.shardMultiplier,
    xpMultiplier: skin.xpMultiplier * avatar.xpMultiplier * banner.xpMultiplier,
    jackpotRewardMultiplier: skin.jackpotRewardMultiplier * avatar.jackpotRewardMultiplier * banner.jackpotRewardMultiplier,

    mediumGemWeightBonus: skin.mediumGemWeightBonus + avatar.mediumGemWeightBonus + banner.mediumGemWeightBonus,
    bigGemWeightBonus: skin.bigGemWeightBonus + avatar.bigGemWeightBonus + banner.bigGemWeightBonus,
    shardWeightBonus: skin.shardWeightBonus + avatar.shardWeightBonus + banner.shardWeightBonus,
    bonusKeyWeightBonus: skin.bonusKeyWeightBonus + avatar.bonusKeyWeightBonus + banner.bonusKeyWeightBonus,
    reviveTokenWeightBonus: skin.reviveTokenWeightBonus + avatar.reviveTokenWeightBonus + banner.reviveTokenWeightBonus,
    jackpotWeightBonus: skin.jackpotWeightBonus + avatar.jackpotWeightBonus + banner.jackpotWeightBonus,
    trapWeightReduction: skin.trapWeightReduction + avatar.trapWeightReduction + banner.trapWeightReduction,

    reviveTokenBonus: skin.reviveTokenBonus + avatar.reviveTokenBonus + banner.reviveTokenBonus,
  };

  return {
    gemMultiplier: Math.min(raw.gemMultiplier, COSMETIC_BONUS_CAPS.maxGemMultiplier),
    shardMultiplier: Math.min(raw.shardMultiplier, COSMETIC_BONUS_CAPS.maxShardMultiplier),
    xpMultiplier: Math.min(raw.xpMultiplier, COSMETIC_BONUS_CAPS.maxXpMultiplier),
    jackpotRewardMultiplier: Math.min(raw.jackpotRewardMultiplier, COSMETIC_BONUS_CAPS.maxJackpotRewardMultiplier),

    mediumGemWeightBonus: Math.min(raw.mediumGemWeightBonus, COSMETIC_BONUS_CAPS.maxMediumGemWeightBonus),
    bigGemWeightBonus: Math.min(raw.bigGemWeightBonus, COSMETIC_BONUS_CAPS.maxBigGemWeightBonus),
    shardWeightBonus: Math.min(raw.shardWeightBonus, COSMETIC_BONUS_CAPS.maxShardWeightBonus),
    bonusKeyWeightBonus: Math.min(raw.bonusKeyWeightBonus, COSMETIC_BONUS_CAPS.maxBonusKeyWeightBonus),
    reviveTokenWeightBonus: Math.min(raw.reviveTokenWeightBonus, COSMETIC_BONUS_CAPS.maxReviveTokenWeightBonus),
    jackpotWeightBonus: Math.min(raw.jackpotWeightBonus, COSMETIC_BONUS_CAPS.maxJackpotWeightBonus),
    trapWeightReduction: Math.min(raw.trapWeightReduction, COSMETIC_BONUS_CAPS.maxTrapWeightReduction),

    reviveTokenBonus: raw.reviveTokenBonus,
  };
}

export const VAULT_WEIGHTS: Record<number, RewardWeights> = {
  1: {
    smallGems: 55,
    mediumGems: 20,
    bigGems: 0,
    multiplier: 20,
    bonusKey: 3,
    cosmeticShard: 0,
    bonusLife: 0,
    jackpot: 0,
    shardJackpot: 0,
    trap: 2,
  },
  2: {
    smallGems: 34,
    mediumGems: 23,
    bigGems: 0,
    multiplier: 20,
    bonusKey: 4,
    cosmeticShard: 5,
    bonusLife: 5,
    jackpot: 0,
    shardJackpot: 0,
    trap: 9,
  },
  3: {
    smallGems: 20,
    mediumGems: 27,
    bigGems: 10,
    multiplier: 18,
    bonusKey: 3,
    cosmeticShard: 6,
    bonusLife: 6,
    jackpot: 0,
    shardJackpot: 0,
    trap: 10,
  },
  4: {
    smallGems: 5,
    mediumGems: 15,
    bigGems: 12,
    multiplier: 15,
    bonusKey: 3,
    cosmeticShard: 12,
    bonusLife: 12,
    jackpot: 9,
    shardJackpot: 5,
    trap: 12,
  },
  5: {
    smallGems: 3,
    mediumGems: 0,
    bigGems: 20,
    multiplier: 17,
    bonusKey: 0,
    cosmeticShard: 12,
    bonusLife: 12,
    jackpot: 13,
    shardJackpot: 8,
    trap: 15,
  },
  6: {
    smallGems: 0,
    mediumGems: 8,
    bigGems: 22,
    multiplier: 11,
    bonusKey: 0,
    cosmeticShard: 12,
    bonusLife: 12,
    jackpot: 11,
    shardJackpot: 5,
    trap: 19,
  },
  7: {
    smallGems: 0,
    mediumGems: 6,
    bigGems: 26,
    multiplier: 10,
    bonusKey: 0,
    cosmeticShard: 10,
    bonusLife: 10,
    jackpot: 13,
    shardJackpot: 5,
    trap: 20,
  },
  8: {
    smallGems: 0,
    mediumGems: 0,
    bigGems: 26,
    multiplier: 14,
    bonusKey: 0,
    cosmeticShard: 10,
    bonusLife: 10,
    jackpot: 14,
    shardJackpot: 4,
    trap: 22,
  },
  9: {
    smallGems: 0,
    mediumGems: 0,
    bigGems: 22,
    multiplier: 13,
    bonusKey: 0,
    cosmeticShard: 12,
    bonusLife: 10,
    jackpot: 14,
    shardJackpot: 5,
    trap: 24,
  },
  10: {
    smallGems: 0,
    mediumGems: 0,
    bigGems: 18,
    multiplier: 15,
    bonusKey: 0,
    cosmeticShard: 12,
    bonusLife: 8,
    jackpot: 14,
    shardJackpot: 5,
    trap: 28,
  },
};

export function rollWeightedOutcome(weights: RewardWeights): OutcomeType {
  const entries = Object.entries(weights).filter(([, w]) => w > 0) as [OutcomeType, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  if (total <= 0) return "smallGems";

  let roll = Math.random() * total;
  for (const [type, w] of entries) {
    roll -= w;
    if (roll <= 0) return type;
  }
  return entries[entries.length - 1][0];
}

export function normalizeWeightsToPercentages(weights: RewardWeights): Record<string, number> {
  const entries = Object.entries(weights) as [OutcomeType, number][];
  const total = entries.reduce((sum, [, w]) => sum + Math.max(0, w), 0);
  if (total <= 0) {
    return Object.fromEntries(entries.map(([k]) => [k, 0])) as Record<string, number>;
  }
  return Object.fromEntries(
    entries.map(([k, w]) => [k, (Math.max(0, w) / total) * 100])
  ) as Record<string, number>;
}

export function applyCosmeticBonusesToWeights(baseWeights: RewardWeights, bonuses: CosmeticBonuses): RewardWeights {
  return {
    ...baseWeights,
    mediumGems: Math.max(0, baseWeights.mediumGems + bonuses.mediumGemWeightBonus),
    bigGems: Math.max(0, baseWeights.bigGems + bonuses.bigGemWeightBonus),
    cosmeticShard: Math.max(0, baseWeights.cosmeticShard + bonuses.shardWeightBonus),
    shardJackpot: Math.max(0, baseWeights.shardJackpot + bonuses.shardWeightBonus),
    bonusKey: Math.max(0, baseWeights.bonusKey + bonuses.bonusKeyWeightBonus),
    bonusLife: Math.max(0, baseWeights.bonusLife + bonuses.reviveTokenWeightBonus),
    jackpot: Math.max(0, baseWeights.jackpot + bonuses.jackpotWeightBonus),
    trap: Math.max(COSMETIC_BONUS_CAPS.minTrapWeight, baseWeights.trap - bonuses.trapWeightReduction),
  };
}

export function getDebugWeightInfo(vaultNumber: number, player: Player) {
  const bonuses = getActiveCosmeticBonuses(player);
  const baseWeights = VAULT_WEIGHTS[vaultNumber] ?? VAULT_WEIGHTS[MAX_DEFINED_VAULT];
  const finalWeights = applyCosmeticBonusesToWeights(baseWeights, bonuses);
  return {
    baseWeights,
    cosmeticBonuses: bonuses,
    finalWeights,
    displayPercentages: normalizeWeightsToPercentages(finalWeights),
  };
}

export function simulateRewardRolls(weights: RewardWeights, runs = 10000) {
  const counts: Record<string, number> = {};
  for (let i = 0; i < runs; i++) {
    const outcome = rollWeightedOutcome(weights);
    counts[outcome] = (counts[outcome] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(counts).map(([key, count]) => [
      key,
      `${((count / runs) * 100).toFixed(2)}%`,
    ])
  );
}

export const OUTCOME_BASE_LABELS: Record<OutcomeType, string> = {
  smallGems: "10-20 gems",
  mediumGems: "40-60 gems",
  bigGems: "80-120 gems",
  multiplier: "+0.5x",
  bonusKey: "1 key",
  cosmeticShard: "2-4 shards",
  trap: "Lose all",
  jackpot: "200-400 gems",
  bonusLife: "15-25 gems + 1 life",
  shardJackpot: "20-40 shards",
};

const MAX_DEFINED_VAULT = Math.max(...Object.keys(VAULT_WEIGHTS).map(Number));

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function vaultDepthMultiplier(vaultNum: number): number {
  return 1 + vaultNum * 0.05;
}

export function resolveVault(vaultNumber: number, multiplier: number, player: Player): VaultOutcome {
  const bonuses = getActiveCosmeticBonuses(player);
  const baseWeights = VAULT_WEIGHTS[vaultNumber] ?? VAULT_WEIGHTS[MAX_DEFINED_VAULT];
  const weights = applyCosmeticBonusesToWeights(baseWeights, bonuses);
  const type = rollWeightedOutcome(weights);
  const depth = vaultDepthMultiplier(vaultNumber);

  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    console.log('[resolveVault] vault:', vaultNumber, 'rolled:', type, getDebugWeightInfo(vaultNumber, player));
  }

  switch (type) {
    case "smallGems":
      return { type, label: "Small Gems", gems: Math.round(randInt(10, 20) * multiplier * bonuses.gemMultiplier * depth) };
    case "mediumGems":
      return { type, label: "Medium Gems", gems: Math.round(randInt(40, 60) * multiplier * bonuses.gemMultiplier * depth) };
    case "bigGems":
      return { type, label: "Big Gems", gems: Math.round(randInt(80, 120) * multiplier * bonuses.gemMultiplier * depth) };
    case "multiplier":
      return { type, label: "Multiplier Up!", multiplierDelta: 0.5 };
    case "bonusKey":
      return { type, label: "Bonus Key!", keys: 1 };
    case "cosmeticShard":
      return { type, label: "Cosmetic Shard!", shards: Math.round(randInt(2, 4) * bonuses.shardMultiplier * depth) };
    case "trap":
      return { type, label: "TRAP!", gems: 0 };
    case "jackpot":
      return { type, label: "JACKPOT!", gems: Math.round(randInt(200, 400) * multiplier * bonuses.jackpotRewardMultiplier * depth) };
    case "bonusLife":
      return { type, label: "Bonus Life!", gems: Math.round(randInt(15, 25) * multiplier * bonuses.gemMultiplier * depth) };
    case "shardJackpot":
      return { type, label: "SHARD JACKPOT!", shards: Math.round(randInt(20, 40) * bonuses.shardMultiplier * depth) };
    default:
      return { type: "smallGems", label: "Small Gems", gems: Math.round(randInt(5, 10) * multiplier * bonuses.gemMultiplier * depth) };
  }
}

export function getRiskPercent(vaultNumber: number, player?: Player): number {
  const maxVault = Math.max(...Object.keys(VAULT_WEIGHTS).map(Number));
  const baseWeights = VAULT_WEIGHTS[vaultNumber] ?? VAULT_WEIGHTS[maxVault];
  const weights = player ? applyCosmeticBonusesToWeights(baseWeights, getActiveCosmeticBonuses(player)) : baseWeights;
  const normalized = normalizeWeightsToPercentages(weights);
  return Math.round(normalized.trap ?? 30);
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
    unbankedKeys: 0,
    unbankedShards: 0,
    unbankedReviveTokens: 0,
    currentMultiplier: 1,
    isTrapTriggered: false,
    isRunActive: false,
    history: [],
    gemsBanked: 0,
    reviveUsed: false,
  };
}
