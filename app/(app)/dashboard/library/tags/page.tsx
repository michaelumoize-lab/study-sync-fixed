// app/dashboard/library/tags/page.tsx
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { tags, noteTags, notes } from "@/lib/schema";
import { eq, asc, count, and, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { TagsClient } from "@/components/Library/TagsClient";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

  const userId = session.user.id;

  const rows = await db
    .select({
      id: tags.id,
      name: tags.name,
      color: tags.color,
      createdAt: tags.createdAt,
      noteCount: count(noteTags.noteId),
    })
    .from(tags)
    .leftJoin(noteTags, eq(noteTags.tagId, tags.id))
    .where(eq(tags.userId, userId))
    .groupBy(tags.id)
    .orderBy(asc(tags.name));

  return <TagsClient initialTags={rows} />;
}
