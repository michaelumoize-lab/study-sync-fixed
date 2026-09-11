"use client";

import {
  Sparkles,
  FileText,
  CheckCircle2,
  Zap,
  Target,
  Bot,
  Brain,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroPreview() {
  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none animate-in fade-in zoom-in-95 duration-700 delay-300 fill-mode-both">
      {/* Background ambient lighting */}
      <div className="absolute -inset-2 rounded-[2.5rem] bg-linear-to-tr from-primary/30 via-indigo-500/20 to-primary/20 blur-2xl opacity-60 -z-10" />

      {/* Floating Badge - Top Right */}
      <div className="hidden sm:flex absolute -top-4 -right-4 z-20 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-card/90 backdrop-blur-md border border-border/80 shadow-2xl animate-bounce-slow">
        <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-500">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Citation Verified
          </span>
          <span className="text-xs font-bold text-foreground">Zero AI Hallucinations</span>
        </div>
      </div>

      {/* Floating Badge - Bottom Left */}
      <div className="hidden sm:flex absolute -bottom-5 -left-4 z-20 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-card/90 backdrop-blur-md border border-border/80 shadow-2xl">
        <div className="p-1.5 rounded-xl bg-primary/15 text-primary">
          <Zap className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            FSRS Repetition
          </span>
          <span className="text-xs font-bold text-foreground">+4.2 days optimal interval</span>
        </div>
      </div>

      {/* Main Glassmorphic Window */}
      <div className="relative rounded-3xl border border-border/80 bg-card/85 dark:bg-zinc-950/85 backdrop-blur-xl shadow-2xl overflow-hidden text-left">
        {/* Window Chrome Header */}
        <div className="bg-muted/40 border-b border-border/60 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="ml-2 text-[11px] font-mono text-muted-foreground">
              studysync.app / live-cockpit
            </span>
          </div>

          <Badge variant="outline" className="text-[10px] font-mono py-0.5 px-2 bg-background/60 gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            FSRS Engine Active
          </Badge>
        </div>

        {/* Cockpit Content */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Top: Priority Concept Bar */}
          <div className="p-3 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-foreground">Today&apos;s Knowledge Gaps</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">3 Priorities</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-background border border-red-500/20 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold truncate">Graph Theory</span>
                  <span className="text-[9px] font-bold text-red-500">38%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: "38%" }} />
                </div>
              </div>

              <div className="p-2 rounded-xl bg-background border border-amber-500/20 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold truncate">Recursion</span>
                  <span className="text-[9px] font-bold text-amber-500">Review</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              <div className="p-2 rounded-xl bg-background border border-emerald-500/20 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold truncate">Binary Search</span>
                  <span className="text-[9px] font-bold text-emerald-500">94%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "94%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Center: AI Tutor Grounded Response */}
          <div className="space-y-3">
            {/* Student message */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-medium text-muted-foreground mr-1">You</span>
              <div className="px-3.5 py-2.5 rounded-2xl rounded-tr-xs bg-primary text-primary-foreground text-xs font-medium leading-relaxed max-w-[90%] shadow-xs">
                Why does Dijkstra fail with negative edge weights?
              </div>
            </div>

            {/* AI Tutor Response */}
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary ml-1">
                <Bot className="w-3.5 h-3.5" />
                <span>StudySync AI Tutor</span>
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-xs bg-muted/50 border border-border/80 text-xs text-foreground leading-relaxed space-y-2.5 max-w-[95%] shadow-xs">
                <p>
                  Dijkstra greedily assumes that once a vertex is visited, its shortest distance is finalized. A negative edge can later produce a cheaper path, violating this greedy invariant.
                </p>

                {/* Grounded Citation Card */}
                <div className="p-2.5 rounded-xl bg-background border border-primary/30 shadow-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      <span>CS201_Algorithms_Lec06.pdf</span>
                    </div>
                    <Badge className="text-[9px] h-4 bg-primary/10 text-primary border-primary/20">
                      Page 47
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic bg-muted/40 p-1.5 rounded-md">
                    &quot;Theorem 6.2: Non-negative edge weight invariance guarantees monotonic relaxation...&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Exam Readiness Status Bar */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-500 font-black text-xs">
                86%
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">Midterm Readiness</span>
                <span className="text-[10px] text-muted-foreground">Safe zone &bull; 2 gaps remaining</span>
              </div>
            </div>

            <Button size="sm" variant="ghost" className="h-7 text-xs font-bold text-primary hover:text-primary gap-1 px-2">
              Simulate Exam
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroPreview;
