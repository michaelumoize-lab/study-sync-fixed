// types/note.ts

export type NoteStatus = "active" | "draft" | "deleted";

export type Note = {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  pdfUrl: string | null;
  draftTitle: string | null;
  draftContent: string | null;
  hasDraft: boolean;
  status: NoteStatus;
  isPinned: boolean;
  subjectId: string | null;
  semesterId: string | null;
  deletedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  subject: { id: string; name: string; color: string | null } | null;
  semester: { id: string; name: string } | null;
  tags: { id: string; name: string; color: string | null }[];
};

export type CreateNoteInput = {
  title: string;
  content?: string;
  status?: NoteStatus;
  subjectId?: string;
  semesterId?: string;
  tagIds?: string[];
};

export type UpdateNoteInput = {
  title?: string;
  content?: string;
  status?: NoteStatus;
  isPinned?: boolean;
  subjectId?: string | null;
  semesterId?: string | null;
  tagIds?: string[];
};
