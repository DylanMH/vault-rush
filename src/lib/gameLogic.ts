import { VaultOutcome, OutcomeType, Player, RunState, CosmeticBonuses, RewardWeights } from "@/types/game";

export const COSMETIC_BONUS_CAPS = {
  maxGemMultiplier: 1.60,
  maxShardMultiplier: 1.50,
  maxXpMultiplier: 1.35,
  maxJackpotRewardMultiplier: 1.60,

  maxMediumGemWeightBonus: 12,
  maxBigGemWeightBonus: 8,
  maxShardWeightBonus: 10,
  maxBonusKeyWeightBonus: 6,
  maxReviveTokenWeightBonus: 6,
  maxJackpotWeightBonus: 10,
  maxTrapWeightReduction: 12,
  maxMultiplierWeightBonus: 8,
  maxShardJackpotWeightBonus: 8,

  minTrapWeight: 2,

  maxTrapAutoReviveChance: 0.60,
  maxShardDuplicationChance: 0.50,
  maxGemUpgradeChance: 0.40,
  maxDeepVaultGemBonus: 1.40,
  maxLateBankBonus: 0.50,
};

function b(
  overrides: Partial<CosmeticBonuses> = {}
): CosmeticBonuses {
  return {
    gemMultiplier: 1,
    shardMultiplier: 1,
    xpMultiplier: 1,
    jackpotRewardMultiplier: 1,
    mediumGemWeightBonus: 0,
    bigGemWeightBonus: 0,
    shardWeightBonus: 0,
    bonusKeyWeightBonus: 0,
    reviveTokenWeightBonus: 0,
    jackpotWeightBonus: 0,
    trapWeightReduction: 0,
    multiplierWeightBonus: 0,
    shardJackpotWeightBonus: 0,
    reviveTokenBonus: 0,
    trapAutoReviveChance: 0,
    shardDuplicationChance: 0,
    gemUpgradeChance: 0,
    deepVaultGemBonus: 1,
    lateBankBonus: 0,
    guaranteedSafeInterval: 0,
    ...overrides,
  };
}

export const COSMETIC_BONUSES: Record<string, CosmeticBonuses> = {
  // Vault Skins — smaller bonuses, cheapest
  "vault-default": b(),
  "vault-blue-sapphire": b({ gemMultiplier: 1.1, jackpotRewardMultiplier: 1.1, mediumGemWeightBonus: 2 }),
  "vault-red-ruby": b({ trapWeightReduction: 2 }),
  "vault-purple-cosmic": b({ gemMultiplier: 1.5, xpMultiplier: 1.05, jackpotRewardMultiplier: 1.5, mediumGemWeightBonus: 3, jackpotWeightBonus: 5 }),
  "vault-plus": b({ gemMultiplier: 1.5, jackpotRewardMultiplier: 1.5 }),

  // Banners (Badge Frames) — medium bonuses, medium price
  "banner-default": b(),
  "banner-heart": b({ reviveTokenBonus: 1 }),
  "banner-ice": b({ trapWeightReduction: 3 }),
  "banner-emerald": b({ gemMultiplier: 1.1, jackpotRewardMultiplier: 1.1, mediumGemWeightBonus: 3 }),
  "banner-ruby": b({ gemMultiplier: 1.2, jackpotRewardMultiplier: 1.2, jackpotWeightBonus: 2 }),
  "banner-diamond": b({ mediumGemWeightBonus: 5, jackpotWeightBonus: 5 }),
  "banner-galaxy": b({ shardMultiplier: 1.3, xpMultiplier: 1.08 }),
  "banner-golden-bird": b({ xpMultiplier: 1.12 }),
  "banner-champion": b({ gemMultiplier: 1.15, shardMultiplier: 1.2, xpMultiplier: 1.1, jackpotRewardMultiplier: 1.15, mediumGemWeightBonus: 3, jackpotWeightBonus: 4, trapWeightReduction: 2 }),

  // Avatars — strongest bonuses, most expensive
  "avatar-basic": b(),
  "avatar-champion": b({ gemMultiplier: 1.2, jackpotRewardMultiplier: 1.2, mediumGemWeightBonus: 5, jackpotWeightBonus: 3 }),
  "avatar-galaxy": b({ shardMultiplier: 1.25, jackpotWeightBonus: 8 }),
  "avatar-pirate": b({ gemMultiplier: 1.3, jackpotRewardMultiplier: 1.3, trapWeightReduction: 4 }),
  "avatar-joker": b({ jackpotWeightBonus: 12, trapWeightReduction: -2 }),
  "avatar-shadow": b({ xpMultiplier: 1.05, mediumGemWeightBonus: 8, trapWeightReduction: 6 }),
  "avatar-dragon": b({ gemMultiplier: 1.4, shardMultiplier: 1.3, xpMultiplier: 1.1, jackpotRewardMultiplier: 1.4, mediumGemWeightBonus: 5, jackpotWeightBonus: 6, trapWeightReduction: 3 }),

  // ─── MYTHIC SETS ───

  // Guardian Set — Survival
  "vault-mythic-guardian": b({ trapWeightReduction: 5, mediumGemWeightBonus: 3, reviveTokenWeightBonus: 2 }),
  "banner-mythic-guardian": b({ reviveTokenBonus: 1, trapWeightReduction: 3, trapAutoReviveChance: 0.05 }),
  "avatar-mythic-guardian": b({ trapWeightReduction: 8, trapAutoReviveChance: 0.10 }),

  // Crystal Set — Gem Wealth
  "vault-mythic-crystal": b({ gemMultiplier: 1.2, mediumGemWeightBonus: 3 }),
  "banner-mythic-crystal": b({ bigGemWeightBonus: 5, shardDuplicationChance: 0.05 }),
  "avatar-mythic-crystal": b({ gemMultiplier: 1.3, gemUpgradeChance: 0.10 }),

  // Void Set — Deep Runs
  "vault-mythic-void": b({ multiplierWeightBonus: 5, gemMultiplier: 1.1 }),
  "banner-mythic-void": b({ xpMultiplier: 1.1, multiplierWeightBonus: 3 }),
  "avatar-mythic-void": b({ gemMultiplier: 1.2, xpMultiplier: 1.1 }),

  // Oblivion Set — Jackpot Hunter
  "vault-mythic-oblivion": b({ jackpotWeightBonus: 5, jackpotRewardMultiplier: 1.2 }),
  "banner-mythic-oblivion": b({ shardJackpotWeightBonus: 5, jackpotWeightBonus: 3 }),
  "avatar-mythic-oblivion": b({ jackpotRewardMultiplier: 1.3, bigGemWeightBonus: 5 }),

  // God Set — RNG Control
  "vault-mythic-god": b({ trapWeightReduction: 4, bonusKeyWeightBonus: 3 }),
  "banner-mythic-god": b({ jackpotWeightBonus: 4, reviveTokenWeightBonus: 3 }),
  "avatar-mythic-god": b({ gemMultiplier: 1.3, jackpotRewardMultiplier: 1.2 }),

  // Ethereal Set — Ultimate Hybrid
  "vault-mythic-ethereal": b({ gemMultiplier: 1.25, shardMultiplier: 1.2 }),
  "banner-mythic-ethereal": b({ xpMultiplier: 1.15, shardWeightBonus: 5 }),
  "avatar-mythic-ethereal": b({ gemMultiplier: 1.3, jackpotWeightBonus: 6 }),
};

export const MYTHIC_SETS: Record<string, { name: string; items: string[] }> = {
  guardian: { name: "Guardian", items: ["vault-mythic-guardian", "banner-mythic-guardian", "avatar-mythic-guardian"] },
  crystal: { name: "Crystal", items: ["vault-mythic-crystal", "banner-mythic-crystal", "avatar-mythic-crystal"] },
  void: { name: "Void", items: ["vault-mythic-void", "banner-mythic-void", "avatar-mythic-void"] },
  oblivion: { name: "Oblivion", items: ["vault-mythic-oblivion", "banner-mythic-oblivion", "avatar-mythic-oblivion"] },
  god: { name: "God", items: ["vault-mythic-god", "banner-mythic-god", "avatar-mythic-god"] },
  ethereal: { name: "Ethereal", items: ["vault-mythic-ethereal", "banner-mythic-ethereal", "avatar-mythic-ethereal"] },
};

export const SET_BONUSES: Record<string, { name: string; description: string; bonuses: CosmeticBonuses }> = {
  guardian: {
    name: "Aegis Shield",
    description: "+25% trap auto-revive chance",
    bonuses: b({ trapAutoReviveChance: 0.25 }),
  },
  crystal: {
    name: "Crystal Refraction",
    description: "+15% chance small gems upgrade to medium",
    bonuses: b({ gemUpgradeChance: 0.15 }),
  },
  void: {
    name: "Void Walk",
    description: "Vaults 8+ grant +20% additional gems",
    bonuses: b({ deepVaultGemBonus: 1.20 }),
  },
  oblivion: {
    name: "Oblivion Surge",
    description: "Bank after 5+ safe vaults for +30% gems",
    bonuses: b({ lateBankBonus: 0.30 }),
  },
  god: {
    name: "Divine Intervention",
    description: "Every 4th vault is guaranteed safe",
    bonuses: b({ guaranteedSafeInterval: 4 }),
  },
  ethereal: {
    name: "Ethereal Echo",
    description: "20% chance to duplicate all rewards on bank",
    bonuses: b({ gemMultiplier: 1.05 }),
  },
};

export function getActiveMythicSet(player: Player): string | null {
  const activeItems = [player.activeVaultSkin, player.activeBadgeFrame, player.activeAvatar];
  for (const [setId, setData] of Object.entries(MYTHIC_SETS)) {
    if (setData.items.every((id) => activeItems.includes(id))) {
      return setId;
    }
  }
  return null;
}

export function getAutoReviveSource(player: Player): string {
  const avatar = COSMETIC_BONUSES[player.activeAvatar] ?? COSMETIC_BONUSES["avatar-basic"];
  const banner = COSMETIC_BONUSES[player.activeBadgeFrame] ?? COSMETIC_BONUSES["banner-default"];
  const activeSet = getActiveMythicSet(player);
  const setBonus = activeSet ? SET_BONUSES[activeSet]?.bonuses ?? b() : b();

  const avatarChance = avatar.trapAutoReviveChance;
  const bannerChance = banner.trapAutoReviveChance;
  const setChance = setBonus.trapAutoReviveChance;
  const total = avatarChance + bannerChance + setChance;

  if (total <= 0) return "";

  const setName = activeSet ? MYTHIC_SETS[activeSet]?.name ?? "Mythic" : "Mythic";

  const roll = Math.random() * total;
  if (roll < avatarChance) {
    return `${setName} Avatar`;
  }
  if (roll < avatarChance + bannerChance) {
    return `${setName} Banner`;
  }
  if (activeSet) {
    return `${MYTHIC_SETS[activeSet].name} Set Bonus`;
  }
  return "Auto-Revive";
}

export function getActiveCosmeticBonuses(player: Player): CosmeticBonuses {
  const skin = COSMETIC_BONUSES[player.activeVaultSkin] ?? COSMETIC_BONUSES["vault-default"];
  const avatar = COSMETIC_BONUSES[player.activeAvatar] ?? COSMETIC_BONUSES["avatar-basic"];
  const banner = COSMETIC_BONUSES[player.activeBadgeFrame] ?? COSMETIC_BONUSES["banner-default"];

  const activeSet = getActiveMythicSet(player);
  const setBonus = activeSet ? SET_BONUSES[activeSet]?.bonuses ?? b() : b();

  const raw: CosmeticBonuses = {
    gemMultiplier: skin.gemMultiplier * avatar.gemMultiplier * banner.gemMultiplier * setBonus.gemMultiplier,
    shardMultiplier: skin.shardMultiplier * avatar.shardMultiplier * banner.shardMultiplier * setBonus.shardMultiplier,
    xpMultiplier: skin.xpMultiplier * avatar.xpMultiplier * banner.xpMultiplier * setBonus.xpMultiplier,
    jackpotRewardMultiplier: skin.jackpotRewardMultiplier * avatar.jackpotRewardMultiplier * banner.jackpotRewardMultiplier * setBonus.jackpotRewardMultiplier,

    mediumGemWeightBonus: skin.mediumGemWeightBonus + avatar.mediumGemWeightBonus + banner.mediumGemWeightBonus + setBonus.mediumGemWeightBonus,
    bigGemWeightBonus: skin.bigGemWeightBonus + avatar.bigGemWeightBonus + banner.bigGemWeightBonus + setBonus.bigGemWeightBonus,
    shardWeightBonus: skin.shardWeightBonus + avatar.shardWeightBonus + banner.shardWeightBonus + setBonus.shardWeightBonus,
    bonusKeyWeightBonus: skin.bonusKeyWeightBonus + avatar.bonusKeyWeightBonus + banner.bonusKeyWeightBonus + setBonus.bonusKeyWeightBonus,
    reviveTokenWeightBonus: skin.reviveTokenWeightBonus + avatar.reviveTokenWeightBonus + banner.reviveTokenWeightBonus + setBonus.reviveTokenWeightBonus,
    jackpotWeightBonus: skin.jackpotWeightBonus + avatar.jackpotWeightBonus + banner.jackpotWeightBonus + setBonus.jackpotWeightBonus,
    trapWeightReduction: skin.trapWeightReduction + avatar.trapWeightReduction + banner.trapWeightReduction + setBonus.trapWeightReduction,
    multiplierWeightBonus: skin.multiplierWeightBonus + avatar.multiplierWeightBonus + banner.multiplierWeightBonus + setBonus.multiplierWeightBonus,
    shardJackpotWeightBonus: skin.shardJackpotWeightBonus + avatar.shardJackpotWeightBonus + banner.shardJackpotWeightBonus + setBonus.shardJackpotWeightBonus,

    reviveTokenBonus: skin.reviveTokenBonus + avatar.reviveTokenBonus + banner.reviveTokenBonus + setBonus.reviveTokenBonus,

    trapAutoReviveChance: skin.trapAutoReviveChance + avatar.trapAutoReviveChance + banner.trapAutoReviveChance + setBonus.trapAutoReviveChance,
    shardDuplicationChance: skin.shardDuplicationChance + avatar.shardDuplicationChance + banner.shardDuplicationChance + setBonus.shardDuplicationChance,
    gemUpgradeChance: skin.gemUpgradeChance + avatar.gemUpgradeChance + banner.gemUpgradeChance + setBonus.gemUpgradeChance,
    deepVaultGemBonus: skin.deepVaultGemBonus * avatar.deepVaultGemBonus * banner.deepVaultGemBonus * setBonus.deepVaultGemBonus,
    lateBankBonus: skin.lateBankBonus + avatar.lateBankBonus + banner.lateBankBonus + setBonus.lateBankBonus,
    guaranteedSafeInterval: setBonus.guaranteedSafeInterval || skin.guaranteedSafeInterval || avatar.guaranteedSafeInterval || banner.guaranteedSafeInterval,
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
    multiplierWeightBonus: Math.min(raw.multiplierWeightBonus, COSMETIC_BONUS_CAPS.maxMultiplierWeightBonus),
    shardJackpotWeightBonus: Math.min(raw.shardJackpotWeightBonus, COSMETIC_BONUS_CAPS.maxShardJackpotWeightBonus),

    reviveTokenBonus: raw.reviveTokenBonus,

    trapAutoReviveChance: Math.min(raw.trapAutoReviveChance, COSMETIC_BONUS_CAPS.maxTrapAutoReviveChance),
    shardDuplicationChance: Math.min(raw.shardDuplicationChance, COSMETIC_BONUS_CAPS.maxShardDuplicationChance),
    gemUpgradeChance: Math.min(raw.gemUpgradeChance, COSMETIC_BONUS_CAPS.maxGemUpgradeChance),
    deepVaultGemBonus: Math.min(raw.deepVaultGemBonus, COSMETIC_BONUS_CAPS.maxDeepVaultGemBonus),
    lateBankBonus: Math.min(raw.lateBankBonus, COSMETIC_BONUS_CAPS.maxLateBankBonus),
    guaranteedSafeInterval: raw.guaranteedSafeInterval,
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
    shardJackpot: Math.max(0, baseWeights.shardJackpot + bonuses.shardJackpotWeightBonus),
    bonusKey: Math.max(0, baseWeights.bonusKey + bonuses.bonusKeyWeightBonus),
    bonusLife: Math.max(0, baseWeights.bonusLife + bonuses.reviveTokenWeightBonus),
    jackpot: Math.max(0, baseWeights.jackpot + bonuses.jackpotWeightBonus),
    multiplier: Math.max(0, baseWeights.multiplier + bonuses.multiplierWeightBonus),
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
  let weights = applyCosmeticBonusesToWeights(baseWeights, bonuses);

  // Guaranteed safe interval — remove trap from eligible vaults
  if (bonuses.guaranteedSafeInterval > 0 && vaultNumber > 0 && vaultNumber % bonuses.guaranteedSafeInterval === 0) {
    weights = { ...weights, trap: 0 };
  }

  let type = rollWeightedOutcome(weights);
  const depth = vaultDepthMultiplier(vaultNumber);

  // Gem upgrade chance — small gems may upgrade to medium
  if (type === "smallGems" && bonuses.gemUpgradeChance > 0 && Math.random() < bonuses.gemUpgradeChance) {
    type = "mediumGems";
  }

  // Deep vault gem bonus applies to vaults 8+
  const deepMult = vaultNumber >= 8 ? bonuses.deepVaultGemBonus : 1;

  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    console.log('[resolveVault] vault:', vaultNumber, 'rolled:', type, getDebugWeightInfo(vaultNumber, player));
  }

  switch (type) {
    case "smallGems":
      return { type, label: "Small Gems", gems: Math.round(randInt(10, 20) * multiplier * bonuses.gemMultiplier * depth * deepMult) };
    case "mediumGems":
      return { type, label: "Medium Gems", gems: Math.round(randInt(40, 60) * multiplier * bonuses.gemMultiplier * depth * deepMult) };
    case "bigGems":
      return { type, label: "Big Gems", gems: Math.round(randInt(80, 120) * multiplier * bonuses.gemMultiplier * depth * deepMult) };
    case "multiplier":
      return { type, label: "Multiplier Up!", multiplierDelta: 0.5 };
    case "bonusKey":
      return { type, label: "Bonus Key!", keys: 1 };
    case "cosmeticShard": {
      const shards = Math.round(randInt(2, 4) * bonuses.shardMultiplier * depth);
      const duped = bonuses.shardDuplicationChance > 0 && Math.random() < bonuses.shardDuplicationChance;
      return { type, label: "Cosmetic Shard!", shards: duped ? shards * 2 : shards };
    }
    case "trap":
      return { type, label: "TRAP!", gems: 0 };
    case "jackpot":
      return { type, label: "JACKPOT!", gems: Math.round(randInt(200, 400) * multiplier * bonuses.jackpotRewardMultiplier * depth * deepMult) };
    case "bonusLife":
      return { type, label: "Bonus Life!", gems: Math.round(randInt(15, 25) * multiplier * bonuses.gemMultiplier * depth * deepMult) };
    case "shardJackpot": {
      const shards = Math.round(randInt(20, 40) * bonuses.shardMultiplier * depth);
      const duped = bonuses.shardDuplicationChance > 0 && Math.random() < bonuses.shardDuplicationChance;
      return { type, label: "SHARD JACKPOT!", shards: duped ? shards * 2 : shards };
    }
    default:
      return { type: "smallGems", label: "Small Gems", gems: Math.round(randInt(5, 10) * multiplier * bonuses.gemMultiplier * depth * deepMult) };
  }
}

export function getRiskPercent(vaultNumber: number, player?: Player): number {
  const maxVault = Math.max(...Object.keys(VAULT_WEIGHTS).map(Number));
  const baseWeights = VAULT_WEIGHTS[vaultNumber] ?? VAULT_WEIGHTS[maxVault];
  const weights = player ? applyCosmeticBonusesToWeights(baseWeights, getActiveCosmeticBonuses(player)) : baseWeights;

  // Guaranteed safe interval shows 0% risk
  if (player) {
    const bonuses = getActiveCosmeticBonuses(player);
    if (bonuses.guaranteedSafeInterval > 0 && vaultNumber > 0 && vaultNumber % bonuses.guaranteedSafeInterval === 0) {
      return 0;
    }
  }

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
    betaTesterRewarded: false,
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
