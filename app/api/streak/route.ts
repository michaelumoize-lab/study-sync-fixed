// app/api/streak/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { userSettings } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/streak — returns current streak
export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [settings] = await db
    .select({
      studyStreakCount: userSettings.studyStreakCount,
      lastActiveAt: userSettings.lastActiveAt,
    })
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id));

  return NextResponse.json({
    streak: settings?.studyStreakCount ?? 0,
    lastActiveAt: settings?.lastActiveAt ?? null,
  });
}

// POST /api/streak — call once per session to increment or reset
export async function POST() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const now = new Date();

  const [existing] = await db
    .select({
      studyStreakCount: userSettings.studyStreakCount,
      lastActiveAt: userSettings.lastActiveAt,
    })
    .from(userSettings)
    .where(eq(userSettings.userId, userId));

  let newStreak = 1;

  if (existing?.lastActiveAt) {
    const last = new Date(existing.lastActiveAt);
    const lastDay = new Date(
      last.getFullYear(),
      last.getMonth(),
      last.getDate(),
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round(
      (today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      // Same day — no change
      return NextResponse.json({ streak: existing.studyStreakCount ?? 1 });
    } else if (diffDays === 1) {
      // Consecutive day — increment
      newStreak = (existing.studyStreakCount ?? 0) + 1;
    } else {
      // Missed a day — reset
      newStreak = 1;
    }
  }

  await db
    .insert(userSettings)
    .values({
      userId,
      studyStreakCount: newStreak,
      lastActiveAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        studyStreakCount: newStreak,
        lastActiveAt: now,
        updatedAt: now,
      },
    });

  return NextResponse.json({ streak: newStreak });
}
