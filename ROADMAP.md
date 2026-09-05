# StudySync Major Upgrade Roadmap & Architecture Plan

> **Core Vision: "StudySync Knows You"**  
> *Your courses → material → concepts → questions → mistakes → mastery → schedule → exams all feed into one unified student model.*

---

## Table of Contents
1. [Audit & Technical Debt Backlog](#1-audit--technical-debt-backlog)
2. [The Central Architecture: The Unified Student Model](#2-the-central-architecture-the-unified-student-model)
3. [The 3-Phase, 7-Pillar Roadmap](#3-the-3-phase-7-pillar-roadmap)
   - [Phase 1 — Foundation: Knowledge Vault & Grounded AI Tutor](#phase-1--foundation)
   - [Phase 2 — Learning Engine: Concepts, Adaptive Quizzes & Spaced Repetition](#phase-2--learning-engine)
   - [Phase 3 — Intelligence: AI Study Planner & Exam Readiness](#phase-3--intelligence)
4. [Target Database Schema (Drizzle ORM + pgvector)](#4-target-database-schema-drizzle-orm--pgvector)
5. [Code Quality & Performance Standards](#5-code-quality--performance-standards)
6. [Actionable Implementation Checklist](#6-actionable-implementation-checklist)

---

## 1. Audit & Technical Debt Backlog

Before and alongside building new features, the following foundational issues in the existing codebase must be resolved:

### 1.1 Dual ORM & Connection Pool Conflict
- **Current State:** Both Prisma (`@prisma/client`, `@prisma/adapter-neon`) and Drizzle (`drizzle-orm`, `@neondatabase/serverless`) are running simultaneously.
  - Better Auth uses Prisma via `prismaAdapter(prisma)` targeting `prisma/schema.prisma` with `model User { id: String }`.
  - Application entities (notes, flashcards, subjects) use Drizzle targeting `lib/schema.ts`, referencing `neonAuth.table("user", { id: uuid("id") })`.
- **Issues:**
  - Double connection pool overhead and increased serverless cold-start latency.
  - Potential ID type mismatch (`String` vs `UUID`) leading to foreign key breakage.
  - Redundant dependencies bloating bundle size.
- **Action:** Standardize on **Drizzle ORM** entirely:
  - Migrate Better Auth to `@better-auth/drizzle-adapter` using `lib/db.ts`.
  - Deprecate and remove Prisma dependencies and config files (`prisma/`, `prisma.config.ts`).

### 1.2 PDF Ingestion & Prompt Artifact
- **Current State:**
  - `lib/pdf-client.ts` parses PDFs in the browser, flattening all text into a single un-chunked string with no page number preservation.
  - `app/api/upload/pdf/route.ts` runs a 30s synchronous call to Groq (`llama-3.3-70b-versatile`) with a 4,096 token limit, causing timeouts on large files.
  - Lines 132–135 of `app/api/upload/pdf/route.ts` contain an inherited system prompt artifact referencing "prayers" ("Add a blank line between every section and prayer", "Each prayer title should be a `<h2>` or `<h3>`").
- **Action:**
  - Clean up the system prompt to focus strictly on academic lecture note extraction and outline formatting.
  - Preserve page numbers and boundaries during extraction (`pageIndex`, `content`).
  - Move document processing to a reliable async pipeline or chunked streaming endpoint.

### 1.3 Flashcards Missing True Spaced Repetition
- **Current State:**
  - `flashcards.nextReviewAt` exists in the schema, but is not used algorithmically.
  - Reviewing a card simply toggles `status = "mastered"` on right swipe or `status = "learning"` on left swipe.
  - No interval scheduling, no memory stability calculation, and no "Cards due today" filtering.
- **Action:** Integrate the modern **FSRS (Free Spaced Repetition Scheduler)** or SM-2 algorithm to dynamically calculate `interval`, `stability`, `difficulty`, and `due_date`.

### 1.4 Monolithic Client Components & Missing Data Cache
- **Current State:**
  - Core pages exist as 800–900+ line monoliths (`components/Flashcards/FlashcardsClient.tsx`, `components/Study/StudyClient.tsx`, `components/Schedule/ScheduleClient.tsx`, `components/FocusMode/FocusModeClient.tsx`).
  - `@tanstack/react-query` is installed in `package.json` but only used by Better Auth UI components; main business logic uses raw `fetch()`, `useState`, and `useEffect`.
- **Action:**
  - Refactor data fetching to custom TanStack Query hooks (`useDecks()`, `useDueReviews()`, `useNotes()`, `useStudySession()`).
  - Split giant client files into dedicated UI subcomponents and custom hook controllers.

### 1.5 Brute-Force Context in AI Tutor
- **Current State:**
  - `app/api/study/chat/route.ts` takes an entire note, strips HTML tags, and prepends it to the system prompt.
  - Context window blows up for long documents, multi-document retrieval is impossible, and there are no source citations.
- **Action:** Transition to a RAG pipeline utilizing `pgvector` on Neon with semantic retrieval and inline citation generation.

---

## 2. The Central Architecture: The Unified Student Model

The core differentiator of StudySync is that data is not siloed:

```
                  ┌─────────────────────────────────┐
                  │          Course / Vault         │
                  │  (PDFs, Slides, YouTube, Notes) │
                  └────────────────┬────────────────┘
                                   │ Chunks & Extracts
                                   ▼
                  ┌─────────────────────────────────┐
                  │         Concept Graph           │
                  │   (Atomic units of knowledge)   │
                  └───────┬───────────────┬─────────┘
                          │               │
           Generates for  │               │ Feeds into
                          ▼               ▼
      ┌───────────────────────┐       ┌────────────────────────┐
      │  Flashcards & Quizzes │       │   AI Grounded Tutor    │
      └───────────┬───────────┘       └───────────┬────────────┘
                  │                               │
                  │ Interaction Data              │ Identified
                  │ (Pass/Fail, Time, Error Type) │ Misconceptions
                  ▼                               ▼
      ┌────────────────────────────────────────────────────────┐
      │                  STUDENT MODEL STATE                   │
      │   - Concept Mastery Score: P(L_k) [0.0 - 1.0]          │
      │   - Memory Retention Curve & Stability (FSRS)          │
      │   - Active Misconceptions & Weak Spots                 │
      └───────────┬───────────────────────────────┬────────────┘
                  │ Drives                        │ Predicts
                  ▼                               ▼
      ┌───────────────────────┐       ┌────────────────────────┐
      │  AI Daily Study Plan  │       │     Exam Readiness     │
      │ "What to study today" │       │  & Diagnostic Mocks    │
      └───────────────────────┘       └────────────────────────┘
```

---

## 3. The 3-Phase, 7-Pillar Roadmap

```
Phase 1 — Foundation       Phase 2 — Learning Engine    Phase 3 — Intelligence
┌─────────────────────┐    ┌────────────────────────┐   ┌─────────────────────┐
│ 1. Knowledge Vault  │    │ 3. Concept Mastery     │   │ 6. AI Study Planner │
│ 2. Grounded AI Tutor│    │ 4. Adaptive Quizzes    │   │ 7. Exam Readiness   │
│    (with Citations) │    │ 5. Spaced Repetition   │   │    & Mock Exams     │
└─────────────────────┘    └────────────────────────┘   └─────────────────────┘
```

---

### Phase 1 — Foundation

#### Pillar 1: Course & Knowledge Vault
* **Goal:** A single repository for all study materials per course, supporting diverse source formats.
* **Key Features:**
  - **Hierarchical Structure:** Semester $\rightarrow$ Course $\rightarrow$ Module/Topic $\rightarrow$ Resources.
  - **Multi-Source Ingestion:**
    - **PDFs & Presentations:** Extracted with page indexes retained.
    - **YouTube Video Lectures:** Extracted transcripts with exact second timestamps (`04:32`).
    - **Audio/Lecture Recordings:** Speech-to-text transcript processing.
    - **Rich Notes & Markdown:** Native Tiptap editor notes.
  - **Vector Embedding Pipeline:**
    - Enable `pgvector` on Neon PostgreSQL.
    - Segment documents into semantic chunks (500–1,000 characters) with metadata (`resourceId`, `pageNumber`, `timestamp`, `chunkIndex`).
    - Compute embeddings via cost-efficient models (e.g., OpenAI `text-embedding-3-small`).

#### Pillar 2: Source-Grounded AI Tutor (with Citations)
* **Goal:** Chat with full course materials without hallucinations, backed by verifiable citations.
* **Key Features:**
  - **Hybrid Search Engine:** Combines `pgvector` cosine similarity with PostgreSQL full-text search (`tsvector` / `tsquery`) for precise keyword matching.
  - **Scope Selection:** Allow the student to scope chat to:
    - *Entire Course* (all syllabus materials)
    - *Specific Resource* (a single slide deck or lecture)
    - *Specific Concept*
  - **Verifiable Citations:**
    - AI outputs structured citation tokens, e.g., `[cite:res_id:p14]` or `[cite:res_id:08:45]`.
    - Client renders citations as interactive chips: clicking `[Slide 14]` or `[Page 22]` opens a drawer displaying the source page and highlights the referenced passage.

---

### Phase 2 — Learning Engine

#### Pillar 3: Concept Mastery & Knowledge Graph
* **Goal:** Understand exactly what the student understands and where misconceptions exist.
* **Key Features:**
  - **Concept Extraction:** Automatic extraction of key concepts and prerequisite relationships from course documents.
  - **Mastery Scoring Model:** Bayesian Knowledge Tracing (BKT) or decay-weighted accuracy:
    - $P(L_k)$: Probability that the student has mastered Concept $k$ ($0.0 \rightarrow 1.0$).
    - Updates dynamically after every quiz attempt, flashcard review, and tutor query.
  - **Mastery Visualizer:** Interactive concept map/matrix showing:
    - 🟢 Mastered ($>85\%$)
    - 🟡 In Progress ($50\% - 85\%$)
    - 🔴 Critical Weak Spot ($<50\%$)

#### Pillar 4: Adaptive Quizzes
* **Goal:** Questions that dynamically adjust difficulty to match the student's Zone of Proximal Development.
* **Key Features:**
  - **Dynamic Item Selection:**
    - High mastery $\rightarrow$ High-order synthesis, tricky edge cases, and application questions.
    - Struggling $\rightarrow$ Foundational checks and step-by-step diagnostic questions.
  - **Error Taxonomy:** Every wrong answer prompts diagnostic categorization:
    - *Conceptual Misunderstanding*
    - *Calculation / Logic Mistake*
    - *Misread Question*
    - *Recall Failure*
  - **Automated Remediation:** Immediate explanation with deep-link back to the exact vault chunk where the concept is taught.

#### Pillar 5: Spaced Repetition Engine (FSRS)
* **Goal:** Automatic memory retention scheduling so students review material right before they forget it.
* **Key Features:**
  - **FSRS Algorithm Integration:** Superior to SM-2, tracking:
    - Stability ($S$), Difficulty ($D$), Retrievability ($R$), and Repetition count.
  - **Card States:** `New` $\rightarrow$ `Learning` $\rightarrow$ `Review` $\rightarrow$ `Relearning`.
  - **Global Review Queue:** "Today's Reviews" widget displaying all due cards across all courses in one unified session.

---

### Phase 3 — Intelligence

#### Pillar 6: AI Study Planner ("What should I study today?")
* **Goal:** Eliminate decision fatigue with an automated, optimized daily study schedule.
* **Key Features:**
  - **Optimization Inputs:**
    1. Memory decay: Spaced repetition cards due today (highest priority).
    2. Exam dates: Proximity and weighting of upcoming exams.
    3. Mastery gaps: Concepts with low mastery scores in high-credit courses.
    4. Available study time: Student's declared study budget for the day.
  - **Actionable Daily Plan:**
    - Generates 25–50 min structured blocks (e.g., *"15 min Spaced Repetition Review"*, *"40 min Deep Dive: Meiosis Gap Remediation"*, *"20 min Adaptive Quiz"*).
    - Integrates with the existing `FocusMode` and Pomodoro timer.

#### Pillar 7: Exam Readiness & Diagnostic Mock Exams ("Am I ready?")
* **Goal:** Predict test performance and run simulated exams under realistic conditions.
* **Key Features:**
  - **Readiness Index (0–100%):**
    - Weighted aggregate of syllabus coverage, concept mastery, and retention stability.
    - Status indicator: *Not Ready*, *Borderline*, *Exam Ready*.
  - **Full-Length Mock Exams:**
    - Timed, distraction-free environment.
    - Balanced distribution of questions across the course syllabus.
  - **Post-Exam Gap Analysis Report:**
    - Detailed breakdown: *"You scored 74%. You will score 88%+ if you fix these 3 concepts before Friday."*

---

## 4. Target Database Schema (Drizzle ORM + pgvector)

```ts
// ===========================================================================
// Core Hierarchy: Courses & Knowledge Vault
// ===========================================================================

export const courses = pgTable("courses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  semesterId: text("semester_id").references(() => semesters.id, { onDelete: "set null" }),
  code: text("code"), // e.g. "CS101", "BIO204"
  name: text("name").notNull(),
  description: text("description"),
  color: text("color"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const resources = pgTable("resources", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'pdf' | 'slides' | 'youtube' | 'audio' | 'note'
  sourceUrl: text("source_url"),
  storageKey: text("storage_key"),
  metadata: jsonb("metadata"), // e.g. pageCount, durationSeconds, videoId
  status: text("status").default("ready").notNull(), // 'processing' | 'ready' | 'failed'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const documentChunks = pgTable("document_chunks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  resourceId: text("resource_id").notNull().references(() => resources.id, { onDelete: "cascade" }),
  chunkIndex: integer("chunk_index").notNull(),
  content: text("content").notNull(),
  pageNumber: integer("page_number"),
  timestampSeconds: integer("timestamp_seconds"),
  embedding: vector("embedding", { dimensions: 1536 }), // pgvector
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index("doc_chunks_resource_idx").on(t.resourceId),
  index("doc_chunks_embedding_idx").using("hnsw", t.embedding.op("vector_cosine_ops")),
]);

// ===========================================================================
// Concept Graph & Student Mastery Model
// ===========================================================================

export const concepts = pgTable("concepts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  parentConceptId: text("parent_concept_id"), // hierarchical ontology
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userConceptMastery = pgTable("user_concept_mastery", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  conceptId: text("concept_id").notNull().references(() => concepts.id, { onDelete: "cascade" }),
  masteryScore: real("mastery_score").default(0).notNull(), // 0.00 to 1.00
  confidenceInterval: real("confidence_interval").default(0.5).notNull(),
  totalAttempts: integer("total_attempts").default(0).notNull(),
  correctAttempts: integer("correct_attempts").default(0).notNull(),
  lastAssessedAt: timestamp("last_assessed_at", { withTimezone: true }),
  misconceptions: jsonb("misconceptions").default([]),
}, (t) => [
  uniqueIndex("user_concept_unique_idx").on(t.userId, t.conceptId),
]);

// ===========================================================================
// Spaced Repetition (FSRS) & Flashcards
// ===========================================================================

export const flashcards = pgTable("flashcards", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  deckId: text("deck_id").notNull().references(() => flashcardDecks.id, { onDelete: "cascade" }),
  conceptId: text("concept_id").references(() => concepts.id, { onDelete: "set null" }),
  front: text("front").notNull(),
  back: text("back").notNull(),
  
  // FSRS state
  fsrsState: text("fsrs_state").default("new").notNull(), // 'new' | 'learning' | 'review' | 'relearning'
  stability: real("stability").default(0).notNull(),
  difficulty: real("difficulty").default(0).notNull(),
  elapsedDays: integer("elapsed_days").default(0).notNull(),
  scheduledDays: integer("scheduled_days").default(0).notNull(),
  reps: integer("reps").default(0).notNull(),
  lapses: integer("lapses").default(0).notNull(),
  dueAt: timestamp("due_at", { withTimezone: true }).defaultNow().notNull(),
  lastReviewAt: timestamp("last_review_at", { withTimezone: true }),
}, (t) => [
  index("flashcards_due_idx").on(t.deckId, t.dueAt),
]);

// ===========================================================================
// Adaptive Quizzing & Questions
// ===========================================================================

export const questions = pgTable("questions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  conceptId: text("concept_id").notNull().references(() => concepts.id, { onDelete: "cascade" }),
  resourceId: text("resource_id").references(() => resources.id, { onDelete: "set null" }),
  questionText: text("question_text").notNull(),
  options: jsonb("options").notNull(), // [{ id: 'a', text: '...', isCorrect: true }]
  explanation: text("explanation").notNull(),
  difficultyLevel: real("difficulty_level").default(0.5).notNull(), // 0.1 (easy) to 1.0 (hard)
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  questionId: text("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  conceptId: text("concept_id").notNull().references(() => concepts.id, { onDelete: "cascade" }),
  selectedOptionId: text("selected_option_id").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeSpentMs: integer("time_spent_ms").notNull(),
  errorType: text("error_type"), // 'concept_gap' | 'calculation' | 'misread' | null
  attemptedAt: timestamp("attempted_at", { withTimezone: true }).defaultNow().notNull(),
});

// ===========================================================================
// Exams, Mock Exams & Study Planning
// ===========================================================================

export const exams = pgTable("exams", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  examDate: timestamp("exam_date", { withTimezone: true }).notNull(),
  targetScore: real("target_score"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const studyTasks = pgTable("study_tasks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  courseId: text("course_id").references(() => courses.id, { onDelete: "set null" }),
  conceptId: text("concept_id").references(() => concepts.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  taskType: text("task_type").notNull(), // 'spaced_review' | 'gap_study' | 'quiz' | 'mock_exam'
  estimatedMinutes: integer("estimated_minutes").notNull(),
  scheduledDate: timestamp("scheduled_date", { withTimezone: true }).notNull(),
  priorityScore: real("priority_score").default(1.0).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});
```

---

## 5. Code Quality & Performance Standards

1. **Strict Zod Output Schemas for AI:**
   - Eliminate fragile regex/markdown parsing. Use structured JSON responses (`response_format: { type: "json_object" }`) validated with Zod for quizzes, flashcards, and concept maps.
2. **TanStack Query Everywhere:**
   - All client data access should pass through React Query hooks with defined `staleTime`, query invalidations, and optimistic mutations.
3. **Modular Component Architecture:**
   - Restrict components to a single responsibility under 250 lines. Extract modals, study modes, and complex views into dedicated subcomponents.
4. **Resilient Rate Limiting & Background Jobs:**
   - PDF/Video chunking and vector embedding must be decoupled from the synchronous HTTP request cycle to eliminate gateway timeouts.

---

## 6. Actionable Implementation Checklist

### Step 0: Immediate Cleanup & Technical Debt
- [ ] Migrate Better Auth to Drizzle ORM (`@better-auth/drizzle-adapter`).
- [ ] Uninstall Prisma packages and delete `prisma/` folder and config.
- [ ] Fix the prayer prompt in `app/api/upload/pdf/route.ts`.
- [ ] Split `components/Flashcards/FlashcardsClient.tsx` into modular components.
- [ ] Wrap API queries with `@tanstack/react-query` hooks.

### Step 1: Foundation (Knowledge Vault & AI Tutor)
- [ ] Enable `pgvector` in Neon and apply `document_chunks` table migration.
- [ ] Implement text chunking utility with page index and timestamp tracking.
- [ ] Add support for YouTube transcript extraction.
- [ ] Build hybrid search API (`/api/tutor/search`) combining vector cosine similarity with full-text search.
- [ ] Implement citation parser in AI Tutor chat with client-side interactive source preview drawers.

### Step 2: Learning Engine (Concepts, Quizzes & Spaced Repetition)
- [ ] Implement `concepts` and `user_concept_mastery` schema tables.
- [ ] Build automatic concept extraction from course resources.
- [ ] Implement FSRS spaced repetition scheduling logic for flashcards.
- [ ] Add "Due Today" global review dashboard.
- [ ] Build Adaptive Quiz generator targeting student mastery frontiers.
- [ ] Implement quiz attempt tracking and error taxonomy diagnosis.

### Step 3: Intelligence (AI Planner & Exam Readiness)
- [ ] Implement `exams` and `study_tasks` schema tables.
- [ ] Build Exam Readiness Index algorithm based on syllabus coverage and mastery decay.
- [ ] Create Full-Length Mock Exam simulation mode with post-test Gap Analysis Reports.
- [ ] Build Daily AI Study Planner optimizing schedule by exam proximity, due reviews, and mastery gaps.
