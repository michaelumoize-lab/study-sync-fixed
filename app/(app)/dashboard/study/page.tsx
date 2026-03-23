// app/dashboard/study/page.tsx
import { db } from "@/lib/db";
import { studySessions, studyMessages, notes } from "@/lib/schema";
import { eq, desc, count, asc, and } from "drizzle-orm";
import { StudyClient } from "@/components/Study/StudyClient";
import { getServerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function StudyPage() {
  const session = await getServerSession();
  const userId = session.user.id;

  // Load recent sessions
  const sessions = await db
    .select({
      id: studySessions.id,
      title: studySessions.title,
      noteId: studySessions.noteId,
      noteTitle: notes.title,
      createdAt: studySessions.createdAt,
      updatedAt: studySessions.updatedAt,
      messageCount: count(studyMessages.id),
    })
    .from(studySessions)
    .leftJoin(studyMessages, eq(studyMessages.sessionId, studySessions.id))
    .leftJoin(notes, eq(studySessions.noteId, notes.id))
    .where(eq(studySessions.userId, userId))
    .groupBy(studySessions.id, notes.title)
    .orderBy(desc(studySessions.updatedAt))
    .limit(30);

  // Load user notes for attachment picker
  const userNotes = await db
    .select({ id: notes.id, title: notes.title })
    .from(notes)
    .where(
      and(
        eq(notes.userId, userId),
        eq(notes.status, "active"), // Add this filter
      ),
    )
    .orderBy(asc(notes.updatedAt))
    .limit(100);

    return (
      <StudyClient
        initialSessions={sessions.map((s) => ({
          ...s,
          createdAt: s.createdAt.toISOString(),
          updatedAt: s.updatedAt.toISOString(),
        }))}
        userNotes={userNotes}
      />
    );
}
