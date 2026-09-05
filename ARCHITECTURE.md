# Next.js Project Architecture & Coding Conventions

This document defines the architectural and coding conventions that should be followed throughout this project. These conventions are intended to keep the codebase **readable, traceable, performant, and easy to maintain** as the application grows.

The goal is to avoid large page files containing hundreds of lines of code and instead build pages from small, focused, composable components.

---

## 1. Prefer Server Components by Default

All pages and components that can be server-rendered **must remain Server Components**.

Do not add `"use client"` unless the component genuinely requires client-side functionality.

A component should only become a Client Component when it requires things such as:

* React state (`useState`)
* React effects (`useEffect`)
* Event handlers requiring client-side execution
* Browser APIs
* Client-side interactions
* Client-only libraries
* Other functionality that cannot execute on the server

### Rule

> **Server by default. Client only when necessary.**

Avoid making an entire page a Client Component simply because one small section requires interactivity.

### Bad

```tsx
"use client"

export default function DashboardPage() {
  // Everything becomes a client component
  // even though most of the page could be server-rendered.
}
```

### Good

```tsx
export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <main>
      <DashboardHeader />
      <UpcomingExams exams={data.exams} />
      <AISuggestion data={data.suggestion} />
    </main>
  )
}
```

Only the components that actually require interactivity should use `"use client"`.

---

# 2. Keep Pages Thin and Composed

Page files should primarily be responsible for **composition and orchestration**, not implementing the entire UI.

A page should be easy to read and understand at a glance.

For example:

```tsx
export default async function DashboardPage() {
  const dashboard = await getDashboardData()

  return (
    <DashboardLayout>
      <DashboardHeader user={dashboard.user} />

      <DashboardOverview
        stats={dashboard.stats}
        exams={dashboard.upcomingExams}
      />

      <AISuggestion suggestion={dashboard.suggestion} />

      <RecentActivity activities={dashboard.activities} />
    </DashboardLayout>
  )
}
```

The page should tell us **what the page consists of**, rather than containing hundreds of lines implementing every detail.

---

# 3. Break Large Pages Into Focused Components

Avoid large page files such as:

```text
WelcomePageClient.tsx   // 700+ lines
```

Instead, identify logical sections of the page and extract them into focused components.

For example:

```text
app/
├── dashboard/
│   └── page.tsx
│
components/
└── dashboard/
    ├── dashboard-header.tsx
    ├── dashboard-overview.tsx
    ├── ai-suggestion.tsx
    ├── upcoming-exam-card.tsx
    ├── upcoming-exams.tsx
    ├── recent-activity.tsx
    └── dashboard-stats.tsx
```

Each component should have **one clear responsibility**.

For example:

```text
ai-suggestion.tsx
```

should primarily be responsible for rendering the AI suggestion UI.

```text
upcoming-exam-card.tsx
```

should primarily be responsible for rendering one exam card.

```text
upcoming-exams.tsx
```

should primarily be responsible for rendering the collection/list of upcoming exams.

---

# 4. Organize Components by Feature

Components should be organized around the feature/page they belong to rather than putting every component into one massive global components directory.

For example:

```text
components/
├── dashboard/
│   ├── ai-suggestion.tsx
│   ├── upcoming-exam-card.tsx
│   ├── upcoming-exams.tsx
│   └── dashboard-stats.tsx
│
├── exams/
│   ├── exam-card.tsx
│   ├── exam-list.tsx
│   └── exam-filters.tsx
│
├── profile/
│   ├── profile-header.tsx
│   └── profile-form.tsx
│
└── shared/
    ├── empty-state.tsx
    ├── loading-state.tsx
    └── error-state.tsx
```

Use `shared/` only for components that are genuinely reusable across multiple features.

Do not put feature-specific components into `shared/` simply for convenience.

---

# 5. Use Composition to Make Code Traceable

The project should follow a **composed component architecture**.

When looking at a page, a developer should be able to trace the UI from the page down through its components.

For example:

```text
/dashboard
    ↓
app/dashboard/page.tsx
    ↓
DashboardLayout
    ↓
DashboardHeader
DashboardOverview
    ↓
DashboardStats
UpcomingExams
    ↓
UpcomingExamCard
AISuggestion
RecentActivity
```

This makes it easy to answer:

* Where does this UI come from?
* Which component owns this behavior?
* Where should I make this change?
* Is this component reusable?
* Does this section require client-side JavaScript?

Avoid deeply nested, unnecessarily abstract component trees, but prefer clear composition over giant monolithic components.

---

# 6. Use Direct Server-Side Database Fetching Where Possible

When a page can obtain its data directly on the server, **fetch the data on the server instead of unnecessarily going through a client-side API request**.

For example:

```tsx
export default async function DashboardPage() {
  const exams = await db.exam.findMany({
    where: {
      // ...
    },
  })

  return <UpcomingExams exams={exams} />
}
```

Prefer:

```text
Server Component
      ↓
Database
      ↓
Server Component
      ↓
UI
```

over unnecessarily doing:

```text
Server Component
      ↓
Client Component
      ↓
fetch("/api/exams")
      ↓
API Route
      ↓
Database
      ↓
Client Component
```

when there is no architectural reason for the API route.

The goal is to reduce unnecessary network hops, client-side JavaScript, loading states, and duplicated data-fetching logic.

---

# 7. Keep Database Access on the Server

Database access should remain server-side.

Do not expose database clients, credentials, or server-only database logic to Client Components.

Create reusable server-side data-access functions when appropriate.

For example:

```text
lib/
└── data/
    ├── dashboard.ts
    ├── exams.ts
    └── users.ts
```

Example:

```tsx
// lib/data/dashboard.ts

export async function getDashboardData(userId: string) {
  // database queries
}
```

Then:

```tsx
// app/dashboard/page.tsx

export default async function DashboardPage() {
  const dashboard = await getDashboardData(userId)

  return <DashboardOverview data={dashboard} />
}
```

This keeps database logic separate from UI composition.

---

# 8. Client Components Should Be Leaf Components Where Possible

When interactivity is required, push the Client Component boundary as far down the component tree as reasonably possible.

For example:

```text
DashboardPage (Server)
│
├── DashboardHeader (Server)
├── DashboardStats (Server)
├── UpcomingExams (Server)
│   └── UpcomingExamCard (Server)
│
└── ExamFilter (Client)
```

Do not turn `DashboardPage` into a Client Component simply because `ExamFilter` needs state.

Instead:

```tsx
export default async function DashboardPage() {
  const exams = await getExams()

  return (
    <>
      <DashboardHeader />
      <ExamFilter exams={exams} />
    </>
  )
}
```

The client boundary should exist only where it provides value.

---

# 9. Avoid "Client Wrapper" Components

Do not create a Client Component that wraps an entire page merely to allow one child component to be interactive.

Avoid patterns such as:

```text
Page
└── ClientPage
    ├── Header
    ├── Stats
    ├── Exams
    ├── Activity
    └── InteractiveButton
```

if only `InteractiveButton` needs client-side behavior.

Instead:

```text
Page (Server)
├── Header (Server)
├── Stats (Server)
├── Exams (Server)
└── InteractiveButton (Client)
```

This preserves the benefits of Server Components.

---

# 10. Separate Data, Composition, and Presentation

Where practical, maintain a clear separation between:

### Data

Responsible for retrieving information.

```text
lib/data/
```

### Page composition

Responsible for assembling the page.

```text
app/dashboard/page.tsx
```

### UI components

Responsible for displaying and interacting with the data.

```text
components/dashboard/
```

The desired flow is:

```text
Database
   ↓
Server Data Function
   ↓
Server Page
   ↓
Feature Components
   ↓
Interactive Client Components
```

---

# 11. Avoid Premature Abstraction

Do not create abstractions simply to make files smaller.

A component should be extracted when it has a meaningful responsibility, is reusable, improves readability, or creates a useful client/server boundary.

Avoid creating components such as:

```text
DashboardSectionWrapper
DashboardContentContainer
DashboardInnerLayout
DashboardDataRenderer
```

when they provide no meaningful abstraction.

The goal is **clear composition**, not maximum fragmentation.

---

# 12. Naming Conventions

Use clear, descriptive names.

### Components

Use PascalCase for component names:

```text
UpcomingExamCard
AISuggestion
DashboardStats
```

### Files

Use kebab-case:

```text
upcoming-exam-card.tsx
ai-suggestion.tsx
dashboard-stats.tsx
```

### Data functions

Use descriptive names:

```text
getDashboardData()
getUpcomingExams()
getUserProfile()
```

Names should make the responsibility obvious without requiring the developer to open the file.

---

# 13. Target Page Structure

A typical feature should follow a structure similar to:

```text
app/
└── dashboard/
    └── page.tsx

components/
└── dashboard/
    ├── dashboard-header.tsx
    ├── dashboard-overview.tsx
    ├── dashboard-stats.tsx
    ├── upcoming-exams.tsx
    ├── upcoming-exam-card.tsx
    ├── ai-suggestion.tsx
    └── recent-activity.tsx

lib/
└── data/
    └── dashboard.ts
```

The page might then be as simple as:

```tsx
export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <DashboardLayout>
      <DashboardHeader user={data.user} />
      <DashboardOverview stats={data.stats} />
      <UpcomingExams exams={data.upcomingExams} />
      <AISuggestion suggestion={data.suggestion} />
      <RecentActivity activities={data.activities} />
    </DashboardLayout>
  )
}
```

This is the level of readability we should aim for.

---

# 14. Refactoring Existing Large Pages

When encountering an existing page with hundreds of lines of code, do not simply continue adding to it.

Instead:

1. Identify the major UI sections.
2. Identify which sections are interactive.
3. Extract those sections into focused components.
4. Keep non-interactive components as Server Components.
5. Move database/data-fetching logic to server-side data functions where appropriate.
6. Keep the page responsible primarily for composition.
7. Keep Client Components as low in the component tree as possible.
8. Remove unnecessary API requests when the data can be retrieved directly on the server.
9. Ensure the final page is easy to scan and understand.

The objective is that a developer can open `page.tsx` and understand the page structure in **seconds**, without reading hundreds of lines of implementation details.

---

# 15. Coding Agent Instructions

When modifying or creating code in this project, follow these rules:

* **Do not create unnecessarily large page components.**
* **Do not add `"use client"` unless it is required.**
* **Prefer Server Components.**
* **Keep Client Components focused and as low in the component tree as possible.**
* **Compose pages from focused feature components.**
* **Organize components by feature/domain.**
* **Keep database access server-side.**
* **Prefer direct server-side database access when appropriate.**
* **Avoid unnecessary API routes for server-to-database communication.**
* **Separate data fetching from UI presentation when it improves clarity.**
* **Do not duplicate data-fetching logic across components.**
* **Do not introduce abstractions that do not improve readability or maintainability.**
* **Favor explicit, traceable composition over clever abstractions.**
* **When refactoring, preserve existing functionality and behavior.**
* **Before adding new code to a large file, consider whether it belongs in a dedicated component.**

## Primary Principle

> **Pages should compose. Components should specialize. Servers should fetch. Clients should interact.**

The resulting codebase should make it immediately obvious:

**where data comes from → where the page is composed → which component renders it → which components require client-side interactivity.**
