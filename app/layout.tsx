// app/layout.tsx

import { authClient } from "@/lib/auth/client";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/Shared/ThemeProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudySync | Your Personal Vault",
  description: "Capture everything, forget nothing. Write rich notes, chat with your content using AI, organize by subject, and build a personal vault of knowledge that grows with you — built for serious learners who want to study smarter, not harder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable}`}>
      <body className="font-sans antialiased custom-scrollbar">
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
      </body>
    </html>
  );
}
