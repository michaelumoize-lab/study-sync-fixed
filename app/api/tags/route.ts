// app/api/tags/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { tags } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/tags
export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(tags)
    .where(eq(tags.userId, session.user.id))
    .orderBy(asc(tags.name));

  return NextResponse.json(rows);
}

// POST /api/tags
export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, color } = await req.json();

  if (!name?.trim())
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const [tag] = await db
    .insert(tags)
    .values({
      userId: session.user.id,
      name: name.trim().toLowerCase().replace(/\s+/g, "-"),
      color: color ?? null,
    })
    .returning();

  return NextResponse.json(tag, { status: 201 });
}
