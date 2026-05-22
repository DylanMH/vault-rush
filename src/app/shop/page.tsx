"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-vault-900">
      <p className="text-vault-400 text-sm">Loading shop...</p>
    </div>
  );
}
