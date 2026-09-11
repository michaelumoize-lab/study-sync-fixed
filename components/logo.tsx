import React from "react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showBadge?: boolean;
}

export function Logo({ className, size = 20, showBadge = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none group", className)}>
      <div className="relative flex items-center justify-center p-2 rounded-xl bg-linear-to-br from-primary/25 via-primary/15 to-indigo-500/20 text-primary border border-primary/20 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/20 group-hover:border-primary/40">
        <BookOpen style={{ width: size, height: size }} className="transition-transform duration-300 group-hover:-rotate-3" />
        <div className="absolute inset-0 rounded-xl bg-primary/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-lg sm:text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
          StudySync
        </span>
        {showBadge && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
            AI
          </span>
        )}
      </div>
    </div>
  );
}

export default Logo;
