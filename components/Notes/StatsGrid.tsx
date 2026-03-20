"use client";
// components/Notes/StatsGrid.tsx

import { useMemo } from "react";
import { Hash, TrendingUp, FileStack, LucideIcon } from "lucide-react";
import { Note } from "@/types/note";

interface StatsGridProps {
  notes: Note[];
  loading: boolean;
  onShowRecent?: () => void;
}

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  onClick?: () => void;
}

export function StatsGrid({ notes, loading, onShowRecent }: StatsGridProps) {
  const { total, recent, depth } = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const totalContent = notes.reduce((acc, n) => acc + (n.content?.length ?? 0), 0);
    return {
      total: notes.length,
      recent: notes.filter((n) => new Date(n.createdAt).getTime() > sevenDaysAgo).length,
      depth: totalContent > 5000 ? "Deep" : totalContent > 1000 ? "Medium" : "Light",
    };
  }, [notes]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card p-5 rounded-3xl border border-border flex items-center gap-4 animate-pulse">
            <div className="p-3 rounded-2xl bg-secondary w-11 h-11" />
            <div className="flex-1 space-y-2">
              <div className="h-2 w-16 bg-secondary rounded" />
              <div className="h-6 w-10 bg-secondary rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const stats: StatItem[] = [
    {
      label: "Vault Count",
      value: total,
      icon: Hash,
      colorClass: "text-blue-500",
      bgClass: "bg-blue-500/10",
    },
    {
      label: "New This Week",
      value: `+${recent}`,
      icon: TrendingUp,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      onClick: onShowRecent,
    },
    {
      label: "Vault Depth",
      value: depth,
      icon: FileStack,
      colorClass: "text-emerald-500",
      bgClass: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      {stats.map((stat) => (
        <div
          key={stat.label}
          onClick={stat.onClick}
          className={`bg-card p-5 rounded-3xl border border-border flex items-center gap-4 transition-all ${
            stat.onClick ? "cursor-pointer hover:border-primary/30 active:scale-95" : ""
          }`}
        >
          <div className={`p-3 rounded-2xl ${stat.bgClass} ${stat.colorClass}`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-2xl font-black text-foreground leading-tight">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
