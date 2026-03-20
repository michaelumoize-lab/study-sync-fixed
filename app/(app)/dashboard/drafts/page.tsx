// app/dashboard/drafts/page.tsx
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes, subjects, tags, noteTags } from "@/lib/schema";
import { eq, and, isNull, inArray, desc, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import { DraftsClient } from "@/components/Notes/DraftsClient";
import { Note } from "@/types/note";
import { mapNote } from "@/lib/map-note";

export const dynamic = "force-dynamic";

export default async function DraftsPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

  const userId = session.user.id;

  const rawDrafts = await db
    .select({
      id: notes.id,
      userId: notes.userId,
      title: notes.title,
      content: notes.content,
      pdfUrl: notes.pdfUrl,
      draftTitle: notes.draftTitle,
      draftContent: notes.draftContent,
      hasDraft: notes.hasDraft,
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
        isNull(notes.deletedAt),
        or(eq(notes.status, "draft"), eq(notes.hasDraft, true)),
      ),
    )
    .orderBy(desc(notes.updatedAt));

  const noteIds = rawDrafts.map((n) => n.id);
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

  const initialDrafts: Note[] = rawDrafts.map((n) => mapNote(n, tagsByNote));

  return <DraftsClient initialDrafts={initialDrafts} />;
}
