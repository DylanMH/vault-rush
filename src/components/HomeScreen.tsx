"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Gem,
  KeyRound,
  Heart,
  Trophy,
  ShoppingBag,
  Layers,
  Calendar,
  Zap,
  Star,
  ChevronRight,
  Crown,
} from "lucide-react";
import { Player } from "@/types/game";
import { formatNumber } from "@/lib/utils";
import { Screen } from "@/hooks/useGameState";
import { getDailyEvent } from "@/lib/gameLogic";
import { useSound } from "@/hooks/useSound";
import LegalModal from "./LegalModal";

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

interface HomeScreenProps {
  player: Player;
  onNavigate: (s: Screen) => void;
  onStartRun: () => boolean | Promise<boolean>;
  onClaimDaily: () => Promise<boolean>;
}

export default function HomeScreen({
  player,
  onNavigate,
  onStartRun,
  onClaimDaily,
}: HomeScreenProps) {
  const sound = useSound();
  const [canClaimDaily, setCanClaimDaily] = useState(false);

  useEffect(() => {
    const todayIso = new Date().toISOString().split('T')[0];
    const lastIso = player.lastDailyClaim ? new Date(player.lastDailyClaim).toISOString().split('T')[0] : null;
    setCanClaimDaily(lastIso !== todayIso);
  }, [player.lastDailyClaim]);

  return (
    <div className="flex flex-col min-h-screen bg-vault-900 pb-24">
      {/* Header Stats */}
      <div className="sticky top-0 z-10 bg-vault-900/95 backdrop-blur border-b border-vault-700 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="gold-text">VAULT</span>{" "}
              <span className="text-white">RUSH</span>
            </h1>
            <div className="flex items-center gap-1 text-xs text-vault-gold mt-0.5">
              <Star size={12} fill="currentColor" />
              <span>
                Lv.{player.level} — {formatNumber(player.xp)}/{formatNumber(player.xpToNextLevel)} XP
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-vault-800 rounded-full px-3 py-1.5 border border-vault-600">
            <Gem size={16} className="text-vault-gem" />
            <span className="font-bold text-sm">{formatNumber(player.gems)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm">
              <KeyRound size={14} className="text-vault-gold" />
              <span className="font-semibold">{player.keys}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Heart size={14} className="text-red-400" />
              <span className="font-semibold">{player.reviveTokens}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Layers size={14} className="text-vault-accent" />
              <span className="font-semibold">{player.cosmeticShards}</span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate("profile");
            }}
            className="flex items-center gap-2 bg-vault-800 hover:bg-vault-700 border border-vault-600 hover:border-vault-gold/50 rounded-full pl-1.5 pr-3 py-1 transition active:scale-[0.97]"
          >
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-vault-600 shrink-0">
              <Image src={getAvatarImage(player.activeAvatar)} alt="avatar" fill className="object-cover" sizes="28px" priority />
            </div>
            <span className="text-xs font-bold text-vault-gold">Profile</span>
          </button>
        </div>
      </div>

      {/* Daily Event Banner */}
      <EventBanner />

      {/* Start Run */}
      <div className="px-4 mt-6">
        <button
          onClick={() => {
            sound.playClick();
            Promise.resolve(onStartRun()).then((ok) => {
              if (!ok) alert("Not enough keys! Watch an ad or visit the shop.");
            });
          }}
          disabled={player.keys < 1}
          className={`w-full py-5 rounded-2xl font-black text-xl tracking-wide uppercase transition-all duration-200 ${
            player.keys >= 1
              ? "bg-gradient-to-r from-vault-gold to-vault-goldLight text-vault-900 shadow-lg glow-gold active:scale-[0.98]"
              : "bg-vault-700 text-vault-500 cursor-not-allowed"
          }`}
        >
          {player.keys >= 1 ? "Start Run" : "No Keys"}
        </button>
        <p className="text-center text-xs text-vault-400 mt-2">
          Costs 1 Key per run
        </p>
      </div>

      {/* Daily Reward */}
      <div className="px-4 mt-4">
        <button
          onClick={async () => {
            sound.playClick();
            if (await onClaimDaily()) {
              // Success feedback handled by re-render
            }
          }}
          disabled={!canClaimDaily}
          className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${
            canClaimDaily
              ? "bg-vault-800 border-vault-gold text-vault-gold animate-pulse-slow"
              : "bg-vault-800/50 border-vault-700 text-vault-500 cursor-not-allowed"
          }`}
        >
          <div className="flex items-center gap-3">
            <Calendar size={20} />
            <div className="text-left">
              <p className="font-bold text-sm">Daily Reward</p>
              <p className="text-xs opacity-70">
                {canClaimDaily
                  ? `Streak: ${player.streak} days`
                  : "Come back tomorrow!"}
              </p>
            </div>
          </div>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Subscription Promo */}
      {!player.isSubscribed && (
        <div className="px-4 mt-4">
          <div
            onClick={() => onNavigate("shop")}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-vault-800 to-vault-700 border border-vault-gold/30 cursor-pointer active:scale-[0.99] transition"
          >
            <div className="flex items-center gap-3">
              <Crown size={20} className="text-vault-gold" />
              <div className="text-left">
                <p className="font-bold text-sm text-vault-gold">
                  Vault Rush Plus
                </p>
                <p className="text-xs text-vault-400">
                  No ads + daily keys + 10% gem boost
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-vault-gold" />
          </div>
        </div>
      )}

      {/* Menu Grid */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-2 gap-3">
          <MenuCard
            icon={<ShoppingBag size={22} className="text-vault-gem" />}
            label="Shop"
            onClick={() => {
              sound.playClick();
              onNavigate("shop");
            }}
          />
          <MenuCard
            icon={<Layers size={22} className="text-vault-accent" />}
            label="Collection"
            onClick={() => {
              sound.playClick();
              onNavigate("collection");
            }}
          />
          <MenuCard
            icon={<Trophy size={22} className="text-vault-gold" />}
            label="Leaderboard"
            onClick={() => {
              sound.playClick();
              onNavigate("leaderboard");
            }}
          />
          <MenuCard
            icon={<Calendar size={22} className="text-vault-gemLight" />}
            label="Daily"
            onClick={() => {
              sound.playClick();
              onNavigate("daily");
            }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-bold text-vault-400 uppercase tracking-wider mb-3">
          Stats
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <StatPill
            label="Best Run"
            value={formatNumber(player.bestRunGems)}
          />
          <StatPill label="Longest Run" value={`${player.longestRun}`} />
          <StatPill label="Jackpots" value={player.jackpotCount.toString()} />
          <StatPill
            label="Total Opened"
            value={formatNumber(player.totalVaultsOpened)}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 mt-8 pb-4 text-center">
        <LegalModal />
      </div>
    </div>
  );
}

function EventBanner() {
  const [event, setEvent] = useState({ name: "Daily Event", description: "Check back later!" });

  useEffect(() => {
    setEvent(getDailyEvent());
  }, []);

  return (
    <div className="px-4 mt-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-vault-accent to-vault-accentLight p-4 shine">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-white" fill="currentColor" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/90">
              {event.name}
            </span>
          </div>
          <p className="text-sm text-white/90 font-medium">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function MenuCard({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-vault-800 border border-vault-700 active:scale-[0.97] transition hover:border-vault-600"
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-vault-800 rounded-xl p-3 text-center border border-vault-700">
      <p className="text-lg font-black text-white">{value}</p>
      <p className="text-xs text-vault-400 mt-0.5">{label}</p>
    </div>
  );
}
