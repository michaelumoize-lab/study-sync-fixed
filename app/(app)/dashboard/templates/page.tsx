// app/dashboard/templates/page.tsx
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { templates } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { TemplatesClient } from "@/components/Templates/TemplatesClient";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

  const rows = await db
    .select()
    .from(templates)
    .where(eq(templates.userId, session.user.id))
    .orderBy(asc(templates.updatedAt));

  return <TemplatesClient initialTemplates={rows} />;
}
