"use client";

// components/Notes/WelcomePageClient.tsx

import Link from "next/link";
import {
  BookOpen,
  Clock,
  MessageSquare,
  PenLine,
  ArrowRight,
  Zap,
  Focus,
} from "lucide-react";
import { useNotes } from "@/hooks/useNotes";
import { useStudyStreak } from "@/hooks/useStudyStreak";
import { motion, type Variants } from "framer-motion";
import { useMemo, useEffect, useState, useRef } from "react";
import { usePostHog } from "posthog-js/react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// ---------------------------------------------------------------------------

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ---------------------------------------------------------------------------
// StatItem — mirrors VaultStatus pill style from Navbar
// ---------------------------------------------------------------------------

interface StatItemProps {
  value: string | number;
  label: string;
  loading?: boolean;
}

function StatItem({ value, label, loading }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      {loading ? (
        <div className="w-8 h-6 bg-secondary animate-pulse rounded-lg" />
      ) : (
        <span className="text-xl font-black tracking-tight text-foreground">
          {value}
        </span>
      )}
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card data
// ---------------------------------------------------------------------------

interface CardConfig {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
}

const CARDS: CardConfig[] = [
  {
    href: "/dashboard/vault",
    icon: BookOpen,
    title: "Open Vault",
    description: "Browse your full library of study materials.",
  },
  {
    href: "/dashboard/vault/new",
    icon: PenLine,
    title: "New Note",
    description: "Start a fresh page.",
  },
  {
    href: "/dashboard/study",
    icon: MessageSquare,
    title: "Study AI",
    description:
      "Chat with your notes. Get summaries, quizzes, and instant answers.",
    badge: "AI-Powered",
  },
  {
    href: "/dashboard/focus-mode",
    icon: Focus,
    title: "Focus Mode",
    description: "Focus on your notes without distractions.",
  },
  {
    href: "/dashboard/recent",
    icon: Clock,
    title: "Recent Notes",
    description: "Jump back into what you were reading.",
  },
];

// ---------------------------------------------------------------------------
// ActionCard
// ---------------------------------------------------------------------------

interface ActionCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

function ActionCard({
  href,
  icon,
  title,
  description,
  badge,
}: ActionCardProps) {
  return (
    <motion.div variants={fadeUp}>
      <Link
        href={href}
        className="group relative flex flex-col p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:bg-secondary/40 hover:-translate-y-[2px] transition-all duration-200 h-full"
      >
        {/* Icon */}
        <div className="mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground">
            {icon}
          </div>
        </div>

        {/* Text */}
        <div className="flex-1">
          {badge && (
            <div className="mb-2 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                {badge}
              </span>
            </div>
          )}
          <h3 className="font-bold text-base tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Arrow */}
        <ArrowRight className="absolute right-4 top-4 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// WelcomePageClient
// ---------------------------------------------------------------------------

interface WelcomePageClientProps {
  firstName: string;
  userEmail: string;
  userName: string;
}

export function WelcomePageClient({
  firstName,
  userEmail,
  userName,
}: WelcomePageClientProps) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.identify(userEmail, { email: userEmail, name: userName });
  }, [posthog, userEmail, userName]);

  const { notes, loading } = useNotes();
  const streak = useStudyStreak();
  const greeting = useMemo(() => getGreeting(), []);
  const emailSentRef = useRef(false);

  const [subjectCount, setSubjectCount] = useState(0);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subjects")
      .then((r) => r.json())
      .then((data) => setSubjectCount(Array.isArray(data) ? data.length : 0))
      .catch((err) => console.error("Failed to fetch subjects:", err))
      .finally(() => setSubjectsLoading(false));
  }, []);

  useEffect(() => {
  // Only send once per component mount
  if (emailSentRef.current) return;
  emailSentRef.current = true;

  fetch("/api/email/welcome", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: userName, email: userEmail }),
  })
    .catch(() => {
      // Silent fail - don't block user experience
    });
}, [userEmail, userName]); 

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto px-6 pt-28 pb-16 font-outfit flex flex-col items-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Status pill */}
      <motion.div variants={fadeUp} className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/30 rounded-2xl border border-border/50">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
            {greeting}, {firstName}
          </span>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={fadeUp}
        className="text-4xl md:text-5xl font-black tracking-tight text-center mb-3"
      >
        Your vault is <span className="text-primary">ready.</span>
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        variants={fadeUp}
        className="text-muted-foreground text-base max-w-md text-center mb-8 leading-relaxed"
      >
        Everything is synced and waiting. Pick up right where you left off.
      </motion.p>

      {/* Stats row */}
      <motion.div variants={fadeUp} className="mb-10">
        <div className="inline-flex items-center gap-5 px-6 py-3 bg-secondary/30 rounded-2xl border border-border/50">
          <StatItem value={notes.length} label="Notes" loading={loading} />
          <div className="h-6 w-px bg-border" />
          <StatItem
            value={subjectCount}
            label="Subjects"
            loading={subjectsLoading}
          />
          <div className="h-6 w-px bg-border" />
          <StatItem
            value={streak !== null ? `${streak}d` : ""}
            label="Streak"
            loading={streak === null}
          />
        </div>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        variants={container}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {CARDS.map(
          ({ href, icon: Icon, title, description, badge }) => (
            <ActionCard
              key={href}
              href={href}
              icon={<Icon className="h-4 w-4" />}
              title={title}
              description={description}
              badge={badge}
            />
          ),
        )}
      </motion.div>
    </motion.div>
  );
}
