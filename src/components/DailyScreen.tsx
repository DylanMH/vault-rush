"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Calendar, Gem, KeyRound, Heart, Sparkles } from "lucide-react";
import { Player } from "@/types/game";
import { useSound } from "@/hooks/useSound";

interface DailyScreenProps {
  player: Player;
  onBack: () => void;
  onClaimDaily: () => Promise<boolean>;
}

export default function DailyScreen({ player, onBack, onClaimDaily }: DailyScreenProps) {
  const sound = useSound();
  const [claimed, setClaimed] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  useEffect(() => {
    const todayIso = new Date().toISOString().split('T')[0];
    const lastIso = player.lastDailyClaim ? new Date(player.lastDailyClaim).toISOString().split('T')[0] : null;
    setAlreadyClaimed(lastIso === todayIso);
  }, [player.lastDailyClaim]);

  const rewards = [
    { day: 1, reward: "50 Gems", icon: <Gem size={16} className="text-vault-gem" /> },
    { day: 2, reward: "2 Keys", icon: <KeyRound size={16} className="text-vault-gold" /> },
    { day: 3, reward: "1 Revive", icon: <Heart size={16} className="text-red-400" /> },
    { day: 4, reward: "100 Gems", icon: <Gem size={16} className="text-vault-gem" /> },
    { day: 5, reward: "4 Keys", icon: <KeyRound size={16} className="text-vault-gold" /> },
    { day: 6, reward: "2 Revives", icon: <Heart size={16} className="text-red-400" /> },
    { day: 7, reward: "300 Gems", icon: <Sparkles size={16} className="text-vault-gold" /> },
  ];

  const currentDay = ((player.streak - 1) % 7) + 1;

  return (
    <div className="flex flex-col min-h-screen bg-vault-900">
      <div className="flex items-center gap-3 px-4 py-3 bg-vault-900/95 backdrop-blur border-b border-vault-700">
        <button onClick={() => { sound.playClick(); onBack(); }} className="text-vault-400 hover:text-white transition">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Daily Rewards</h2>
      </div>

      <div className="px-4 py-6 text-center">
        <Calendar size={32} className="mx-auto text-vault-gold mb-2" />
        <p className="text-2xl font-black text-white">Day {player.streak}</p>
        <p className="text-sm text-vault-400 mt-1">
          {alreadyClaimed ? "Come back tomorrow!" : "Claim your reward now!"}
        </p>
      </div>

      <div className="px-4 space-y-2">
        {rewards.map((r) => {
          const isPast = r.day < currentDay || (alreadyClaimed && r.day === currentDay);
          const isCurrent = r.day === currentDay && !alreadyClaimed;
          return (
            <div
              key={r.day}
              className={`flex items-center justify-between p-4 rounded-xl border transition ${
                isCurrent
                  ? "bg-vault-gold/10 border-vault-gold animate-pulse-slow"
                  : isPast
                  ? "bg-vault-800/40 border-vault-700 opacity-50"
                  : "bg-vault-800 border-vault-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isPast ? "bg-vault-700 text-vault-500" : isCurrent ? "bg-vault-gold text-vault-900" : "bg-vault-700 text-white"
                }`}>
                  {isPast ? "✓" : r.day}
                </div>
                <p className="text-sm font-bold">{r.reward}</p>
              </div>
              {isCurrent && !claimed && (
                <button
                  onClick={async () => {
                    sound.playClick();
                    if (await onClaimDaily()) {
                      sound.playWinSmall();
                      setClaimed(true);
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-vault-gold text-vault-900 text-xs font-bold"
                >
                  Claim
                </button>
              )}
            </div>
          );
        })}
      </div>

      {claimed && (
        <div className="px-4 mt-4 text-center">
          <p className="text-vault-gem font-bold text-sm">Reward claimed!</p>
        </div>
      )}
    </div>
  );
}
