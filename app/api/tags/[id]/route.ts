// app/api/tags/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { tags } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

// PUT /api/tags/[id]
export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // FIX 1: Wrap req.json() in try/catch — a missing or malformed body throws
  // a SyntaxError that would otherwise crash the route with an unhandled 500.
  let name: unknown;
  let color: unknown;
  try {
    const body = await req.json();
    name = body.name;
    color = body.color;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // FIX 2: Build the updates object from only the provided fields, then
  // guard against an empty object before touching the database.
  // Name normalization logic was already correct — preserved unchanged.
  const updates: Record<string, unknown> = {
    ...(typeof name === "string" && {
      name: name.trim().toLowerCase().replace(/\s+/g, "-"),
    }),
    ...(color !== undefined && { color }),
  };

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No updatable fields provided" },
      { status: 400 },
    );
  }

  const [updated] = await db
    .update(tags)
    .set(updates)
    .where(and(eq(tags.id, id), eq(tags.userId, session.user.id)))
    .returning();

  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

// DELETE /api/tags/[id] — unchanged, no issues found
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db
    .delete(tags)
    .where(and(eq(tags.id, id), eq(tags.userId, session.user.id)));

  return NextResponse.json({ success: true });
}
