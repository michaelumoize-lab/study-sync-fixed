// app/api/vault/deleted/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import { eq, and, inArray } from "drizzle-orm";
import { ratelimit } from "@/lib/ratelimit";

// PATCH /api/vault/deleted/bulk — restore multiple notes
export async function PATCH(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success, limit, remaining, reset } = await ratelimit.limit(`vault_deleted_bulk_write:${session.user.id}`);
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

  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0)
    return NextResponse.json({ error: "No IDs provided" }, { status: 400 });

  await db
    .update(notes)
    .set({ status: "active", deletedAt: null })
    .where(and(eq(notes.userId, session.user.id), inArray(notes.id, ids)));

  return NextResponse.json({ success: true });
}

// DELETE /api/vault/deleted/bulk — permanently delete multiple notes
export async function DELETE(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success, limit, remaining, reset } = await ratelimit.limit(`vault_deleted_bulk_write:${session.user.id}`);
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

  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0)
    return NextResponse.json({ error: "No IDs provided" }, { status: 400 });

  await db
    .delete(notes)
    .where(and(eq(notes.userId, session.user.id), inArray(notes.id, ids)));

  return NextResponse.json({ success: true });
}
