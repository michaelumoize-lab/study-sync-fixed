// app/api/schedule/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { scheduleEvents } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, subjectId, startsAt, endsAt, isCompleted } = await req.json();

  const [updated] = await db
    .update(scheduleEvents)
    .set({
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description?.trim() ?? null }),
      ...(subjectId !== undefined && { subjectId }),
      ...(startsAt !== undefined && { startsAt: new Date(startsAt) }),
      ...(endsAt !== undefined && { endsAt: endsAt ? new Date(endsAt) : null }),
      ...(isCompleted !== undefined && { isCompleted }),
    })
    .where(and(eq(scheduleEvents.id, id), eq(scheduleEvents.userId, session.user.id)))
    .returning();

  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db
    .delete(scheduleEvents)
    .where(and(eq(scheduleEvents.id, id), eq(scheduleEvents.userId, session.user.id)));

  return NextResponse.json({ success: true });
}