// lib/map-note.ts
import { Note } from "@/types/note";

type RawNote = {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  pdfUrl: string | null;
  draftTitle: string | null;
  draftContent: string | null;
  hasDraft?: boolean;
  status: "active" | "draft" | "deleted";
  isPinned: boolean;
  subjectId: string | null;
  semesterId: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  subjectName?: string | null;
  subjectColor?: string | null;
  semesterName?: string | null;
};

export function mapNote(
  n: RawNote,
  tagsByNote: Record<
    string,
    { id: string; name: string; color: string | null }[]
  >,
): Note {
  return {
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
    semester: n.semesterId
      ? { id: n.semesterId, name: n.semesterName ?? "" }
      : null,
    tags: tagsByNote[n.id] ?? [],
  };
}
