"use client";

import { ArrowRight, Sparkles, ShieldCheck, Zap, Edit3 } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Animated Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[120px] animate-bounce-slow" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-foreground dark:text-primary text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              The Future of Study Sessions
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight">
              Focus on learning, <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">
                  we&apos;ll handle
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 rounded-full" />
              </span>{" "}
              the sync.
            </h1>

            {/* Subtext */}
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed delay-150 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
              StudySync is your private vault for academic notes. Organize your
              thoughts, track your progress, and keep everything in one secure
              place.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 delay-300 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
              <Link
                href="/signup"
                className="group w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:shadow-primary/40 hover:brightness-105 active:scale-95"
              >
                Create Free Vault
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#how-it-works"
                className="group w-full sm:w-auto px-8 py-4 bg-secondary/50 backdrop-blur-sm text-foreground font-bold rounded-2xl border border-border hover:bg-secondary transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                How it Works
              </Link>
            </div>
          </div>

          {/* RIGHT CONTENT - App Preview */}
          <div className="relative lg:block animate-in fade-in zoom-in-95 duration-1000 delay-500 fill-mode-both">
            <div className="relative z-10 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-float">
              {/* Window Chrome */}
              <div className="bg-muted/50 border-b border-border px-4 py-2.5 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-muted rounded-md px-3 py-1 text-[10px] text-muted-foreground text-center border border-border/50">
                  studysync.app / vault
                </div>
              </div>

              {/* App Layout */}
              <div className="flex h-72">
                {/* Sidebar */}
                <div className="w-36 border-r border-border p-3 flex flex-col gap-1 shrink-0">
                  <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-2 px-1">
                    My Vault
                  </p>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-primary/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground">
                      Biology
                    </span>
                  </div>
                  {["Calculus", "History", "Chemistry"].map((s) => (
                    <div
                      key={s}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-border shrink-0" />
                      <span className="text-xs text-muted-foreground">{s}</span>
                    </div>
                  ))}
                  <div className="mt-auto border border-dashed border-border rounded-lg p-2 text-center">
                    <span className="text-[10px] text-muted-foreground">
                      + New subject
                    </span>
                  </div>
                </div>

                {/* Note Content */}
                <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
                  {/* Note Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-foreground mb-1">
                        Cell Membrane Transport
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-semibold">
                          Biology
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Lec 4 · Week 2
                        </span>
                      </div>
                    </div>
                    <div className="bg-primary w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                      <Edit3 className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Note Body */}
                  <div className="flex flex-col gap-2 text-xs leading-relaxed">
                    <p className="text-muted-foreground">
                      Two types of transport across membranes:
                    </p>
                    <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-primary">
                      <div className="flex gap-2">
                        <span className="text-primary font-semibold shrink-0">
                          Passive
                        </span>
                        <span className="text-muted-foreground">
                          moves with gradient, no ATP needed
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary font-semibold shrink-0">
                          Active
                        </span>
                        <span className="text-muted-foreground">
                          moves against gradient, requires ATP
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      Key example:{" "}
                      <span className="text-foreground font-semibold">
                        Na⁺/K⁺ pump
                      </span>{" "}
                      — 3 Na⁺ out, 2 K⁺ in.
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-1.5 flex-wrap mt-auto">
                    {["#exam-prep", "#midterm", "#lecture-notes"].map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="border-t border-border px-4 py-2 flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[10px] text-muted-foreground">
                    Synced · just now
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  247 words
                </span>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-xl border border-border z-20 flex items-center gap-3 animate-bounce-slow">
              <div className="bg-primary p-2 rounded-lg">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none">
                  Status
                </p>
                <p className="text-sm font-bold text-foreground">Synced</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
