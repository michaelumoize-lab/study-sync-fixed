"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: "/ph",
      ui_host: "https://us.posthog.com",
      defaults: "2026-01-30",
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}