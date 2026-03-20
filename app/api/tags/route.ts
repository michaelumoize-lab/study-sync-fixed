// app/api/tags/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { tags } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { readRatelimit, ratelimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

// GET /api/tags
export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success } = await readRatelimit.limit(`tags_read:${session.user.id}`);
  if (!success)
    return NextResponse.json(
      { error: "Too many requests, slow down" },
      { status: 429 },
    );

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

  const { success, limit, remaining, reset } = await ratelimit.limit(`tags_write:${session.user.id}`);
  if (!success)
    return NextResponse.json(
      { error: "Too many requests, slow down" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      },
    );

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
