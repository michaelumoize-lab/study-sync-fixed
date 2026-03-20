// app/api/vault/counts/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import { eq, and, isNull, isNotNull, count, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  // Run all three counts in parallel — single round trip
  const [vaultCount, draftCount, deletedCount] = await Promise.all([
    db
      .select({ count: count() })
      .from(notes)
      .where(
        and(
          eq(notes.userId, userId),
          eq(notes.status, "active"),
          isNull(notes.deletedAt),
        ),
      )
      .then((r) => r[0]?.count ?? 0),

    db
      .select({ count: count() })
      .from(notes)
      .where(
        and(
          eq(notes.userId, userId),
          isNull(notes.deletedAt),
          or(eq(notes.status, "draft"), eq(notes.hasDraft, true)),
        ),
      )
      .then((r) => r[0]?.count ?? 0),

    db
      .select({ count: count() })
      .from(notes)
      .where(and(eq(notes.userId, userId), isNotNull(notes.deletedAt)))
      .then((r) => r[0]?.count ?? 0),
  ]);

  return NextResponse.json({ vaultCount, draftCount, deletedCount });
}
