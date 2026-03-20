// app/api/subjects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { subjects } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/subjects
export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(subjects)
    .where(eq(subjects.userId, session.user.id))
    .orderBy(asc(subjects.name));

  return NextResponse.json(rows);
}

// POST /api/subjects
export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, color, icon } = await req.json();

  if (!name?.trim())
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const [subject] = await db
    .insert(subjects)
    .values({
      userId: session.user.id,
      name: name.trim(),
      description: description?.trim() ?? null,
      color: color ?? null,
      icon: icon ?? null,
    })
    .returning();

  return NextResponse.json(subject, { status: 201 });
}
