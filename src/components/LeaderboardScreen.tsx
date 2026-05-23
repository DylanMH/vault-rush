"use client";

import { useState } from "react";
import { ChevronLeft, Trophy, Medal, Loader2 } from "lucide-react";
import { Player } from "@/types/game";
import { formatNumber } from "@/lib/utils";
import { useSound } from "@/hooks/useSound";
import { useLeaderboard } from "@/hooks/useLeaderboard";

type CategoryKey = "best_run" | "longest_streak" | "highest_jackpot" | "weekly_score" | "longest_run";

const tabs: { key: CategoryKey; label: string; playerField: keyof Player }[] = [
  { key: "best_run", label: "Biggest Run", playerField: "bestRunGems" },
  { key: "longest_run", label: "Longest Run", playerField: "longestRun" },
  { key: "longest_streak", label: "Streak", playerField: "longestStreak" },
  { key: "highest_jackpot", label: "Jackpot", playerField: "highestJackpot" },
  { key: "weekly_score", label: "Weekly", playerField: "weeklyScore" },
];

interface LeaderboardScreenProps {
  player: Player;
  userId: string | null;
  onBack: () => void;
}

function EntryRow({ entry }: { entry: { rank: number; name: string; score: number; isPlayer: boolean } }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border ${
        entry.isPlayer
          ? "bg-vault-gold/10 border-vault-gold/40"
          : "bg-vault-800 border-vault-700"
      }`}
    >
      <div className="w-8 text-center">
        {entry.rank <= 3 ? (
          <Medal
            size={20}
            className={
              entry.rank === 1
                ? "text-yellow-400"
                : entry.rank === 2
                ? "text-gray-300"
                : "text-amber-600"
            }
          />
        ) : (
          <span className="text-sm font-bold text-vault-400">{entry.rank}</span>
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-bold ${entry.isPlayer ? "text-vault-gold" : "text-white"}`}>
          {entry.name}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Trophy size={14} className="text-vault-gold" />
        <span className="text-sm font-bold">{formatNumber(entry.score)}</span>
      </div>
    </div>
  );
}

export default function LeaderboardScreen({ player, userId, onBack }: LeaderboardScreenProps) {
  const sound = useSound();
  const [activeTab, setActiveTab] = useState<CategoryKey>("best_run");
  const { entries, isLoading, error } = useLeaderboard(activeTab);

  const playerScore = player[tabs.find((t) => t.key === activeTab)!.playerField] as number;

  const getDisplayName = (e: typeof entries[0]) =>
    e.display_name || e.username || "Anonymous";

  // Top 10 entries
  const topEntries = entries.slice(0, 10).map((e) => ({
    rank: e.rank,
    name: getDisplayName(e),
    score: e.score,
    isPlayer: e.user_id === userId,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-vault-900">
      <div className="flex items-center gap-3 px-4 py-3 bg-vault-900/95 backdrop-blur border-b border-vault-700">
        <button onClick={() => { sound.playClick(); onBack(); }} className="text-vault-400 hover:text-white transition">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Leaderboard</h2>
      </div>

      <div className="grid grid-cols-5 gap-1.5 px-4 mt-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { sound.playClick(); setActiveTab(t.key); }}
            className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold text-center leading-tight transition ${
              activeTab === t.key
                ? "bg-vault-gold text-vault-900"
                : "bg-vault-800 text-vault-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 space-y-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 size={32} className="text-vault-gold animate-spin" />
            <p className="text-sm text-vault-400">Loading leaderboard...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="text-sm text-vault-danger">{error}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Trophy size={32} className="text-vault-400" />
            <p className="text-sm text-vault-400">No entries yet. Be the first!</p>
          </div>
        ) : (
          <>
            {topEntries.map((entry) => (
              <EntryRow key={entry.rank + entry.name} entry={entry} />
            ))}

            {/* Show player rank if not in top 10 */}
            {(() => {
              const playerEntry = entries.find((e) => e.user_id === userId);
              if (!userId || playerScore <= 0 || topEntries.some((e) => e.isPlayer) || !playerEntry) return null;
              return (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <div className="flex-1 h-px bg-vault-700" />
                    <span className="text-[10px] text-vault-400 font-bold uppercase">Your Rank</span>
                    <div className="flex-1 h-px bg-vault-700" />
                  </div>
                  <EntryRow
                    entry={{
                      rank: playerEntry.rank,
                      name: getDisplayName(playerEntry),
                      score: playerScore,
                      isPlayer: true,
                    }}
                  />
                </>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}
