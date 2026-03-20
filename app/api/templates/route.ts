// app/api/templates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { templates } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(templates)
    .where(eq(templates.userId, session.user.id))
    .orderBy(asc(templates.updatedAt));

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, content } = await req.json();

  if (!name?.trim())
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const [template] = await db
    .insert(templates)
    .values({
      userId: session.user.id,
      name: name.trim(),
      description: description?.trim() ?? null,
      content: content ?? "",
    })
    .returning();

  return NextResponse.json(template, { status: 201 });
}
