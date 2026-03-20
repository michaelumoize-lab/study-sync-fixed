"use client";

import { Edit3, RefreshCcw, ArrowRight, FolderPlus } from "lucide-react";

const steps = [
  {
    title: "Capture",
    description:
      "Write down your lecture notes in our lightning-fast markdown editor. No distractions, just you and your thoughts.",
    icon: <Edit3 className="w-6 h-6 text-primary-foreground" />,
    color: "bg-primary",
    ring: "ring-background",
  },
  {
    title: "Organize",
    description:
      "Categorize your notes into subjects and topics. Our smart tagging system makes sure you never lose a page again.",
    icon: <FolderPlus className="w-6 h-6 text-primary" />,
    color: "bg-foreground dark:bg-card",
    ring: "ring-background",
  },
  {
    title: "Sync",
    description:
      "Your data is automatically synced across all your devices. Start on your laptop, finish on your phone—instantly.",
    icon: <RefreshCcw className="w-6 h-6 text-primary-foreground" />,
    color: "bg-primary",
    ring: "ring-background",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <p className="text-primary font-bold tracking-widest uppercase text-sm">
            Simple & Efficient
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
            How StudySync works
          </h2>
          <p className="text-muted-foreground text-lg">
            We designed StudySync to get out of your way so you can focus on what matters most: your education.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="grid md:grid-cols-3 gap-12 relative">

          {/* Connector Line — top-8 = half of h-16 icon height */}
          <div className="hidden md:block absolute top-8 left-[10%] w-[80%] h-[2px] bg-border z-0" />

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-700 fill-mode-both"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Icon Bubble — z-10 to sit above the line */}
              <div
                className={`${step.color} ${step.ring} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ring-8 z-10 relative`}
              >
                {step.icon}
              </div>

              {/* Text Content */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                  <span className="text-primary opacity-60 text-sm italic">
                    0{index + 1}.
                  </span>
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed px-4">
                  {step.description}
                </p>
              </div>

              {/* Mobile Arrow */}
              {index < 2 && (
                <div className="md:hidden pt-4">
                  <ArrowRight className="w-6 h-6 text-border rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-20 p-8 bg-foreground dark:bg-card rounded-3xl text-center space-y-6 shadow-2xl overflow-hidden relative group border border-border">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/20 transition-colors" />

          <h3 className="text-2xl md:text-3xl font-bold text-background dark:text-foreground relative z-10">
            Ready to build your study vault?
          </h3>
          <button className="relative z-10 bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/10 hover:brightness-105">
            Start Syncing for Free
          </button>
        </div>
      </div>
    </section>
  );
}