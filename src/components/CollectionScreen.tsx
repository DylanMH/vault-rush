"use client";

import { useState } from "react";
import { ChevronLeft, Gem, Lock, Crown } from "lucide-react";
import { Player, CosmeticItem } from "@/types/game";
import { useSound } from "@/hooks/useSound";
import { COSMETIC_BONUSES, MYTHIC_SETS, SET_BONUSES } from "@/lib/gameLogic";
import Image from "next/image";

type TabKey = "vaultSkin" | "badgeFrame" | "avatar" | "mythic";

function formatBonus(id: string): string {
  const b = COSMETIC_BONUSES[id];
  if (!b) return "";
  const parts: string[] = [];
  if (b.gemMultiplier > 1) parts.push(`${b.gemMultiplier}x Gems`);
  if (b.jackpotWeightBonus > 0) parts.push(`+${b.jackpotWeightBonus} Jackpot Chance`);
  if (b.mediumGemWeightBonus > 0) parts.push(`+${b.mediumGemWeightBonus} Med Gem Chance`);
  if (b.bigGemWeightBonus > 0) parts.push(`+${b.bigGemWeightBonus} Big Gem Chance`);
  if (b.trapWeightReduction > 0) parts.push(`-${b.trapWeightReduction} Trap Chance`);
  if (b.shardMultiplier > 1) parts.push(`${b.shardMultiplier}x Shards`);
  if (b.xpMultiplier > 1) parts.push(`+${Math.round((b.xpMultiplier - 1) * 100)}% XP`);
  if (b.reviveTokenBonus > 0) parts.push(`+${b.reviveTokenBonus} Revive`);
  if (b.multiplierWeightBonus > 0) parts.push(`+${b.multiplierWeightBonus} Mult Chance`);
  if (b.shardJackpotWeightBonus > 0) parts.push(`+${b.shardJackpotWeightBonus} Shard Jpot Chance`);
  if (b.trapAutoReviveChance > 0) parts.push(`${Math.round(b.trapAutoReviveChance * 100)}% Auto-Revive`);
  if (b.shardDuplicationChance > 0) parts.push(`${Math.round(b.shardDuplicationChance * 100)}% Shard Dupe`);
  if (b.gemUpgradeChance > 0) parts.push(`${Math.round(b.gemUpgradeChance * 100)}% Gem Upgrade`);
  if (b.deepVaultGemBonus > 1) parts.push(`+${Math.round((b.deepVaultGemBonus - 1) * 100)}% Deep Vault Gems`);
  if (b.lateBankBonus > 0) parts.push(`+${Math.round(b.lateBankBonus * 100)}% Late Bank`);
  if (b.guaranteedSafeInterval > 0) parts.push(`Safe every ${b.guaranteedSafeInterval} vaults`);
  return parts.join(" · ");
}

function getCosmeticImage(id: string): string {
  const map: Record<string, string> = {
    "vault-default": "/assets/vaults/green_emerald_vault.png",
    "vault-blue-sapphire": "/assets/vaults/blue_sapphire_vault.png",
    "vault-red-ruby": "/assets/vaults/red_ruby_vault.png",
    "vault-purple-cosmic": "/assets/vaults/purple_cosmic_vault.png",
    "vault-plus": "/assets/vaults/gold_legendary_vault.png",
    "banner-default": "/assets/banners/emerald-banner.png",
    "banner-heart": "/assets/banners/heart-banner.png",
    "banner-ice": "/assets/banners/ice-banner.png",
    "banner-emerald": "/assets/banners/emerald-banner.png",
    "banner-ruby": "/assets/banners/ruby-banner.png",
    "banner-diamond": "/assets/banners/diamond-banner.png",
    "banner-galaxy": "/assets/banners/galaxy-banner.png",
    "banner-golden-bird": "/assets/banners/golden-bird-banner.png",
    "banner-champion": "/assets/banners/champion-banner.png",
    "avatar-basic": "/assets/avatars/basic-avatar.png",
    "avatar-champion": "/assets/avatars/champion-avatar.png",
    "avatar-galaxy": "/assets/avatars/galaxy-avatar.png",
    "avatar-pirate": "/assets/avatars/pirate-avatar.png",
    "avatar-joker": "/assets/avatars/joker-avatar.png",
    "avatar-shadow": "/assets/avatars/shadow-avatar.png",
    "avatar-dragon": "/assets/avatars/dragon-avatar.png",
    "vault-mythic-guardian": "/assets/mythic-vaults/mythic-guardian.png",
    "vault-mythic-crystal": "/assets/mythic-vaults/mythic-crystal.png",
    "vault-mythic-void": "/assets/mythic-vaults/mythic-void.png",
    "vault-mythic-oblivion": "/assets/mythic-vaults/mythic-oblivion.png",
    "vault-mythic-god": "/assets/mythic-vaults/mythic-god.png",
    "vault-mythic-ethereal": "/assets/mythic-vaults/mythic-ethereal.png",
    "banner-mythic-guardian": "/assets/mythic-banners/mythic-guardian.png",
    "banner-mythic-crystal": "/assets/mythic-banners/mythic-crystal.png",
    "banner-mythic-void": "/assets/mythic-banners/mythic-void.png",
    "banner-mythic-oblivion": "/assets/mythic-banners/mythic-oblivion.png",
    "banner-mythic-god": "/assets/mythic-banners/mythic-god.png",
    "banner-mythic-ethereal": "/assets/mythic-banners/mythic-ethereal.png",
    "avatar-mythic-guardian": "/assets/mythic-avatars/mythic-guardian.png",
    "avatar-mythic-crystal": "/assets/mythic-avatars/mythic-crystal.png",
    "avatar-mythic-void": "/assets/mythic-avatars/mythic-void.png",
    "avatar-mythic-oblivion": "/assets/mythic-avatars/mythic-oblivion.png",
    "avatar-mythic-god": "/assets/mythic-avatars/mythic-god.png",
    "avatar-mythic-ethereal": "/assets/mythic-avatars/mythic-ethereal.png",
  };
  return map[id] || "";
}

const COSMETICS: CosmeticItem[] = [
  // Vault Skins
  { id: "vault-default", name: "Standard Vault", type: "vaultSkin", description: "The classic emerald vault design", shardCost: 0, icon: "", bonuses: COSMETIC_BONUSES["vault-default"] },
  { id: "vault-blue-sapphire", name: "Blue Sapphire", type: "vaultSkin", description: "Slight gem boost from sapphire energy", shardCost: 30, icon: "", bonuses: COSMETIC_BONUSES["vault-blue-sapphire"] },
  { id: "vault-red-ruby", name: "Red Ruby", type: "vaultSkin", description: "Small trap resistance from ruby power", shardCost: 100, icon: "", bonuses: COSMETIC_BONUSES["vault-red-ruby"] },
  { id: "vault-purple-cosmic", name: "Purple Cosmic", type: "vaultSkin", description: "Best vault bonuses + XP boost", shardCost: 250, icon: "", bonuses: COSMETIC_BONUSES["vault-purple-cosmic"] },
  { id: "vault-plus", name: "Plus Vault", type: "vaultSkin", description: "Vault Rush Plus exclusive skin", shardCost: 0, icon: "", bonuses: COSMETIC_BONUSES["vault-plus"] },

  // Banners
  { id: "banner-default", name: "Emerald Banner", type: "badgeFrame", description: "Starter emerald banner frame", shardCost: 0, icon: "", bonuses: COSMETIC_BONUSES["banner-default"] },
  { id: "banner-heart", name: "Heart Banner", type: "badgeFrame", description: "Bonus revive token on runs", shardCost: 100, icon: "", bonuses: COSMETIC_BONUSES["banner-heart"] },
  { id: "banner-ice", name: "Ice Banner", type: "badgeFrame", description: "Trap reduction for safer runs", shardCost: 200, icon: "", bonuses: COSMETIC_BONUSES["banner-ice"] },
  { id: "banner-emerald", name: "Emerald Banner", type: "badgeFrame", description: "Better medium gem chances", shardCost: 350, icon: "", bonuses: COSMETIC_BONUSES["banner-emerald"] },
  { id: "banner-ruby", name: "Ruby Banner", type: "badgeFrame", description: "Gem boost + jackpot chance", shardCost: 500, icon: "", bonuses: COSMETIC_BONUSES["banner-ruby"] },
  { id: "banner-diamond", name: "Diamond Banner", type: "badgeFrame", description: "Jackpot & medium gem hunter", shardCost: 650, icon: "", bonuses: COSMETIC_BONUSES["banner-diamond"] },
  { id: "banner-galaxy", name: "Galaxy Banner", type: "badgeFrame", description: "Shard multiplier + XP boost", shardCost: 800, icon: "", bonuses: COSMETIC_BONUSES["banner-galaxy"] },
  { id: "banner-golden-bird", name: "Golden Bird", type: "badgeFrame", description: "Strong XP boost for leveling fast", shardCost: 1000, icon: "", bonuses: COSMETIC_BONUSES["banner-golden-bird"] },
  { id: "banner-champion", name: "Champion Banner", type: "badgeFrame", description: "Best all-around banner bonuses", shardCost: 1500, icon: "", bonuses: COSMETIC_BONUSES["banner-champion"] },

  // Avatars
  { id: "avatar-basic", name: "Basic", type: "avatar", description: "Clean and simple — no bonuses", shardCost: 0, icon: "", bonuses: COSMETIC_BONUSES["avatar-basic"] },
  { id: "avatar-champion", name: "Champion", type: "avatar", description: "Gem boost + better medium gems", shardCost: 300, icon: "", bonuses: COSMETIC_BONUSES["avatar-champion"] },
  { id: "avatar-galaxy", name: "Galaxy", type: "avatar", description: "Jackpot hunter + shard boost", shardCost: 500, icon: "", bonuses: COSMETIC_BONUSES["avatar-galaxy"] },
  { id: "avatar-pirate", name: "Pirate", type: "avatar", description: "Gem magnet with trap resistance", shardCost: 750, icon: "", bonuses: COSMETIC_BONUSES["avatar-pirate"] },
  { id: "avatar-joker", name: "Joker", type: "avatar", description: "High risk, high reward jackpot master", shardCost: 1000, icon: "", bonuses: COSMETIC_BONUSES["avatar-joker"] },
  { id: "avatar-shadow", name: "Shadow", type: "avatar", description: "Trap dodger + medium gem finder", shardCost: 1250, icon: "", bonuses: COSMETIC_BONUSES["avatar-shadow"] },
  { id: "avatar-dragon", name: "Dragon", type: "avatar", description: "Vault Rush Plus exclusive — best bonuses", shardCost: 0, icon: "", bonuses: COSMETIC_BONUSES["avatar-dragon"] },

  // Mythic Sets
  { id: "vault-mythic-guardian", name: "Guardian Vault", type: "vaultSkin", description: "Mythic survival vault skin", shardCost: 1500, icon: "", bonuses: COSMETIC_BONUSES["vault-mythic-guardian"], setId: "guardian" },
  { id: "banner-mythic-guardian", name: "Guardian Banner", type: "badgeFrame", description: "Mythic survival banner", shardCost: 2000, icon: "", bonuses: COSMETIC_BONUSES["banner-mythic-guardian"], setId: "guardian" },
  { id: "avatar-mythic-guardian", name: "Guardian Avatar", type: "avatar", description: "Mythic survival avatar", shardCost: 2500, icon: "", bonuses: COSMETIC_BONUSES["avatar-mythic-guardian"], setId: "guardian" },

  { id: "vault-mythic-crystal", name: "Crystal Vault", type: "vaultSkin", description: "Mythic gem wealth vault skin", shardCost: 2000, icon: "", bonuses: COSMETIC_BONUSES["vault-mythic-crystal"], setId: "crystal" },
  { id: "banner-mythic-crystal", name: "Crystal Banner", type: "badgeFrame", description: "Mythic gem wealth banner", shardCost: 2500, icon: "", bonuses: COSMETIC_BONUSES["banner-mythic-crystal"], setId: "crystal" },
  { id: "avatar-mythic-crystal", name: "Crystal Avatar", type: "avatar", description: "Mythic gem wealth avatar", shardCost: 3000, icon: "", bonuses: COSMETIC_BONUSES["avatar-mythic-crystal"], setId: "crystal" },

  { id: "vault-mythic-void", name: "Void Vault", type: "vaultSkin", description: "Mythic deep run vault skin", shardCost: 2500, icon: "", bonuses: COSMETIC_BONUSES["vault-mythic-void"], setId: "void" },
  { id: "banner-mythic-void", name: "Void Banner", type: "badgeFrame", description: "Mythic deep run banner", shardCost: 3000, icon: "", bonuses: COSMETIC_BONUSES["banner-mythic-void"], setId: "void" },
  { id: "avatar-mythic-void", name: "Void Avatar", type: "avatar", description: "Mythic deep run avatar", shardCost: 3500, icon: "", bonuses: COSMETIC_BONUSES["avatar-mythic-void"], setId: "void" },

  { id: "vault-mythic-oblivion", name: "Oblivion Vault", type: "vaultSkin", description: "Mythic jackpot hunter vault skin", shardCost: 3000, icon: "", bonuses: COSMETIC_BONUSES["vault-mythic-oblivion"], setId: "oblivion" },
  { id: "banner-mythic-oblivion", name: "Oblivion Banner", type: "badgeFrame", description: "Mythic jackpot hunter banner", shardCost: 3500, icon: "", bonuses: COSMETIC_BONUSES["banner-mythic-oblivion"], setId: "oblivion" },
  { id: "avatar-mythic-oblivion", name: "Oblivion Avatar", type: "avatar", description: "Mythic jackpot hunter avatar", shardCost: 4000, icon: "", bonuses: COSMETIC_BONUSES["avatar-mythic-oblivion"], setId: "oblivion" },

  { id: "vault-mythic-god", name: "God Vault", type: "vaultSkin", description: "Mythic RNG control vault skin", shardCost: 3500, icon: "", bonuses: COSMETIC_BONUSES["vault-mythic-god"], setId: "god" },
  { id: "banner-mythic-god", name: "God Banner", type: "badgeFrame", description: "Mythic RNG control banner", shardCost: 4000, icon: "", bonuses: COSMETIC_BONUSES["banner-mythic-god"], setId: "god" },
  { id: "avatar-mythic-god", name: "God Avatar", type: "avatar", description: "Mythic RNG control avatar", shardCost: 4500, icon: "", bonuses: COSMETIC_BONUSES["avatar-mythic-god"], setId: "god" },

  { id: "vault-mythic-ethereal", name: "Ethereal Vault", type: "vaultSkin", description: "Mythic ultimate hybrid vault skin", shardCost: 4000, icon: "", bonuses: COSMETIC_BONUSES["vault-mythic-ethereal"], setId: "ethereal" },
  { id: "banner-mythic-ethereal", name: "Ethereal Banner", type: "badgeFrame", description: "Mythic ultimate hybrid banner", shardCost: 4500, icon: "", bonuses: COSMETIC_BONUSES["banner-mythic-ethereal"], setId: "ethereal" },
  { id: "avatar-mythic-ethereal", name: "Ethereal Avatar", type: "avatar", description: "Mythic ultimate hybrid avatar", shardCost: 5000, icon: "", bonuses: COSMETIC_BONUSES["avatar-mythic-ethereal"], setId: "ethereal" },
];

interface CollectionScreenProps {
  player: Player;
  onBack: () => void;
  onUnlock: (item: CosmeticItem) => boolean | Promise<boolean>;
  onEquip: (id: string, type: "vaultSkin" | "avatar" | "badgeFrame") => void;
}

export default function CollectionScreen({ player, onBack, onUnlock, onEquip }: CollectionScreenProps) {
  const sound = useSound();
  const [activeTab, setActiveTab] = useState<TabKey>("vaultSkin");

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "vaultSkin", label: "Vaults" },
    { key: "badgeFrame", label: "Banners" },
    { key: "avatar", label: "Avatars" },
    { key: "mythic", label: "Mythic" },
  ];

  const activeMap: Record<Exclude<TabKey, "mythic">, string> = {
    vaultSkin: player.activeVaultSkin,
    badgeFrame: player.activeBadgeFrame,
    avatar: player.activeAvatar,
  };

  const activeId = activeTab === "mythic" ? null : activeMap[activeTab as Exclude<TabKey, "mythic">];
  const activeItem = activeId ? COSMETICS.find((c) => c.id === activeId) : null;

  function isSubscriberOnly(id: string): boolean {
    return id === "vault-plus" || id === "avatar-dragon";
  }

  function getSetProgress(setId: string): { owned: number; total: number; equipped: number } {
    const items = MYTHIC_SETS[setId].items;
    return {
      owned: items.filter((id) => player.ownedCosmetics.includes(id)).length,
      total: items.length,
      equipped: items.filter((id) => [player.activeVaultSkin, player.activeBadgeFrame, player.activeAvatar].includes(id)).length,
    };
  }

  const tabItems = activeTab === "mythic"
    ? COSMETICS.filter((c) => c.setId)
    : COSMETICS.filter((c) => c.type === activeTab && !c.setId);

  function renderItemCard(item: CosmeticItem) {
    const isStarter = item.shardCost === 0 && !isSubscriberOnly(item.id);
    const owned = player.ownedCosmetics.includes(item.id) || isStarter;
    const active = [player.activeVaultSkin, player.activeBadgeFrame, player.activeAvatar].includes(item.id);
    const imgPath = getCosmeticImage(item.id);
    const subscriberOnly = isSubscriberOnly(item.id);
    const locked = subscriberOnly && !player.isSubscribed;

    return (
      <div
        key={item.id}
        className={`flex flex-col rounded-xl border transition overflow-hidden h-full ${
          active
            ? "bg-vault-800 border-vault-gold"
            : locked
            ? "bg-vault-800/30 border-vault-700/50 opacity-60"
            : "bg-vault-800/60 border-vault-700"
        }`}
      >
        {/* Image */}
        <div className="relative w-full aspect-square bg-vault-700/50 overflow-hidden">
          {imgPath ? (
            <Image src={imgPath} alt={item.name} fill className="object-contain p-1" sizes="(max-width: 640px) 50vw, 33vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gem size={28} className="text-vault-400" />
            </div>
          )}
          {locked && (
            <div className="absolute inset-0 bg-vault-900/70 flex items-center justify-center">
              <Lock size={24} className="text-vault-500" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-2.5 sm:p-3 gap-1">
          <div className="flex items-center gap-1 flex-wrap">
            <p className="text-xs sm:text-sm font-bold text-white leading-tight">{item.name}</p>
            {subscriberOnly && <Crown size={10} className="text-vault-gold shrink-0" />}
          </div>
          <p className="text-[10px] sm:text-[11px] text-vault-400 leading-snug">{item.description}</p>
          {formatBonus(item.id) && !locked && (
            <p className="text-[9px] sm:text-[10px] text-vault-gold font-semibold leading-snug">{formatBonus(item.id)}</p>
          )}

          <div className="mt-auto pt-2">
            {locked ? (
              <span className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold bg-vault-700 text-vault-500">
                <Crown size={12} />
                Plus
              </span>
            ) : owned ? (
              <button
                onClick={() => { sound.playClick(); onEquip(item.id, item.type); }}
                className={`w-full py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition ${
                  active
                    ? "bg-vault-gold/20 text-vault-gold border border-vault-gold/40"
                    : "bg-vault-700 text-white border border-vault-600 hover:bg-vault-600"
                }`}
              >
                {active ? "Equipped" : "Equip"}
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playClick();
                  Promise.resolve(onUnlock(item)).then((ok) => ok && sound.playPurchase());
                }}
                disabled={player.cosmeticShards < item.shardCost}
                className={`w-full py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition ${
                  player.cosmeticShards >= item.shardCost
                    ? "bg-vault-accent text-white"
                    : "bg-vault-700 text-vault-500 cursor-not-allowed"
                }`}
              >
                {item.shardCost} Shards
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-vault-900">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-vault-900/95 backdrop-blur border-b border-vault-700">
        <button onClick={() => { sound.playClick(); onBack(); }} className="text-vault-400 hover:text-white transition">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Collection</h2>
        <div className="ml-auto flex items-center gap-1 text-sm text-vault-accentLight font-bold">
          <Gem size={14} className="text-vault-accent" />
          {player.cosmeticShards} Shards
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 mt-3 overflow-x-auto scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { sound.playClick(); setActiveTab(t.key); }}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeTab === t.key
                ? t.key === "mythic"
                  ? "bg-vault-accent text-white"
                  : "bg-vault-gold text-vault-900"
                : "bg-vault-800 text-vault-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Equipped Hero */}
      {activeItem && (
        <div className="px-4 mt-4">
          <div className="rounded-2xl p-3 sm:p-4 border border-vault-gold/40 bg-vault-800/80">
            <span className="text-[10px] text-vault-gold font-bold uppercase tracking-wider">Currently Equipped</span>
            <div className="flex items-center gap-3 sm:gap-4 mt-2">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-vault-gold/30 shrink-0">
                <Image
                  src={getCosmeticImage(activeItem.id)}
                  alt={activeItem.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-base sm:text-lg font-black text-white">{activeItem.name}</p>
                  {isSubscriberOnly(activeItem.id) && <Crown size={14} className="text-vault-gold shrink-0" />}
                </div>
                <p className="text-[11px] sm:text-xs text-vault-400 leading-snug">{activeItem.description}</p>
                {formatBonus(activeItem.id) && (
                  <p className="text-[10px] text-vault-gold mt-0.5 font-semibold leading-snug">{formatBonus(activeItem.id)}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === "mythic" ? (
        <div className="px-4 py-4 space-y-6 pb-20">
          {Object.entries(MYTHIC_SETS).map(([setId, setData]) => {
            const progress = getSetProgress(setId);
            const setBonus = SET_BONUSES[setId];
            const isComplete = progress.equipped === 3;
            const setItems = COSMETICS.filter((c) => c.setId === setId);

            return (
              <div key={setId} className={`rounded-2xl border p-3 sm:p-4 ${isComplete ? 'border-vault-accent bg-vault-800/80' : 'border-vault-700 bg-vault-800/40'}`}>
                {/* Set Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className={`text-sm font-black ${isComplete ? 'text-vault-accent' : 'text-white'}`}>{setData.name} Set</p>
                    <p className="text-[10px] text-vault-400">{progress.owned}/{progress.total} owned · {progress.equipped}/3 equipped</p>
                  </div>
                  {setBonus && (
                    <div className={`text-right px-2 py-1 rounded-lg ${isComplete ? 'bg-vault-accent/20' : 'bg-vault-700/50'}`}>
                      <p className={`text-[10px] font-bold ${isComplete ? 'text-vault-accent' : 'text-vault-400'}`}>{setBonus.name}</p>
                      <p className="text-[9px] text-vault-400">{setBonus.description}</p>
                    </div>
                  )}
                </div>

                {/* Set Items Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {setItems.map((item) => {
                    const owned = player.ownedCosmetics.includes(item.id);
                    const active = [player.activeVaultSkin, player.activeBadgeFrame, player.activeAvatar].includes(item.id);
                    const imgPath = getCosmeticImage(item.id);

                    return (
                      <div key={item.id} className={`flex flex-col rounded-xl border transition overflow-hidden h-full ${active ? 'bg-vault-800 border-vault-gold' : 'bg-vault-800/60 border-vault-700'}`}>
                        <div className="relative w-full aspect-square bg-vault-700/50 overflow-hidden">
                          {imgPath ? (
                            <Image src={imgPath} alt={item.name} fill className="object-contain p-1" sizes="33vw" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Gem size={20} className="text-vault-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 p-2 gap-1">
                          <p className="text-[10px] font-bold text-white leading-tight">{item.name}</p>
                          {formatBonus(item.id) && (
                            <p className="text-[8px] text-vault-gold font-semibold leading-tight">{formatBonus(item.id)}</p>
                          )}
                          {owned ? (
                            <button
                              onClick={() => { sound.playClick(); onEquip(item.id, item.type); }}
                              className={`w-full py-1 rounded text-[9px] font-bold transition ${
                                active
                                  ? "bg-vault-gold/20 text-vault-gold border border-vault-gold/40"
                                  : "bg-vault-700 text-white border border-vault-600 hover:bg-vault-600"
                              }`}
                            >
                              {active ? "Equipped" : "Equip"}
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                sound.playClick();
                                Promise.resolve(onUnlock(item)).then((ok) => ok && sound.playPurchase());
                              }}
                              disabled={player.cosmeticShards < item.shardCost}
                              className={`w-full py-1 rounded text-[9px] font-bold transition ${
                                player.cosmeticShards >= item.shardCost
                                  ? "bg-vault-accent text-white"
                                  : "bg-vault-700 text-vault-500 cursor-not-allowed"
                              }`}
                            >
                              {item.shardCost}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-4 py-4 grid grid-cols-2 sm:grid-cols-3 gap-3 pb-20">
          {tabItems.map((item) => renderItemCard(item))}
        </div>
      )}
    </div>
  );
}
