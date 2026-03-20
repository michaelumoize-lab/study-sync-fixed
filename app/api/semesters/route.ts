// app/api/semesters/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { semesters } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/semesters
export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(semesters)
    .where(eq(semesters.userId, session.user.id))
    .orderBy(desc(semesters.createdAt));

  return NextResponse.json(rows);
}

// POST /api/semesters
export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, startDate, endDate, isActive } = await req.json();

  if (!name?.trim())
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  // If setting this as active, deactivate all others first
  if (isActive) {
    await db
      .update(semesters)
      .set({ isActive: false })
      .where(eq(semesters.userId, session.user.id));
  }

  const [semester] = await db
    .insert(semesters)
    .values({
      userId: session.user.id,
      name: name.trim(),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      isActive: isActive ?? false,
    })
    .returning();

  return NextResponse.json(semester, { status: 201 });
}
