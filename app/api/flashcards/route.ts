// app/api/flashcards/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { flashcardDecks, flashcards } from "@/lib/schema";
import { eq, count, desc } from "drizzle-orm";
import Groq from "groq-sdk";

export const dynamic = "force-dynamic";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// GET /api/flashcards — list all decks with card counts
export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decks = await db
    .select({
      id: flashcardDecks.id,
      name: flashcardDecks.name,
      description: flashcardDecks.description,
      noteId: flashcardDecks.noteId,
      subjectId: flashcardDecks.subjectId,
      createdAt: flashcardDecks.createdAt,
      updatedAt: flashcardDecks.updatedAt,
      cardCount: count(flashcards.id),
    })
    .from(flashcardDecks)
    .leftJoin(flashcards, eq(flashcards.deckId, flashcardDecks.id))
    .where(eq(flashcardDecks.userId, session.user.id))
    .groupBy(flashcardDecks.id)
    .orderBy(desc(flashcardDecks.updatedAt));

  return NextResponse.json(decks);
}

// POST /api/flashcards — create deck (manual or AI)
export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, noteId, subjectId, cards, generateFromContent } =
    body;

  if (!name?.trim())
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const [deck] = await db
    .insert(flashcardDecks)
    .values({
      userId: session.user.id,
      name: name.trim(),
      description: description?.trim() ?? null,
      noteId: noteId ?? null,
      subjectId: subjectId ?? null,
    })
    .returning();

  // If manual cards provided
  if (cards?.length) {
    await db.insert(flashcards).values(
      cards.map((c: { front: string; back: string }) => ({
        deckId: deck.id,
        front: c.front.trim(),
        back: c.back.trim(),
      })),
    );
  }

  // If AI generation requested
  if (generateFromContent && body.noteContent) {
    const plain = body.noteContent
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1500,
      messages: [
        {
          role: "system",
          content: `You are a flashcard generator. Given study content, generate exactly ${body.count ?? 8} flashcard pairs.
Return ONLY a JSON array with no extra text:
[{"front": "question", "back": "answer"}, ...]`,
        },
        { role: "user", content: `Generate flashcards from:\n\n${plain}` },
      ],
    });

    try {
      const raw = completion.choices[0]?.message?.content ?? "[]";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const generated: { front: string; back: string }[] = JSON.parse(cleaned);
      if (generated.length) {
        await db
          .insert(flashcards)
          .values(
            generated.map((c) => ({
              deckId: deck.id,
              front: c.front,
              back: c.back,
            })),
          );
      }
    } catch {
      // continue even if AI parse fails
    }
  }

  return NextResponse.json(deck, { status: 201 });
}
