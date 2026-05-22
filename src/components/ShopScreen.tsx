"use client";

import { useState } from "react";
import { Gem, KeyRound, Heart, Package, Crown, Ban, ChevronLeft, Sparkles, Loader2, Wallet, Coins } from "lucide-react";
import { Player, ShopItem } from "@/types/game";
import { formatNumber } from "@/lib/utils";
import { useSound } from "@/hooks/useSound";
import { STRIPE_PRICE_IDS } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

type TabId = "keys" | "revives" | "shards" | "premium";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "keys", label: "Keys", icon: <KeyRound size={14} /> },
  { id: "revives", label: "Revives", icon: <Heart size={14} /> },
  { id: "shards", label: "Shards", icon: <Sparkles size={14} /> },
  { id: "premium", label: "Premium", icon: <Crown size={14} /> },
];

const GEM_ITEMS: ShopItem[] = [
  { id: "keys-5", name: "5 Keys", description: "Small key pack", price: 1000, currency: "gems", quantity: 5, type: "keys" },
  { id: "keys-15", name: "15 Keys", description: "Medium key pack", price: 2500, currency: "gems", quantity: 15, type: "keys" },
  { id: "keys-50-gems", name: "50 Keys", description: "Large key pack", price: 10000, currency: "gems", quantity: 50, type: "keys" },
  { id: "keys-100-gems", name: "100 Keys", description: "Mega key pack", price: 20000, currency: "gems", quantity: 100, type: "keys" },
  { id: "revive-5", name: "5 Revives", description: "5 revive tokens", price: 500, currency: "gems", quantity: 5, type: "reviveTokens" },
  { id: "revive-10", name: "10 Revives", description: "10 revive tokens", price: 1000, currency: "gems", quantity: 10, type: "reviveTokens" },
  { id: "shards-10", name: "10 Shards", description: "Cosmetic shards", price: 5000, currency: "gems", quantity: 10, type: "shards" },
  { id: "shards-50", name: "50 Shards", description: "Cosmetic shards", price: 25000, currency: "gems", quantity: 50, type: "shards" },
  { id: "shards-100", name: "100 Shards", description: "Cosmetic shards", price: 100000, currency: "gems", quantity: 100, type: "shards" },
];

const USD_ITEMS: ShopItem[] = [
  { id: "keys-5-usd", name: "5 Keys", description: "Instant key delivery", price: 99, currency: "usd", quantity: 5, type: "keys", stripePriceId: STRIPE_PRICE_IDS["keys-5-usd"], stripeMode: "payment" },
  { id: "keys-20-usd", name: "20 Keys", description: "Instant key delivery", price: 399, currency: "usd", quantity: 20, type: "keys", stripePriceId: STRIPE_PRICE_IDS["keys-20-usd"], stripeMode: "payment" },
  { id: "keys-50-usd", name: "50 Keys", description: "Instant key delivery", price: 499, currency: "usd", quantity: 50, type: "keys", stripePriceId: STRIPE_PRICE_IDS["keys-50-usd"], stripeMode: "payment" },
  { id: "keys-100-usd", name: "100 Keys", description: "Instant key delivery", price: 799, currency: "usd", quantity: 100, type: "keys", stripePriceId: STRIPE_PRICE_IDS["keys-100-usd"], stripeMode: "payment" },
  { id: "gems-500", name: "Starter Gem Bundle", description: "500 bonus gems", price: 99, currency: "usd", quantity: 500, type: "gems", stripePriceId: STRIPE_PRICE_IDS["gems-500"], stripeMode: "payment" },
  { id: "starter", name: "Starter Bundle", description: "10 keys + 2 revives + 100 gems", price: 299, currency: "usd", quantity: 1, type: "bundle", stripePriceId: STRIPE_PRICE_IDS["starter"], stripeMode: "payment" },
  { id: "adfree", name: "Ad-Free Upgrade", description: "Remove all ads forever", price: 99, currency: "usd", quantity: 1, type: "adFree", stripePriceId: STRIPE_PRICE_IDS["adfree"], stripeMode: "payment" },
  { id: "plus", name: "Vault Rush Plus", description: "Monthly: +10 keys, +1000 gems, +5 revives, exclusive skin, 1.5x gem boost, no ads", price: 499, currency: "usd", quantity: 1, type: "subscription", stripePriceId: STRIPE_PRICE_IDS["plus"], stripeMode: "subscription" },
];

const TAB_ITEMS: Record<TabId, ShopItem[]> = {
  keys: [
    ...GEM_ITEMS.filter((i) => i.type === "keys"),
    ...USD_ITEMS.filter((i) => i.type === "keys"),
  ],
  revives: GEM_ITEMS.filter((i) => i.type === "reviveTokens"),
  shards: GEM_ITEMS.filter((i) => i.type === "shards"),
  premium: USD_ITEMS.filter((i) => i.type !== "keys"),
};

function isPlaceholderPrice(id: string): boolean {
  const priceId = STRIPE_PRICE_IDS[id];
  return !priceId || priceId.startsWith("price_placeholder");
}

interface ShopScreenProps {
  player: Player;
  onBack: () => void;
  onPurchase: (item: ShopItem) => Promise<boolean>;
  onToggleSubscription: () => void;
}

export default function ShopScreen({ player, onBack, onPurchase, onToggleSubscription }: ShopScreenProps) {
  const sound = useSound();
  const [activeTab, setActiveTab] = useState<TabId>("keys");
  const [stripeLoading, setStripeLoading] = useState<string | null>(null);

  async function startStripeCheckout(item: ShopItem) {
    if (!item.stripePriceId || isPlaceholderPrice(item.id)) return;
    setStripeLoading(item.id);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session?.access_token || ""}`,
        },
        body: JSON.stringify({ itemId: item.id }),
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

  function renderItem(item: ShopItem) {
    const isGem = item.currency === "gems";
    const canAfford = isGem ? player.gems >= item.price : true;
    const alreadyAdFree = item.type === "adFree" && player.isAdFree;
    const alreadySubscribed = item.type === "subscription" && player.isSubscribed;
    const isComingSoon = !isGem && isPlaceholderPrice(item.id);
    const disabled = alreadyAdFree || alreadySubscribed || stripeLoading === item.id || isComingSoon || (!isGem ? false : !canAfford);

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
          disabled={disabled}
          className={`px-4 py-2 rounded-lg font-bold text-xs transition active:scale-95 ${
            alreadyAdFree || alreadySubscribed
              ? "bg-vault-700 text-vault-500 cursor-not-allowed"
              : isComingSoon
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
            "Active"
          ) : isComingSoon ? (
            "Coming Soon"
          ) : isGem ? (
            <span className="flex items-center gap-1">
              <Coins size={12} />
              {formatNumber(item.price)}
            </span>
          ) : item.type === "subscription" ? (
            `$${(item.price / 100).toFixed(2)}/mo`
          ) : (
            `$${(item.price / 100).toFixed(2)}`
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-vault-900">
      {/* Header */}
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

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-4 gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { sound.playClick(); setActiveTab(tab.id); }}
              className={`flex items-center justify-center gap-1 py-2.5 rounded-full text-[11px] font-bold transition ${
                activeTab === tab.id
                  ? "bg-vault-gold text-vault-900"
                  : "bg-vault-800 text-vault-400 border border-vault-700 hover:text-white"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
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

        {/* Currency labels */}
        {activeTab === "keys" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-vault-gem uppercase">
              <Coins size={14} />
              <span>Gem Store</span>
            </div>
            {TAB_ITEMS.keys.filter((i) => i.currency === "gems").map(renderItem)}
            <div className="flex items-center gap-2 text-xs font-bold text-vault-gold uppercase pt-2">
              <Wallet size={14} />
              <span>Real Money</span>
            </div>
            {TAB_ITEMS.keys.filter((i) => i.currency === "usd").map(renderItem)}
          </div>
        )}

        {activeTab === "revives" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-vault-gem uppercase">
              <Coins size={14} />
              <span>Gem Store</span>
            </div>
            {TAB_ITEMS.revives.map(renderItem)}
          </div>
        )}

        {activeTab === "shards" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-vault-gem uppercase">
              <Coins size={14} />
              <span>Gem Store</span>
            </div>
            {TAB_ITEMS.shards.map(renderItem)}
          </div>
        )}

        {activeTab === "premium" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-vault-gold uppercase">
              <Wallet size={14} />
              <span>Premium Store</span>
            </div>
            {TAB_ITEMS.premium.map(renderItem)}
          </div>
        )}

        {!player.isAdFree && !player.isSubscribed && (
          <div className="bg-vault-800/50 rounded-xl p-4 border border-vault-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-vault-gold" />
              <p className="text-xs font-bold text-vault-gold uppercase">Free Keys</p>
            </div>
            <p className="text-xs text-vault-400 mb-2">Watch a short ad to earn 1 free key.</p>
            <button
              onClick={() => { sound.playClick(); }}
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
