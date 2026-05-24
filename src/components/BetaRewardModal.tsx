"use client";

import { useState } from "react";
import { Gem, KeyRound, Heart, Sparkles, Crown } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useSound } from "@/hooks/useSound";
import confetti from "canvas-confetti";

interface BetaRewardModalProps {
  onClaim: () => Promise<void>;
  onClose: () => void;
}

export default function BetaRewardModal({ onClaim, onClose }: BetaRewardModalProps) {
  const sound = useSound();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async () => {
    if (claiming) return;
    setClaiming(true);
    sound.playJackpot();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.55 },
      colors: ["#f59e0b", "#ef4444", "#ec4899", "#8b5cf6", "#10b981"],
    });
    await onClaim();
    setClaiming(false);
    setClaimed(true);
  };

  const rewards = [
    { icon: Gem, label: "Gems", value: 50000, color: "text-vault-gem", bg: "bg-vault-gem/10", border: "border-vault-gem/30" },
    { icon: KeyRound, label: "Keys", value: 50, color: "text-vault-gold", bg: "bg-vault-gold/10", border: "border-vault-gold/30" },
    { icon: Heart, label: "Lives", value: 50, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30" },
    { icon: Sparkles, label: "Shards", value: 500, color: "text-vault-accent", bg: "bg-vault-accent/10", border: "border-vault-accent/30" },
    { icon: Crown, label: "Vault Rush+", value: "Active", color: "text-vault-gold", bg: "bg-vault-gold/10", border: "border-vault-gold/30", isText: true },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4">
      <div className="bg-vault-800 rounded-2xl w-full max-w-sm p-6 border-2 border-vault-gold text-center animate-pop">
        {!claimed ? (
          <>
            <Heart size={44} className="mx-auto text-red-400 mb-3 animate-pulse" />
            <p className="text-lg font-black gold-text mb-1">Thank You!</p>
            <p className="text-sm text-vault-300 mb-1">For helping me beta test this game.</p>
            <p className="text-sm text-vault-300 mb-5">I miss you and appreciate you! &lt;3</p>

            <p className="text-xs font-bold text-vault-400 uppercase tracking-wider mb-3">Your Rewards</p>
            <div className="space-y-2 mb-5">
              {rewards.map((r) => (
                <div
                  key={r.label}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 border ${r.bg} ${r.border}`}
                >
                  <div className="flex items-center gap-2">
                    <r.icon size={18} className={r.color} />
                    <span className="text-sm font-bold text-white">{r.label}</span>
                  </div>
                  <span className={`text-sm font-black ${r.color}`}>
                    {r.isText ? r.value : `+${formatNumber(r.value as number)}`}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleClaim}
              disabled={claiming}
              className="w-full py-3 rounded-xl bg-vault-gold text-vault-900 font-black text-sm hover:bg-vault-goldLight transition disabled:opacity-50"
            >
              {claiming ? "Claiming..." : "Claim Rewards"}
            </button>
          </>
        ) : (
          <>
            <Sparkles size={44} className="mx-auto text-vault-gold mb-3" />
            <p className="text-lg font-black gold-text mb-1">Rewards Claimed!</p>
            <p className="text-sm text-vault-300 mb-5">Enjoy Vault Rush+ and all your goodies.</p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-vault-gold text-vault-900 font-black text-sm hover:bg-vault-goldLight transition"
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
}
