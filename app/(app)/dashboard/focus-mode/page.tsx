import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { FocusModeClient } from "@/components/FocusMode/FocusModeClient";

export const dynamic = "force-dynamic";

export default async function FocusModePage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

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