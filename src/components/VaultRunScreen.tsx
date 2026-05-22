"use client";

import { useEffect, useRef, useState } from "react";
import { Gem, KeyRound, Heart, AlertTriangle, X, Info, Sparkles, User, Box, Hexagon, Star, Crosshair, Calendar } from "lucide-react";
import Image from "next/image";
import { Player, RunState, VaultOutcome } from "@/types/game";
import { formatNumber } from "@/lib/utils";
import { getRiskPercent, VAULT_ODDS, getActiveCosmeticBonuses, applyOddsBonuses, OUTCOME_BASE_LABELS, COSMETIC_BONUSES } from "@/lib/gameLogic";
import { useSound } from "@/hooks/useSound";
import confetti from "canvas-confetti";

function getVaultImage(skinId: string): string {
  const map: Record<string, string> = {
    "vault-default": "/assets/vaults/green_emerald_vault.png",
    "vault-blue-sapphire": "/assets/vaults/blue_sapphire_vault.png",
    "vault-red-ruby": "/assets/vaults/red_ruby_vault.png",
    "vault-purple-cosmic": "/assets/vaults/purple_cosmic_vault.png",
    "vault-plus": "/assets/vaults/gold_legendary_vault.png",
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
  };
  return map[bannerId] || "/assets/banners/emerald-banner.png";
}

function formatCompactBonusesForId(id: string): string {
  const b = COSMETIC_BONUSES[id];
  if (!b) return "No bonuses";
  const parts: string[] = [];
  if (b.gemMultiplier > 1) parts.push(`${b.gemMultiplier.toFixed(1)}x Gems`);
  if (b.jackpotChanceBonus > 0) parts.push(`+${b.jackpotChanceBonus}% Jackpot`);
  if (b.mediumGemChanceBonus > 0) parts.push(`+${b.mediumGemChanceBonus}% Med`);
  if (b.trapReduction > 0) parts.push(`-${b.trapReduction}% Trap`);
  if (b.shardMultiplier > 1) parts.push(`${b.shardMultiplier.toFixed(1)}x Shard`);
  if (b.xpMultiplier > 1) parts.push(`+${Math.round((b.xpMultiplier - 1) * 100)}% XP`);
  if (b.reviveTokenBonus > 0) parts.push(`+${b.reviveTokenBonus} Revive`);
  return parts.length ? parts.join(" · ") : "No bonuses";
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
  const headerRef = useRef<HTMLDivElement>(null);

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
            <div className="flex items-center gap-1" title={`Avatar: ${player.activeAvatar.replace('avatar-', '')}`}>
              <User size={16} className="text-vault-gem" />
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

        {/* Status + Risk */}
        <div className="px-4 py-4 border-b border-vault-700">
        <div className={`rounded-2xl p-4 border ${player.isSubscribed ? 'plus-glow bg-vault-800/80' : 'bg-vault-800 border-vault-700'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-vault-400 uppercase tracking-wider font-bold">
              Rewards
            </span>
            <span className="text-xs text-vault-400">Vault {run.currentVault}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <Gem size={24} className="text-vault-gem" />
            <span className="text-3xl font-black text-white">
              {formatNumber(run.unbankedGems)}
            </span>
          </div>

          {/* Run collected stats */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-vault-accent" />
              <span className="text-xs text-vault-accent font-bold">
                {run.history.reduce((s, h) => s + (h.shards || 0), 0)} Shards
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <KeyRound size={12} className="text-vault-gold" />
              <span className="text-xs text-vault-gold font-bold">
                {run.history.reduce((s, h) => s + (h.keys || 0), 0)} Keys
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart size={12} className="text-red-400" />
              <span className="text-xs text-red-400 font-bold">
                {run.history.reduce((s, h) => s + (h.type === "bonusLife" ? 1 : 0), 0)} Lives
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-vault-400">Multiplier:</span>
            <span className="text-sm font-bold text-vault-gold">
              x{run.currentMultiplier.toFixed(1)}
            </span>
          </div>

          {/* Equipped cosmetics row */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-vault-700/50">
            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-vault-600 shrink-0">
                <Image src={getAvatarImage(player.activeAvatar)} alt="avatar" fill className="object-cover" sizes="32px" priority />
              </div>
              <p className="text-[10px] text-vault-gold font-semibold leading-tight">
                {formatCompactBonusesForId(player.activeAvatar)}
              </p>
            </div>
            {/* Banner */}
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-vault-600 shrink-0">
                <Image src={getBannerImage(player.activeBadgeFrame)} alt="banner" fill className="object-cover" sizes="32px" priority />
              </div>
              <p className="text-[10px] text-vault-gold font-semibold leading-tight">
                {formatCompactBonusesForId(player.activeBadgeFrame)}
              </p>
            </div>
          </div>
        </div>

        {/* Risk Meter */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-vault-400">Risk Meter</span>
            <span
              className={`font-bold ${
                risk > 20 ? "text-vault-danger" : "text-vault-gold"
              }`}
            >
              {risk}%
            </span>
          </div>
          <div className="h-3 bg-vault-800 rounded-full overflow-hidden border border-vault-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                risk > 20
                  ? "bg-gradient-to-r from-vault-gold to-vault-danger"
                  : "bg-gradient-to-r from-vault-gem to-vault-gold"
              }`}
              style={{ width: `${Math.min(risk * 2.5, 100)}%` }}
            />
          </div>
        </div>
      </div>
      </div>

      {/* Vault Images */}
      <div className="px-4 flex-1 flex flex-col items-center justify-start gap-2 pt-2">
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
              {/* Vault image */}
              <div
                className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  isCurrent
                    ? isAnimating
                      ? "border-vault-gold shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-105"
                      : "border-vault-gold shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    : isTrap
                    ? "border-vault-danger shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                    : isOpen
                    ? "border-vault-gold/40 grayscale"
                    : "border-vault-700 opacity-60"
                } ${isCurrent ? "w-48 h-48" : "w-28 h-28"}`}
              >
                <Image
                  src={getVaultImage(player.activeVaultSkin)}
                  alt={`Vault ${vaultNum}`}
                  fill
                  className={`object-cover ${isAnimating ? "animate-pulse" : ""}`}
                  sizes={isCurrent ? "192px" : "112px"}
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
              const baseOdds = VAULT_ODDS[run.currentVault] ?? VAULT_ODDS[Math.max(...Object.keys(VAULT_ODDS).map(Number))];
              const adjusted = applyOddsBonuses(baseOdds, bonuses);
              const hasBonuses = bonuses.jackpotChanceBonus > 0 || bonuses.mediumGemChanceBonus > 0 || bonuses.trapReduction > 0;
              const totalChance = adjusted.reduce((s, o) => s + o.chance, 0);
              return (
                <>
                  {hasBonuses && (
                    <p className="text-xs text-vault-gold mb-3">
                      Your cosmetics are changing these odds!
                    </p>
                  )}
                  <div className="space-y-1">
                    {adjusted.map((o) => {
                      const base = baseOdds.find((b) => b.type === o.type);
                      const pct = totalChance > 0 ? ((o.chance / totalChance) * 100).toFixed(1) : "0.0";
                      const changed = base && base.chance !== o.chance;
                      return (
                        <div
                          key={o.type}
                          className="flex items-center justify-between text-sm py-1"
                        >
                          <span className="text-vault-300">
                            {o.type.replace(/([A-Z])/g, " $1").trim()}
                            <span className="text-vault-500 text-xs ml-1">({OUTCOME_BASE_LABELS[o.type]})</span>
                          </span>
                          <div className="text-right">
                            <span
                              className={`font-bold ${
                                o.type === "trap"
                                  ? "text-vault-danger"
                                  : o.type === "jackpot"
                                  ? "text-vault-gem"
                                  : "text-white"
                              }`}
                            >
                              {pct}%
                            </span>
                            {changed && base && (
                              <span className="text-vault-500 text-xs ml-1.5">
                                ({base.chance}% base)
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {hasBonuses && (
                    <div className="mt-3 pt-3 border-t border-vault-700/50 text-xs text-vault-400">
                      {bonuses.jackpotChanceBonus > 0 && <p>+{bonuses.jackpotChanceBonus}% jackpot chance (from cosmetics)</p>}
                      {bonuses.mediumGemChanceBonus > 0 && <p>+{bonuses.mediumGemChanceBonus}% medium gem chance (from cosmetics)</p>}
                      {bonuses.trapReduction > 0 && <p>-{bonuses.trapReduction}% trap chance (from cosmetics)</p>}
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
  const isPositive =
    outcome.type !== "trap";
  const bg = isPositive
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
          {outcome.type === "trap" ? (
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
            outcome.type === "trap"
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
