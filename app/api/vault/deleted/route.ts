// app/api/vault/deleted/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes, subjects, tags, noteTags, semesters } from "@/lib/schema";
import { eq, and, isNotNull, inArray, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/vault/deleted — fetch soft-deleted notes
export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const rawNotes = await db
    .select({
      id: notes.id,
      userId: notes.userId,
      title: notes.title,
      content: notes.content,
      status: notes.status,
      isPinned: notes.isPinned,
      subjectId: notes.subjectId,
      semesterId: notes.semesterId,
      deletedAt: notes.deletedAt,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
      subjectName: subjects.name,
      subjectColor: subjects.color,
      semesterName: semesters.name,
    })
    .from(notes)
    .leftJoin(subjects, eq(notes.subjectId, subjects.id))
    .leftJoin(semesters, eq(notes.semesterId, semesters.id))
    .where(and(eq(notes.userId, userId), isNotNull(notes.deletedAt)))
    .orderBy(desc(notes.deletedAt));

  const noteIds = rawNotes.map((n) => n.id);
  let tagsByNote: Record<
    string,
    { id: string; name: string; color: string | null }[]
  > = {};

  if (noteIds.length > 0) {
    const tagRows = await db
      .select({
        noteId: noteTags.noteId,
        tagId: tags.id,
        tagName: tags.name,
        tagColor: tags.color,
      })
      .from(noteTags)
      .innerJoin(tags, eq(noteTags.tagId, tags.id))
      .where(inArray(noteTags.noteId, noteIds));

    tagsByNote = tagRows.reduce<
      Record<string, { id: string; name: string; color: string | null }[]>
    >((acc, row) => {
      if (!acc[row.noteId]) acc[row.noteId] = [];
      acc[row.noteId].push({
        id: row.tagId,
        name: row.tagName,
        color: row.tagColor,
      });
      return acc;
    }, {});
  }

  const result = rawNotes.map((n) => ({
    ...n,
    subject: n.subjectId
      ? {
          id: n.subjectId,
          name: n.subjectName ?? "",
          color: n.subjectColor ?? null,
        }
      : null,
    semester: n.semesterId
      ? { id: n.semesterId, name: n.semesterName ?? "" }
      : null,
    tags: tagsByNote[n.id] ?? [],
  }));

  return NextResponse.json(result);
}
