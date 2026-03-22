// app/layout.tsx

import { authClient } from "@/lib/auth/client";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/Shared/ThemeProvider";
import { PostHogProvider } from "./PostHogProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const baseUrl = "https://www.studysync.website";

export const metadata: Metadata = {
  title: "StudySync | Your Personal Study Vault",
  description:
    "Capture notes, chat with AI, create flashcards, and build your personal knowledge vault. The smarter way to study.",
  keywords: [
    "study app",
    "note taking",
    "flashcards",
    "AI study",
    "student notes",
  ],
  openGraph: {
    title: "StudySync | Your Personal Study Vault",
    description:
      "Capture notes, chat with AI, create flashcards and study smarter.",
    url: baseUrl,
    siteName: "StudySync",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudySync | Your Personal Study Vault",
    description:
      "Capture notes, chat with AI, create flashcards and study smarter.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable}`}>
      <body className="font-sans antialiased custom-scrollbar">
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                className:
                  "font-outfit text-sm font-semibold border border-border dark:bg-[#0d0d0d] dark:text-white",
                style: {
                  borderRadius: "12px",
                  padding: "12px 20px",
                },
                success: {
                  iconTheme: {
                    primary: "#aff33e",
                    secondary: "#1e293b",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#ffffff",
                  },
                },
              }}
            />
            <NeonAuthUIProvider
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              authClient={authClient as any}
              redirectTo="/welcome"
              emailOTP
              social={{
                providers: ["google"],
              }}
              credentials={{ forgotPassword: true }}
            >
              {children}
            </NeonAuthUIProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
