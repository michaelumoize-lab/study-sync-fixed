// app/dashboard/library/semesters/[id]/page.tsx
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes, subjects, tags, noteTags, semesters } from "@/lib/schema";
import { eq, and, isNull, desc, inArray } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { FilteredNotesClient } from "@/components/Library/FilteredNotesClient";
import { Note } from "@/types/note";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function SemesterNotesPage({ params }: Props) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

  const userId = session.user.id;

  const [semester] = await db
    .select({ id: semesters.id, name: semesters.name })
    .from(semesters)
    .where(and(eq(semesters.id, id), eq(semesters.userId, userId)));

  if (!semester) notFound();

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
      subjectName: subjects.name,
      subjectColor: subjects.color,
    })
    .from(notes)
    .leftJoin(subjects, eq(notes.subjectId, subjects.id))
    .where(
      and(
        eq(notes.userId, userId),
        eq(notes.semesterId, id),
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

  const initialNotes: Note[] = rawNotes.map((n) => ({
    id: n.id,
    userId: n.userId,
    title: n.title,
    content: n.content,
    pdfUrl: n.pdfUrl ?? null,
    draftTitle: n.draftTitle ?? null,
    draftContent: n.draftContent ?? null,
    hasDraft: n.hasDraft ?? false,
    status: n.status,
    isPinned: n.isPinned,
    subjectId: n.subjectId,
    semesterId: n.semesterId,
    deletedAt: n.deletedAt,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
    subject: n.subjectId
      ? {
          id: n.subjectId,
          name: n.subjectName ?? "",
          color: n.subjectColor ?? null,
        }
      : null,
    semester: null,
    tags: tagsByNote[n.id] ?? [],
  }));

  return (
    <FilteredNotesClient
      initialNotes={initialNotes}
      heading={semester.name}
      subheading={`${initialNotes.length} ${initialNotes.length === 1 ? "note" : "notes"}`}
      backHref="/dashboard/library/semesters"
      backLabel="Semesters"
    />
  );
}
