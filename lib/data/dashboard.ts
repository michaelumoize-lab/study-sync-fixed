// lib/data/dashboard.ts

export interface DashboardUser {
  id: string;
  name: string;
  firstName: string;
  email: string;
}

export interface TodaysFocusData {
  courseCode: string;
  courseName: string;
  conceptName: string;
  masteryScore: number;
  examDaysRemaining: number;
  rationale: string;
  errorPattern: string;
  studyHref: string;
  quizHref: string;
}

export interface DailyTask {
  id: string;
  title: string;
  category: string;
  minutes: number;
  completed: boolean;
  href: string;
}

export interface UpcomingExamData {
  id: string;
  name: string;
  courseName: string;
  examDateFormatted: string;
  daysRemaining: number;
  readinessScore: number;
  statusBadge: string;
  badgeVariant: "destructive" | "default" | "secondary" | "outline";
}

export interface NeedsAttentionTopic {
  id: string;
  conceptName: string;
  courseName: string;
  masteryScore: number;
  recentStats: string;
  commonMistake: string;
  actionHref: string;
  actionLabel: string;
}

export interface ContinueLearningItem {
  id: string;
  courseCode: string;
  courseName: string;
  unitTitle: string;
  progressPercent: number;
  lastActivityTime: string;
  resumeHref: string;
  actionLabel: string;
}

export interface SpacedReviewData {
  cardsDue: number;
  conceptsDue: number;
  estimatedMinutes: number;
  breakdown: { name: string; cardsCount: number }[];
}

export interface ProgressSnapshotData {
  streakDays: number;
  hoursStudiedThisWeek: number;
  hoursDiffNotice: string;
  masteryGainPercent: number;
  overallMasteryPercent: number;
  quizAccuracyPercent: number;
  questionsAnsweredCount: number;
  cardsReviewedCount: number;
  retentionPercent: number;
}

export interface DashboardData {
  user: DashboardUser;
  focus: TodaysFocusData;
  plan: DailyTask[];
  upcomingExams: UpcomingExamData[];
  needsAttention: NeedsAttentionTopic[];
  continueLearning: ContinueLearningItem[];
  spacedReview: SpacedReviewData;
  progressSnapshot: ProgressSnapshotData;
}

/**
 * Server-side data retrieval for the Student Study Command Center.
 * In the future, this aggregates directly from Prisma tables:
 * courses, concepts, user_concept_mastery, flashcards, exams, study_tasks.
 */
export async function getDashboardData(rawUser: {
  id?: string;
  name?: string | null;
  email?: string | null;
}): Promise<DashboardData> {
  const name = rawUser.name ?? "Student";
  const firstName = name.split(" ")[0] || "there";
  const email = rawUser.email ?? "";
  const id = rawUser.id ?? "user_default";

  return {
    user: {
      id,
      name,
      firstName,
      email,
    },
    focus: {
      courseCode: "CS 301",
      courseName: "Operating Systems",
      conceptName: "Memory Management",
      masteryScore: 42,
      examDaysRemaining: 12,
      rationale:
        "You are currently weakest in this topic (42% mastery) and your Operating Systems exam is approaching on Sep 18.",
      errorPattern:
        "Confuses virtual addresses with physical frames in multi-level page tables.",
      studyHref: "/dashboard/study",
      quizHref: "/dashboard/study/quizzes",
    },
    plan: [
      {
        id: "task-1",
        title: "Review 12 flashcards due today",
        category: "Spaced Repetition",
        minutes: 15,
        completed: true,
        href: "/dashboard/flashcards",
      },
      {
        id: "task-2",
        title: "Practice Memory Management questions",
        category: "Concept Gap",
        minutes: 20,
        completed: false,
        href: "/dashboard/study/quizzes",
      },
      {
        id: "task-3",
        title: "AI Tutor: Virtual Memory deep-dive",
        category: "AI Session",
        minutes: 15,
        completed: false,
        href: "/dashboard/study",
      },
    ],
    upcomingExams: [
      {
        id: "exam-1",
        name: "Operating Systems Midterm",
        courseName: "Operating Systems",
        examDateFormatted: "Sep 18, 2026",
        daysRemaining: 12,
        readinessScore: 68,
        statusBadge: "12 days left",
        badgeVariant: "destructive",
      },
      {
        id: "exam-2",
        name: "Machine Learning Quiz 2",
        courseName: "Machine Learning",
        examDateFormatted: "Oct 2, 2026",
        daysRemaining: 26,
        readinessScore: 74,
        statusBadge: "26 days left",
        badgeVariant: "secondary",
      },
      {
        id: "exam-3",
        name: "Database Systems Final",
        courseName: "Database Systems",
        examDateFormatted: "Oct 19, 2026",
        daysRemaining: 43,
        readinessScore: 81,
        statusBadge: "43 days left",
        badgeVariant: "outline",
      },
    ],
    needsAttention: [
      {
        id: "na-1",
        conceptName: "Memory Management",
        courseName: "Operating Systems",
        masteryScore: 42,
        recentStats: "Answered 8 questions recently; only 3 were correct.",
        commonMistake: "Page offset and virtual-to-physical translation errors.",
        actionHref: "/dashboard/study",
        actionLabel: "Review concepts",
      },
      {
        id: "na-2",
        conceptName: "Process Scheduling",
        courseName: "Operating Systems",
        masteryScore: 51,
        recentStats: "4 flashcard lapses logged this week.",
        commonMistake: "Struggling with multi-level feedback queue priorities.",
        actionHref: "/dashboard/flashcards",
        actionLabel: "Review cards",
      },
      {
        id: "na-3",
        conceptName: "Virtual Memory & TLB",
        courseName: "Operating Systems",
        masteryScore: 58,
        recentStats: "Detected misconception in practice attempts.",
        commonMistake: "Confusing TLB hit ratio with CPU L1 cache hit ratio.",
        actionHref: "/dashboard/study",
        actionLabel: "Ask AI Tutor",
      },
    ],
    continueLearning: [
      {
        id: "cl-1",
        courseCode: "CS 301",
        courseName: "Operating Systems",
        unitTitle: "Unit 3: Memory Management & Paging",
        progressPercent: 67,
        lastActivityTime: "2h ago",
        resumeHref: "/dashboard/study",
        actionLabel: "Resume Lecture",
      },
      {
        id: "cl-2",
        courseCode: "CS 482",
        courseName: "Machine Learning",
        unitTitle: "Lecture 4: Gradient Descent & Loss Functions",
        progressPercent: 45,
        lastActivityTime: "Yesterday",
        resumeHref: "/dashboard/study",
        actionLabel: "Resume Quiz",
      },
      {
        id: "cl-3",
        courseCode: "CS 241",
        courseName: "Computer Networks",
        unitTitle: "Unit 2: Transport Layer & TCP Handshake",
        progressPercent: 85,
        lastActivityTime: "3d ago",
        resumeHref: "/dashboard/study",
        actionLabel: "Resume Notes",
      },
    ],
    spacedReview: {
      cardsDue: 24,
      conceptsDue: 3,
      estimatedMinutes: 12,
      breakdown: [
        { name: "Binary Search & Tree Rotations", cardsCount: 8 },
        { name: "TCP Slow Start & Congestion", cardsCount: 10 },
        { name: "Gradient Descent Optimizers", cardsCount: 6 },
      ],
    },
    progressSnapshot: {
      streakDays: 7,
      hoursStudiedThisWeek: 4.2,
      hoursDiffNotice: "+0.8h vs last week",
      masteryGainPercent: 12,
      overallMasteryPercent: 76,
      quizAccuracyPercent: 82,
      questionsAnsweredCount: 34,
      cardsReviewedCount: 118,
      retentionPercent: 91,
    },
  };
}
