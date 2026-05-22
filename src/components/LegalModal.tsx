"use client";

import { useState } from "react";
import { X, Scale } from "lucide-react";

export default function LegalModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-vault-500 hover:text-vault-400 underline underline-offset-2 transition"
      >
        Legal / Odds
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-0 sm:px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-vault-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 border border-vault-700 max-h-[80vh] overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Scale size={20} className="text-vault-gold" />
                <h3 className="text-lg font-bold">Legal & Fair Play</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-vault-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm text-vault-300">
              <div className="bg-vault-900/60 rounded-xl p-4 border border-vault-700">
                <p className="font-bold text-white mb-1">Virtual Currency Only</p>
                <p>
                  Vault Rush uses virtual currency only. Rewards have no cash value and cannot be withdrawn, exchanged, or redeemed for real money.
                </p>
              </div>

              <div className="bg-vault-900/60 rounded-xl p-4 border border-vault-700">
                <p className="font-bold text-white mb-1">Responsible Play</p>
                <p>
                  This game is intended for entertainment purposes. If you feel you are spending too much time or virtual currency, consider taking a break.
                </p>
              </div>

              <div className="bg-vault-900/60 rounded-xl p-4 border border-vault-700">
                <p className="font-bold text-white mb-1">Odds Disclosure</p>
                <p>
                  All vault outcomes are determined by weighted random chance. Odds are visible in-game via the info button on the run screen. No outcome is guaranteed.
                </p>
              </div>

              <p className="text-xs text-vault-500 pt-2">
                © 2026 Vault Rush. All rights reserved. For support, contact support@vaultrush.game
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
