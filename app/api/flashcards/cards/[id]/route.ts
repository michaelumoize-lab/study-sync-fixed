// app/api/flashcards/cards/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { flashcards, flashcardDecks } from "@/lib/schema";
import { eq, and, inArray } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/flashcards/cards/[id] — update status or content
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { status, difficulty, front, back } = body;

  const [updated] = await db
    .update(flashcards)
    .set({
      ...(status !== undefined && { status }),
      ...(difficulty !== undefined && { difficulty }),
      ...(front !== undefined && { front }),
      ...(back !== undefined && { back }),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(flashcards.id, id),
        inArray(
          flashcards.deckId,
          db.select({ id: flashcardDecks.id })
            .from(flashcardDecks)
            .where(eq(flashcardDecks.userId, session.user.id))
        )
      )
    )
    .returning();

  return NextResponse.json(updated);
}

// DELETE /api/flashcards/cards/[id]
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.delete(flashcards).where(
    and(
      eq(flashcards.id, id),
      inArray(
        flashcards.deckId,
        db.select({ id: flashcardDecks.id })
          .from(flashcardDecks)
          .where(eq(flashcardDecks.userId, session.user.id))
      )
    )
  );
  return NextResponse.json({ success: true });
}
