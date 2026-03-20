// app/api/vault/deleted/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/vault/deleted/[id] — restore a note
export async function PATCH(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db
    .update(notes)
    .set({ status: "active", deletedAt: null })
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)));

  return NextResponse.json({ success: true });
}

// DELETE /api/vault/deleted/[id] — permanently delete
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)));

  return NextResponse.json({ success: true });
}
