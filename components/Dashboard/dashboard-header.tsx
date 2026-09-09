import * as React from "react";
import { HeaderActions } from "@/components/Dashboard/header-actions";
import { DashboardUser } from "@/lib/data/dashboard";

interface DashboardHeaderProps {
  user: DashboardUser;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const greeting = getGreeting();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Study Command Center
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          {greeting}, {user.firstName} 👋
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          Here&apos;s what matters for your studies today.
        </p>
      </div>

      <HeaderActions />
    </div>
  );
}
