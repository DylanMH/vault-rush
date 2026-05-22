"use client";

import { useState } from "react";
import { Gem, KeyRound, Heart, Package, Crown, Ban, ChevronLeft, Sparkles, Loader2 } from "lucide-react";
import { Player, ShopItem } from "@/types/game";
import { formatNumber } from "@/lib/utils";
import { useSound } from "@/hooks/useSound";
import { STRIPE_PRICE_IDS } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

const isTestMode = process.env.NEXT_PUBLIC_STRIPE_TEST_MODE === "true";

const SHOP_ITEMS: ShopItem[] = [
  { id: "keys-5", name: "5 Keys", description: "A small key bundle", price: 300, currency: "gems", quantity: 5, type: "keys" },
  { id: "keys-20", name: "20 Keys", description: "Mega key bundle", price: 1000, currency: "gems", quantity: 20, type: "keys" },
  { id: "revive-2", name: "Revive Token Pack", description: "2 revive tokens", price: 400, currency: "gems", quantity: 2, type: "reviveTokens" },
  { id: "shards-10", name: "10 Shards", description: "Cosmetic shards for unlocking skins", price: 1000, currency: "gems", quantity: 10, type: "shards" },
  { id: "gems-200", name: "Gem Bundle", description: "200 bonus gems", price: isTestMode ? 50 : 99, currency: "usd", quantity: 200, type: "gems", stripePriceId: STRIPE_PRICE_IDS["gems-200"], stripeMode: "payment" },
  { id: "starter", name: "Starter Bundle", description: "10 keys + 2 revives + 100 gems", price: isTestMode ? 50 : 99, currency: "usd", quantity: 1, type: "bundle", stripePriceId: STRIPE_PRICE_IDS["starter"], stripeMode: "payment" },
  { id: "adfree", name: "Ad-Free Upgrade", description: "Remove all ads forever", price: isTestMode ? 50 : 99, currency: "usd", quantity: 1, type: "adFree", stripePriceId: STRIPE_PRICE_IDS["adfree"], stripeMode: "payment" },
  { id: "plus", name: "Vault Rush Plus", description: "Monthly: +10 keys, +1000 gems, +5 revives, exclusive skin, 1.5x gem boost, no ads", price: isTestMode ? 50 : 99, currency: "usd", quantity: 1, type: "subscription", stripePriceId: STRIPE_PRICE_IDS["plus"], stripeMode: "subscription" },
];

interface ShopScreenProps {
  player: Player;
  onBack: () => void;
  onPurchase: (item: ShopItem) => Promise<boolean>;
  onToggleSubscription: () => void;
}

export default function ShopScreen({ player, onBack, onPurchase, onToggleSubscription }: ShopScreenProps) {
  const sound = useSound();
  const [stripeLoading, setStripeLoading] = useState<string | null>(null);

  async function startStripeCheckout(item: ShopItem) {
    if (!item.stripePriceId) return;
    setStripeLoading(item.id);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session?.access_token || ""}`,
        },
        body: JSON.stringify({
          itemId: item.id,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("[ShopScreen] checkout error:", data.error);
        setStripeLoading(null);
      }
    } catch (err) {
      console.error("[ShopScreen] checkout fetch error:", err);
      setStripeLoading(null);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-vault-900">
      <div className="flex items-center gap-3 px-4 py-3 bg-vault-900/95 backdrop-blur border-b border-vault-700">
        <button onClick={() => { sound.playClick(); onBack(); }} className="text-vault-400 hover:text-white transition">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Shop</h2>
        <div className="ml-auto flex items-center gap-1 bg-vault-800 rounded-full px-3 py-1 border border-vault-600">
          <Gem size={14} className="text-vault-gem" />
          <span className="text-sm font-bold">{formatNumber(player.gems)}</span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {player.isSubscribed && (
          <div className="bg-gradient-to-r from-vault-gold/20 to-vault-gold/5 border border-vault-gold/40 rounded-xl p-3 flex items-center gap-3">
            <Crown size={20} className="text-vault-gold" />
            <div>
              <p className="text-sm font-bold text-vault-gold">Vault Rush Plus Active</p>
              <p className="text-xs text-vault-400">Enjoy your benefits!</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {SHOP_ITEMS.map((item) => {
            const isGem = item.currency === "gems";
            const canAfford = isGem ? player.gems >= item.price : true;
            const alreadyAdFree = item.type === "adFree" && player.isAdFree;
            const alreadySubscribed = item.type === "subscription" && player.isSubscribed;
            return (
              <div
                key={item.id}
                className="bg-vault-800 rounded-xl p-4 border border-vault-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-vault-700 flex items-center justify-center">
                    {item.type === "keys" && <KeyRound size={20} className="text-vault-gold" />}
                    {item.type === "reviveTokens" && <Heart size={20} className="text-red-400" />}
                    {item.type === "gems" && <Gem size={20} className="text-vault-gem" />}
                    {item.type === "shards" && <Sparkles size={20} className="text-vault-accent" />}
                    {item.type === "bundle" && <Package size={20} className="text-vault-accent" />}
                    {item.type === "adFree" && <Ban size={20} className="text-vault-goldLight" />}
                    {item.type === "subscription" && <Crown size={20} className="text-vault-gold" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-vault-400">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    sound.playClick();
                    if (isGem) {
                      if (!canAfford) return;
                      if (await onPurchase(item)) sound.playPurchase();
                    } else if (item.stripePriceId) {
                      await startStripeCheckout(item);
                    }
                  }}
                  disabled={alreadyAdFree || alreadySubscribed || stripeLoading === item.id}
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition active:scale-95 ${
                    alreadyAdFree || alreadySubscribed
                      ? "bg-vault-700 text-vault-500 cursor-not-allowed"
                      : stripeLoading === item.id
                      ? "bg-vault-700 text-vault-500 cursor-wait"
                      : canAfford
                      ? isGem
                        ? "bg-vault-gem text-vault-900"
                        : "bg-vault-gold text-vault-900"
                      : "bg-vault-700 text-vault-500 cursor-not-allowed"
                  }`}
                >
                  {stripeLoading === item.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : alreadyAdFree ? (
                    "Purchased"
                  ) : alreadySubscribed ? (
                    "Already Subscribed"
                  ) : isGem ? (
                    `${formatNumber(item.price)} Gems`
                  ) : item.type === "subscription" ? (
                    `$${(item.price / 100).toFixed(2)}/mo`
                  ) : (
                    `$${(item.price / 100).toFixed(2)}`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {!player.isAdFree && !player.isSubscribed && (
          <div className="bg-vault-800/50 rounded-xl p-4 border border-vault-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-vault-gold" />
              <p className="text-xs font-bold text-vault-gold uppercase">Free Keys</p>
            </div>
            <p className="text-xs text-vault-400 mb-2">Watch a short ad to earn 1 free key.</p>
            <button
              onClick={() => {
                sound.playClick();
                // Handled by parent
              }}
              className="w-full py-2 rounded-lg bg-vault-700 text-white text-xs font-bold border border-vault-600"
            >
              Watch Ad (+1 Key)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
