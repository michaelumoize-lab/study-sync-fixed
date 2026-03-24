// app/dashboard/vault/page.tsx
import { db } from "@/lib/db";
import { notes, subjects, tags, noteTags, semesters } from "@/lib/schema";
import { eq, and, isNull, asc, desc, inArray } from "drizzle-orm";
import { VaultClient } from "@/components/Notes/VaultClient";
import { Note } from "@/types/note";
import { getServerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function VaultPage() {
  const session = await getServerSession();
  const userId = session.user.id;

  const [rawNotes, initialSubjects, initialTags, initialSemesters] =
    await Promise.all([
      db
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
        .where(
          and(
            eq(notes.userId, userId),
            eq(notes.status, "active"),
            isNull(notes.deletedAt),
          ),
        )
        .orderBy(desc(notes.isPinned), desc(notes.updatedAt)),

      db
        .select({ id: subjects.id, name: subjects.name, color: subjects.color })
        .from(subjects)
        .where(eq(subjects.userId, userId))
        .orderBy(asc(subjects.name)),

      db
        .select({ id: tags.id, name: tags.name, color: tags.color })
        .from(tags)
        .where(eq(tags.userId, userId))
        .orderBy(asc(tags.name)),

      db
        .select({ id: semesters.id, name: semesters.name })
        .from(semesters)
        .where(eq(semesters.userId, userId))
        .orderBy(asc(semesters.name)),
    ]);

  const noteIds = rawNotes.map((n) => n.id);
  let tagsByNote: Record<
    string,
    { id: string; name: string; color: string | null }[]
  > = {};

  if (noteIds.length > 0) {
    const allTagRows = await db
      .select({
        noteId: noteTags.noteId,
        tagId: tags.id,
        tagName: tags.name,
        tagColor: tags.color,
      })
      .from(noteTags)
      .innerJoin(tags, eq(noteTags.tagId, tags.id))
      .where(inArray(noteTags.noteId, noteIds));

    tagsByNote = allTagRows.reduce<
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
    <VaultClient
      initialNotes={initialNotes}
      subjects={initialSubjects}
      tags={initialTags}
      semesters={initialSemesters}
    />
  );
}
