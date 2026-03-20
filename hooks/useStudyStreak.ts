"use client";
// hooks/useStudyStreak.ts

import { useState, useEffect } from "react";

/**
 * Increments the study streak once per session on mount.
 * Returns the current streak count from the database.
 */
export function useStudyStreak(): number | null {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    // Use sessionStorage so we only ping the API once per browser session
    const sessionKey = "studysync_streak_pinged";
    const alreadyPinged = sessionStorage.getItem(sessionKey);

    if (!alreadyPinged) {
      // Increment (or reset) streak for today
      fetch("/api/streak", { method: "POST" })
        .then((r) => r.json())
        .then((data) => {
          setStreak(data.streak ?? 0);
          sessionStorage.setItem(sessionKey, "1");
        })
        .catch(() => {});
    } else {
      // Already pinged this session — just fetch current value
      fetch("/api/streak")
        .then((r) => r.json())
        .then((data) => setStreak(data.streak ?? 0))
        .catch(() => {});
    }
  }, []);

  return streak;
}
