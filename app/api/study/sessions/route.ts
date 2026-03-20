// app/api/study/sessions/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { studySessions, studyMessages, notes } from "@/lib/schema";
import { eq, desc, count } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    .where(eq(studySessions.userId, session.user.id))
    .groupBy(studySessions.id, notes.title)
    .orderBy(desc(studySessions.updatedAt))
    .limit(30);

  return NextResponse.json(sessions);
}