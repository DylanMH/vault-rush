"use client";

function play(src: string, volume = 0.5) {
  if (typeof window === "undefined") return;
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch(() => {});
}

export function useSound() {
  return {
    playClick: () => play("/sounds/button-press.wav", 0.4),
    playWinSmall: () => play("/sounds/small-win.wav", 0.5),
    playWinMedium: () => play("/sounds/medium-win.wav", 0.5),
    playWinLarge: () => play("/sounds/large-win.wav", 0.5),
    playJackpot: () => play("/sounds/jackpot-win.wav", 0.6),
    playLose: () => play("/sounds/lose.wav", 0.6),
    playBank: () => play("/sounds/bank-button.wav", 0.5),
    // TODO: Add a dedicated level-up sound (e.g. from Mixkit "achievement" or "success-fanfare")
    playLevelUp: () => play("/sounds/level-up.wav", 0.5),
    playShardJackpot: () => play("/sounds/cosmetic-shard-jackpot.wav", 0.6),
    playPurchase: () => play("/sounds/store-purchase.wav", 0.5),
  };
}
