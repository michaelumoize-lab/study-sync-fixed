// app/dashboard/library/tags/page.tsx
import { db } from "@/lib/db";
import { tags, noteTags } from "@/lib/schema";
import { eq, asc, count } from "drizzle-orm";
import { TagsClient } from "@/components/Library/TagsClient";
import { getServerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const session = await getServerSession();
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
