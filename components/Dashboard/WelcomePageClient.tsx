"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Layers,
  Flame,
  TrendingUp,
  BarChart3,
  Target,
  ChevronRight,
  Search,
  Bell,
  Play,
  RotateCcw,
  Check,
  GraduationCap,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface WelcomePageClientProps {
  firstName: string;
  userEmail: string;
  userName: string;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function WelcomePageClient({
  firstName,
  userEmail,
  userName,
}: WelcomePageClientProps) {
  const greeting = React.useMemo(() => getGreeting(), []);

  // Interactive Task List State (Today's Plan)
  const [tasks, setTasks] = React.useState([
    {
      id: "t1",
      title: "Review 12 flashcards due today",
      category: "Spaced Repetition",
      minutes: 15,
      completed: true,
      href: "/dashboard/flashcards",
    },
    {
      id: "t2",
      title: "Practice Memory Management questions",
      category: "Concept Gap",
      minutes: 20,
      completed: false,
      href: "/dashboard/study/quizzes",
    },
    {
      id: "t3",
      title: "AI Tutor: Virtual Memory deep-dive",
      category: "AI Session",
      minutes: 15,
      completed: false,
      href: "/dashboard/study",
    },
  ]);

  const [aiModalOpen, setAiModalOpen] = React.useState(false);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalPlannedMinutes = tasks.reduce((sum, t) => sum + t.minutes, 0);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-16 pt-2">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Study Command Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Here&apos;s what matters for your studies today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAiModalOpen(true)}
            className="rounded-xl gap-2 font-medium bg-secondary/50 hover:bg-secondary border-border"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>What should I study?</span>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-xl gap-2 font-semibold shadow-xs"
          >
            <Link href="/dashboard/study">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Session</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. The Hero: Today's Focus Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="default"
                  className="gap-1.5 rounded-lg py-0.5 px-2.5 bg-primary text-primary-foreground font-semibold"
                >
                  <Target className="w-3 h-3" />
                  TODAY&apos;S FOCUS
                </Badge>
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Exam in 12 days
                </span>
              </div>
              <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                AI Recommendation
              </Badge>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-black mt-2 text-foreground flex items-center gap-2.5">
              <span>🧠 Operating Systems: Memory Management</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              You are currently weakest in this topic (42% mastery) and your Operating Systems exam is approaching on Sep 18.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-1 pb-4">
            <div className="p-4 rounded-2xl bg-background/70 border border-border/60 max-w-xl">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-muted-foreground uppercase tracking-wider text-[10px]">
                  Concept Mastery
                </span>
                <span className="text-red-500 font-bold">42% (Needs Attention)</span>
              </div>
              <Progress value={42} className="h-2.5 bg-muted" />
              <p className="text-xs text-muted-foreground mt-2">
                💡 <strong>Recent mistake pattern:</strong> Confuses virtual addresses with physical frames in page tables.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap items-center gap-3 pt-0">
            <Button asChild className="rounded-xl font-bold gap-2">
              <Link href="/dashboard/study">
                Continue Studying
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl font-semibold">
              <Link href="/dashboard/study/quizzes">
                Take Diagnostic Quiz (8 Qs)
              </Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-xl text-xs text-muted-foreground hover:text-foreground">
              <Link href="/dashboard/courses">
                View Course Syllabus
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* 3. Middle Grid: Today's Plan & Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Today's Plan */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Today&apos;s Plan</CardTitle>
                  <CardDescription className="text-xs">
                    {completedCount} of {tasks.length} completed ({totalPlannedMinutes} min total)
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="text-[11px] font-semibold">
                {completedCount === tasks.length ? "Done for today! 🎉" : "In Progress"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-2.5 flex-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  task.completed
                    ? "bg-secondary/20 border-border/40 text-muted-foreground"
                    : "bg-card border-border hover:border-primary/40 hover:bg-secondary/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      task.completed
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/40 bg-background"
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold transition-all ${
                        task.completed ? "line-through opacity-70" : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </p>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {task.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground">
                    {task.minutes}m
                  </span>
                  <Link
                    href={task.href}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Planned by StudySync intelligence
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAiModalOpen(true)}
              className="text-xs font-semibold text-primary"
            >
              Re-optimize plan →
            </Button>
          </CardFooter>
        </Card>

        {/* Right: Upcoming Exams */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Upcoming Exams</CardTitle>
                  <CardDescription className="text-xs">
                    Goalposts driving your daily recommendation weights
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-xs font-medium">
                3 Exams
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5 flex-1">
            {/* Exam 1 */}
            <div className="p-3.5 rounded-2xl bg-card border border-border/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="font-bold text-sm text-foreground">
                    Operating Systems Midterm
                  </span>
                </div>
                <Badge variant="destructive" className="text-[10px] font-bold">
                  12 days left
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Exam Readiness</span>
                  <span className="font-semibold text-foreground">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
                <span>Date: Sep 18, 2026</span>
                <Link
                  href="/dashboard/study"
                  className="font-semibold text-primary hover:underline"
                >
                  Prepare now →
                </Link>
              </div>
            </div>

            {/* Exam 2 */}
            <div className="p-3.5 rounded-2xl bg-card border border-border/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-bold text-sm text-foreground">
                    Machine Learning Quiz 2
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">
                  26 days left
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Exam Readiness</span>
                  <span className="font-semibold text-foreground">74%</span>
                </div>
                <Progress value={74} className="h-2" />
              </div>
            </div>

            {/* Exam 3 */}
            <div className="p-3.5 rounded-2xl bg-card border border-border/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-sm text-foreground">
                    Database Systems Final
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">
                  43 days left
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Exam Readiness</span>
                  <span className="font-semibold text-foreground">81%</span>
                </div>
                <Progress value={81} className="h-2" />
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Based on concept syllabus coverage
            </span>
            <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-primary">
              <Link href="/dashboard/courses">Manage exams →</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* 4. Needs Attention (Weak Topics / Misconceptions) */}
      <Card className="border-amber-500/20 bg-amber-500/[0.02]">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">⚠️ Needs Attention</CardTitle>
                <CardDescription className="text-xs">
                  Topics where recent question attempts or reviews dipped below mastery thresholds
                </CardDescription>
              </div>
            </div>
            <Button asChild size="sm" className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white">
              <Link href="/dashboard/study/quizzes">
                Practice Weak Topics
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Topic 1 */}
            <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground">Memory Management</h4>
                  <span className="text-[11px] text-muted-foreground">Operating Systems</span>
                </div>
                <span className="text-xs font-black text-red-500">42%</span>
              </div>
              <Progress value={42} className="h-1.5 bg-muted" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Answered 8 questions recently; only 3 were correct. Common error: page offset calculations.
              </p>
              <Link
                href="/dashboard/study"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
              >
                Review concepts <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Topic 2 */}
            <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground">Process Scheduling</h4>
                  <span className="text-[11px] text-muted-foreground">Operating Systems</span>
                </div>
                <span className="text-xs font-black text-amber-500">51%</span>
              </div>
              <Progress value={51} className="h-1.5 bg-muted" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Struggled with multi-level feedback queues. 4 flashcard lapses logged this week.
              </p>
              <Link
                href="/dashboard/flashcards"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
              >
                Review cards <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Topic 3 */}
            <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground">Virtual Memory & TLB</h4>
                  <span className="text-[11px] text-muted-foreground">Operating Systems</span>
                </div>
                <span className="text-xs font-black text-amber-500">58%</span>
              </div>
              <Progress value={58} className="h-1.5 bg-muted" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Misconception detected: Confusing TLB hit ratio with cache hit ratio.
              </p>
              <Link
                href="/dashboard/study"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
              >
                Ask AI Tutor <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Continue Learning (Resume Study) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h3 className="text-base font-bold text-foreground">Continue Learning</h3>
          </div>
          <Link
            href="/dashboard/courses"
            className="text-xs font-semibold text-primary hover:underline"
          >
            All Courses →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:border-primary/40 hover:shadow-xs transition-all cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px]">Course CS 301</Badge>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
              <CardTitle className="text-base font-bold mt-1">Operating Systems</CardTitle>
              <CardDescription className="text-xs">
                Unit 3: Memory Management & Paging
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Unit Progress</span>
                  <span className="font-semibold text-foreground">67%</span>
                </div>
                <Progress value={67} className="h-1.5" />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild size="sm" variant="secondary" className="w-full text-xs font-bold rounded-xl gap-1.5">
                <Link href="/dashboard/study">
                  <Play className="w-3 h-3 fill-current" /> Resume Lecture
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:border-primary/40 hover:shadow-xs transition-all cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px]">Course CS 482</Badge>
                <span className="text-xs text-muted-foreground">Yesterday</span>
              </div>
              <CardTitle className="text-base font-bold mt-1">Machine Learning</CardTitle>
              <CardDescription className="text-xs">
                Lecture 4: Gradient Descent & Loss Functions
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Unit Progress</span>
                  <span className="font-semibold text-foreground">45%</span>
                </div>
                <Progress value={45} className="h-1.5" />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild size="sm" variant="secondary" className="w-full text-xs font-bold rounded-xl gap-1.5">
                <Link href="/dashboard/study">
                  <Play className="w-3 h-3 fill-current" /> Resume Quiz
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:border-primary/40 hover:shadow-xs transition-all cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px]">Course CS 241</Badge>
                <span className="text-xs text-muted-foreground">3d ago</span>
              </div>
              <CardTitle className="text-base font-bold mt-1">Computer Networks</CardTitle>
              <CardDescription className="text-xs">
                Unit 2: Transport Layer & TCP Handshake
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Unit Progress</span>
                  <span className="font-semibold text-foreground">85%</span>
                </div>
                <Progress value={85} className="h-1.5" />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild size="sm" variant="secondary" className="w-full text-xs font-bold rounded-xl gap-1.5">
                <Link href="/dashboard/study">
                  <Play className="w-3 h-3 fill-current" /> Resume Notes
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* 6. Bottom Split Grid: Spaced Repetition Due & Progress Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Spaced Repetition (Due for Review) */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Spaced Repetition Review</CardTitle>
                  <CardDescription className="text-xs">
                    FSRS memory retention queue
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold">
                24 Cards Due
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 flex-1">
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-foreground">24 Cards</p>
                <span className="text-xs text-muted-foreground">Across 3 concepts</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">~12 min</p>
                <span className="text-xs text-muted-foreground">Est. completion</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Binary Search & Tree Rotations</span>
                <span className="font-semibold text-foreground">8 cards</span>
              </div>
              <div className="flex justify-between">
                <span>TCP Slow Start & Congestion</span>
                <span className="font-semibold text-foreground">10 cards</span>
              </div>
              <div className="flex justify-between">
                <span>Gradient Descent Optimizers</span>
                <span className="font-semibold text-foreground">6 cards</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/40">
            <Button asChild className="w-full rounded-xl font-bold gap-2">
              <Link href="/dashboard/flashcards">
                <RotateCcw className="w-4 h-4" />
                Start Review Session
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Right: Progress Snapshot */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Your Progress</CardTitle>
                  <CardDescription className="text-xs">
                    Weekly student model snapshot
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                <Flame className="w-4 h-4 fill-current" />
                7-day streak
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/50">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Time Studied
                </span>
                <p className="text-xl font-black text-foreground mt-1">4.2 hrs</p>
                <span className="text-[10px] text-emerald-600 font-bold">+0.8h vs last week</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/50">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Mastery Gain
                </span>
                <p className="text-xl font-black text-foreground mt-1">+12%</p>
                <span className="text-[10px] text-emerald-600 font-bold">76% overall mastery</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/50">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Quiz Accuracy
                </span>
                <p className="text-xl font-black text-foreground mt-1">82%</p>
                <span className="text-[10px] text-muted-foreground">34 questions answered</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/50">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Cards Reviewed
                </span>
                <p className="text-xl font-black text-foreground mt-1">118</p>
                <span className="text-[10px] text-emerald-600 font-bold">91% retention rate</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/40">
            <Button asChild variant="outline" className="w-full rounded-xl font-bold gap-2">
              <Link href="/dashboard/progress">
                <TrendingUp className="w-4 h-4" />
                View Detailed Progress
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* 7. AI "What should I study right now?" Modal */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-bold">
              Personalized Study Recommendation
            </DialogTitle>
            <DialogDescription className="text-sm">
              StudySync analyzed your upcoming exams, FSRS memory decay, and recent quiz mistakes.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-3 my-2">
            <p className="text-sm font-bold text-foreground">
              Suggested 35-Minute Power Session:
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="font-bold text-foreground">1.</span>
                <span>
                  <strong>Review 6 flashcards</strong> on Process Scheduling (10 min)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-foreground">2.</span>
                <span>
                  <strong>Practice 8 questions</strong> on Memory Management (15 min)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-foreground">3.</span>
                <span>
                  <strong>Quick recap</strong> on Page Replacement algorithms (10 min)
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
              🎯 <strong>Why this?</strong> Addresses your lowest mastery topic (42%) where an exam is in 12 days.
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setAiModalOpen(false)}
              className="rounded-xl font-medium"
            >
              Maybe Later
            </Button>
            <Button
              asChild
              className="rounded-xl font-bold gap-2"
              onClick={() => setAiModalOpen(false)}
            >
              <Link href="/dashboard/study">
                Start This Session
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
