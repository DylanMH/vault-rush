"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Ban, CheckCircle, Loader2 } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { supabase } from "@/lib/supabase";

function ShopSuccessPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sound = useSound();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [itemLabel, setItemLabel] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setErrorMsg("No session ID found.");
      return;
    }

    async function verify() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) {
          setStatus("error");
          setErrorMsg("Please sign in to claim this purchase.");
          return;
        }

        const res = await fetch(`/api/stripe/verify?session_id=${encodeURIComponent(sessionId!)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!data.verified) {
          setStatus("error");
          setErrorMsg(data.error || "Payment could not be verified.");
          return;
        }

        const type = data.itemType;
        const qty = data.quantity || 1;
        sound?.playPurchase?.();

        setItemLabel(getItemLabel(type, qty));
        setStatus("success");
      } catch (err) {
        console.error("[ShopSuccess] verify error:", err);
        setStatus("error");
        setErrorMsg("Something went wrong during verification.");
      }
    }

    verify();
  }, [sessionId, sound]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-vault-900 px-6 text-center">
      {status === "verifying" && (
        <>
          <Loader2 size={48} className="text-vault-gold animate-spin mb-4" />
          <h2 className="text-xl font-bold text-white">Verifying your purchase...</h2>
          <p className="text-sm text-vault-400 mt-2">This should only take a moment.</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle size={64} className="text-vault-gem mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Purchase Complete!</h2>
          <p className="text-vault-300 mb-6">{itemLabel}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl bg-vault-gold text-vault-900 font-bold active:scale-95 transition"
          >
            Back to Game
          </button>
        </>
      )}

      {status === "error" && (
        <>
          <Ban size={48} className="text-vault-danger mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Purchase Failed</h2>
          <p className="text-vault-300 mb-6">{errorMsg}</p>
          <button
            onClick={() => router.push("/shop")}
            className="px-6 py-3 rounded-xl bg-vault-700 text-white font-bold active:scale-95 transition"
          >
            Back to Shop
          </button>
        </>
      )}
    </div>
  );
}

function getItemLabel(type: string, qty: number) {
  switch (type) {
    case "gems": return `+${qty} Gems added to your account`;
    case "bundle": return "Starter Bundle added: 10 keys, 2 revives, 100 gems";
    case "adFree": return "Ad-Free Upgrade activated!";
    case "subscription": return "Vault Rush Plus active! +10 keys, +1000 gems, +5 revives, exclusive skin unlocked!";
    default: return "Item added to your account";
  }
}

export default function ShopSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-vault-900 px-6 text-center">
        <Loader2 size={48} className="text-vault-gold animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white">Loading...</h2>
      </div>
    }>
      <ShopSuccessPageInner />
    </Suspense>
  );
}
