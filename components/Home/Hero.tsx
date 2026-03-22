"use client";

import { ArrowRight, Sparkles, ShieldCheck, Zap, Edit3 } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import dynamic from "next/dynamic";

const HeroMockup = dynamic(() => import("./HeroMockup"), { ssr: false });

export default function Hero() {
  const { data: session } = authClient.useSession();

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
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
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
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed delay-150 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
              StudySync is your private vault for academic notes. Organize your
              thoughts, track your progress, and keep everything in one secure
              place.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 delay-300 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
              <Link
                href={session ? "/dashboard/vault" : "/auth/sign-in"}
                className="group w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:shadow-primary/40 hover:brightness-105 active:scale-95"
              >
                {session ? "Go to Vault" : "Create Free Vault"}
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
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}
