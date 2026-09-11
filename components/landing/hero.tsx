"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  FileCheck2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HeroPreview } from "./hero-preview";

export function Hero() {
  return (
    <section className="relative pt-20 sm:pt-24 lg:pt-28 pb-10 lg:pb-14 overflow-hidden">
      {/* Dynamic Background Aurora Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/15 blur-[140px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-indigo-500/15 blur-[140px] animate-bounce-slow" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-foreground dark:text-primary text-xs font-bold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-spin-slow" />
              <span>The Future of Adaptive Learning</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold text-foreground leading-[1.08] tracking-tight">
              Study smarter. <br />
              Because StudySync <br />
              <span className="relative inline-block mt-1">
                <span className="relative z-10 text-primary">
                  knows what you don&apos;t know.
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-3.5 bg-primary/20 -z-10 rounded-full" />
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Stop passively re-reading slides. StudySync pinpoints your concept gaps,
              schedules personalized reviews, and grounds every AI answer directly in
              your lecture material with exact page citations.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/auth/sign-in"
                className="group px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2.5 hover:shadow-primary/40 hover:brightness-105 active:scale-95 text-base"
              >
                <span>Start Studying Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#features"
                className="group px-8 py-4 bg-secondary/50 backdrop-blur-sm text-foreground font-bold rounded-2xl border border-border hover:bg-secondary transition-all flex items-center justify-center gap-2 text-base"
              >
                <ShieldCheck className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span>Explore The Engine</span>
              </Link>
            </div>

            {/* 3 Premium Value Cards */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-md shadow-xs">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground leading-tight">
                    100% Grounded
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    In your lecture notes
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-md shadow-xs">
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground leading-tight">
                    FSRS Spaced Rep
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Cognitive algorithm
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-md shadow-xs">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground leading-tight">
                    Exam Readiness
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Score prediction
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT - Live StudySync Preview Mockup */}
          <div className="w-full">
            <HeroPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
