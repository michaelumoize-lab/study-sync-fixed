// app/dashboard/templates/page.tsx
import { db } from "@/lib/db";
import { templates } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { TemplatesClient } from "@/components/Templates/TemplatesClient";
import { getServerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const session = await getServerSession();
  const userId = session.user.id;

  const rows = await db
    .select()
    .from(templates)
    .where(eq(templates.userId, userId))
    .orderBy(asc(templates.updatedAt));

  return <TemplatesClient initialTemplates={rows} />;
}
