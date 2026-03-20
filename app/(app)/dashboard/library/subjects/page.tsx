// app/dashboard/library/subjects/page.tsx
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { subjects, notes } from "@/lib/schema";
import { eq, asc, count, and, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { SubjectsClient } from "@/components/Library/SubjectsClient";

export const dynamic = "force-dynamic";

export default async function SubjectsPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

  const userId = session.user.id;

  // Fetch subjects with their note count
  const rows = await db
    .select({
      id: subjects.id,
      name: subjects.name,
      description: subjects.description,
      color: subjects.color,
      icon: subjects.icon,
      createdAt: subjects.createdAt,
      updatedAt: subjects.updatedAt,
      noteCount: count(notes.id),
    })
    .from(subjects)
    .leftJoin(
      notes,
      and(
        eq(notes.subjectId, subjects.id),
        eq(notes.status, "active"),
        isNull(notes.deletedAt),
      ),
    )
    .where(eq(subjects.userId, userId))
    .groupBy(subjects.id)
    .orderBy(asc(subjects.name));

  return <SubjectsClient initialSubjects={rows} />;
}
