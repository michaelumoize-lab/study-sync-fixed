// app/dashboard/study/page.tsx
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { studySessions, studyMessages, notes } from "@/lib/schema";
import { eq, desc, count, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { StudyClient } from "@/components/Study/StudyClient";

export const dynamic = "force-dynamic";

export default async function StudyPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

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
    .where(eq(notes.userId, userId))
    .orderBy(asc(notes.updatedAt))
    .limit(100);

  return <StudyClient initialSessions={sessions} userNotes={userNotes} />;
}
