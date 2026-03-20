// app/api/flashcards/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { flashcardDecks, flashcards } from "@/lib/schema";
import { eq, and, asc } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/flashcards/[id] — get deck with all cards
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [deck] = await db
    .select()
    .from(flashcardDecks)
    .where(and(eq(flashcardDecks.id, id), eq(flashcardDecks.userId, session.user.id)));

  if (!deck) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const cards = await db
    .select()
    .from(flashcards)
    .where(eq(flashcards.deckId, id))
    .orderBy(asc(flashcards.createdAt));

  return NextResponse.json({ ...deck, cards });
}

// PUT /api/flashcards/[id] — update deck name/description
export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description } = await req.json();

  const [updated] = await db
    .update(flashcardDecks)
    .set({
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description: description?.trim() ?? null }),
      updatedAt: new Date(),
    })
    .where(and(eq(flashcardDecks.id, id), eq(flashcardDecks.userId, session.user.id)))
    .returning();

  return NextResponse.json(updated);
}

// DELETE /api/flashcards/[id]
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db
    .delete(flashcardDecks)
    .where(and(eq(flashcardDecks.id, id), eq(flashcardDecks.userId, session.user.id)));

  return NextResponse.json({ success: true });
}