"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Player,
  RunState,
  VaultOutcome,
  OutcomeType,
  CosmeticItem,
  ShopItem,
} from "@/types/game";
import {
  getDefaultPlayer,
  getDefaultRunState,
  resolveVault,
  xpForLevel,
  getDailyEvent,
  getActiveCosmeticBonuses,
  getActiveMythicSet,
  getAutoReviveSource,
} from "@/lib/gameLogic";
import { useSupabasePlayer } from "@/hooks/useSupabasePlayer";
import { supabase } from "@/lib/supabase";

// Re-export for components that need auth state
export { useSupabasePlayer };

export type Screen =
  | "home"
  | "run"
  | "shop"
  | "collection"
  | "leaderboard"
  | "daily"
  | "profile";

export function useGameState(auth: ReturnType<typeof useSupabasePlayer>) {
  const [player, setPlayer] = useState<Player>(getDefaultPlayer);
  const [run, setRun] = useState<RunState>(getDefaultRunState);
  const [screen, setScreen] = useState<Screen>("home");
  const [lastOutcome, setLastOutcome] = useState<VaultOutcome | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [adModal, setAdModal] = useState<{
    open: boolean;
    seconds: number;
    onComplete?: () => void;
  }>({ open: false, seconds: 5 });

  const [levelUpInfo, setLevelUpInfo] = useState<{
    oldLevel: number;
    newLevel: number;
    rewards: { gems: number; keys: number; shards: number };
  } | null>(null);

  const [showBetaReward, setShowBetaReward] = useState(false);

  const playerSnapshotRef = useRef<Player | null>(null);

  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);

  const clearCurrentRun = useCallback(() => {
    // Client-side only. Run state is not persisted as authoritative data.
  }, []);

  // Load player data from Supabase on mount AND when auth user changes
  useEffect(() => {
    async function loadInitialPlayer() {
      if (auth.isLoading) return;

      setIsPlayerLoaded(false);
      console.log('[loadInitialPlayer] loading for userId:', auth.userId);
      let loadedPlayer = await auth.loadPlayer();

      // Only load from localStorage for explicit guest mode.
      // If authState is 'unauthenticated', we might be in a brief window before
      // onAuthStateChange fires, so we should not trust stale localStorage data.
      if (auth.authState === 'guest') {
        try {
          const localData = localStorage.getItem("vr_player");
          if (localData) {
            const parsed = JSON.parse(localData);
            loadedPlayer = { ...getDefaultPlayer(), ...parsed };
          }
        } catch {
          // ignore
        }
      }

      // Check subscription expiry and clean up if expired
      if (loadedPlayer.subscriptionExpiry) {
        const expiry = new Date(loadedPlayer.subscriptionExpiry);
        if (expiry < new Date()) {
          loadedPlayer.isSubscribed = false;
          loadedPlayer.subscriptionExpiry = null;
          // Remove exclusive skin if equipped
          if (loadedPlayer.activeVaultSkin === "vault-plus") {
            loadedPlayer.activeVaultSkin = "vault-default";
          }
          const idx = loadedPlayer.ownedCosmetics.indexOf("vault-plus");
          if (idx !== -1) {
            loadedPlayer.ownedCosmetics = loadedPlayer.ownedCosmetics.filter((id: string) => id !== "vault-plus");
          }
        }
      }

      console.log('[loadInitialPlayer] loaded gems:', loadedPlayer.gems, 'keys:', loadedPlayer.keys);
      setPlayer(loadedPlayer);

      // Restore any existing active run from the server
      if (auth.isAuthenticated && auth.userId) {
        try {
          const { data: activeRun } = await supabase
            .from('active_runs')
            .select('*')
            .eq('user_id', auth.userId)
            .maybeSingle();
          if (activeRun) {
            setRun({
              ...getDefaultRunState(),
              isRunActive: true,
              currentVault: activeRun.current_vault,
              unbankedGems: activeRun.unbanked_gems || 0,
              unbankedKeys: activeRun.unbanked_keys || 0,
              unbankedShards: activeRun.unbanked_shards || 0,
              unbankedReviveTokens: activeRun.unbanked_revive_tokens || 0,
              currentMultiplier: Number(activeRun.current_multiplier) || 1,
              isTrapTriggered: activeRun.is_trap_triggered || false,
              reviveUsed: activeRun.revive_used || false,
              history: (activeRun.history || []) as VaultOutcome[],
            });
            setScreen('run');
          }
        } catch {
          // no active run or error — stay on home
        }
      }

      const BETA_TESTER_ID = 'c7bdb09c-7a65-4e7f-ba92-a76743b72c6c';
      if (auth.userId === BETA_TESTER_ID && !loadedPlayer.betaTesterRewarded) {
        setShowBetaReward(true);
      }

      setIsPlayerLoaded(true);
    }
    loadInitialPlayer();
  }, [auth.isLoading, auth.userId, auth.isAuthenticated, auth.authState]);

  // Note: Economy and stat updates are now server-authoritative via RPCs.
  // Client state is local-only during a run and persisted only at banking time.
  // Do NOT add auto-save effects that write protected fields to Supabase.

  // Save player to localStorage for guest persistence and Stripe success page reads
  useEffect(() => {
    if (!isPlayerLoaded) return;
    localStorage.setItem("vr_player", JSON.stringify(player));
  }, [player, isPlayerLoaded]);

  useEffect(() => {
    const snapshot = playerSnapshotRef.current;
    if (!snapshot) return;
    playerSnapshotRef.current = null;

    if (player.level > snapshot.level) {
      const oldLevel = snapshot.level;
      const newLevel = player.level;
      const totalGems = Array.from({ length: newLevel - oldLevel }, (_, i) => (oldLevel + i + 1) * 5).reduce((a, b) => a + b, 0);
      const totalKeys = Array.from({ length: newLevel - oldLevel }, (_, i) => Math.floor((oldLevel + i + 1) / 10) + 1).reduce((a, b) => a + b, 0);
      const totalShards = Array.from({ length: newLevel - oldLevel }, (_, i) => Math.floor((oldLevel + i + 1) / 8)).reduce((a, b) => a + b, 0);
      setLevelUpInfo({ oldLevel, newLevel, rewards: { gems: totalGems, keys: totalKeys, shards: totalShards } });
    }
  }, [player]);

  const updatePlayer = useCallback(
    (patch: Partial<Player>) => {
      setPlayer((prev) => {
        const next = { ...prev, ...patch };
        return next;
      });
    },
    []
  );

  const addXp = useCallback(
    (amount: number) => {
      setPlayer((prev) => {
        playerSnapshotRef.current = { ...prev };

        let xp = prev.xp + amount;
        let level = prev.level;
        let xpToNext = prev.xpToNextLevel;
        const oldLevel = level;

        while (xp >= xpToNext) {
          xp -= xpToNext;
          level += 1;
          xpToNext = xpForLevel(level);
        }

        const next = { ...prev, xp, level, xpToNextLevel: xpToNext };

        if (level > oldLevel) {
          const gems = Array.from({ length: level - oldLevel }, (_, i) => (oldLevel + i + 1) * 5).reduce((a, b) => a + b, 0);
          const keys = Array.from({ length: level - oldLevel }, (_, i) => Math.floor((oldLevel + i + 1) / 10) + 1).reduce((a, b) => a + b, 0);
          const shards = Array.from({ length: level - oldLevel }, (_, i) => Math.floor((oldLevel + i + 1) / 8)).reduce((a, b) => a + b, 0);

          next.gems = next.gems + gems;
          next.keys = next.keys + keys;
          next.cosmeticShards = next.cosmeticShards + shards;
        }

        return next;
      });
    },
    []
  );

  const startRun = useCallback(async () => {
    if (run.isRunActive) return false;
    if (player.keys < 1) return false;

    if (auth.isAuthenticated && auth.userId) {
      try {
        const { data, error } = await supabase.rpc('start_vault_run');
        if (error) throw error;
        if (data && data[0]) {
          const result = data[0];
          if (!result.success) return false;
          setPlayer((prev) => ({ ...prev, keys: result.keys }));
        }
      } catch (err) {
        console.error('startRun RPC error:', err);
        return false;
      }
    } else {
      // Guest fallback
      setPlayer((prev) => {
        const next = { ...prev, keys: Math.max(0, prev.keys - 1) };
        return next;
      });
    }

    setRun({
      ...getDefaultRunState(),
      isRunActive: true,
      currentVault: 1,
    });
    setLastOutcome(null);
    setShowOutcome(false);
    setScreen("run");
    return true;
  }, [run.isRunActive, player.keys, auth.isAuthenticated, auth.userId]);

  const openVault = useCallback(async () => {
    if (!run.isRunActive || run.isTrapTriggered) return;

    // Always compute outcome client-side so guest and auth modes are identical
    const outcome = resolveVault(run.currentVault, run.currentMultiplier, player);

    // Compute mythic bonuses before showing outcome (same for auth + guest)
    const bonuses = getActiveCosmeticBonuses(player);
    let finalOutcome = outcome;
    let autoRevived = false;
    let autoReviveSource = "";

    // Trap auto-revive: chance to survive a trap without consuming a token
    if (outcome.type === "trap" && bonuses.trapAutoReviveChance > 0 && Math.random() < bonuses.trapAutoReviveChance) {
      autoReviveSource = getAutoReviveSource(player);
      finalOutcome = {
        type: "trap" as const,
        label: "TRAP! Auto-Revive saved you!",
        gems: Math.round(Math.random() * 15 + 10),
        autoRevived: true,
        autoReviveSource,
      };
      autoRevived = true;
    }

    // Show the (possibly auto-revived) outcome in the popup
    setLastOutcome(finalOutcome);
    setShowOutcome(true);

    if (auth.isAuthenticated && auth.userId) {
      try {
        const { data, error } = await supabase.rpc('open_vault', {
          p_outcome_type: finalOutcome.type,
          p_gems: finalOutcome.gems ?? 0,
          p_multiplier_delta: finalOutcome.multiplierDelta ?? 0,
          p_keys: finalOutcome.keys ?? 0,
          p_shards: finalOutcome.shards ?? 0,
          p_auto_revived: autoRevived,
        });
        if (error) throw error;
        if (data && data[0]) {
          const result = data[0];
          setRun({
            ...getDefaultRunState(),
            isRunActive: true,
            currentVault: result.current_vault,
            unbankedGems: result.unbanked_gems,
            unbankedKeys: result.unbanked_keys || 0,
            unbankedShards: result.unbanked_shards || 0,
            unbankedReviveTokens: result.unbanked_revive_tokens || 0,
            currentMultiplier: Number(result.current_multiplier),
            isTrapTriggered: result.is_trap_triggered,
            history: (result.history || []) as VaultOutcome[],
          });
          // Reload player stats from server
          const { data: playerData } = await supabase.from('players').select('*').eq('user_id', auth.userId).single();
          if (playerData) {
            setPlayer((prev) => ({
              ...prev,
              totalVaultsOpened: playerData.total_vaults_opened || prev.totalVaultsOpened,
              trapCount: playerData.trap_count || prev.trapCount,
              jackpotCount: playerData.jackpot_count || prev.jackpotCount,
              highestJackpot: playerData.highest_jackpot || prev.highestJackpot,
            }));
          }
        }
      } catch (err) {
        console.error('openVault RPC error:', err);
        // Fall through to local application
      }
      return;
    }

    // Guest fallback: client-side application
    setRun((prev) => {
      const event = getDailyEvent();
      const next: RunState = {
        ...prev,
        history: [...prev.history, finalOutcome],
        currentVault: prev.currentVault + 1,
      };

      if (finalOutcome.type === "trap" && !finalOutcome.autoRevived) {
        next.isTrapTriggered = true;
      } else if (finalOutcome.type === "multiplier") {
        next.currentMultiplier =
          prev.currentMultiplier + (finalOutcome.multiplierDelta || 0);
      } else if (finalOutcome.gems) {
        next.unbankedGems = prev.unbankedGems + finalOutcome.gems;
      }
      if (finalOutcome.type === "bonusLife") {
        next.unbankedReviveTokens = prev.unbankedReviveTokens + 1;
      }
      if (finalOutcome.shards) {
        next.unbankedShards = prev.unbankedShards + finalOutcome.shards + event.shardBonus;
      } else if (event.shardBonus > 0) {
        next.unbankedShards = prev.unbankedShards + event.shardBonus;
      }
      if (finalOutcome.keys) {
        next.unbankedKeys = prev.unbankedKeys + finalOutcome.keys;
      }

      return next;
    });

    setPlayer((prev) => {
      const next = { ...prev, totalVaultsOpened: prev.totalVaultsOpened + 1 };
      if (finalOutcome.type === "trap" && !finalOutcome.autoRevived) next.trapCount = prev.trapCount + 1;
      if (finalOutcome.type === "jackpot") {
        next.jackpotCount = prev.jackpotCount + 1;
        next.highestJackpot = Math.max(
          prev.highestJackpot,
          finalOutcome.gems || 0
        );
      }
      return next;
    });
  }, [run.isRunActive, run.isTrapTriggered, run.currentVault, run.currentMultiplier, player, auth.isAuthenticated, auth.userId]);

  const bankRewards = useCallback(async () => {
    if (!run.isRunActive) return;
    const banked = run.unbankedGems;
    const vaultCount = run.currentVault - 1;
    const hitJackpot = run.history.some(h => h.type === 'jackpot');
    const everHitTrap = run.history.some(h => h.type === 'trap');

    if (auth.isAuthenticated && auth.userId) {
      // Server-side validation via RPC
      const bonuses = getActiveCosmeticBonuses(player);
      const activeSet = getActiveMythicSet(player);

      const lateBankBonusPct = vaultCount >= 5 ? bonuses.lateBankBonus : 0;
      const etherealEcho = activeSet === 'ethereal' && Math.random() < 0.20;

      try {
        const { data, error } = await supabase.rpc('bank_run_rewards', {
          p_vaults_opened: vaultCount,
          p_gems_banked: banked,
          p_multiplier: run.currentMultiplier,
          p_hit_trap: everHitTrap,
          p_hit_jackpot: hitJackpot,
          p_outcomes: run.history,
          p_xp_multiplier: bonuses.xpMultiplier,
          p_keys_banked: run.unbankedKeys,
          p_shards_banked: run.unbankedShards,
          p_revive_tokens_banked: run.unbankedReviveTokens,
          p_late_bank_bonus_pct: lateBankBonusPct,
          p_ethereal_echo: etherealEcho,
        });

        if (error) throw error;

        if (data && data[0]) {
          const result = data[0];
          // Update local state with server-validated values
          setPlayer((prev) => ({
            ...prev,
            gems: result.gems,
            keys: result.keys,
            reviveTokens: result.revive_tokens,
            cosmeticShards: result.cosmetic_shards,
            level: result.level,
            xp: result.xp,
            xpToNextLevel: result.xp_to_next_level,
            totalGemsEarned: Number(result.total_gems_earned),
            bestRunGems: result.best_run_gems,
            weeklyScore: result.weekly_score,
            trapCount: result.trap_count,
            jackpotCount: result.jackpot_count,
            totalVaultsOpened: Number(result.total_vaults_opened),
            longestRun: result.longest_run,
            longestStreak: result.longest_streak,
          }));

          // Check for level up
          if (result.level > player.level) {
            const oldLevel = player.level;
            const newLevel = result.level;
            const totalGems = Array.from({ length: newLevel - oldLevel }, (_, i) => (oldLevel + i + 1) * 5).reduce((a, b) => a + b, 0);
            const totalKeys = Array.from({ length: newLevel - oldLevel }, (_, i) => Math.floor((oldLevel + i + 1) / 10) + 1).reduce((a, b) => a + b, 0);
            const totalShards = Array.from({ length: newLevel - oldLevel }, (_, i) => Math.floor((oldLevel + i + 1) / 8)).reduce((a, b) => a + b, 0);
            setLevelUpInfo({ oldLevel, newLevel, rewards: { gems: totalGems, keys: totalKeys, shards: totalShards } });
          }

          // Save run history for leaderboard/profile tracking
          auth.saveRun(vaultCount, banked, run.currentMultiplier, everHitTrap, hitJackpot, run.history);

          // Success — clear run and go home
          clearCurrentRun();
          setRun(getDefaultRunState());
          setLastOutcome(null);
          setShowOutcome(false);
          setScreen("home");
          return;
        }

        console.warn('bank_run_rewards returned empty data');
      } catch (err) {
        console.error('Bank rewards RPC error:', err);
      }
      // Auth path failed — stay in run so user can retry; do NOT clear run or go home
      return;
    }

    // Guest fallback
    fallbackBankRewards();
    clearCurrentRun();
    setRun(getDefaultRunState());
    setLastOutcome(null);
    setShowOutcome(false);
    setScreen("home");
  }, [run, player, auth, clearCurrentRun]);

  const fallbackBankRewards = useCallback(() => {
    const event = getDailyEvent();
    let banked = run.unbankedGems;
    const vaultCount = run.currentVault - 1;
    const hitJackpot = run.history.some(h => h.type === 'jackpot');
    const everHitTrap = run.history.some(h => h.type === 'trap');

    const bonuses = getActiveCosmeticBonuses(player);
    const activeSet = getActiveMythicSet(player);

    // Late bank bonus: banking after 5+ vaults grants extra gems
    if (vaultCount >= 5 && bonuses.lateBankBonus > 0) {
      banked = Math.floor(banked * (1 + bonuses.lateBankBonus));
    }

    // Ethereal Echo: 20% chance to duplicate all rewards on bank
    const etherealEcho = activeSet === 'ethereal' && Math.random() < 0.20;
    const gemMult = etherealEcho ? 2 : 1;
    const rewardMult = etherealEcho ? 2 : 1;

    // Always update longestRun and save run history, even with 0 banked
    setPlayer((prev) => {
      const next = {
        ...prev,
        longestRun: Math.max(prev.longestRun, vaultCount),
      };
      if (banked > 0) {
        let gems = prev.gems + Math.floor(banked * event.gemMultiplier * gemMult);
        if (prev.isSubscribed) gems += Math.floor(banked * 0.1 * gemMult);
        next.gems = gems;
        next.totalGemsEarned = prev.totalGemsEarned + banked;
        next.bestRunGems = Math.max(prev.bestRunGems, banked);
        next.weeklyScore = prev.weeklyScore + banked;
      }
      next.keys = prev.keys + run.unbankedKeys * rewardMult;
      next.cosmeticShards = prev.cosmeticShards + run.unbankedShards * rewardMult;
      next.reviveTokens = prev.reviveTokens + run.unbankedReviveTokens * rewardMult;
      return next;
    });

    if (banked > 0) {
      addXp(Math.floor((vaultCount * 5 + Math.floor(banked / 5)) * event.xpMultiplier * bonuses.xpMultiplier * 0.5));
    }

    auth.saveRun(vaultCount, banked, run.currentMultiplier, everHitTrap, hitJackpot, run.history);
  }, [run, addXp, auth, player]);

  const useRevive = useCallback(async () => {
    if (!run.isTrapTriggered || player.reviveTokens < 1 || run.reviveUsed) return;

    if (auth.isAuthenticated && auth.userId) {
      try {
        const { data, error } = await supabase.rpc('use_revive');
        if (error) throw error;
        if (data && data[0]) {
          const result = data[0];
          setRun((prev) => ({
            ...prev,
            isTrapTriggered: result.is_trap_triggered,
            reviveUsed: result.revive_used,
          }));
          setPlayer((prev) => ({
            ...prev,
            reviveTokens: result.revive_tokens,
          }));
          setLastOutcome(null);
          setShowOutcome(false);
          return;
        }
      } catch (err) {
        console.error('useRevive RPC error:', err);
        // Fall through to local
      }
    }

    // Guest / fallback
    setPlayer((prev) => {
      const next = { ...prev, reviveTokens: Math.max(0, prev.reviveTokens - 1) };
      return next;
    });
    setRun((prev) => ({
      ...prev,
      isTrapTriggered: false,
      reviveUsed: true,
    }));
    setLastOutcome(null);
    setShowOutcome(false);
  }, [run.isTrapTriggered, run.reviveUsed, player.reviveTokens, auth.isAuthenticated, auth.userId]);

  const abandonRun = useCallback(async () => {
    const vaultCount = run.currentVault - 1;
    if (vaultCount > 0) {
      setPlayer((prev) => ({
        ...prev,
        longestRun: Math.max(prev.longestRun, vaultCount),
      }));
    }
    if (auth.isAuthenticated && auth.userId) {
      try { await supabase.rpc('clear_active_run'); } catch {}
    }
    clearCurrentRun();
    setRun(getDefaultRunState());
    setLastOutcome(null);
    setShowOutcome(false);
    setScreen("home");
  }, [clearCurrentRun, run.currentVault, auth.isAuthenticated, auth.userId]);

  const cancelRun = useCallback(async () => {
    setPlayer((prev) => {
      const next = { ...prev, keys: prev.keys + 1 };
      return next;
    });
    if (auth.isAuthenticated && auth.userId) {
      try { await supabase.rpc('clear_active_run'); } catch {}
    }
    clearCurrentRun();
    setRun(getDefaultRunState());
    setLastOutcome(null);
    setShowOutcome(false);
    setScreen("home");
  }, [clearCurrentRun, auth.isAuthenticated, auth.userId]);

  const getIsoDate = (d: Date) => d.toISOString().split('T')[0];

  const claimDaily = useCallback(async () => {
    const today = getIsoDate(new Date());
    const last = player.lastDailyClaim ? new Date(player.lastDailyClaim).toISOString().split('T')[0] : null;
    if (last === today) return false;

    if (auth.isAuthenticated && auth.userId) {
      // Server-side daily claim with cooldown check
      try {
        const { data, error } = await supabase.rpc('claim_daily_reward');

        if (error) throw error;

        if (data && data[0]) {
          const result = data[0];
          setPlayer((prev) => ({
            ...prev,
            gems: result.gems,
            keys: result.keys,
            reviveTokens: result.revive_tokens,
            streak: result.streak,
            longestStreak: result.longest_streak,
            lastDailyClaim: result.last_daily_claim,
          }));
          return true;
        }
      } catch (err) {
        console.error('Daily claim RPC error:', err);
        // Fall through to local calculation
      }
    }

    // Local fallback
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const newStreak = last === getIsoDate(yesterday) ? player.streak + 1 : 1;
    const rewards = ["gems", "keys", "revive"] as const;
    const reward = rewards[newStreak % rewards.length];

    setPlayer((prev) => {
      const next = { ...prev, lastDailyClaim: today, streak: newStreak };
      if (reward === "gems") next.gems = prev.gems + 25 * newStreak;
      if (reward === "keys") next.keys = prev.keys + 1 + Math.floor(newStreak / 5);
      if (reward === "revive") next.reviveTokens = prev.reviveTokens + 1;
      if (prev.isSubscribed) next.keys = next.keys + 1;
      next.longestStreak = Math.max(prev.longestStreak, newStreak);
      return next;
    });

    return true;
  }, [player.lastDailyClaim, player.streak, player.isSubscribed, auth]);

  const claimBetaReward = useCallback(async () => {
    if (!auth.isAuthenticated || !auth.userId) return;
    try {
      const { data, error } = await supabase.rpc('claim_beta_reward');
      if (error) throw error;
      if (data && data[0]) {
        const result = data[0];
        if (result.success) {
          setPlayer((prev) => ({
            ...prev,
            gems: result.gems,
            keys: result.keys,
            reviveTokens: result.revive_tokens,
            cosmeticShards: result.cosmetic_shards,
            isSubscribed: result.is_subscribed,
            betaTesterRewarded: true,
          }));
        }
      }
    } catch (err) {
      console.error('Beta reward claim error:', err);
    }
  }, [auth.isAuthenticated, auth.userId]);

  const purchaseItem = useCallback(
    async (item: ShopItem) => {
      // USD items MUST go through Stripe checkout + success page verification.
      // Reject any direct client-side grant for real-money purchases.
      if (item.currency === "usd") return false;
      if (item.currency === "gems" && player.gems < item.price) return false;

      // Server-side validation for gem purchases
      if (item.currency === "gems" && auth.isAuthenticated && auth.userId) {
        try {
          const { data, error } = await supabase.rpc('purchase_item', {
            p_cost: item.price,
            p_keys: item.type === "keys" ? item.quantity : 0,
            p_revive_tokens: item.type === "reviveTokens" ? item.quantity : 0,
            p_shards: item.type === "shards" ? item.quantity : 0,
            p_gems: item.type === "gems" ? item.quantity : 0,
          });

          if (error) throw error;

          if (data && data[0]) {
            const result = data[0];
            if (!result.success) return false;

            // Server confirmed purchase and granted items
            setPlayer((prev) => ({
              ...prev,
              gems: result.gems,
              keys: result.keys,
              reviveTokens: result.revive_tokens,
              cosmeticShards: result.cosmetic_shards,
            }));
            return true;
          }
        } catch (err) {
          console.error('Purchase RPC error:', err);
          // Fall through to local validation
        }
      }

      // Local fallback for non-gem purchases or unauthenticated users
      setPlayer((prev) => {
        const next = { ...prev };
        if (item.currency === "gems") next.gems = prev.gems - item.price;
        switch (item.type) {
          case "keys": next.keys = prev.keys + item.quantity; break;
          case "reviveTokens": next.reviveTokens = prev.reviveTokens + item.quantity; break;
          case "gems": next.gems = prev.gems + item.quantity; break;
          case "shards": next.cosmeticShards = prev.cosmeticShards + item.quantity; break;
          case "bundle":
            next.keys = prev.keys + 10;
            next.reviveTokens = prev.reviveTokens + 2;
            next.gems = prev.gems + 100;
            break;
          case "adFree": break;
          case "subscription": next.isSubscribed = true; break;
        }
        return next;
      });
      return true;
    },
    [player.gems, auth]
  );

  const toggleSubscription = useCallback(() => {
    // Subscription must be purchased through Stripe checkout.
    // This function is intentionally a no-op to prevent free activation.
    console.warn("toggleSubscription is disabled. Use Stripe checkout instead.");
  }, []);

  const unlockCosmetic = useCallback(
    async (item: CosmeticItem) => {
      if (
        player.ownedCosmetics.includes(item.id) ||
        player.cosmeticShards < item.shardCost
      )
        return false;

      if (auth.isAuthenticated && auth.userId) {
        try {
          const { data, error } = await supabase.rpc('unlock_cosmetic', {
            p_item_id: item.id,
            p_shard_cost: item.shardCost,
          });
          if (error) throw error;
          if (data && data[0]) {
            const result = data[0];
            if (!result.success) return false;
            setPlayer((prev) => ({
              ...prev,
              cosmeticShards: result.cosmetic_shards,
              ownedCosmetics: result.owned_cosmetics,
            }));
            return true;
          }
        } catch (err) {
          console.error('Unlock cosmetic RPC error:', err);
        }
      }

      // Guest fallback
      setPlayer((prev) => {
        const next = {
          ...prev,
          cosmeticShards: prev.cosmeticShards - item.shardCost,
          ownedCosmetics: [...prev.ownedCosmetics, item.id],
        };
        return next;
      });
      return true;
    },
    [player.ownedCosmetics, player.cosmeticShards, auth.isAuthenticated, auth.userId]
  );

  const equipCosmetic = useCallback(
    (id: string, type: "vaultSkin" | "avatar" | "badgeFrame") => {
      if (!player.ownedCosmetics.includes(id)) return;
      const key =
        type === "vaultSkin"
          ? "activeVaultSkin"
          : type === "avatar"
          ? "activeAvatar"
          : "activeBadgeFrame";
      updatePlayer({ [key]: id } as Partial<Player>);
      if (auth.isAuthenticated) {
        auth.updateProfile({ [key]: id } as Partial<Pick<Player, 'activeVaultSkin' | 'activeAvatar' | 'activeBadgeFrame'>>).catch(() => {});
      }
    },
    [player.ownedCosmetics, updatePlayer, auth.isAuthenticated, auth.updateProfile]
  );

  const showAd = useCallback(
    (onComplete: () => void) => {
      // TODO: Integrate AdMob or web rewarded ads here
      setAdModal({ open: true, seconds: 5 });
      const interval = setInterval(() => {
        setAdModal((prev) => {
          if (prev.seconds <= 1) {
            clearInterval(interval);
            setTimeout(() => {
              setAdModal({ open: false, seconds: 5 });
              onComplete();
            }, 500);
            return { open: false, seconds: 5 };
          }
          return { open: true, seconds: prev.seconds - 1 };
        });
      }, 1000);
    },
    []
  );

  return {
    player,
    run,
    screen,
    setScreen,
    lastOutcome,
    showOutcome,
    setShowOutcome,
    adModal,
    startRun,
    openVault,
    bankRewards,
    useRevive,
    abandonRun,
    claimDaily,
    purchaseItem,
    toggleSubscription,
    unlockCosmetic,
    equipCosmetic,
    showAd,
    updatePlayer,
    levelUpInfo,
    clearLevelUp: () => setLevelUpInfo(null),
    cancelRun,
    userId: auth.userId,
    showBetaReward,
    setShowBetaReward,
    claimBetaReward,
  };
}
