// app/api/upload/avatar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { put, del } from "@vercel/blob";

export const dynamic = "force-dynamic";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  const oldUrl = formData.get("oldUrl") as string | null;

  if (!(file instanceof File))
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP or GIF allowed" },
      { status: 400 },
    );

  if (file.size > MAX_SIZE)
    return NextResponse.json(
      { error: "File too large. Max 5 MB." },
      { status: 400 },
    );

  // Delete previous blob before uploading new one
  if (oldUrl?.includes("vercel-storage.com")) {
    await del(oldUrl);
  }

  const ext = file.type.split("/")[1];
  const blob = await put(`avatars/${session.user.id}.${ext}`, file, {
    access: "public",
    allowOverwrite: true,
  });

  return NextResponse.json({ url: blob.url });
}

export async function DELETE(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json();

  if (!url || !url.includes("vercel-storage.com"))
    return NextResponse.json({ error: "Invalid blob URL" }, { status: 400 });

  await del(url);

  return NextResponse.json({ success: true });
}