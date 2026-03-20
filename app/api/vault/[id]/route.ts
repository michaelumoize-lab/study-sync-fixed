// app/api/vault/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes, noteTags, subjects, semesters, tags } from "@/lib/schema";
import { eq, and, inArray } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/vault/[id]
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [note] = await db
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
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)));

  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const tagRows = await db
    .select({ tagId: tags.id, tagName: tags.name, tagColor: tags.color })
    .from(noteTags)
    .innerJoin(tags, eq(noteTags.tagId, tags.id))
    .where(eq(noteTags.noteId, id));

  return NextResponse.json({
    ...note,
    subject: note.subjectId
      ? {
          id: note.subjectId,
          name: note.subjectName ?? "",
          color: note.subjectColor ?? null,
        }
      : null,
    semester: note.semesterId
      ? { id: note.semesterId, name: note.semesterName ?? "" }
      : null,
    tags: tagRows.map((t) => ({
      id: t.tagId,
      name: t.tagName,
      color: t.tagColor,
    })),
  });
}

// PUT /api/vault/[id]
export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, content, status, isPinned, subjectId, tagIds } = body;

  const [updated] = await db
    .update(notes)
    .set({
      ...(title !== undefined && { title: title.trim() }),
      ...(content !== undefined && { content }),
      ...(status !== undefined && { status }),
      ...(isPinned !== undefined && { isPinned }),
      ...(subjectId !== undefined && { subjectId }),
      updatedAt: new Date(),
    })
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)))
    .returning();

  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (tagIds !== undefined) {
    await db.delete(noteTags).where(eq(noteTags.noteId, id));
    if (tagIds.length) {
      await db
        .insert(noteTags)
        .values(tagIds.map((tagId: string) => ({ noteId: id, tagId })));
    }
  }

  return NextResponse.json(updated);
}

// DELETE /api/vault/[id] — soft delete
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db
    .update(notes)
    .set({ status: "deleted", deletedAt: new Date() })
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)));

  return NextResponse.json({ success: true });
}
