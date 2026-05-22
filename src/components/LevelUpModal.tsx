"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Gem, KeyRound, Heart, Sparkles } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { xpForLevel } from "@/lib/gameLogic";
import { useSound } from "@/hooks/useSound";
import confetti from "canvas-confetti";

interface LevelUpModalProps {
  oldLevel: number;
  newLevel: number;
  rewards: { gems: number; keys: number; shards: number };
  currentXp: number;
  xpToNext: number;
  onClose: () => void;
}

export default function LevelUpModal({
  oldLevel,
  newLevel,
  rewards,
  currentXp,
  xpToNext,
  onClose,
}: LevelUpModalProps) {
  const sound = useSound();
  const [phase, setPhase] = useState<"level" | "xp" | "rewards">("level");
  const [displayedLevel, setDisplayedLevel] = useState(oldLevel);
  const [xpPercent, setXpPercent] = useState(0);
  const [showExplosion, setShowExplosion] = useState(false);
  const timeoutsRef = useRef<number[]>([]);
  const soundPlayedRef = useRef(false);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    if (!soundPlayedRef.current) {
      soundPlayedRef.current = true;
      sound.playLevelUp();
    }
    // Phase 1: Show old level ticking up to new level
    let lvl = oldLevel;
    const interval = setInterval(() => {
      lvl += 1;
      if (lvl >= newLevel) {
        clearInterval(interval);
        const t = window.setTimeout(() => setPhase("xp"), 1000);
        timeoutsRef.current.push(t);
      }
      setDisplayedLevel(lvl);
    }, 1200);
    return () => {
      clearInterval(interval);
      clearTimeouts();
    };
  }, [oldLevel, newLevel]);

  useEffect(() => {
    if (phase !== "xp") return;
    // Phase 2: XP bar filling from 0 to current XP %
    const target = Math.min((currentXp / xpToNext) * 100, 100);
    let pct = 0;
    const interval = setInterval(() => {
      pct += 1;
      if (pct >= target) {
        clearInterval(interval);
        setXpPercent(target);
        const t1 = window.setTimeout(() => {
          setShowExplosion(true);
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
            colors: ["#f59e0b", "#10b981", "#8b5cf6", "#fbbf24"],
          });
          const t2 = window.setTimeout(() => setPhase("rewards"), 1800);
          timeoutsRef.current.push(t2);
        }, 800);
        timeoutsRef.current.push(t1);
      } else {
        setXpPercent(pct);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [phase, currentXp, xpToNext]);

  useEffect(() => {
    if (phase === "rewards") {
      sound.playBank();
    }
  }, [phase, sound]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4">
      <div className="bg-vault-800 rounded-2xl w-full max-w-xs p-6 border-2 border-vault-gold text-center animate-pop">
        {phase === "level" && (
          <>
            <Sparkles size={40} className="mx-auto text-vault-gold mb-3" />
            <p className="text-xs font-bold text-vault-gold uppercase tracking-wider mb-1">
              Level Up!
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl font-black text-vault-400">
                Lv.{oldLevel}
              </span>
              <span className="text-xl text-vault-400">→</span>
              <span className="text-5xl font-black gold-text">
                Lv.{displayedLevel}
              </span>
            </div>
          </>
        )}

        {phase === "xp" && (
          <>
            <p className="text-2xl font-black gold-text mb-2">
              Lv.{newLevel}
            </p>
            <p className="text-xs text-vault-400 mb-3">
              XP to Next Level
            </p>
            <div className="h-4 bg-vault-700 rounded-full overflow-hidden border border-vault-600 mb-2">
              <div
                className="h-full bg-gradient-to-r from-vault-gold to-vault-gem transition-all duration-75"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <p className="text-xs text-vault-400">
              {formatNumber(currentXp)} / {formatNumber(xpToNext)} XP
            </p>
            {showExplosion && (
              <div className="mt-3 text-lg font-bold text-vault-gold animate-bounce">
                MAX XP BURST!
              </div>
            )}
          </>
        )}

        {phase === "rewards" && (
          <>
            <Star size={40} className="mx-auto text-vault-gold mb-2" />
            <p className="text-2xl font-black gold-text mb-1">
              Lv.{newLevel} Reached!
            </p>
            <p className="text-xs text-vault-400 mb-4">
              Here are your rewards
            </p>
            <div className="space-y-2 mb-5">
              {rewards.gems > 0 && (
                <div className="flex items-center justify-between bg-vault-700/50 rounded-xl px-4 py-2 border border-vault-600">
                  <div className="flex items-center gap-2">
                    <Gem size={18} className="text-vault-gem" />
                    <span className="text-sm font-bold">Gems</span>
                  </div>
                  <span className="text-sm font-black text-vault-gem">
                    +{formatNumber(rewards.gems)}
                  </span>
                </div>
              )}
              {rewards.keys > 0 && (
                <div className="flex items-center justify-between bg-vault-700/50 rounded-xl px-4 py-2 border border-vault-600">
                  <div className="flex items-center gap-2">
                    <KeyRound size={18} className="text-vault-gold" />
                    <span className="text-sm font-bold">Keys</span>
                  </div>
                  <span className="text-sm font-black text-vault-gold">
                    +{rewards.keys}
                  </span>
                </div>
              )}
              {rewards.shards > 0 && (
                <div className="flex items-center justify-between bg-vault-700/50 rounded-xl px-4 py-2 border border-vault-600">
                  <div className="flex items-center gap-2">
                    <Heart size={18} className="text-vault-accent" />
                    <span className="text-sm font-bold">Shards</span>
                  </div>
                  <span className="text-sm font-black text-vault-accent">
                    +{rewards.shards}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
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
