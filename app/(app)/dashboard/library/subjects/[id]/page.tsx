// app/dashboard/library/subjects/[id]/page.tsx
import { db } from "@/lib/db";
import { notes, subjects, tags, noteTags } from "@/lib/schema";
import { eq, and, isNull, desc, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { FilteredNotesClient } from "@/components/Library/FilteredNotesClient";
import { Note } from "@/types/note";
import { mapNote } from "@/lib/map-note";
import { getServerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function SubjectNotesPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession();

  const userId = session.user.id;

  // Verify subject belongs to user
  const [subject] = await db
    .select({ id: subjects.id, name: subjects.name, color: subjects.color })
    .from(subjects)
    .where(and(eq(subjects.id, id), eq(subjects.userId, userId)));

  if (!subject) notFound();

  const rawNotes = await db
    .select({
      id: notes.id,
      userId: notes.userId,
      title: notes.title,
      content: notes.content,
      status: notes.status,
      isPinned: notes.isPinned,
      subjectId: notes.subjectId,
      semesterId: notes.semesterId,
      pdfUrl: notes.pdfUrl,
      draftTitle: notes.draftTitle,
      draftContent: notes.draftContent,
      hasDraft: notes.hasDraft,
      deletedAt: notes.deletedAt,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
    })
    .from(notes)
    .where(
      and(
        eq(notes.userId, userId),
        eq(notes.subjectId, id),
        eq(notes.status, "active"),
        isNull(notes.deletedAt),
      ),
    )
    .orderBy(desc(notes.updatedAt));

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

    tagsByNote = tagRows.reduce<
      Record<string, { id: string; name: string; color: string | null }[]>
    >((acc, row) => {
      if (!acc[row.noteId]) acc[row.noteId] = [];
      acc[row.noteId].push({
        id: row.tagId,
        name: row.tagName,
        color: row.tagColor,
      });
      return acc;
    }, {});
  }

  const initialNotes: Note[] = rawNotes.map((n) => mapNote(n, tagsByNote));

  return (
    <FilteredNotesClient
      initialNotes={initialNotes}
      heading={subject.name}
      subheading={`${initialNotes.length} ${initialNotes.length === 1 ? "note" : "notes"}`}
      accentColor={subject.color}
      backHref="/dashboard/library/subjects"
      backLabel="Subjects"
    />
  );
}
