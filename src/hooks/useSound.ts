"use client";

const SOUNDS: Record<string, { src: string; volume: number }> = {
  click: { src: "/sounds/button-press.wav", volume: 0.4 },
  winSmall: { src: "/sounds/small-win.wav", volume: 0.5 },
  winMedium: { src: "/sounds/medium-win.wav", volume: 0.5 },
  winLarge: { src: "/sounds/large-win.wav", volume: 0.5 },
  jackpot: { src: "/sounds/jackpot-win.wav", volume: 0.6 },
  lose: { src: "/sounds/lose.wav", volume: 0.6 },
  bank: { src: "/sounds/bank-button.wav", volume: 0.5 },
  levelUp: { src: "/sounds/level-up.wav", volume: 0.5 },
  shardJackpot: { src: "/sounds/cosmetic-shard-jackpot.wav", volume: 0.6 },
  purchase: { src: "/sounds/store-purchase.wav", volume: 0.5 },
};

// Audio pool: one element per sound, reused
const pool: Record<string, HTMLAudioElement> = {};
let preloaded = false;

function preload() {
  if (preloaded || typeof window === "undefined") return;
  preloaded = true;
  for (const key of Object.keys(SOUNDS)) {
    const { src, volume } = SOUNDS[key];
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = volume;
    pool[key] = audio;
  }
}

function play(key: string) {
  if (typeof window === "undefined") return;
  if (!preloaded) preload();
  const audio = pool[key];
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

export function useSound() {
  return {
    playClick: () => play("click"),
    playWinSmall: () => play("winSmall"),
    playWinMedium: () => play("winMedium"),
    playWinLarge: () => play("winLarge"),
    playJackpot: () => play("jackpot"),
    playLose: () => play("lose"),
    playBank: () => play("bank"),
    playLevelUp: () => play("levelUp"),
    playShardJackpot: () => play("shardJackpot"),
    playPurchase: () => play("purchase"),
  };
}
