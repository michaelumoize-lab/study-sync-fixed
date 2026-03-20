// app/api/schedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { scheduleEvents, subjects } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await db
    .select({
      id: scheduleEvents.id,
      title: scheduleEvents.title,
      description: scheduleEvents.description,
      subjectId: scheduleEvents.subjectId,
      subjectName: subjects.name,
      subjectColor: subjects.color,
      startsAt: scheduleEvents.startsAt,
      endsAt: scheduleEvents.endsAt,
      isCompleted: scheduleEvents.isCompleted,
      createdAt: scheduleEvents.createdAt,
    })
    .from(scheduleEvents)
    .leftJoin(subjects, eq(scheduleEvents.subjectId, subjects.id))
    .where(eq(scheduleEvents.userId, session.user.id))
    .orderBy(asc(scheduleEvents.startsAt));

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, subjectId, startsAt, endsAt } = await req.json();

  if (!title?.trim())
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!startsAt)
    return NextResponse.json(
      { error: "Start time is required" },
      { status: 400 },
    );

  const [event] = await db
    .insert(scheduleEvents)
    .values({
      userId: session.user.id,
      title: title.trim(),
      description: description?.trim() ?? null,
      subjectId: subjectId ?? null,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : null,
      isCompleted: false,
    })
    .returning();

  return NextResponse.json(event, { status: 201 });
}
