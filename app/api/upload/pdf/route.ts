import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import Groq from "groq-sdk";
import DOMPurify from "isomorphic-dompurify";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const dynamic = "force-dynamic";

// Matches UUID v4 and common numeric/cuid DB IDs
const VALID_ID_RE = /^[a-zA-Z0-9_-]{1,128}$/;

const MAX_TITLE_LENGTH = 500;
const MAX_CONTENT_LENGTH = 100_000;

export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { title, content, subjectId, semesterId } = body;

    // --- Input validation ---
    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "title must be a non-empty string" },
        { status: 400 },
      );
    }
    if (title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        { error: `title must be ${MAX_TITLE_LENGTH} characters or fewer` },
        { status: 400 },
      );
    }
    if (typeof content !== "string") {
      return NextResponse.json(
        { error: "content must be a string" },
        { status: 400 },
      );
    }
    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        {
          error: `content must be ${MAX_CONTENT_LENGTH.toLocaleString()} characters or fewer`,
        },
        { status: 400 },
      );
    }
    if (subjectId !== undefined && subjectId !== null) {
      if (typeof subjectId !== "string" || !VALID_ID_RE.test(subjectId)) {
        return NextResponse.json(
          { error: "subjectId is not a valid ID" },
          { status: 400 },
        );
      }
    }
    if (semesterId !== undefined && semesterId !== null) {
      if (typeof semesterId !== "string" || !VALID_ID_RE.test(semesterId)) {
        return NextResponse.json(
          { error: "semesterId is not a valid ID" },
          { status: 400 },
        );
      }
    }
    // --- End validation ---

    // 1. Reformat extracted text with Groq → returns HTML directly
    let formattedContent = content || "";
    if (content) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const completion = await groq.chat.completions.create(
        {
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are a document formatter. Reformat raw PDF-extracted text into clean HTML using proper tags: <h1>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <p>, <br>.

Important rules:
- Add a blank line (use <br>) between every section and prayer
- Each prayer title should be a <h2> or <h3>
- Each paragraph of prayer text should be wrapped in its own <p> tag
- Never merge separate prayers or sections into one block
- Preserve the exact order and content of the original
- Return ONLY the HTML content. No explanations, no preamble, no markdown, no code blocks.`,
            },
            {
              role: "user",
              content: `Reformat this PDF-extracted text:\n\n${content}`,
            },
          ],
          max_tokens: 4096,
          temperature: 0.3,
        },
        { signal: controller.signal },
      );

      clearTimeout(timeoutId);

      const raw = completion.choices[0]?.message?.content || content;
      // Sanitize AI-generated HTML: strip scripts, event handlers, and
      // any other potentially dangerous markup before storing or returning.
      formattedContent = DOMPurify.sanitize(raw, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form"],
        FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "action"],
      });
    }

    // 2. Save to database
    const [note] = await db
      .insert(notes)
      .values({
        userId: session.user.id,
        title: title || "Untitled PDF",
        content: formattedContent,
        pdfUrl: null,
        subjectId: subjectId || null,
        semesterId: semesterId || null,
        status: "active",
        isPinned: false,
        hasDraft: false,
      })
      .returning();

    return NextResponse.json({ note }, { status: 201 });
  } catch (err) {
    console.error("[PDF UPLOAD ERROR]", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
