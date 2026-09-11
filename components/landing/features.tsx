"use client";

import {
  Brain,
  Bot,
  CalendarClock,
  Target,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Database,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Features() {
  return (
    <section id="features" className="relative pt-8 sm:pt-10 lg:pt-14 pb-16 lg:pb-24 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 blur-[160px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="px-3.5 py-1.5 rounded-full border-primary/30 bg-primary/5 text-foreground text-xs font-semibold tracking-wide gap-2 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Complete Study Intelligence</span>
            </Badge>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1]">
            Everything you need <br />
            <span className="bg-linear-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent">
              to learn effectively.
            </span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            StudySync replaces fragmented study apps with a single cognitive system.
            Four integrated pillars engineered to transform passive reading into proven mastery.
          </p>
        </div>

        {/* 2x2 Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: Concept Mastery */}
          <div className="group relative rounded-3xl p-6 sm:p-8 bg-card/70 border border-border/80 dark:border-white/10 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs group-hover:scale-105 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="text-xs border-border/80 bg-background/50 font-medium">
                  Knowledge Graph
                </Badge>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground">Concept Mastery</h3>
                <p className="text-sm font-semibold text-primary mt-0.5">
                  See exactly what you understand.
                </p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                StudySync structures your notes into an interconnected semantic graph. 
                Instantly identify hidden prerequisite gaps before they compound.
              </p>
            </div>

            {/* Visual Micro-Demo: Concept Node Web */}
            <div className="mt-6 p-4 rounded-2xl bg-background/80 border border-border/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">Algorithms Knowledge Map</span>
                <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  18/22 Mastered
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-card border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-foreground truncate">Memoization</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500">92%</span>
                </div>

                <div className="p-2.5 rounded-xl bg-card border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-foreground truncate">Dijkstra Core</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500">88%</span>
                </div>

                <div className="p-2.5 rounded-xl bg-card border border-red-500/30 bg-red-500/5 flex items-center justify-between col-span-2">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="font-bold text-foreground truncate">Bellman-Ford Cycles</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-red-500">Critical Gap (34%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Grounded AI Tutor */}
          <div className="group relative rounded-3xl p-6 sm:p-8 bg-card/70 border border-border/80 dark:border-white/10 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs group-hover:scale-105 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="text-xs border-border/80 bg-background/50 font-medium">
                  Vector RAG
                </Badge>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground">Grounded AI Tutor</h3>
                <p className="text-sm font-semibold text-primary mt-0.5">
                  Learn with answers grounded in your material.
                </p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                No hallucinations or generic textbook summaries. Ask questions and get answers
                derived directly from your uploaded slides with clickable exact-page citations.
              </p>
            </div>

            {/* Visual Micro-Demo: Source Grounded Card */}
            <div className="mt-6 p-4 rounded-2xl bg-background/80 border border-border/60 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>OS_Concurrency_Lec04.pdf</span>
                </div>
                <Badge className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20">
                  Page 84
                </Badge>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 text-[11px] leading-relaxed text-muted-foreground italic">
                &quot;The four Coffman conditions for deadlock: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.&quot;
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1 text-muted-foreground">
                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified against original PDF
                </span>
                <span className="font-mono">99.4% match</span>
              </div>
            </div>
          </div>

          {/* Card 3: Adaptive Planning */}
          <div className="group relative rounded-3xl p-6 sm:p-8 bg-card/70 border border-border/80 dark:border-white/10 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs group-hover:scale-105 transition-transform">
                  <CalendarClock className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="text-xs border-border/80 bg-background/50 font-medium">
                  FSRS Algorithm
                </Badge>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground">Adaptive Planning</h3>
                <p className="text-sm font-semibold text-primary mt-0.5">
                  Know what to study next.
                </p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Forget arbitrary study timers. StudySync models your personal forgetting curve
                and generates daily review queues targeting items at the exact point of decay.
              </p>
            </div>

            {/* Visual Micro-Demo: Priority Queue */}
            <div className="mt-6 p-4 rounded-2xl bg-background/80 border border-border/60 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>Today&apos;s Adaptive Queue</span>
                <span className="text-[10px] text-muted-foreground font-normal">FSRS-Calculated</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="font-semibold text-foreground">Negative Cycles Review</span>
                  </div>
                  <span className="text-[10px] font-bold text-red-500">High Decay</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-semibold text-foreground">Master Theorem Cases</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-500">Due Today</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-foreground">Binary Heaps</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500">+7.5d interval</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Exam Readiness */}
          <div className="group relative rounded-3xl p-6 sm:p-8 bg-card/70 border border-border/80 dark:border-white/10 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="text-xs border-border/80 bg-background/50 font-medium">
                  Predictive Score
                </Badge>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground">Exam Readiness</h3>
                <p className="text-sm font-semibold text-primary mt-0.5">
                  Know when you&apos;re actually ready.
                </p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Never guess whether you&apos;re prepared. Real-time predictive metrics test you
                against edge cases and calculate a data-driven exam readiness probability.
              </p>
            </div>

            {/* Visual Micro-Demo: Readiness Dial & Forecast */}
            <div className="mt-6 p-4 rounded-2xl bg-background/80 border border-border/60 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col items-center justify-center text-emerald-500 shrink-0">
                  <span className="text-lg font-black leading-none">89%</span>
                  <span className="text-[9px] font-bold mt-0.5">READY</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">Midterm Forecast</span>
                  <span className="text-[11px] text-emerald-500 font-semibold">Grade Range: A / A-</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">2 weak sub-topics remaining</span>
                </div>
              </div>

              <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-xl gap-1 shrink-0">
                Simulate
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Feature Capabilities Bar */}
        <div className="mt-12 p-4 sm:p-5 rounded-3xl bg-muted/30 border border-border/60 flex flex-wrap items-center justify-around gap-4 text-xs text-muted-foreground font-semibold">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <span>FSRS v4.5 Adaptive Decay</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <span>PostgreSQL &amp; Vector Embeddings</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span>Multi-Modal PDF Extraction</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <span>Client Encrypted Study Vault</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
