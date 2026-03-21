// app/dashboard/flashcards/page.tsx
import { db } from "@/lib/db";
import { flashcardDecks, flashcards, notes } from "@/lib/schema";
import { eq, count, desc, asc, and } from "drizzle-orm";
import { FlashcardsClient } from "@/components/Flashcards/FlashcardsClient";
import { getServerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function FlashcardsPage() {
  
  const session = await getServerSession();
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
      .select({ 
        id: notes.id, 
        title: notes.title, 
        content: notes.content 
      })
      .from(notes)
      .where(
        and(
          eq(notes.userId, userId),
          eq(notes.status, "active") // Add this filter
        )
      )
      .orderBy(asc(notes.updatedAt))
      .limit(100),
  ]);

  return <FlashcardsClient initialDecks={decks} userNotes={userNotes} />;
}
