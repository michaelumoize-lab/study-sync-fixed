// app/dashboard/library/tags/[id]/page.tsx
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes, subjects, tags, noteTags } from "@/lib/schema";
import { eq, and, isNull, desc, inArray } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { FilteredNotesClient } from "@/components/Library/FilteredNotesClient";
import { Note } from "@/types/note";
import { mapNote } from "@/lib/map-note";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function TagNotesPage({ params }: Props) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

  const userId = session.user.id;

  // Verify tag belongs to user
  const [tag] = await db
    .select({ id: tags.id, name: tags.name, color: tags.color })
    .from(tags)
    .where(and(eq(tags.id, id), eq(tags.userId, userId)));

  if (!tag) notFound();

  // Get note IDs that have this tag
  const taggedNoteIds = await db
    .select({ noteId: noteTags.noteId })
    .from(noteTags)
    .where(eq(noteTags.tagId, id));

  const noteIdList = taggedNoteIds.map((r) => r.noteId);

  // ✅ Declare outside the if block so it's accessible in return
  let initialNotes: Note[] = [];

  if (noteIdList.length > 0) {
    const rawNotes = await db
      .select({
        id: notes.id,
        userId: notes.userId,
        title: notes.title,
        content: notes.content,
        pdfUrl: notes.pdfUrl, // ✅ added
        draftTitle: notes.draftTitle, // ✅ added
        draftContent: notes.draftContent, // ✅ added
        hasDraft: notes.hasDraft, // ✅ added
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
      .where(
        and(
          eq(notes.userId, userId),
          eq(notes.status, "active"),
          isNull(notes.deletedAt),
          inArray(notes.id, noteIdList),
        ),
      )
      .orderBy(desc(notes.updatedAt));

    const tagRows = await db
      .select({
        noteId: noteTags.noteId,
        tagId: tags.id,
        tagName: tags.name,
        tagColor: tags.color,
      })
      .from(noteTags)
      .innerJoin(tags, eq(noteTags.tagId, tags.id))
      .where(inArray(noteTags.noteId, noteIdList));

    const tagsByNote = tagRows.reduce(
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

    initialNotes = rawNotes.map((n) => mapNote(n, tagsByNote)); // ✅ assign not declare
  }

  return (
    <FilteredNotesClient
      initialNotes={initialNotes}
      heading={`#${tag.name}`}
      subheading={`${initialNotes.length} ${initialNotes.length === 1 ? "note" : "notes"}`}
      accentColor={tag.color}
      backHref="/dashboard/library/tags"
      backLabel="Tags"
    />
  );
}
