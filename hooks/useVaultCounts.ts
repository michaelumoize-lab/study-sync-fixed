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
      const res = await fetch("/api/vault/counts");
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
    const handler = () => fetchCounts();
    window.addEventListener("vault-updated", handler);
    window.addEventListener("draft-updated", handler);
    return () => {
      window.removeEventListener("vault-updated", handler);
      window.removeEventListener("draft-updated", handler);
    };
  }, [fetchCounts]);

  return { ...counts, loading, refetch: fetchCounts };
}
