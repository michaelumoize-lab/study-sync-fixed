import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Footer from "@/components/Home/Footer";
import Features from "@/components/landing/features";
import AITutor from "@/components/landing/ai-tutor";
import AdaptiveLearning from "@/components/landing/adaptive-learning";
import HowItWorks from "@/components/Home/HowItWorks";
import ScrollToTop from "@/components/Shared/ScrollToTop";
import { getServerSession } from "@/lib/get-session";
import { Metadata } from "next";

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
    images: ["https://www.studysync.website/og-image.png"],
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

export default async function HomePage() {
  const session = await getServerSession();

  return (
    <>
      <ScrollToTop />
      <Navbar session={session} />
      <main>
        <Hero />
        <Features />
        <AITutor />
        <AdaptiveLearning />
        <HowItWorks />
        <Footer />
      </main>
    </>
  );
}
