// app/(app)/dashboard/settings/page.tsx
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import {
  userSettings,
  notes,
  flashcardDecks,
  scheduleEvents,
  subjects,
  tags,
} from "@/lib/schema";
import { eq, count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/Settings/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

  const userId = session.user.id;

  const [settings, stats] = await Promise.all([
    db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .then(
        (r) =>
          r[0] ?? {
            userId,
            theme: "system",
            autoSaveInterval: 30,
            studyStreakCount: 0,
            lastActiveAt: null,
            updatedAt: new Date(),
          },
      ),

    Promise.all([
      db
        .select({ count: count() })
        .from(notes)
        .where(eq(notes.userId, userId))
        .then((r) => r[0]?.count ?? 0),
      db
        .select({ count: count() })
        .from(subjects)
        .where(eq(subjects.userId, userId))
        .then((r) => r[0]?.count ?? 0),
      db
        .select({ count: count() })
        .from(tags)
        .where(eq(tags.userId, userId))
        .then((r) => r[0]?.count ?? 0),
      db
        .select({ count: count() })
        .from(flashcardDecks)
        .where(eq(flashcardDecks.userId, userId))
        .then((r) => r[0]?.count ?? 0),
      db
        .select({ count: count() })
        .from(scheduleEvents)
        .where(eq(scheduleEvents.userId, userId))
        .then((r) => r[0]?.count ?? 0),
    ]).then(([noteCount, subjectCount, tagCount, deckCount, eventCount]) => ({
      noteCount,
      subjectCount,
      tagCount,
      deckCount,
      eventCount,
    })),
  ]);

  return (
    <SettingsClient
      initialSettings={settings}
      userEmail={session.user.email ?? ""}
      userName={session.user.name ?? ""}
      userImage={session.user.image ?? null}   // ← new prop
      stats={stats}
    />
  );
}