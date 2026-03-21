// app/api/email/welcome/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { userSettings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email } = await req.json();

  // Check if user_settings exists - if it does, welcome email was already sent
  const [existingSettings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id));

  if (existingSettings) {
    return NextResponse.json({
      success: false,
      skipped: true,
      reason: "User already has settings row, so welcome email already sent",
    });
  }

  const displayName = name || email?.split("@")[0] || "there";

  try {
    await resend.emails.send({
      from: "StudySync <support@mail.studysync.website>",
      to: email,
      subject: "Your vault is ready 🎉 — Welcome to StudySync",
      html: getWelcomeEmailHtml(displayName),
    });

    // Create user_settings record (marks that welcome email was sent)
    await db.insert(userSettings).values({
      userId: session.user.id,
      theme: "system",
      autoSaveInterval: 30,
      studyStreakCount: 0,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[WELCOME EMAIL ERROR]", err);
    return NextResponse.json({ success: false });
  }
}

function getWelcomeEmailHtml(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<title>Welcome to StudySync</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

  * { box-sizing: border-box; }

  body {
    margin: 0;
    padding: 0;
    background-color: #0a0a0a;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  .email-wrapper {
    width: 100%;
    background-color: #0a0a0a;
    padding: 40px 16px;
  }

  .email-container {
    max-width: 580px;
    width: 100%;
    margin: 0 auto;
  }

  /* Header */
  .email-header {
    background-color: #111111;
    border-radius: 20px 20px 0 0;
    padding: 32px 40px 28px;
    border: 1px solid #222222;
    border-bottom: none;
  }

  .logo-wrap {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .logo-icon {
    background-color: #aff33e;
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 18px;
    line-height: 1;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.5px;
  }

  /* Hero */
  .email-hero {
    background-color: #111111;
    padding: 0 40px 36px;
    border: 1px solid #222222;
    border-top: none;
    border-bottom: none;
  }

  .hero-inner {
    background: linear-gradient(135deg, #1a2a00 0%, #0f1a00 100%);
    border-radius: 16px;
    padding: 36px 28px;
    text-align: center;
    border: 1px solid #2a3a00;
  }

  .hero-emoji {
    font-size: 40px;
    margin: 0 0 12px;
  }

  .hero-title {
    margin: 0 0 10px;
    font-size: 26px;
    font-weight: 900;
    color: #aff33e;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }

  .hero-subtitle {
    margin: 0;
    font-size: 14px;
    color: #888888;
    line-height: 1.6;
  }

  /* Intro */
  .email-intro {
    background-color: #111111;
    padding: 0 40px 28px;
    border: 1px solid #222222;
    border-top: none;
    border-bottom: none;
  }

  .intro-text {
    margin: 0 0 8px;
    font-size: 15px;
    color: #aaaaaa;
    line-height: 1.7;
  }

  /* Features */
  .email-features {
    background-color: #111111;
    padding: 0 40px 36px;
    border: 1px solid #222222;
    border-top: none;
    border-bottom: none;
  }

  .feature-card {
    background-color: #161616;
    border: 1px solid #222222;
    border-radius: 14px;
    padding: 18px 20px;
    margin-bottom: 12px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .feature-card:last-child {
    margin-bottom: 0;
  }

  .feature-icon {
    width: 40px;
    height: 40px;
    min-width: 40px;
    background-color: #1a2a00;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    line-height: 40px;
    text-align: center;
  }

  .feature-title {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
  }

  .feature-desc {
    margin: 0;
    font-size: 12px;
    color: #666666;
    line-height: 1.5;
  }

  /* CTA */
  .email-cta {
    background-color: #111111;
    padding: 0 40px 36px;
    border: 1px solid #222222;
    border-top: none;
    border-bottom: none;
    text-align: center;
  }

  .cta-button {
    display: inline-block;
    background-color: #aff33e;
    color: #0a0a0a !important;
    font-size: 15px;
    font-weight: 800;
    text-decoration: none;
    padding: 16px 40px;
    border-radius: 14px;
    letter-spacing: -0.2px;
  }

  .cta-sub {
    margin: 18px 0 0;
    font-size: 13px;
    color: #555555;
  }

  .cta-link {
    color: #aff33e !important;
    text-decoration: none;
  }

  /* Streak */
  .email-streak {
    background-color: #111111;
    padding: 0 40px 36px;
    border: 1px solid #222222;
    border-top: none;
    border-bottom: none;
  }

  .streak-inner {
    background: linear-gradient(135deg, #1a1a00 0%, #111100 100%);
    border: 1px solid #2a2a00;
    border-radius: 14px;
    padding: 20px 24px;
    text-align: center;
  }

  .streak-emoji {
    font-size: 22px;
    margin: 0 0 6px;
  }

  .streak-title {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 700;
    color: #aff33e;
  }

  .streak-sub {
    margin: 0;
    font-size: 12px;
    color: #666666;
  }

  /* Footer */
  .email-footer {
    background-color: #0d0d0d;
    border-radius: 0 0 20px 20px;
    padding: 24px 40px;
    border: 1px solid #222222;
    border-top: 1px solid #1a1a1a;
    text-align: center;
  }

  .footer-brand {
    margin: 0 0 6px;
    font-size: 13px;
    font-weight: 700;
    color: #ffffff;
  }

  .footer-tagline {
    margin: 0 0 16px;
    font-size: 12px;
    color: #444444;
  }

  .footer-links {
    margin: 0 0 14px;
    font-size: 11px;
    color: #333333;
  }

  .footer-link {
    color: #444444 !important;
    text-decoration: none;
  }

  .footer-note {
    margin: 0;
    font-size: 11px;
    color: #2a2a2a;
  }

  /* ── Mobile ── */
  @media only screen and (max-width: 600px) {
    .email-wrapper {
      padding: 20px 12px !important;
    }

    .email-header,
    .email-hero,
    .email-intro,
    .email-features,
    .email-cta,
    .email-streak,
    .email-footer {
      padding-left: 20px !important;
      padding-right: 20px !important;
    }

    .email-header {
      border-radius: 16px 16px 0 0 !important;
      padding-top: 24px !important;
      padding-bottom: 20px !important;
    }

    .email-footer {
      border-radius: 0 0 16px 16px !important;
    }

    .hero-title {
      font-size: 22px !important;
    }

    .hero-inner {
      padding: 28px 20px !important;
    }

    .cta-button {
      display: block !important;
      padding: 16px 20px !important;
      font-size: 14px !important;
    }

    .feature-card {
      flex-direction: column !important;
      gap: 12px !important;
    }

    .feature-icon {
      width: 36px !important;
      height: 36px !important;
      min-width: 36px !important;
      font-size: 16px !important;
      line-height: 36px !important;
    }
  }
</style>
</head>
<body>
<div class="email-wrapper">
  <div class="email-container">

    <!-- Header -->
    <div class="email-header">
      <div class="logo-wrap">
        <div class="logo-icon">📖</div>
        <span class="logo-text">StudySync</span>
      </div>
    </div>

    <!-- Hero -->
    <div class="email-hero">
      <div class="hero-inner">
        <p class="hero-emoji">🎉</p>
        <h1 class="hero-title">Your vault is ready.</h1>
        <p class="hero-subtitle">Welcome to StudySync — the smarter way to study, capture, and retain everything that matters.</p>
      </div>
    </div>

    <!-- Intro -->
    <div class="email-intro">
      <p class="intro-text">Hey <strong style="color:#ffffff;">${name}</strong> 👋</p>
      <p class="intro-text" style="margin:0;">You've just joined thousands of students who use StudySync to stay on top of their studies. Here's everything you can do right now:</p>
    </div>

    <!-- Features -->
    <div class="email-features">

      <div class="feature-card">
        <div class="feature-icon">📝</div>
        <div>
          <p class="feature-title">Your Vault</p>
          <p class="feature-desc">Capture rich notes with formatting, organize by subject and semester, pin your most important notes, and never lose an idea again.</p>
        </div>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🤖</div>
        <div>
          <p class="feature-title">AI Study Chat</p>
          <p class="feature-desc">Chat with your notes using AI. Ask questions, get summaries, generate quiz questions, and master your content faster than ever.</p>
        </div>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🃏</div>
        <div>
          <p class="feature-title">Flashcards</p>
          <p class="feature-desc">Generate flashcard decks from your notes with AI or create them manually. Review with spaced repetition and track your mastery progress.</p>
        </div>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🎯</div>
        <div>
          <p class="feature-title">Focus Mode</p>
          <p class="feature-desc">Enter distraction-free writing mode with ambient music, a Pomodoro timer, and auto-save. Your best work happens here.</p>
        </div>
      </div>

      <div class="feature-card">
        <div class="feature-icon">📅</div>
        <div>
          <p class="feature-title">Study Schedule</p>
          <p class="feature-desc">Plan your study sessions, track deadlines, and link events to subjects. Stay organised across the entire semester.</p>
        </div>
      </div>

    </div>

    <!-- CTA -->
    <div class="email-cta">
      <a href="https://studysync.website/dashboard/vault" class="cta-button">Open Your Vault →</a>
      <p class="cta-sub">Or visit <a href="https://studysync.website" class="cta-link">studysync.website</a></p>
    </div>

    <!-- Streak -->
    <div class="email-streak">
      <div class="streak-inner">
        <p class="streak-emoji">🔥</p>
        <p class="streak-title">Start your streak today</p>
        <p class="streak-sub">Log in every day to build your study streak. Consistency is everything.</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p class="footer-brand">StudySync</p>
      <p class="footer-tagline">The private vault for your academic journey.</p>
      <p class="footer-links">
        <a href="https://studysync.website/legal/privacy-policy" class="footer-link">Privacy Policy</a>
        &nbsp;·&nbsp;
        <a href="https://studysync.website/legal/terms-of-service" class="footer-link">Terms of Service</a>
        &nbsp;·&nbsp;
        <a href="mailto:support@studysync.app" class="footer-link">Contact</a>
      </p>
      <p class="footer-note">You're receiving this because you just created a StudySync account.</p>
    </div>

  </div>
</div>
</body>
</html>`;
}
