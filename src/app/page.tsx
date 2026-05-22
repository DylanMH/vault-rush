"use client";

import { useEffect } from "react";
import { useGameState } from "@/hooks/useGameState";
import { useSupabasePlayer } from "@/hooks/useSupabasePlayer";
import AuthScreen from "@/components/AuthScreen";
import HomeScreen from "@/components/HomeScreen";
import VaultRunScreen from "@/components/VaultRunScreen";
import ShopScreen from "@/components/ShopScreen";
import CollectionScreen from "@/components/CollectionScreen";
import LeaderboardScreen from "@/components/LeaderboardScreen";
import DailyScreen from "@/components/DailyScreen";
import ProfileScreen from "@/components/ProfileScreen";
import AdModal from "@/components/AdModal";
import LevelUpModal from "@/components/LevelUpModal";
import BackgroundMusic from "@/components/BackgroundMusic";

export default function Page() {
  const auth = useSupabasePlayer();
  const game = useGameState(auth);

  useEffect(() => {
    if (game.screen === "home" && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [game.screen]);

  // Show loading spinner while checking auth
  if (auth.isLoading) {
    return (
      <main className="relative min-h-screen max-w-lg mx-auto bg-vault-900 shadow-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-vault-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-vault-400 text-sm">Loading Vault Rush...</p>
        </div>
      </main>
    );
  }

  // Show auth screen for unauthenticated users
  if (auth.authState === 'unauthenticated') {
    return (
      <main className="relative min-h-screen max-w-lg mx-auto bg-vault-900 shadow-2xl">
        <AuthScreen
          onGuestMode={auth.setGuestMode}
          onAuthenticated={() => {
            // Auth state will update via onAuthStateChange listener
          }}
        />
      </main>
    );
  }

  return (
    <>
      <BackgroundMusic screen={game.screen} />
      <main className="relative min-h-screen max-w-lg mx-auto bg-vault-900 shadow-2xl">
        {/* Guest Mode Banner */}
        {auth.isGuest && (
          <div className="sticky top-0 z-20 bg-vault-gold/10 border-b border-vault-gold/30 px-4 py-2 flex items-center justify-between">
            <span className="text-xs text-vault-gold font-semibold">
              Guest Mode - Progress not saved to cloud
            </span>
            <button
              onClick={() => {
                localStorage.removeItem('vr_auth_state');
                window.location.reload();
              }}
              className="text-xs text-vault-gold hover:text-white font-semibold underline underline-offset-2 transition"
            >
              Sign Up to Save
            </button>
          </div>
        )}

        {game.screen === "home" && (
          <HomeScreen
            player={game.player}
            onNavigate={game.setScreen}
            onStartRun={game.startRun}
            onClaimDaily={game.claimDaily}
          />
        )}

        {game.screen === "run" && (
          <VaultRunScreen
            player={game.player}
            run={game.run}
            lastOutcome={game.lastOutcome}
            showOutcome={game.showOutcome}
            onOpenVault={game.openVault}
            onBankRewards={game.bankRewards}
            onUseRevive={game.useRevive}
            onAbandonRun={game.abandonRun}
            onCancelRun={game.cancelRun}
            setShowOutcome={game.setShowOutcome}
            onShowAd={game.showAd}
          />
        )}

        {game.levelUpInfo && (
          <LevelUpModal
            oldLevel={game.levelUpInfo.oldLevel}
            newLevel={game.levelUpInfo.newLevel}
            rewards={game.levelUpInfo.rewards}
            currentXp={game.player.xp}
            xpToNext={game.player.xpToNextLevel}
            onClose={game.clearLevelUp}
          />
        )}

        {game.screen === "shop" && (
          <ShopScreen
            player={game.player}
            onBack={() => game.setScreen("home")}
            onPurchase={game.purchaseItem}
            onToggleSubscription={game.toggleSubscription}
          />
        )}

        {game.screen === "collection" && (
          <CollectionScreen
            player={game.player}
            onBack={() => game.setScreen("home")}
            onUnlock={game.unlockCosmetic}
            onEquip={game.equipCosmetic}
          />
        )}

        {game.screen === "leaderboard" && (
          <LeaderboardScreen
            player={game.player}
            userId={game.userId}
            onBack={() => game.setScreen("home")}
          />
        )}

        {game.screen === "daily" && (
          <DailyScreen
            player={game.player}
            onBack={() => game.setScreen("home")}
            onClaimDaily={game.claimDaily}
          />
        )}

        {game.screen === "profile" && (
          <ProfileScreen
            player={game.player}
            onBack={() => game.setScreen("home")}
            isGuest={auth.isGuest}
            userDisplayName={auth.userDisplayName}
            userEmail={auth.userEmail}
          />
        )}

        <AdModal open={game.adModal.open} seconds={game.adModal.seconds} />
      </main>
    </>
  );
}
