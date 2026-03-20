// app/api/subjects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { subjects } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { ratelimit } from "@/lib/ratelimit";

type RouteContext = { params: Promise<{ id: string }> };

// PUT /api/subjects/[id]
export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success, limit, remaining, reset } = await ratelimit.limit(`subjects_write:${session.user.id}`);
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

  const { name, description, color, icon } = await req.json();

  const [updated] = await db
    .update(subjects)
    .set({
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && {
        description: description?.trim() ?? null,
      }),
      ...(color !== undefined && { color }),
      ...(icon !== undefined && { icon }),
      updatedAt: new Date(),
    })
    .where(and(eq(subjects.id, id), eq(subjects.userId, session.user.id)))
    .returning();

  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

// DELETE /api/subjects/[id]
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success, limit, remaining, reset } = await ratelimit.limit(`subjects_write:${session.user.id}`);
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

  await db
    .delete(subjects)
    .where(and(eq(subjects.id, id), eq(subjects.userId, session.user.id)));

  return NextResponse.json({ success: true });
}
