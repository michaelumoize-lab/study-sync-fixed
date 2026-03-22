import Hero from "@/components/Home/Hero";
import Footer from "@/components/Home/Footer";
import Features from "@/components/Home/Features";
import HowItWorks from "@/components/Home/HowItWorks";
import { Metadata } from "next";
import posthog from "posthog-js";

export const dynamic = "force-dynamic";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.studysync.website";

export const metadata: Metadata = {
  title: "StudySync | Your Personal Study Vault",
  description:
    "Capture notes, chat with AI, create flashcards, and build your personal knowledge vault. The smarter way to study.",
  keywords: [
    "study app",
    "note taking app",
    "flashcards app",
    "AI study assistant",
    "student productivity",
    "online learning tools",
    "study planner",
  ],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "StudySync | Your Personal Study Vault",
    description:
      "Capture notes, chat with AI, create flashcards and study smarter.",
    siteName: "StudySync",
    url: baseUrl,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudySync | Your Personal Study Vault",
    description:
      "Capture notes, chat with AI, create flashcards and study smarter.",
    creator: "@miketech_90",
    images: ["https://www.studysync.website/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function HomePage() {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: "/ph",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    disable_session_recording: true, // removes recorder.js
    enable_recording_console_log: false,
    autocapture: false, // removes dead-clicks script
    disable_surveys: true, // removes surveys.js
  });
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
}
