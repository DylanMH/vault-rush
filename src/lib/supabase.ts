import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface SupabasePlayer {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  email: string | null;
  gems: number;
  keys: number;
  revive_tokens: number;
  level: number;
  xp: number;
  xp_to_next_level: number;
  streak: number;
  last_daily_claim: string | null;
  is_subscribed: boolean;
  subscription_expiry: string | null;
  is_ad_free: boolean;
  total_gems_earned: number;
  total_vaults_opened: number;
  trap_count: number;
  jackpot_count: number;
  best_run_gems: number;
  longest_streak: number;
  longest_run: number;
  highest_jackpot: number;
  weekly_score: number;
  cosmetic_shards: number;
  owned_cosmetics: string[];
  active_vault_skin: string;
  active_avatar: string;
  active_badge_frame: string;
  current_run: any | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseRun {
  id: string;
  player_id: string;
  vaults_opened: number;
  gems_banked: number;
  multiplier_reached: number;
  hit_trap: boolean;
  hit_jackpot: boolean;
  outcomes: any[];
  created_at: string;
}

export interface LeaderboardEntry {
  user_id?: string;
  username?: string;
  display_name?: string;
  score: number;
  level?: number;
  active_vault_skin?: string;
  active_avatar?: string;
  active_badge_frame?: string;
  rank: number;
}
