"use client";

import {
  Activity,
  Brain,
  AlertTriangle,
  CalendarCheck,
  RotateCw,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ADAPTIVE_STEPS = [
  {
    step: "01",
    title: "Your Activity",
    desc: "Every note viewed, quiz answered, and flashcard flipped is tracked.",
    icon: Activity,
    accent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  {
    step: "02",
    title: "Mastery Mapping",
    desc: "AI calculates concept comprehension across all lecture topics.",
    icon: Brain,
    accent: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    step: "03",
    title: "Gap Isolation",
    desc: "Identifies prerequisite blind spots before they hurt your grades.",
    icon: AlertTriangle,
    accent: "text-red-500 bg-red-500/10 border-red-500/20",
  },
  {
    step: "04",
    title: "Adaptive Queue",
    desc: "Generates today's exact study queue using the FSRS forgetting curve.",
    icon: CalendarCheck,
    accent: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    step: "05",
    title: "Improved Retention",
    desc: "Targeted practice closes the loop and locks knowledge in long-term.",
    icon: RotateCw,
    accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
];

export function AdaptiveLearning() {
  return (
    <section id="adaptive-learning" className="relative pt-10 sm:pt-14 lg:pt-18 pb-16 lg:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-primary/8 blur-[160px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="px-3.5 py-1.5 rounded-full border-primary/30 bg-primary/5 text-foreground text-xs font-semibold tracking-wide gap-2 shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span>Closed-Loop Cognitive System</span>
            </Badge>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1]">
            StudySync adapts to you.{" "}
            <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent">
              Not the other way around.
            </span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Traditional study apps give you static timetables. StudySync continuously models
            your forgetting curve, isolates weak concepts, and realigns your daily priorities
            after every session.
          </p>
        </div>

        {/* The Continuous Feedback Loop Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-14">
          {ADAPTIVE_STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="relative p-4 sm:p-5 rounded-3xl bg-card/70 border border-border/80 dark:border-white/10 backdrop-blur-md shadow-xs flex flex-col justify-between space-y-3 group hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-2xl border ${item.accent} shadow-2xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-muted-foreground/60">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Cockpit: Today's Priorities Interactive Card */}
        <div className="relative rounded-3xl border border-border/80 dark:border-white/10 bg-card/85 dark:bg-zinc-950/85 backdrop-blur-2xl shadow-2xl overflow-hidden text-left p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  Today&apos;s Adaptive Priorities
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Ranked by conceptual gap severity &amp; FSRS memory decay rate
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-mono py-1 px-3 bg-background/50">
                Algorithm: FSRS-4.5
              </Badge>
              <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                3 Actions Required
              </Badge>
            </div>
          </div>

          {/* Priorities List */}
          <div className="mt-6 space-y-3">
            {/* Priority 1: Red Concept Gap */}
            <div className="p-4 sm:p-5 rounded-2xl bg-background border border-red-500/25 shadow-xs hover:border-red-500/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 shrink-0 mt-0.5 sm:mt-0 ring-4 ring-red-500/20" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">Graph Algorithms</span>
                    <Badge variant="destructive" className="text-[10px] h-4.5 px-1.5 font-bold">
                      Concept Gap (34%)
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Struggling with negative cycles and Bellman-Ford relaxation invariants.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono font-bold text-red-500">Critical Priority</span>
                <Button size="sm" className="rounded-xl h-8 text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-xs">
                  Review Concept
                </Button>
              </div>
            </div>

            {/* Priority 2: Yellow Spaced Review */}
            <div className="p-4 sm:p-5 rounded-2xl bg-background border border-amber-500/25 shadow-xs hover:border-amber-500/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0 mt-0.5 sm:mt-0 ring-4 ring-amber-500/20" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">Recursion Trees</span>
                    <Badge className="text-[10px] h-4.5 px-1.5 font-bold bg-amber-500/15 text-amber-500 border-amber-500/30">
                      Spaced Review Due
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Retention predicted at 68%. 4 flashcards scheduled to reset forgetting curve.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-muted-foreground">4 Cards Due</span>
                <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs font-bold border-amber-500/30 text-foreground hover:bg-amber-500/10">
                  Start Review
                </Button>
              </div>
            </div>

            {/* Priority 3: Green Practice Maintenance */}
            <div className="p-4 sm:p-5 rounded-2xl bg-background border border-emerald-500/25 shadow-xs hover:border-emerald-500/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0 mt-0.5 sm:mt-0 ring-4 ring-emerald-500/20" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">Sorting Invariants</span>
                    <Badge className="text-[10px] h-4.5 px-1.5 font-bold bg-emerald-500/15 text-emerald-500 border-emerald-500/30">
                      Mastered (96%)
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Quick challenge to maintain long-term memory stability. Next interval: +14.8 days.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-emerald-500 font-bold">+14.8d Interval</span>
                <Button size="sm" variant="ghost" className="rounded-xl h-8 text-xs font-bold text-muted-foreground hover:text-foreground">
                  Quick Quiz
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Feedback Loop Summary */}
          <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Every session updates your global mastery graph in real time</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <TrendingUp className="w-4 h-4" />
              <span>Projected midterm confidence: +23% faster mastery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdaptiveLearning;
