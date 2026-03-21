// app/api/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { userSettings } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id));

  // Return defaults if no settings row yet
  return NextResponse.json(
    settings ?? {
      userId: session.user.id,
      theme: "system",
      autoSaveInterval: 30,
      studyStreakCount: 0,
      lastActiveAt: null,
      updatedAt: new Date(),
    },
  );
}

export async function PUT(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { theme, autoSaveInterval } = body;

  const [updated] = await db
    .insert(userSettings)
    .values({
      userId: session.user.id,
      theme,
      autoSaveInterval,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        ...(theme !== undefined && { theme }),
        ...(autoSaveInterval !== undefined && { autoSaveInterval }),
        updatedAt: new Date(),
      },
    })
    .returning();

  return NextResponse.json(updated);
}
