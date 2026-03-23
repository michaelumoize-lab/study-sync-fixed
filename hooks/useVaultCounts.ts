"use client";
// hooks/useVaultCounts.ts

import { useState, useEffect, useCallback } from "react";

interface VaultCounts {
  vaultCount: number;
  draftCount: number;
  deletedCount: number;
}

export function useVaultCounts() {
  const [counts, setCounts] = useState<VaultCounts>({
    vaultCount: 0,
    draftCount: 0,
    deletedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/vault/counts", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setCounts(data);
    } catch {
      // fail silently — counts are non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Refresh counts whenever vault changes
  useEffect(() => {
    window.addEventListener("vault-updated", fetchCounts);
    window.addEventListener("draft-updated", fetchCounts);
    return () => {
      window.removeEventListener("vault-updated", fetchCounts);
      window.removeEventListener("draft-updated", fetchCounts);
    };
  }, [fetchCounts]);

  return { ...counts, loading, refetch: fetchCounts };
}
