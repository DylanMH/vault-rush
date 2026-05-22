"use client";

import { ChevronLeft, Gem, Lock, Crown } from "lucide-react";
import { Player, CosmeticItem } from "@/types/game";
import { useSound } from "@/hooks/useSound";
import { COSMETIC_BONUSES } from "@/lib/gameLogic";
import Image from "next/image";

function formatBonus(id: string): string {
  const b = COSMETIC_BONUSES[id];
  if (!b) return "";
  const parts: string[] = [];
  if (b.gemMultiplier > 1) parts.push(`${b.gemMultiplier}x Gems`);
  if (b.jackpotChanceBonus > 0) parts.push(`+${b.jackpotChanceBonus}% Jackpot`);
  if (b.mediumGemChanceBonus > 0) parts.push(`+${b.mediumGemChanceBonus}% Med Gems`);
  if (b.trapReduction > 0) parts.push(`-${b.trapReduction}% Traps`);
  if (b.shardMultiplier > 1) parts.push(`${b.shardMultiplier}x Shards`);
  if (b.xpMultiplier > 1) parts.push(`+${Math.round((b.xpMultiplier - 1) * 100)}% XP`);
  if (b.reviveTokenBonus > 0) parts.push(`+${b.reviveTokenBonus} Revive`);
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
  };
  return map[id] || "";
}

const COSMETICS: CosmeticItem[] = [
  // Vault Skins — cheapest, small bonuses
  { id: "vault-default", name: "Standard Vault", type: "vaultSkin", description: "The classic emerald vault design", shardCost: 0, icon: "", bonuses: COSMETIC_BONUSES["vault-default"] },
  { id: "vault-blue-sapphire", name: "Blue Sapphire", type: "vaultSkin", description: "Slight gem boost from sapphire energy", shardCost: 30, icon: "", bonuses: COSMETIC_BONUSES["vault-blue-sapphire"] },
  { id: "vault-red-ruby", name: "Red Ruby", type: "vaultSkin", description: "Small trap resistance from ruby power", shardCost: 100, icon: "", bonuses: COSMETIC_BONUSES["vault-red-ruby"] },
  { id: "vault-purple-cosmic", name: "Purple Cosmic", type: "vaultSkin", description: "Best vault bonuses + XP boost", shardCost: 250, icon: "", bonuses: COSMETIC_BONUSES["vault-purple-cosmic"] },
  { id: "vault-plus", name: "Plus Vault", type: "vaultSkin", description: "Vault Rush Plus exclusive skin", shardCost: 0, icon: "", bonuses: COSMETIC_BONUSES["vault-plus"] },

  // Banners — medium price, medium bonuses
  { id: "banner-default", name: "Emerald Banner", type: "badgeFrame", description: "Starter emerald banner frame", shardCost: 0, icon: "", bonuses: COSMETIC_BONUSES["banner-default"] },
  { id: "banner-heart", name: "Heart Banner", type: "badgeFrame", description: "Bonus revive token on runs", shardCost: 100, icon: "", bonuses: COSMETIC_BONUSES["banner-heart"] },
  { id: "banner-ice", name: "Ice Banner", type: "badgeFrame", description: "Trap reduction for safer runs", shardCost: 200, icon: "", bonuses: COSMETIC_BONUSES["banner-ice"] },
  { id: "banner-emerald", name: "Emerald Banner", type: "badgeFrame", description: "Better medium gem chances", shardCost: 350, icon: "", bonuses: COSMETIC_BONUSES["banner-emerald"] },
  { id: "banner-ruby", name: "Ruby Banner", type: "badgeFrame", description: "Gem boost + jackpot chance", shardCost: 500, icon: "", bonuses: COSMETIC_BONUSES["banner-ruby"] },
  { id: "banner-diamond", name: "Diamond Banner", type: "badgeFrame", description: "Jackpot & medium gem hunter", shardCost: 650, icon: "", bonuses: COSMETIC_BONUSES["banner-diamond"] },
  { id: "banner-galaxy", name: "Galaxy Banner", type: "badgeFrame", description: "Shard multiplier + XP boost", shardCost: 800, icon: "", bonuses: COSMETIC_BONUSES["banner-galaxy"] },
  { id: "banner-golden-bird", name: "Golden Bird", type: "badgeFrame", description: "Strong XP boost for leveling fast", shardCost: 1000, icon: "", bonuses: COSMETIC_BONUSES["banner-golden-bird"] },
  { id: "banner-champion", name: "Champion Banner", type: "badgeFrame", description: "Best all-around banner bonuses", shardCost: 1500, icon: "", bonuses: COSMETIC_BONUSES["banner-champion"] },

  // Avatars — most expensive, strongest bonuses
  { id: "avatar-basic", name: "Basic", type: "avatar", description: "Clean and simple — no bonuses", shardCost: 0, icon: "", bonuses: COSMETIC_BONUSES["avatar-basic"] },
  { id: "avatar-champion", name: "Champion", type: "avatar", description: "Gem boost + better medium gems", shardCost: 300, icon: "", bonuses: COSMETIC_BONUSES["avatar-champion"] },
  { id: "avatar-galaxy", name: "Galaxy", type: "avatar", description: "Jackpot hunter + shard boost", shardCost: 500, icon: "", bonuses: COSMETIC_BONUSES["avatar-galaxy"] },
  { id: "avatar-pirate", name: "Pirate", type: "avatar", description: "Gem magnet with trap resistance", shardCost: 750, icon: "", bonuses: COSMETIC_BONUSES["avatar-pirate"] },
  { id: "avatar-joker", name: "Joker", type: "avatar", description: "High risk, high reward jackpot master", shardCost: 1000, icon: "", bonuses: COSMETIC_BONUSES["avatar-joker"] },
  { id: "avatar-shadow", name: "Shadow", type: "avatar", description: "Trap dodger + medium gem finder", shardCost: 1250, icon: "", bonuses: COSMETIC_BONUSES["avatar-shadow"] },
  { id: "avatar-dragon", name: "Dragon", type: "avatar", description: "Vault Rush Plus exclusive — best bonuses", shardCost: 0, icon: "", bonuses: COSMETIC_BONUSES["avatar-dragon"] },
];

interface CollectionScreenProps {
  player: Player;
  onBack: () => void;
  onUnlock: (item: CosmeticItem) => boolean | Promise<boolean>;
  onEquip: (id: string, type: "vaultSkin" | "avatar" | "badgeFrame") => void;
}

export default function CollectionScreen({ player, onBack, onUnlock, onEquip }: CollectionScreenProps) {
  const sound = useSound();
  const types: Array<{ key: "vaultSkin" | "avatar" | "badgeFrame"; label: string }> = [
    { key: "vaultSkin", label: "Vault Skins" },
    { key: "badgeFrame", label: "Banners" },
    { key: "avatar", label: "Avatars" },
  ];

  const activeMap: Record<string, string> = {
    vaultSkin: player.activeVaultSkin,
    avatar: player.activeAvatar,
    badgeFrame: player.activeBadgeFrame,
  };

  function isSubscriberOnly(id: string): boolean {
    return id === "vault-plus" || id === "avatar-dragon";
  }

  return (
    <div className="flex flex-col min-h-screen bg-vault-900">
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

      <div className="px-4 py-4 space-y-6 overflow-y-auto pb-20">
        {types.map(({ key, label }) => (
          <div key={key}>
            <h3 className="text-xs font-bold text-vault-400 uppercase tracking-wider mb-3">{label}</h3>
            <div className="grid grid-cols-1 gap-2">
              {COSMETICS.filter((c) => c.type === key).map((item) => {
                const isStarter = item.shardCost === 0 && !isSubscriberOnly(item.id);
                const owned = player.ownedCosmetics.includes(item.id) || isStarter;
                const active = activeMap[key] === item.id;
                const imgPath = getCosmeticImage(item.id);
                const subscriberOnly = isSubscriberOnly(item.id);
                const locked = subscriberOnly && !player.isSubscribed;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                      active
                        ? "bg-vault-800 border-vault-gold"
                        : locked
                        ? "bg-vault-800/30 border-vault-700/50 opacity-60"
                        : "bg-vault-800/60 border-vault-700"
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-lg bg-vault-700 flex-shrink-0 overflow-hidden">
                      {imgPath ? (
                        <Image src={imgPath} alt={item.name} fill className="object-cover" sizes="56px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Gem size={20} className="text-vault-400" />
                        </div>
                      )}
                      {locked && (
                        <div className="absolute inset-0 bg-vault-900/70 flex items-center justify-center">
                          <Lock size={16} className="text-vault-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold truncate">{item.name}</p>
                        {subscriberOnly && (
                          <Crown size={12} className="text-vault-gold flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-vault-400">{item.description}</p>
                      {formatBonus(item.id) && !locked && (
                        <p className="text-[10px] text-vault-gold mt-0.5 font-semibold">
                          {formatBonus(item.id)}
                        </p>
                      )}
                    </div>

                    {locked ? (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-vault-700 text-vault-500 flex items-center gap-1">
                        <Crown size={12} />
                        Plus
                      </span>
                    ) : owned ? (
                      <button
                        onClick={() => { sound.playClick(); onEquip(item.id, item.type); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${
                          player.cosmeticShards >= item.shardCost
                            ? "bg-vault-accent text-white"
                            : "bg-vault-700 text-vault-500 cursor-not-allowed"
                        }`}
                      >
                        {item.shardCost} Shards
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
