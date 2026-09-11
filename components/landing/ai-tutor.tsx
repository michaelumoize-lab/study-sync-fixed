"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  FileText,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Code2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SAMPLE_PROMPTS = [
  "Why does adding a constant to edge weights fail?",
  "Generate 3 exam flashcards from Slide 47",
  "How does Bellman-Ford solve this instead?",
];

export function AITutor() {
  const [selectedPrompt, setSelectedPrompt] = useState(0);

  return (
    <section id="ai-tutor" className="relative pt-10 sm:pt-14 lg:pt-18 pb-16 lg:pb-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="px-3.5 py-1.5 rounded-full border-primary/30 bg-primary/5 text-foreground text-xs font-semibold tracking-wide gap-2 shadow-xs"
            >
              <Bot className="w-3.5 h-3.5 text-primary" />
              <span>Grounded Retrieval Intelligence</span>
            </Badge>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1]">
            An AI tutor that{" "}
            <span className="bg-linear-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent">
              never hallucinates.
            </span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            General AI models guess from the internet. StudySync retrieves answers
            strictly from your professor&apos;s uploaded slides, textbooks, and lecture notes—with
            clickable page citations for every single answer.
          </p>
        </div>

        {/* Interactive Deep-Dive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Key Pillars */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-card/70 border border-border/80 dark:border-white/10 backdrop-blur-md shadow-xs space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Zero-Hallucination Guarantee
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                  Every response is strictly bounded by high-dimensional vector search against your notes. If it&apos;s not in your material, StudySync won&apos;t invent it.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-card/70 border border-border/80 dark:border-white/10 backdrop-blur-md shadow-xs space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Click-to-Verify Source Cards
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                  Every claim is backed by exact file names, slide numbers, and highlighted text excerpts so you can cross-reference with 100% exam confidence.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-card/70 border border-border/80 dark:border-white/10 backdrop-blur-md shadow-xs space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Socratic Explanations
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                  StudySync doesn&apos;t just spit answers; it breaks down the core intuition, flags common pitfalls, and links related concept nodes.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-2xl font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                <Link href="/auth/sign-in" className="flex items-center gap-2">
                  <span>Chat With Your Course Materials</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: High-Fidelity Interactive Visual */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-zinc-950/90 backdrop-blur-2xl shadow-2xl overflow-hidden text-left">
              {/* Window Header */}
              <div className="px-4 py-3 bg-muted/40 border-b border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-mono text-muted-foreground">
                    tutor / Algorithms_Lec06.pdf
                  </span>
                </div>

                <Badge variant="outline" className="text-[10px] gap-1.5 font-mono py-0.5 bg-background/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Grounded Mode
                </Badge>
              </div>

              {/* Chat Canvas */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Question */}
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>You</span>
                  </div>
                  <div className="p-3.5 rounded-2xl rounded-tr-xs bg-primary text-primary-foreground text-xs sm:text-sm font-medium leading-relaxed max-w-[90%] shadow-xs">
                    Why does Dijkstra fail with negative edge weights? Can&apos;t we just add a constant to all edges to make them positive?
                  </div>
                </div>

                {/* AI Grounded Response */}
                <div className="flex flex-col items-start gap-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>StudySync AI</span>
                    <span className="text-[10px] font-normal text-muted-foreground">&bull; 0.4s</span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl rounded-tl-xs bg-muted/50 border border-border/80 text-xs sm:text-sm text-foreground leading-relaxed space-y-3 max-w-[96%] shadow-xs">
                    <p>
                      <strong>No, adding a constant fails.</strong> It penalizes paths with more edges disproportionately:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                      <li>A 3-edge path gains <span className="text-foreground font-mono font-bold">+3C</span>.</li>
                      <li>A 1-edge path gains only <span className="text-foreground font-mono font-bold">+1C</span>.</li>
                      <li>This alters which path is actually minimal, producing incorrect shortest paths.</li>
                    </ul>

                    {/* Rich Clickable Source Citation Card */}
                    <div className="mt-3 p-3.5 rounded-2xl bg-background border-2 border-primary/30 shadow-md space-y-2 hover:border-primary transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                          <FileText className="w-4 h-4 text-primary" />
                          <span>CS201_Lecture_06_ShortestPaths.pdf</span>
                        </div>
                        <Badge className="text-[10px] bg-primary/10 text-primary border-primary/30">
                          Slide 47
                        </Badge>
                      </div>

                      <div className="p-2.5 rounded-xl bg-muted/50 border border-border/40 text-[11px] font-mono leading-relaxed text-muted-foreground">
                        <p className="text-foreground font-semibold mb-1">
                          &quot;Theorem 6.2 (Re-weighting Fallacy):&quot;
                        </p>
                        <p className="italic">
                          Adding \( k &gt; 0 \) to each weight favors paths with fewer edges. \( w&apos;(P_1) = w(P_1) + 3k \) vs \( w&apos;(P_2) = w(P_2) + k \). Relative ordering is not preserved.
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-emerald-500 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Cosine match 99.2%
                        </span>
                        <span className="text-primary font-semibold flex items-center gap-1 cursor-pointer hover:underline">
                          View original page
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sample Prompt Chips */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-primary" />
                    <span>Try follow-up questions:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_PROMPTS.map((prompt, index) => (
                      <button
                        key={prompt}
                        onClick={() => setSelectedPrompt(index)}
                        className={cn(
                          "text-[11px] px-2.5 py-1.5 rounded-xl border transition-all text-left",
                          selectedPrompt === index
                            ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                            : "bg-background/80 border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/60"
                        )}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AITutor;
