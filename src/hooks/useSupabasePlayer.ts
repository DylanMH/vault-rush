"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, SupabasePlayer } from '@/lib/supabase';
import { Player } from '@/types/game';
import { getDefaultPlayer } from '@/lib/gameLogic';

const AUTH_STATE_KEY = 'vr_auth_state';

export type AuthState = 'loading' | 'unauthenticated' | 'guest' | 'authenticated';

function convertSupabaseToPlayer(sp: SupabasePlayer): Player {
  return {
    gems: sp.gems,
    keys: sp.keys,
    reviveTokens: sp.revive_tokens,
    level: sp.level,
    xp: sp.xp,
    xpToNextLevel: sp.xp_to_next_level,
    streak: sp.streak,
    lastDailyClaim: sp.last_daily_claim 
      ? new Date(sp.last_daily_claim).toISOString().split('T')[0] 
      : null,
    isSubscribed: sp.is_subscribed,
    subscriptionExpiry: sp.subscription_expiry,
    isAdFree: sp.is_ad_free,
    totalGemsEarned: sp.total_gems_earned,
    totalVaultsOpened: sp.total_vaults_opened,
    trapCount: sp.trap_count,
    jackpotCount: sp.jackpot_count,
    bestRunGems: sp.best_run_gems,
    longestStreak: sp.longest_streak,
    longestRun: sp.longest_run ?? 0,
    highestJackpot: sp.highest_jackpot,
    weeklyScore: sp.weekly_score,
    cosmeticShards: sp.cosmetic_shards,
    ownedCosmetics: sp.owned_cosmetics,
    activeVaultSkin: sp.active_vault_skin,
    activeAvatar: sp.active_avatar,
    activeBadgeFrame: sp.active_badge_frame,
  };
}

function convertPlayerToSupabase(p: Player, userId: string): Partial<SupabasePlayer> {
  return {
    user_id: userId,
    gems: p.gems,
    keys: p.keys,
    revive_tokens: p.reviveTokens,
    level: p.level,
    xp: p.xp,
    xp_to_next_level: p.xpToNextLevel,
    streak: p.streak,
    last_daily_claim: p.lastDailyClaim,
    is_subscribed: p.isSubscribed,
    subscription_expiry: p.subscriptionExpiry,
    is_ad_free: p.isAdFree,
    total_gems_earned: p.totalGemsEarned,
    total_vaults_opened: p.totalVaultsOpened,
    trap_count: p.trapCount,
    jackpot_count: p.jackpotCount,
    best_run_gems: p.bestRunGems,
    longest_streak: p.longestStreak,
    longest_run: p.longestRun,
    highest_jackpot: p.highestJackpot,
    weekly_score: p.weeklyScore,
    cosmetic_shards: p.cosmeticShards,
    owned_cosmetics: p.ownedCosmetics,
    active_vault_skin: p.activeVaultSkin,
    active_avatar: p.activeAvatar,
    active_badge_frame: p.activeBadgeFrame,
  };
}

export function useSupabasePlayer() {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [userId, setUserId] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authStateRef = useRef<AuthState>('loading');

  useEffect(() => {
    authStateRef.current = authState;
  }, [authState]);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
        setUserDisplayName(session.user.user_metadata?.display_name || session.user.user_metadata?.username || null);
        setUserEmail(session.user.email || null);
        setAuthState('authenticated');
      } else {
        // getSession can return stale null while onAuthStateChange recovers the session.
        // Wait briefly so the listener can fire before we commit to unauthenticated.
        await new Promise((resolve) => setTimeout(resolve, 400));

        // After the delay, check the ref to see if onAuthStateChange already updated state.
        // If it did, authStateRef.current will be 'authenticated' and we should not override.
        if (authStateRef.current === 'authenticated') {
          // Session was recovered by onAuthStateChange during the delay.
          // authState, userId, etc. are already set by the listener.
        } else {
          // Check if user was previously a guest
          const savedState = localStorage.getItem(AUTH_STATE_KEY);
          if (savedState === 'guest') {
            setAuthState('guest');
          } else {
            setAuthState('unauthenticated');
          }
        }
      }
    } catch (err) {
      console.error('Session check error:', err);
      setAuthState('unauthenticated');
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
          setUserDisplayName(session.user.user_metadata?.display_name || session.user.user_metadata?.username || null);
          setUserEmail(session.user.email || null);
          setAuthState('authenticated');
          localStorage.setItem(AUTH_STATE_KEY, 'authenticated');
        } else {
          setUserId(null);
          setUserDisplayName(null);
          setUserEmail(null);
          setAuthState('unauthenticated');
          localStorage.removeItem(AUTH_STATE_KEY);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const setGuestMode = useCallback(() => {
    setAuthState('guest');
    setUserId(null);
    localStorage.setItem(AUTH_STATE_KEY, 'guest');
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setAuthState('unauthenticated');
    localStorage.removeItem(AUTH_STATE_KEY);
  }, []);

  const loadPlayer = useCallback(async (): Promise<Player> => {
    // Only authenticated users get cloud data
    if (authState !== 'authenticated' || !userId) {
      return getDefaultPlayer();
    }

    // Load from Supabase
    try {
      console.log('[loadPlayer] loading for userId:', userId);
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Player doesn't exist yet, create with defaults
          const defaultPlayer = getDefaultPlayer();
          const newPlayer = convertPlayerToSupabase(defaultPlayer, userId);
          
          const { data: created, error: createError } = await supabase
            .from('players')
            .insert(newPlayer)
            .select()
            .single();

          if (createError) throw createError;
          setPlayerId(created.id);
          return convertSupabaseToPlayer(created);
        }
        throw error;
      }

      if (data) {
        console.log('[loadPlayer] found row gems:', data.gems, 'keys:', data.keys, 'level:', data.level);
        setPlayerId(data.id);
        return convertSupabaseToPlayer(data);
      }
    } catch (err) {
      console.error('Load player error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load player');
      
      return getDefaultPlayer();
    }

    return getDefaultPlayer();
  }, [authState, userId]);

  // Safe profile-only update. Never update economy, stats, or entitlements from the client.
  const updateProfile = useCallback(async (patch: Partial<Pick<Player, 'activeVaultSkin' | 'activeAvatar' | 'activeBadgeFrame'>>): Promise<void> => {
    if (authState !== 'authenticated' || !userId) return;
    try {
      const snakePatch: Record<string, string> = {};
      if (patch.activeVaultSkin !== undefined) snakePatch.active_vault_skin = patch.activeVaultSkin;
      if (patch.activeAvatar !== undefined) snakePatch.active_avatar = patch.activeAvatar;
      if (patch.activeBadgeFrame !== undefined) snakePatch.active_badge_frame = patch.activeBadgeFrame;

      const { error } = await supabase.from('players').update(snakePatch).eq('user_id', userId);
      if (error) throw error;
    } catch (err) {
      console.error('[updateProfile] failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  }, [authState, userId]);

  const saveRun = useCallback(async (
    vaultsOpened: number,
    gemsBanked: number,
    multiplier: number,
    hitTrap: boolean,
    hitJackpot: boolean,
    outcomes: any[]
  ): Promise<void> => {
    // Only save runs to Supabase if authenticated and we have the player ID
    if (authState !== 'authenticated' || !userId || !playerId) return;

    try {
      const { error } = await supabase
        .from('runs')
        .insert({
          player_id: playerId,
          vaults_opened: vaultsOpened,
          gems_banked: gemsBanked,
          multiplier_reached: multiplier,
          hit_trap: hitTrap,
          hit_jackpot: hitJackpot,
          outcomes: outcomes,
        });

      if (error) throw error;
    } catch (err) {
      console.error('Save run error:', err);
    }
  }, [authState, userId, playerId]);

  const isGuest = authState === 'guest';
  const isAuthenticated = authState === 'authenticated';

  return {
    authState,
    userId,
    userDisplayName,
    userEmail,
    isLoading,
    isGuest,
    isAuthenticated,
    error,
    setGuestMode,
    signOut,
    loadPlayer,
    updateProfile,
    saveRun,
  };
}
