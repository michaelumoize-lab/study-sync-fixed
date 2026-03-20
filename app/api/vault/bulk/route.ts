// app/api/vault/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import { and, eq, inArray } from "drizzle-orm";

// DELETE /api/vault/bulk — soft delete multiple notes
export async function DELETE(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0)
    return NextResponse.json({ error: "No IDs provided" }, { status: 400 });

  await db
    .update(notes)
    .set({ status: "deleted", deletedAt: new Date() })
    .where(and(eq(notes.userId, session.user.id), inArray(notes.id, ids)));

  return NextResponse.json({ success: true });
}
