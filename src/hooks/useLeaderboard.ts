"use client";

import { useState, useEffect } from 'react';
import { supabase, LeaderboardEntry } from '@/lib/supabase';

type LeaderboardCategory = 'best_run' | 'longest_streak' | 'highest_jackpot' | 'weekly_score' | 'longest_run';

const categoryColumnMap: Record<LeaderboardCategory, string> = {
  best_run: 'best_run_gems',
  longest_run: 'longest_run',
  longest_streak: 'longest_streak',
  highest_jackpot: 'highest_jackpot',
  weekly_score: 'weekly_score',
};

export function useLeaderboard(category: LeaderboardCategory) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [category]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const scoreColumn = categoryColumnMap[category];
      const { data, error: fetchError } = await supabase
        .from('players')
        .select('user_id, username, display_name, level, active_vault_skin, active_avatar, active_badge_frame, ' + scoreColumn)
        .gt(scoreColumn, 0)
        .order(scoreColumn, { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      const mapped: LeaderboardEntry[] = (data || []).map((row: any, index: number) => ({
        user_id: row.user_id,
        username: row.username,
        display_name: row.display_name,
        score: row[scoreColumn] as number,
        level: row.level,
        active_vault_skin: row.active_vault_skin,
        active_avatar: row.active_avatar,
        active_badge_frame: row.active_badge_frame,
        rank: index + 1,
      }));

      setEntries(mapped);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    entries,
    isLoading,
    error,
    refresh: fetchLeaderboard,
  };
}
