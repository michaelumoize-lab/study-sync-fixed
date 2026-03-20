// app/api/study/sessions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { studySessions, studyMessages } from "@/lib/schema";
import { eq, and, asc } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/study/sessions/[id] — load messages for a session
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await db
    .select({ id: studyMessages.id, role: studyMessages.role, content: studyMessages.content, createdAt: studyMessages.createdAt })
    .from(studyMessages)
    .where(eq(studyMessages.sessionId, id))
    .orderBy(asc(studyMessages.createdAt));

  return NextResponse.json(messages);
}

// DELETE /api/study/sessions/[id] — delete a session and its messages
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db
    .delete(studySessions)
    .where(and(eq(studySessions.id, id), eq(studySessions.userId, session.user.id)));

  return NextResponse.json({ success: true });
}