// app/api/templates/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { templates } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, content } = await req.json();

  const [updated] = await db
    .update(templates)
    .set({
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && {
        description: description?.trim() ?? null,
      }),
      ...(content !== undefined && { content }),
      updatedAt: new Date(),
    })
    .where(and(eq(templates.id, id), eq(templates.userId, session.user.id)))
    .returning();

  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db
    .delete(templates)
    .where(and(eq(templates.id, id), eq(templates.userId, session.user.id)));

  return NextResponse.json({ success: true });
}
