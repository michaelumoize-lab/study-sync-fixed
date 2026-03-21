import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { FocusModeClient } from "@/components/FocusMode/FocusModeClient";
import { getServerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function FocusModePage() {
  const session = await getServerSession();

  const userNotes = await db
    .select({ id: notes.id, title: notes.title })
    .from(notes)
    .where(
      and(
        eq(notes.userId, session.user.id),
        eq(notes.status, "active"),
        isNull(notes.deletedAt),
      ),
    )
    .orderBy(desc(notes.updatedAt));

  return <FocusModeClient initialNotes={userNotes} />;
}
