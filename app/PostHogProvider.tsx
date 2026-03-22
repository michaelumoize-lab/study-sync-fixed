"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, Suspense } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: "/ph",
      ui_host: "https://us.posthog.com",
      defaults: "2026-01-30",
      disable_session_recording: true,
      autocapture: false,
      disable_surveys: true,
      capture_dead_clicks: false,
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>{children}</Suspense>
    </PHProvider>
  );
}
