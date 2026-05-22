"use client";

import { useEffect, useRef } from "react";

const MUSIC_SRC = "/sounds/backgroundmusic.mp3";
const MENU_VOLUME = 0.35;
const VAULT_VOLUME = 0.08;

// Module-level singleton — survives React Strict Mode remounts, refreshes, etc.
let globalAudio: HTMLAudioElement | null = null;
let globalStarted = false;

function getAudio(): HTMLAudioElement {
  if (!globalAudio) {
    globalAudio = new Audio(MUSIC_SRC);
    globalAudio.loop = true;
    globalAudio.preload = "auto";
    globalAudio.volume = MENU_VOLUME;
  }
  return globalAudio;
}

export default function BackgroundMusic({ screen }: { screen: string }) {
  const initedRef = useRef(false);

  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    const audio = getAudio();

    const start = () => {
      if (globalStarted) return;
      globalStarted = true;
      audio.play().catch(() => {});
    };

    // If audio is already playing (page refresh with existing singleton), just mark started
    if (!audio.paused) {
      globalStarted = true;
    } else {
      // Try autoplay immediately (may fail due to policy)
      audio.play().catch(() => {});
      // Fallback: start on any interaction
      window.addEventListener("click", start);
      window.addEventListener("touchstart", start);
      window.addEventListener("keydown", start);
    }

    return () => {
      window.removeEventListener("click", start);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("keydown", start);
    };
  }, []);

  // Fade volume based on screen
  useEffect(() => {
    const audio = getAudio();
    const target = screen === "run" ? VAULT_VOLUME : MENU_VOLUME;
    const step = target > audio.volume ? 0.02 : -0.02;
    const fade = setInterval(() => {
      if (Math.abs(audio.volume - target) < 0.02) {
        audio.volume = target;
        clearInterval(fade);
        return;
      }
      audio.volume = Math.max(0, Math.min(1, audio.volume + step));
    }, 50);

    return () => clearInterval(fade);
  }, [screen]);

  // This component renders nothing — audio lives outside React
  return null;
}
