// app/api/notes/[id]/draft/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content } = await req.json();

  const [updated] = await db
    .update(notes)
    .set({
      draftTitle: title,
      draftContent: content,
      hasDraft: true,
      updatedAt: new Date(),
    })
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)))
    .returning();

  if (!updated)
    return NextResponse.json({ error: "Note not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [updated] = await db
    .update(notes)
    .set({
      draftTitle: null,
      draftContent: null,
      hasDraft: false,
      updatedAt: new Date(),
    })
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)))
    .returning();

  if (!updated)
    return NextResponse.json({ error: "Note not found" }, { status: 404 });

  return NextResponse.json(updated);
}
