// app/dashboard/recently-deleted/page.tsx
import { db } from "@/lib/db";
import { notes, subjects, tags, noteTags } from "@/lib/schema";
import { eq, and, isNotNull, inArray, desc } from "drizzle-orm";
import { RecentlyDeletedClient } from "@/components/Notes/RecentlyDeletedClient";
import { Note } from "@/types/note";
import { mapNote } from "@/lib/map-note";
import { getServerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function RecentlyDeletedPage() {
  const session = await getServerSession();
  const userId = session.user.id;

  const rawNotes = await db
    .select({
      id: notes.id,
      userId: notes.userId,
      title: notes.title,
      content: notes.content,
      pdfUrl: notes.pdfUrl, // ✅ add
      draftTitle: notes.draftTitle, // ✅ add
      draftContent: notes.draftContent, // ✅ add
      hasDraft: notes.hasDraft, // ✅ add
      status: notes.status,
      isPinned: notes.isPinned,
      subjectId: notes.subjectId,
      semesterId: notes.semesterId,
      deletedAt: notes.deletedAt,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
      subjectName: subjects.name,
      subjectColor: subjects.color,
    })
    .from(notes)
    .leftJoin(subjects, eq(notes.subjectId, subjects.id))
    .where(and(eq(notes.userId, userId), isNotNull(notes.deletedAt)))
    .orderBy(desc(notes.deletedAt));

  const noteIds = rawNotes.map((n) => n.id);
  let tagsByNote: Record<
    string,
    { id: string; name: string; color: string | null }[]
  > = {};

  if (noteIds.length > 0) {
    const tagRows = await db
      .select({
        noteId: noteTags.noteId,
        tagId: tags.id,
        tagName: tags.name,
        tagColor: tags.color,
      })
      .from(noteTags)
      .innerJoin(tags, eq(noteTags.tagId, tags.id))
      .where(inArray(noteTags.noteId, noteIds));

    tagsByNote = tagRows.reduce(
      (acc, row) => {
        if (!acc[row.noteId]) acc[row.noteId] = [];
        acc[row.noteId].push({
          id: row.tagId,
          name: row.tagName,
          color: row.tagColor,
        });
        return acc;
      },
      {} as Record<
        string,
        { id: string; name: string; color: string | null }[]
      >,
    );
  }

  const initialNotes: Note[] = rawNotes.map((n) => mapNote(n, tagsByNote)); // ✅ use mapNote

  return <RecentlyDeletedClient initialNotes={initialNotes} />;
}
