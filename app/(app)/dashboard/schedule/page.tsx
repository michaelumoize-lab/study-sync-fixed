// app/dashboard/schedule/page.tsx
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { scheduleEvents, subjects } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ScheduleClient } from "@/components/Schedule/ScheduleClient";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

  const userId = session.user.id;

  const [events, userSubjects] = await Promise.all([
    db
      .select({
        id: scheduleEvents.id,
        title: scheduleEvents.title,
        description: scheduleEvents.description,
        subjectId: scheduleEvents.subjectId,
        subjectName: subjects.name,
        subjectColor: subjects.color,
        startsAt: scheduleEvents.startsAt,
        endsAt: scheduleEvents.endsAt,
        isCompleted: scheduleEvents.isCompleted,
        createdAt: scheduleEvents.createdAt,
      })
      .from(scheduleEvents)
      .leftJoin(subjects, eq(scheduleEvents.subjectId, subjects.id))
      .where(eq(scheduleEvents.userId, userId))
      .orderBy(asc(scheduleEvents.startsAt)),

    db
      .select({ id: subjects.id, name: subjects.name, color: subjects.color })
      .from(subjects)
      .where(eq(subjects.userId, userId))
      .orderBy(asc(subjects.name)),
  ]);

  return <ScheduleClient initialEvents={events} subjects={userSubjects} />;
}
