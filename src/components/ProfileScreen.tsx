"use client";

import { ChevronLeft, User, Trophy, Gem, KeyRound, Heart, Star, Skull, Sparkles, Zap, LogOut } from "lucide-react";
import Image from "next/image";
import { Player } from "@/types/game";
import { formatNumber } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

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

interface ProfileScreenProps {
  player: Player;
  onBack: () => void;
  isGuest?: boolean;
  userDisplayName?: string | null;
  userEmail?: string | null;
}

export default function ProfileScreen({ player, onBack, isGuest, userDisplayName, userEmail }: ProfileScreenProps) {
  return (
    <div className="relative flex flex-col min-h-screen bg-vault-900 overflow-hidden">
      {/* Full-page banner background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getBannerImage(player.activeBadgeFrame)}
          alt="banner"
          fill
          className="object-cover object-top opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-vault-900/70 via-vault-900/85 to-vault-900" />
      </div>

      <div className="relative z-10 flex items-center gap-3 px-4 py-3 border-b border-vault-700/50">
        <button onClick={onBack} className="text-vault-400 hover:text-white transition">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Profile</h2>
      </div>

      <div className="relative z-10 px-4 py-6 text-center">
        {/* Avatar */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl overflow-hidden border-2 border-vault-gold bg-vault-800 mb-2">
          <Image
            src={getAvatarImage(player.activeAvatar)}
            alt="avatar"
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <p className="text-xl font-black text-white">{userDisplayName || "Vault Rusher"}</p>
        {!isGuest && userEmail && (
          <p className="text-xs text-vault-400 mt-0.5">Signed in as {userEmail}</p>
        )}
        {isGuest && (
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-vault-gold/20 text-vault-gold text-xs font-bold border border-vault-gold/30">
            Guest
          </span>
        )}
        <div className="flex items-center justify-center gap-1 mt-1 text-vault-gold">
          <Star size={14} fill="currentColor" />
          <span className="text-sm font-bold">Level {player.level}</span>
        </div>
        <div className="w-full bg-vault-800 rounded-full h-3 mt-3 border border-vault-700 overflow-hidden max-w-xs mx-auto">
          <div
            className="bg-gradient-to-r from-vault-gold to-vault-goldLight h-full rounded-full transition-all"
            style={{ width: `${(player.xp / player.xpToNextLevel) * 100}%` }}
          />
        </div>
        <p className="text-xs text-vault-400 mt-1">
          {formatNumber(player.xp)} / {formatNumber(player.xpToNextLevel)} XP
        </p>
      </div>

      <div className="relative z-10 px-4 space-y-2">
        <StatRow icon={<Gem size={18} className="text-vault-gem" />} label="Total Gems Earned" value={formatNumber(player.totalGemsEarned)} />
        <StatRow icon={<KeyRound size={18} className="text-vault-gold" />} label="Vaults Opened" value={formatNumber(player.totalVaultsOpened)} />
        <StatRow icon={<Skull size={18} className="text-vault-danger" />} label="Traps Hit" value={player.trapCount.toString()} />
        <StatRow icon={<Sparkles size={18} className="text-vault-goldLight" />} label="Jackpots" value={player.jackpotCount.toString()} />
        <StatRow icon={<Trophy size={18} className="text-vault-accent" />} label="Best Run" value={`${formatNumber(player.bestRunGems)} gems`} />
        <StatRow icon={<KeyRound size={18} className="text-vault-goldLight" />} label="Longest Run" value={`${player.longestRun} vaults`} />
        <StatRow icon={<Zap size={18} className="text-vault-gemLight" />} label="Longest Streak" value={`${player.longestStreak} days`} />
        <StatRow icon={<Heart size={18} className="text-red-400" />} label="Revive Tokens" value={player.reviveTokens.toString()} />
      </div>

      <div className="relative z-10 px-4 mt-6 mb-8">
        {!isGuest ? (
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="w-full py-3 rounded-xl font-semibold text-sm text-vault-danger bg-vault-danger/10 border border-vault-danger/30 active:scale-[0.98] transition hover:bg-vault-danger/20 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem('vr_auth_state');
              window.location.reload();
            }}
            className="w-full py-3 rounded-xl font-semibold text-sm text-vault-gold bg-vault-gold/10 border border-vault-gold/30 active:scale-[0.98] transition hover:bg-vault-gold/20 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Sign Up to Save Progress
          </button>
        )}
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-vault-800 rounded-xl border border-vault-700">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm text-vault-300">{label}</span>
      </div>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}
