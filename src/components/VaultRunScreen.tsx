"use client";

import { useEffect, useRef, useState } from "react";
import { Gem, KeyRound, Heart, AlertTriangle, X, Info, Sparkles, User, Box, Hexagon, Star, Crosshair, Calendar, ChevronUp, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Player, RunState, VaultOutcome } from "@/types/game";
import { formatNumber } from "@/lib/utils";
import { getRiskPercent, VAULT_WEIGHTS, getActiveCosmeticBonuses, applyCosmeticBonusesToWeights, normalizeWeightsToPercentages, OUTCOME_BASE_LABELS, COSMETIC_BONUSES, getActiveMythicSet, SET_BONUSES, MYTHIC_SETS } from "@/lib/gameLogic";
import { useSound } from "@/hooks/useSound";
import confetti from "canvas-confetti";

function getVaultImage(skinId: string): string {
  const map: Record<string, string> = {
    "vault-default": "/assets/vaults/green_emerald_vault.png",
    "vault-blue-sapphire": "/assets/vaults/blue_sapphire_vault.png",
    "vault-red-ruby": "/assets/vaults/red_ruby_vault.png",
    "vault-purple-cosmic": "/assets/vaults/purple_cosmic_vault.png",
    "vault-plus": "/assets/vaults/gold_legendary_vault.png",
    "vault-mythic-guardian": "/assets/mythic-vaults/mythic-guardian.png",
    "vault-mythic-crystal": "/assets/mythic-vaults/mythic-crystal.png",
    "vault-mythic-void": "/assets/mythic-vaults/mythic-void.png",
    "vault-mythic-oblivion": "/assets/mythic-vaults/mythic-oblivion.png",
    "vault-mythic-god": "/assets/mythic-vaults/mythic-god.png",
    "vault-mythic-ethereal": "/assets/mythic-vaults/mythic-ethereal.png",
  };
  return map[skinId] || "/assets/vaults/green_emerald_vault.png";
}

function getAvatarImage(avatarId: string): string {
  const map: Record<string, string> = {
    "avatar-basic": "/assets/avatars/basic-avatar.png",
    "avatar-champion": "/assets/avatars/champion-avatar.png",
    "avatar-galaxy": "/assets/avatars/galaxy-avatar.png",
    "avatar-pirate": "/assets/avatars/pirate-avatar.png",
    "avatar-joker": "/assets/avatars/joker-avatar.png",
    "avatar-shadow": "/assets/avatars/shadow-avatar.png",
    "avatar-dragon": "/assets/avatars/dragon-avatar.png",
    "avatar-mythic-guardian": "/assets/mythic-avatars/mythic-guardian.png",
    "avatar-mythic-crystal": "/assets/mythic-avatars/mythic-crystal.png",
    "avatar-mythic-void": "/assets/mythic-avatars/mythic-void.png",
    "avatar-mythic-oblivion": "/assets/mythic-avatars/mythic-oblivion.png",
    "avatar-mythic-god": "/assets/mythic-avatars/mythic-god.png",
    "avatar-mythic-ethereal": "/assets/mythic-avatars/mythic-ethereal.png",
  };
  return map[avatarId] || "/assets/avatars/basic-avatar.png";
}

function getBannerImage(bannerId: string): string {
  const map: Record<string, string> = {
    "banner-default": "/assets/banners/emerald-banner.png",
    "banner-heart": "/assets/banners/heart-banner.png",
    "banner-ice": "/assets/banners/ice-banner.png",
    "banner-emerald": "/assets/banners/emerald-banner.png",
    "banner-ruby": "/assets/banners/ruby-banner.png",
    "banner-diamond": "/assets/banners/diamond-banner.png",
    "banner-galaxy": "/assets/banners/galaxy-banner.png",
    "banner-golden-bird": "/assets/banners/golden-bird-banner.png",
    "banner-champion": "/assets/banners/champion-banner.png",
    "banner-mythic-guardian": "/assets/mythic-banners/mythic-guardian.png",
    "banner-mythic-crystal": "/assets/mythic-banners/mythic-crystal.png",
    "banner-mythic-void": "/assets/mythic-banners/mythic-void.png",
    "banner-mythic-oblivion": "/assets/mythic-banners/mythic-oblivion.png",
    "banner-mythic-god": "/assets/mythic-banners/mythic-god.png",
    "banner-mythic-ethereal": "/assets/mythic-banners/mythic-ethereal.png",
  };
  return map[bannerId] || "/assets/banners/emerald-banner.png";
}

function formatCompactBonusesForId(id: string): string {
  const b = COSMETIC_BONUSES[id];
  if (!b) return "No bonuses";
  const parts: string[] = [];
  if (b.gemMultiplier > 1) parts.push(`${b.gemMultiplier.toFixed(1)}x Gems`);
  if (b.jackpotWeightBonus > 0) parts.push(`+${b.jackpotWeightBonus} Jackpot Chance`);
  if (b.mediumGemWeightBonus > 0) parts.push(`+${b.mediumGemWeightBonus} Med Gem Chance`);
  if (b.bigGemWeightBonus > 0) parts.push(`+${b.bigGemWeightBonus} Big Gem Chance`);
  if (b.trapWeightReduction > 0) parts.push(`-${b.trapWeightReduction} Trap Chance`);
  if (b.shardMultiplier > 1) parts.push(`${b.shardMultiplier.toFixed(1)}x Shard`);
  if (b.xpMultiplier > 1) parts.push(`+${Math.round((b.xpMultiplier - 1) * 100)}% XP`);
  if (b.reviveTokenBonus > 0) parts.push(`+${b.reviveTokenBonus} Revive`);
  if (b.multiplierWeightBonus > 0) parts.push(`+${b.multiplierWeightBonus} Mult Chance`);
  if (b.shardJackpotWeightBonus > 0) parts.push(`+${b.shardJackpotWeightBonus} ShardJpot`);
  if (b.trapAutoReviveChance > 0) parts.push(`${Math.round(b.trapAutoReviveChance * 100)}% Auto-Revive`);
  if (b.shardDuplicationChance > 0) parts.push(`${Math.round(b.shardDuplicationChance * 100)}% ShardDupe`);
  if (b.gemUpgradeChance > 0) parts.push(`${Math.round(b.gemUpgradeChance * 100)}% GemUpg`);
  if (b.deepVaultGemBonus > 1) parts.push(`+${Math.round((b.deepVaultGemBonus - 1) * 100)}% DeepVault`);
  if (b.lateBankBonus > 0) parts.push(`+${Math.round(b.lateBankBonus * 100)}% LateBank`);
  if (b.guaranteedSafeInterval > 0) parts.push(`Safe/${b.guaranteedSafeInterval} vaults`);
  return parts.length ? parts.join(" · ") : "No bonuses";
}

function getMythicGlowColor(setId: string | null): string | null {
  if (!setId) return null;
  const colors: Record<string, string> = {
    guardian: "59, 130, 246",   // blue
    crystal: "6, 182, 212",      // cyan
    void: "139, 92, 246",      // purple
    oblivion: "239, 68, 68",     // red
    god: "251, 191, 36",         // bright gold
    ethereal: "229, 231, 235",   // white/silver
  };
  return colors[setId] || null;
}

function triggerHaptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(50);
  }
}

interface VaultRunScreenProps {
  player: Player;
  run: RunState;
  lastOutcome: VaultOutcome | null;
  showOutcome: boolean;
  onOpenVault: () => void;
  onBankRewards: () => void;
  onUseRevive: () => void | Promise<void>;
  onAbandonRun: () => void;
  onCancelRun: () => void;
  setShowOutcome: (v: boolean) => void;
  onShowAd: (onComplete: () => void) => void;
}

export default function VaultRunScreen({
  player,
  run,
  lastOutcome,
  showOutcome,
  onOpenVault,
  onBankRewards,
  onUseRevive,
  onAbandonRun,
  onCancelRun,
  setShowOutcome,
  onShowAd,
}: VaultRunScreenProps) {
  const sound = useSound();
  const processing = useRef(false);
  const [animatingVault, setAnimatingVault] = useState<number | null>(null);
  const [showOdds, setShowOdds] = useState(false);
  const [justJackpot, setJustJackpot] = useState(false);
  const [justShardJackpot, setJustShardJackpot] = useState(false);
  const [rewardsExpanded, setRewardsExpanded] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const activeMythicSet = getActiveMythicSet(player);
  const glowColor = getMythicGlowColor(activeMythicSet);

  // Auto-scroll to current vault when it changes
  useEffect(() => {
    if (run.currentVault > 1) {
      const el = document.getElementById(`vault-${run.currentVault}`);
      if (el) {
        const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0;
        const offset = headerHeight + 122;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }, [run.currentVault]);

  useEffect(() => {
    if (!lastOutcome) return;
    if (lastOutcome.type === "jackpot") {
      setJustJackpot(true);
      sound.playJackpot();
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate([80, 30, 80, 30, 120]);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#10b981", "#8b5cf6"],
      });
      setTimeout(() => setJustJackpot(false), 3000);
    } else if (lastOutcome.type === "shardJackpot") {
      setJustShardJackpot(true);
      sound.playShardJackpot();
      triggerHaptic();
      confetti({
        particleCount: 120,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#fbbf24"],
      });
      setTimeout(() => setJustShardJackpot(false), 3000);
    } else if (lastOutcome.type === "trap") {
      sound.playLose();
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate([100, 50, 200]);
    } else if (lastOutcome.type === "smallGems") {
      sound.playWinSmall();
      triggerHaptic();
    } else if (["mediumGems", "multiplier"].includes(lastOutcome.type)) {
      sound.playWinMedium();
      triggerHaptic();
    } else {
      // bigGems, bonusKey, cosmeticShard, bonusLife
      sound.playWinLarge();
      triggerHaptic();
    }
  }, [lastOutcome]);

  const handleOpen = () => {
    if (
      processing.current ||
      !run.isRunActive ||
      run.isTrapTriggered ||
      showOutcome ||
      animatingVault !== null
    )
      return;
    processing.current = true;
    sound.playClick();
    triggerHaptic();
    setAnimatingVault(run.currentVault);
    setTimeout(() => {
      onOpenVault();
      setAnimatingVault(null);
    }, 500);
  };

  const risk = getRiskPercent(run.currentVault, player);

  return (
    <div className="flex flex-col min-h-screen bg-vault-900 relative">
      {/* Sticky Header + Status + Risk */}
      <div ref={headerRef} className="sticky top-0 z-10 bg-vault-900">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-vault-900/95 backdrop-blur border-b border-vault-700">
          <button
            onClick={() => {
              sound.playClick();
              onCancelRun();
            }}
            disabled={run.history.length > 0}
            className="text-vault-400 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
            title={run.history.length > 0 ? "Cannot cancel after opening a vault" : "Cancel run — refunds your key"}
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-vault-800 rounded-full px-3 py-1 border border-vault-700">
              <KeyRound size={14} className="text-vault-gold" />
              <span className="text-sm font-bold">{player.keys}</span>
            </div>
            <div className="flex items-center gap-1 bg-vault-800 rounded-full px-3 py-1 border border-vault-700">
              <Heart size={14} className="text-red-400" />
              <span className="text-sm font-bold">{player.reviveTokens}</span>
            </div>
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-vault-600 shrink-0" title={`Avatar: ${player.activeAvatar.replace('avatar-', '')}`}>
              <Image src={getAvatarImage(player.activeAvatar)} alt="avatar" fill className="object-cover" sizes="28px" priority />
            </div>
          </div>
          <button onClick={() => { sound.playClick(); setShowOdds(true); }} className="text-vault-400 hover:text-vault-gold transition">
            <Info size={22} />
          </button>
        </div>

        {/* Daily Reward Reminder */}
        {(() => {
          const todayIso = new Date().toISOString().split('T')[0];
          const lastIso = player.lastDailyClaim ? new Date(player.lastDailyClaim).toISOString().split('T')[0] : null;
          const canClaimDaily = lastIso !== todayIso;
          if (!canClaimDaily) return null;
          return (
            <div className="px-4 pt-3">
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-vault-gold/10 border border-vault-gold/30 animate-pulse-slow">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-vault-gold" />
                  <span className="text-xs font-bold text-vault-gold">Daily Reward Available!</span>
                </div>
                <span className="text-[10px] text-vault-gold/70">Claim from home screen</span>
              </div>
            </div>
          );
        })()}

        {/* Collapsible Rewards + Risk */}
        <div className="px-4 py-2 border-b border-vault-700">
          {!rewardsExpanded ? (
            /* Compact bar */
            <div
              className={`rounded-xl px-3 py-2 border flex items-center justify-between cursor-pointer active:scale-[0.99] transition ${
                player.isSubscribed ? 'plus-glow bg-vault-800/80 border-vault-600' : 'bg-vault-800 border-vault-700'
              }`}
              onClick={() => setRewardsExpanded(true)}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[10px] text-vault-400 font-bold uppercase">Vault {run.currentVault}</span>
                <div className="flex items-baseline gap-1">
                  <Gem size={14} className="text-vault-gem" />
                  <span className="text-sm font-black text-white">{formatNumber(run.unbankedGems)}</span>
                </div>
                {run.unbankedKeys > 0 && (
                  <div className="flex items-baseline gap-0.5">
                    <KeyRound size={10} className="text-vault-gold" />
                    <span className="text-[10px] font-bold text-vault-gold">{run.unbankedKeys}</span>
                  </div>
                )}
                {run.unbankedShards > 0 && (
                  <div className="flex items-baseline gap-0.5">
                    <Sparkles size={10} className="text-vault-accent" />
                    <span className="text-[10px] font-bold text-vault-accent">{run.unbankedShards}</span>
                  </div>
                )}
                {run.unbankedReviveTokens > 0 && (
                  <div className="flex items-baseline gap-0.5">
                    <Heart size={10} className="text-red-400" />
                    <span className="text-[10px] font-bold text-red-400">{run.unbankedReviveTokens}</span>
                  </div>
                )}
                <span className="text-[10px] text-vault-gold font-bold">x{run.currentMultiplier.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${risk > 20 ? "text-vault-danger" : "text-vault-gold"}`}>{risk}%</span>
                <ChevronDown size={16} className="text-vault-400" />
              </div>
            </div>
          ) : (
            /* Expanded card */
            <div className={`rounded-2xl p-3 border ${player.isSubscribed ? 'plus-glow bg-vault-800/80' : 'bg-vault-800 border-vault-700'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-vault-400 uppercase tracking-wider font-bold">Rewards</span>
                <button onClick={() => setRewardsExpanded(false)} className="text-vault-400 hover:text-white transition">
                  <ChevronUp size={16} />
                </button>
              </div>
              <div className="flex items-baseline gap-2">
                <Gem size={20} className="text-vault-gem" />
                <span className="text-2xl font-black text-white">{formatNumber(run.unbankedGems)}</span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {run.unbankedShards > 0 && (
                  <div className="flex items-center gap-1">
                    <Sparkles size={10} className="text-vault-accent" />
                    <span className="text-[10px] text-vault-accent font-bold">{run.unbankedShards} Shards</span>
                  </div>
                )}
                {run.unbankedKeys > 0 && (
                  <div className="flex items-center gap-1">
                    <KeyRound size={10} className="text-vault-gold" />
                    <span className="text-[10px] text-vault-gold font-bold">{run.unbankedKeys} Keys</span>
                  </div>
                )}
                {run.unbankedReviveTokens > 0 && (
                  <div className="flex items-center gap-1">
                    <Heart size={10} className="text-red-400" />
                    <span className="text-[10px] text-red-400 font-bold">{run.unbankedReviveTokens} Lives</span>
                  </div>
                )}
                <span className="text-[10px] text-vault-gold font-bold">x{run.currentMultiplier.toFixed(1)}</span>
              </div>

              {/* Equipped cosmetics row */}
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-vault-700/50">
                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7 rounded-md overflow-hidden border border-vault-600 shrink-0">
                    <Image src={getAvatarImage(player.activeAvatar)} alt="avatar" fill className="object-cover" sizes="28px" priority />
                  </div>
                  <p className="text-[10px] text-vault-gold font-semibold leading-tight">{formatCompactBonusesForId(player.activeAvatar)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7 rounded-md overflow-hidden border border-vault-600 shrink-0">
                    <Image src={getBannerImage(player.activeBadgeFrame)} alt="banner" fill className="object-cover" sizes="28px" priority />
                  </div>
                  <p className="text-[10px] text-vault-gold font-semibold leading-tight">{formatCompactBonusesForId(player.activeBadgeFrame)}</p>
                </div>
              </div>

              {/* Active Mythic Set Bonus */}
              {activeMythicSet && SET_BONUSES[activeMythicSet] && (
                <div className="mt-2 pt-2 border-t border-vault-700/50">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-vault-accent shrink-0" />
                    <p className="text-[10px] font-bold text-vault-accent">{MYTHIC_SETS[activeMythicSet].name} Set Active</p>
                  </div>
                  <p className="text-[9px] text-vault-accentLight font-semibold leading-tight ml-5">{SET_BONUSES[activeMythicSet].name} — {SET_BONUSES[activeMythicSet].description}</p>
                </div>
              )}

              {/* Risk Meter */}
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-vault-400">Risk Meter</span>
                  <span className={`font-bold ${risk > 20 ? "text-vault-danger" : "text-vault-gold"}`}>{risk}%</span>
                </div>
                <div className="h-2 bg-vault-900 rounded-full overflow-hidden border border-vault-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      risk > 20 ? "bg-gradient-to-r from-vault-gold to-vault-danger" : "bg-gradient-to-r from-vault-gem to-vault-gold"
                    }`}
                    style={{ width: `${Math.min(risk * 2.5, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vault Images */}
      <div className="px-4 flex-1 flex flex-col items-center justify-center gap-2 pt-2 pb-2">
        {Array.from({ length: run.currentVault + 2 }, (_, i) => i + 1).map((vaultNum) => {
          const isOpen = vaultNum < run.currentVault;
          const isCurrent = vaultNum === run.currentVault && !run.isTrapTriggered;
          const isTrap = run.isTrapTriggered && vaultNum === run.currentVault - 1;
          const isPastTrap = run.isTrapTriggered && vaultNum >= run.currentVault;
          const outcome = run.history[vaultNum - 1];
          const isAnimating = animatingVault === vaultNum;

          return (
            <div
              id={`vault-${vaultNum}`}
              key={vaultNum}
              onClick={() => {
                if (isCurrent && !showOutcome) {
                  handleOpen();
                }
              }}
              className={`relative flex flex-col items-center transition-all duration-300 ${
                isCurrent && !showOutcome ? "cursor-pointer" : ""
              } ${isPastTrap ? "opacity-30" : isOpen ? "opacity-50" : ""}`}
            >
              {/* Vault image — responsive sizing */}
              <div
                className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  isCurrent
                    ? isAnimating
                      ? glowColor
                        ? "border-vault-gold scale-105"
                        : "border-vault-gold shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-105"
                      : glowColor
                        ? "border-vault-gold"
                        : "border-vault-gold shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    : isTrap
                    ? "border-vault-danger shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                    : isOpen
                    ? "border-vault-gold/40 grayscale"
                    : "border-vault-700 opacity-60"
                } ${isCurrent ? "w-[min(42vw,11rem)] h-[min(42vw,11rem)]" : "w-[min(22vw,5.5rem)] h-[min(22vw,5.5rem)]"}`}
                style={isCurrent && glowColor ? { boxShadow: `0 0 25px rgba(${glowColor}, 0.5), 0 0 50px rgba(${glowColor}, 0.3)` } : undefined}
              >
                <Image
                  src={getVaultImage(player.activeVaultSkin)}
                  alt={`Vault ${vaultNum}`}
                  fill
                  className={`object-cover ${isAnimating ? "animate-pulse" : ""}`}
                  sizes={isCurrent ? "(max-width: 768px) 42vw, 176px" : "(max-width: 768px) 22vw, 88px"}
                  priority={isCurrent}
                />

                {/* Opened overlay */}
                {isOpen && outcome && (
                  <div className="absolute inset-0 bg-vault-900/60 flex flex-col items-center justify-center">
                    <Sparkles size={20} className="text-vault-gold mb-1" />
                    <p className="text-xs font-bold text-white text-center px-1">
                      {outcome.label}
                    </p>
                    {outcome.gems ? (
                      <p className="text-[10px] text-vault-gem font-bold">+{formatNumber(outcome.gems)}</p>
                    ) : null}
                  </div>
                )}

                {/* Trap overlay */}
                {isTrap && (
                  <div className="absolute inset-0 bg-vault-danger/30 flex items-center justify-center">
                    <AlertTriangle size={32} className="text-vault-danger" />
                  </div>
                )}

                {/* Vault number badge */}
                <div className={`absolute top-1.5 left-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  isCurrent ? "bg-vault-gold text-vault-900" : "bg-vault-900/80 text-vault-400"
                }`}>
                  #{vaultNum}
                </div>
              </div>

              {/* Current vault CTA */}
              {isCurrent && !showOutcome && (
                <p className="text-xs font-bold text-vault-gold mt-1 animate-pulse">
                  Tap to Open
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-vault-900/95 backdrop-blur border-t border-vault-700 px-4 py-4">
        {run.isTrapTriggered ? (
          <div className="flex flex-col gap-2">
            {player.reviveTokens > 0 && !run.reviveUsed ? (
              <button
                onClick={async () => {
                  if (processing.current) return;
                  processing.current = true;
                  sound.playClick();
                  await Promise.resolve(onUseRevive());
                  processing.current = false;
                }}
                className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-vault-accent to-vault-accentLight text-white shadow-lg active:scale-[0.98] transition"
              >
                Use Revive ({player.reviveTokens})
              </button>
            ) : (
              <button
                onClick={() => {
                  if (processing.current) return;
                  processing.current = true;
                  sound.playClick();
                  onShowAd(() => {
                    onBankRewards();
                  });
                }}
                className="w-full py-4 rounded-2xl font-bold text-lg bg-vault-700 text-white border border-vault-600 active:scale-[0.98] transition"
              >
                Watch Ad to Bank Rewards
              </button>
            )}
            <button
              onClick={() => {
                if (processing.current) return;
                processing.current = true;
                sound.playClick();
                onAbandonRun();
              }}
              className="w-full py-3 rounded-2xl font-semibold text-sm text-vault-400 bg-transparent border border-vault-700 active:scale-[0.98] transition"
            >
              Abandon Run (Lose Rewards)
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (processing.current) return;
                processing.current = true;
                sound.playBank();
                onBankRewards();
              }}
              disabled={run.history.length === 0}
              className="flex-1 py-4 rounded-2xl font-bold text-sm bg-vault-800 text-white border border-vault-600 active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Bank
            </button>
            <button
              onClick={handleOpen}
              disabled={
                !run.isRunActive || showOutcome || animatingVault !== null
              }
              className="flex-[2] py-4 rounded-2xl font-black text-lg bg-gradient-to-r from-vault-gold to-vault-goldLight text-vault-900 shadow-lg glow-gold active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Open Vault {run.currentVault}
            </button>
          </div>
        )}
      </div>

      {/* Outcome Popup */}
      {showOutcome && lastOutcome && (
        <OutcomePopup
          outcome={lastOutcome}
          onClose={() => {
            processing.current = false;
            setShowOutcome(false);
          }}
        />
      )}

      {/* Odds Modal */}
      {showOdds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-vault-800 rounded-2xl w-full max-w-sm p-5 border border-vault-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Vault {run.currentVault} Odds</h3>
              <button onClick={() => setShowOdds(false)}>
                <X size={20} className="text-vault-400" />
              </button>
            </div>
            {(() => {
              const bonuses = getActiveCosmeticBonuses(player);
              const baseWeights = VAULT_WEIGHTS[run.currentVault] ?? VAULT_WEIGHTS[Math.max(...Object.keys(VAULT_WEIGHTS).map(Number))];
              const finalWeights = applyCosmeticBonusesToWeights(baseWeights, bonuses);
              const basePct = normalizeWeightsToPercentages(baseWeights);
              const finalPct = normalizeWeightsToPercentages(finalWeights);
              const hasOddsBonuses = bonuses.jackpotWeightBonus > 0 || bonuses.mediumGemWeightBonus > 0 || bonuses.bigGemWeightBonus > 0 || bonuses.trapWeightReduction > 0 || bonuses.shardWeightBonus > 0 || bonuses.bonusKeyWeightBonus > 0 || bonuses.reviveTokenWeightBonus > 0;
              const outcomes = Object.entries(finalWeights).filter(([, w]) => w > 0) as [keyof typeof finalWeights, number][];
              return (
                <>
                  {hasOddsBonuses && (
                    <p className="text-xs text-vault-gold mb-3">
                      Your cosmetics are changing these odds!
                    </p>
                  )}
                  <div className="space-y-1">
                    {outcomes.map(([type]) => {
                      const pct = finalPct[type]?.toFixed(1) ?? "0.0";
                      const baseVal = basePct[type]?.toFixed(1) ?? "0.0";
                      const changed = baseWeights[type] !== finalWeights[type];
                      return (
                        <div
                          key={type}
                          className="flex items-center justify-between text-sm py-1"
                        >
                          <span className="text-vault-300">
                            {String(type).replace(/([A-Z])/g, " $1").trim()}
                            <span className="text-vault-500 text-xs ml-1">({OUTCOME_BASE_LABELS[type]})</span>
                          </span>
                          <div className="text-right">
                            <span
                              className={`font-bold ${
                                type === "trap"
                                  ? "text-vault-danger"
                                  : type === "jackpot"
                                  ? "text-vault-gem"
                                  : "text-white"
                              }`}
                            >
                              {pct}%
                            </span>
                            {changed && (
                              <span className="text-vault-500 text-xs ml-1.5">
                                ({baseVal}% base)
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {hasOddsBonuses && (
                    <div className="mt-3 pt-3 border-t border-vault-700/50 text-xs text-vault-400 space-y-1">
                      {bonuses.jackpotWeightBonus > 0 && <p>+{bonuses.jackpotWeightBonus} Jackpot Chance</p>}
                      {bonuses.mediumGemWeightBonus > 0 && <p>+{bonuses.mediumGemWeightBonus} Medium Gem Chance</p>}
                      {bonuses.bigGemWeightBonus > 0 && <p>+{bonuses.bigGemWeightBonus} Big Gem Chance</p>}
                      {bonuses.shardWeightBonus > 0 && <p>+{bonuses.shardWeightBonus} Shard Chance</p>}
                      {bonuses.bonusKeyWeightBonus > 0 && <p>+{bonuses.bonusKeyWeightBonus} Bonus Key Chance</p>}
                      {bonuses.reviveTokenWeightBonus > 0 && <p>+{bonuses.reviveTokenWeightBonus} Revive Chance</p>}
                      {bonuses.trapWeightReduction > 0 && <p>-{bonuses.trapWeightReduction} Trap Chance</p>}
                      {bonuses.trapWeightReduction < 0 && <p className="text-vault-danger">+{Math.abs(bonuses.trapWeightReduction)} Trap Chance (from equipped avatar)</p>}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Jackpot Overlay */}
      {justJackpot && showOutcome && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="text-center animate-pop">
            <p className="text-5xl font-black gold-text drop-shadow-lg">
              JACKPOT!
            </p>
          </div>
        </div>
      )}

      {/* Shard Jackpot Overlay */}
      {justShardJackpot && showOutcome && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="text-center animate-pop">
            <p className="text-5xl font-black text-vault-accent drop-shadow-lg">
              SHARD JACKPOT!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function OutcomePopup({
  outcome,
  onClose,
}: {
  outcome: VaultOutcome;
  onClose: () => void;
}) {
  const sound = useSound();
  const isAutoRevived = outcome.autoRevived;
  const isPositive =
    outcome.type !== "trap" || isAutoRevived;
  const bg = isAutoRevived
    ? "border-vault-accent bg-vault-800"
    : isPositive
    ? outcome.type === "jackpot"
      ? "border-vault-gold bg-vault-800"
      : outcome.type === "shardJackpot"
      ? "border-vault-accent bg-vault-800"
      : outcome.type === "bonusLife"
      ? "border-vault-accentLight bg-vault-800"
      : "border-vault-gem bg-vault-800"
    : "border-vault-danger bg-vault-800";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className={`rounded-2xl w-full max-w-xs p-6 border-2 ${bg} animate-pop text-center`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3">
          {isAutoRevived ? (
            <Heart size={48} className="mx-auto text-vault-accent" />
          ) : outcome.type === "trap" ? (
            <AlertTriangle
              size={48}
              className="mx-auto text-vault-danger"
            />
          ) : outcome.type === "jackpot" ? (
            <Sparkles size={48} className="mx-auto text-vault-gold" />
          ) : outcome.type === "shardJackpot" ? (
            <Star size={48} className="mx-auto text-vault-accent" />
          ) : outcome.type === "bonusLife" ? (
            <Crosshair size={48} className="mx-auto text-vault-accentLight" />
          ) : (
            <Gem size={48} className="mx-auto text-vault-gem" />
          )}
        </div>
        <p
          className={`text-2xl font-black mb-1 ${
            isAutoRevived
              ? "text-vault-accent"
              : outcome.type === "trap"
              ? "text-vault-danger"
              : outcome.type === "jackpot"
              ? "gold-text"
              : outcome.type === "shardJackpot"
              ? "text-vault-accent"
              : outcome.type === "bonusLife"
              ? "text-vault-accentLight"
              : "text-vault-gem"
          }`}
        >
          {outcome.label}
        </p>
        {outcome.gems ? (
          <p className="text-xl font-bold text-white">
            +{formatNumber(outcome.gems)} Gems
          </p>
        ) : null}
        {outcome.multiplierDelta ? (
          <p className="text-xl font-bold text-vault-gold">
            Multiplier +{outcome.multiplierDelta}x
          </p>
        ) : null}
        {outcome.keys ? (
          <p className="text-xl font-bold text-vault-goldLight">
            +{outcome.keys} Key
          </p>
        ) : null}
        {outcome.shards ? (
          <p className="text-xl font-bold text-vault-accentLight">
            +{outcome.shards} Shard
          </p>
        ) : null}
        {outcome.type === "bonusLife" ? (
          <p className="text-xl font-bold text-vault-accentLight">
            +1 Revive Token
          </p>
        ) : null}
        {isAutoRevived && outcome.autoReviveSource ? (
          <p className="text-xs text-vault-accentLight mt-1 font-semibold">
            {outcome.autoReviveSource} triggered — you kept your life!
          </p>
        ) : null}
        <button
          onClick={() => { sound.playClick(); onClose(); }}
          className="mt-5 w-full py-3 rounded-xl bg-vault-700 text-white font-bold text-sm hover:bg-vault-600 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
