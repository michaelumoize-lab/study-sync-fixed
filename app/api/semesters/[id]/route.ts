// app/api/semesters/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { semesters } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

// PUT /api/semesters/[id]
export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, startDate, endDate, isActive } = await req.json();

  // If setting as active, deactivate all others first
  if (isActive) {
    await db
      .update(semesters)
      .set({ isActive: false })
      .where(eq(semesters.userId, session.user.id));
  }

  const [updated] = await db
    .update(semesters)
    .set({
      ...(name !== undefined && { name: name.trim() }),
      ...(startDate !== undefined && {
        startDate: startDate ? new Date(startDate) : null,
      }),
      ...(endDate !== undefined && {
        endDate: endDate ? new Date(endDate) : null,
      }),
      ...(isActive !== undefined && { isActive }),
    })
    .where(and(eq(semesters.id, id), eq(semesters.userId, session.user.id)))
    .returning();

  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

// DELETE /api/semesters/[id]
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db
    .delete(semesters)
    .where(and(eq(semesters.id, id), eq(semesters.userId, session.user.id)));

  return NextResponse.json({ success: true });
}
