"use client";

import { Home, ShoppingBag, Layers, Trophy, User } from "lucide-react";
import { Screen } from "@/hooks/useGameState";

interface BottomNavProps {
  screen: Screen;
  onNavigate: (s: Screen) => void;
}

const items: { key: Screen; label: string; icon: React.ReactNode }[] = [
  { key: "home", label: "Home", icon: <Home size={20} /> },
  { key: "shop", label: "Shop", icon: <ShoppingBag size={20} /> },
  { key: "collection", label: "Collection", icon: <Layers size={20} /> },
  { key: "leaderboard", label: "Leaderboard", icon: <Trophy size={20} /> },
  { key: "profile", label: "Profile", icon: <User size={20} /> },
];

export default function BottomNav({ screen, onNavigate }: BottomNavProps) {
  if (screen === "run") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-vault-900/95 backdrop-blur border-t border-vault-700 px-2 pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {items.map((item) => {
          const active = screen === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${
                active ? "text-vault-gold" : "text-vault-400 hover:text-vault-300"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
