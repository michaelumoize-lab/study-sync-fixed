// app/api/notes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes, noteTags, tags } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/notes/[id] — fetch single note
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [note] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)));

  if (!note)
    return NextResponse.json({ error: "Note not found" }, { status: 404 });

  return NextResponse.json(note);
}

// PUT /api/notes/[id] — update note title, content, subject, semester, tags
export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, subjectId, semesterId, status, isPinned, tagIds } =
    await req.json();

  const [updated] = await db
    .update(notes)
    .set({
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(subjectId !== undefined && { subjectId }),
      ...(semesterId !== undefined && { semesterId }),
      ...(status !== undefined && { status }),
      ...(isPinned !== undefined && { isPinned }),
      updatedAt: new Date(),
    })
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)))
    .returning();

  if (!updated)
    return NextResponse.json({ error: "Note not found" }, { status: 404 });

  // Update tags if provided
  if (Array.isArray(tagIds)) {
    await db.delete(noteTags).where(eq(noteTags.noteId, id));
    if (tagIds.length > 0) {
      await db
        .insert(noteTags)
        .values(tagIds.map((tagId: string) => ({ noteId: id, tagId })));
    }
  }

  return NextResponse.json(updated);
}

// DELETE /api/notes/[id] — soft delete
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [deleted] = await db
    .update(notes)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)))
    .returning();

  if (!deleted)
    return NextResponse.json({ error: "Note not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
