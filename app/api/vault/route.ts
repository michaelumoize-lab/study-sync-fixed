// app/api/vault/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes, subjects, tags, noteTags, semesters } from "@/lib/schema";
import { eq, and, isNull, desc, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/vault
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
    .where(
      and(
        eq(notes.userId, userId),
        eq(notes.status, "active"),
        isNull(notes.deletedAt),
      ),
    )
    .orderBy(desc(notes.isPinned), desc(notes.updatedAt));

  // Fetch tags for all notes
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

// POST /api/vault
export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, content, status = "active", subjectId, tagIds } = body;

  if (!title?.trim())
    return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const [note] = await db
    .insert(notes)
    .values({
      userId: session.user.id,
      title: title.trim(),
      content: content?.trim() ?? null,
      status,
      subjectId: subjectId ?? null,
    })
    .returning();

  if (tagIds?.length) {
    await db
      .insert(noteTags)
      .values(tagIds.map((tagId: string) => ({ noteId: note.id, tagId })));
  }

  return NextResponse.json(
    { ...note, subject: null, tags: [] },
    { status: 201 },
  );
}
