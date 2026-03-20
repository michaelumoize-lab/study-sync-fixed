"use client";

import { Zap, Search, Moon, Lock } from "lucide-react";

const features = [
  {
    title: "Instant Sync",
    description:
      "Your notes move at the speed of thought. Edit on desktop, read on mobile instantly.",
    icon: <Zap className="w-6 h-6 text-primary-foreground" />,
    className:
      "md:col-span-2 bg-primary/10 border-primary/25 dark:bg-primary/10 dark:border-primary/20",
    iconBg: "bg-primary",
  },
  {
    title: "Deep Search",
    description: "Find any keyword across years of semesters in milliseconds.",
    icon: <Search className="w-6 h-6 text-primary" />,
    className:
      "md:col-span-1 bg-secondary/60 dark:bg-secondary/40 border-border",
    iconBg: "bg-foreground dark:bg-card",
  },
  {
    title: "Focus Mode",
    description:
      "A distraction-free markdown interface designed for long study sessions.",
    icon: <Moon className="w-6 h-6 text-primary" />,
    className:
      "md:col-span-1 bg-secondary/60 dark:bg-secondary/40 border-border",
    iconBg: "bg-foreground dark:bg-card",
  },
  {
    title: "Private Vault",
    description:
      "Your academic data is encrypted and private. We don't sell your notes to anyone.",
    icon: <Lock className="w-6 h-6 text-primary-foreground" />,
    className:
      "md:col-span-2 bg-primary/10 border-primary/25 dark:bg-primary/10 dark:border-primary/20",
    iconBg: "bg-primary",
  },
];

const secondaryFeatures = [
  "AI Summaries",
  "PDF Import",
  "Smart Tags",
  "Flashcards",
];

export default function Features() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <p className="text-primary font-bold tracking-widest uppercase text-sm">
              Powerful Capabilities
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground max-w-xl leading-tight">
              Everything you need to{" "}
              <span className="text-muted-foreground">ace your exams.</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-sm leading-relaxed">
            We stripped away the social noise to give you a dedicated workspace
            for deep learning.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${feature.className}`}
            >
              <div
                className={`${feature.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Secondary Feature Row */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {secondaryFeatures.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2.5 px-4 py-3 bg-secondary/40 dark:bg-secondary/30 rounded-2xl border border-border/50 hover:border-primary/40 hover:bg-accent/50 transition-colors duration-200"
            >
              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <span className="text-sm font-semibold text-muted-foreground">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
