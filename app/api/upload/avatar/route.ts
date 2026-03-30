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

  // Get the current image URL from the session — no DB import needed
  const currentImage = session.user.image ?? null;

  // Delete the old blob regardless of extension
  if (currentImage && currentImage.includes("vercel-storage.com")) {
    try {
      await del(currentImage);
    } catch {
      // Non-fatal: old blob may already be gone
    }
  }

  const extMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const ext = extMap[file.type] ?? "jpg";

  const blob = await put(`avatars/${session.user.id}.${ext}`, file, {
    access: "public",
    allowOverwrite: true,
  });

  return NextResponse.json({ url: blob.url });
}

export async function DELETE() {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get current image from session — no client URL needed
  const currentImage = session.user.image ?? null;

  if (currentImage && currentImage.includes("vercel-storage.com")) {
    try {
      await del(currentImage);
    } catch {
      // Non-fatal
    }
  }

  return NextResponse.json({ success: true });
}
