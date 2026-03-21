// app/api/study/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { studySessions, studyMessages, notes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import Groq from "groq-sdk";
import { ratelimit } from "@/lib/ratelimit";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are StudySync AI — a smart, friendly study assistant built into a student note-taking app.

Your job is to help students understand, revise, and master their study material.

When given a note's content:
- Answer questions about it precisely
- Summarize it clearly when asked
- Generate quiz questions to test understanding
- Create flashcard pairs (front/back) when asked
- Explain concepts in simple terms

Rules:
- Be concise but thorough
- Use markdown formatting (bold, lists, headings) to structure responses
- When generating flashcards, format them as a numbered list: "**Front:** ... | **Back:** ..."
- When quizzing, present one question at a time and wait for the answer
- Stay focused on academic topics
- Be encouraging and supportive`;

export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const { success, limit, remaining, reset } = await ratelimit.limit(
    `study_write:${userId}`,
  );
  if (!success)
    return NextResponse.json(
      { error: "Too many requests, slow down" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      },
    );
  const body = await req.json();
  const { message, sessionId, noteId } = body;

  if (!message?.trim())
    return NextResponse.json({ error: "Message is required" }, { status: 400 });

  // ---------------------------------------------------------------------------
  // Get or create session
  // ---------------------------------------------------------------------------
  let activeSessionId = sessionId;

  if (!activeSessionId) {
    const [newSession] = await db
      .insert(studySessions)
      .values({
        userId,
        noteId: noteId ?? null,
        title: message.slice(0, 60),
      })
      .returning();
    activeSessionId = newSession.id;
  }

  // ---------------------------------------------------------------------------
  // Load note context if attached
  // ---------------------------------------------------------------------------
  let noteContext = "";
  if (noteId) {
    const [note] = await db
      .select({ title: notes.title, content: notes.content })
      .from(notes)
      .where(
        and(
          eq(notes.id, noteId),
          eq(notes.userId, userId),
          eq(notes.status, "active"),
        ),
      );

    if (note) {
      const plainContent = (note.content ?? "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      noteContext = `\n\nThe student has attached this note for context:\n\nTitle: ${note.title}\nContent: ${plainContent}`;
    }
  }

  // ---------------------------------------------------------------------------
  // Load message history (last 20 messages for context window)
  // ---------------------------------------------------------------------------
  const history = await db
    .select({ role: studyMessages.role, content: studyMessages.content })
    .from(studyMessages)
    .where(eq(studyMessages.sessionId, activeSessionId))
    .orderBy(studyMessages.createdAt)
    .limit(20);

  // ---------------------------------------------------------------------------
  // Save user message
  // ---------------------------------------------------------------------------
  await db.insert(studyMessages).values({
    sessionId: activeSessionId,
    role: "user",
    content: message,
  });

  // ---------------------------------------------------------------------------
  // Build messages array for Groq
  // ---------------------------------------------------------------------------
  const messages: { role: "system" | "user" | "assistant"; content: string }[] =
    [
      { role: "system", content: SYSTEM_PROMPT + noteContext },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

  // ---------------------------------------------------------------------------
  // Stream response from Groq
  // ---------------------------------------------------------------------------
  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    stream: true,
    max_tokens: 1024,
    temperature: 0.7,
  });

  // Collect full response to save to DB
  let fullResponse = "";

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      // Send session ID first so client can store it
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ sessionId: activeSessionId })}\n\n`,
        ),
      );

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          fullResponse += delta;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`),
          );
        }
      }

      // Save assistant response to DB
      await db.insert(studyMessages).values({
        sessionId: activeSessionId,
        role: "assistant",
        content: fullResponse,
      });

      controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
