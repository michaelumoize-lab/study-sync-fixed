// app/dashboard/flashcards/page.tsx
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { flashcardDecks, flashcards, notes } from "@/lib/schema";
import { eq, count, desc, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { FlashcardsClient } from "@/components/Flashcards/FlashcardsClient";

export const dynamic = "force-dynamic";

export default async function FlashcardsPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

  const userId = session.user.id;

  const [decks, userNotes] = await Promise.all([
    db
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
      .where(eq(flashcardDecks.userId, userId))
      .groupBy(flashcardDecks.id)
      .orderBy(desc(flashcardDecks.updatedAt)),

    db
      .select({ id: notes.id, title: notes.title, content: notes.content })
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(asc(notes.updatedAt))
      .limit(100),
  ]);

  return <FlashcardsClient initialDecks={decks} userNotes={userNotes} />;
}
