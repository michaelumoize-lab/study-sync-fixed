// app/api/vault/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes, subjects, tags, noteTags, semesters } from "@/lib/schema";
import { eq, and, isNull, desc, inArray } from "drizzle-orm";
import { ratelimit, readRatelimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

type TagEntry = { id: string; name: string; color: string | null };
type TagsByNote = { [noteId: string]: TagEntry[] };

// GET /api/vault
export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const { success } = await readRatelimit.limit(`vault_read:${userId}`);
  if (!success)
    return NextResponse.json(
      { error: "Too many requests, slow down" },
      { status: 429 },
    );

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
      deletedAt: notes.deletedAt,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
      subjectName: subjects.name,
      subjectColor: subjects.color,
      semesterName: semesters.name,
    })
    .from(notes)
    .leftJoin(subjects, eq(notes.subjectId, subjects.id))
    .leftJoin(semesters, eq(notes.semesterId, semesters.id))
    .where(
      and(
        eq(notes.userId, userId),
        eq(notes.status, "active"),
        isNull(notes.deletedAt),
      ),
    )
    .orderBy(desc(notes.isPinned), desc(notes.updatedAt));

  const noteIds = rawNotes.map((n) => n.id);
  let tagsByNote: TagsByNote = {};

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

    const tagsByNoteMap = new Map<string, TagEntry[]>();

    for (const row of tagRows) {
      const existing = tagsByNoteMap.get(row.noteId) ?? [];
      existing.push({
        id: row.tagId,
        name: row.tagName,
        color: typeof row.tagColor === "string" ? row.tagColor : null,
      });
      tagsByNoteMap.set(row.noteId, existing);
    }

    tagsByNote = Object.fromEntries(tagsByNoteMap);
  }

  const result = rawNotes.map((n) => ({
    ...n,
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
  }));

  return NextResponse.json(result);
}

// POST /api/vault
export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const { success, limit, remaining, reset } = await ratelimit.limit(
    `vault_write:${userId}`,
  );
  if (!success)
    return NextResponse.json(
      { error: "Too many requests, slow down" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      },
    );

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // FIX: semesterId was missing from destructuring and insert — selecting a
  // semester on note creation was silently dropped and never saved to the DB.
  const { title, content, status, subjectId, semesterId, tagIds } = body as {
    title?: unknown;
    content?: unknown;
    status?: "active" | "draft" | "deleted";
    subjectId?: unknown;
    semesterId?: unknown;
    tagIds?: unknown;
  };

  if (!title || typeof title !== "string" || !title.trim())
    return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const [note] = await db
    .insert(notes)
    .values({
      userId,
      title: title.trim(),
      content: content && typeof content === "string" ? content.trim() : null,
      status: status ?? "active",
      subjectId: typeof subjectId === "string" ? subjectId : null,
      semesterId: typeof semesterId === "string" ? semesterId : null, // FIX: was missing
    })
    .returning();

  if (Array.isArray(tagIds) && tagIds.length > 0) {
    await db
      .insert(noteTags)
      .values(tagIds.map((tagId: string) => ({ noteId: note.id, tagId })));
  }

  return NextResponse.json(
    { ...note, subject: null, tags: [] },
    { status: 201 },
  );
}
