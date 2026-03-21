// app/dashboard/library/semesters/page.tsx
import { db } from "@/lib/db";
import { semesters, notes } from "@/lib/schema";
import { eq, desc, count, and, isNull } from "drizzle-orm";
import { SemestersClient } from "@/components/Library/SemestersClient";
import { getServerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function SemestersPage() {
  
  const session = await getServerSession();
  const userId = session.user.id;

  const rows = await db
    .select({
      id: semesters.id,
      name: semesters.name,
      startDate: semesters.startDate,
      endDate: semesters.endDate,
      isActive: semesters.isActive,
      createdAt: semesters.createdAt,
      noteCount: count(notes.id),
    })
    .from(semesters)
    .leftJoin(
      notes,
      and(
        eq(notes.semesterId, semesters.id),
        eq(notes.status, "active"),
        isNull(notes.deletedAt),
      ),
    )
    .where(eq(semesters.userId, userId))
    .groupBy(semesters.id)
    .orderBy(desc(semesters.createdAt));

  return <SemestersClient initialSemesters={rows} />;
}
