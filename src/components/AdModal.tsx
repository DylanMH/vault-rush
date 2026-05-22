"use client";

interface AdModalProps {
  open: boolean;
  seconds: number;
}

export default function AdModal({ open, seconds }: AdModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">
      <div className="bg-vault-800 rounded-2xl w-full max-w-sm p-6 border border-vault-700 text-center">
        <p className="text-lg font-bold text-white mb-1">Sponsored</p>
        <p className="text-sm text-vault-400 mb-6">Watching rewarded ad...</p>
        <div className="w-full bg-vault-700 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-vault-gold h-full rounded-full transition-all duration-1000"
            style={{ width: `${((5 - seconds) / 5) * 100}%` }}
          />
        </div>
        <p className="text-2xl font-black text-vault-gold">{seconds}s</p>
        <p className="text-xs text-vault-400 mt-2">Please wait to claim your reward</p>
      </div>
    </div>
  );
}
