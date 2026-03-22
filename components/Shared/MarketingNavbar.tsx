// components/Shared/MarketingNavbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, BookOpen } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { ModeToggle } from "@/components/Shared/ModeToggle";

const GUEST_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
];

// ─────────────────────────────────────────────────────────────────

export default function MarketingNavbar() {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <nav
      ref={menuRef}
      className="fixed top-4 inset-x-0 z-100 max-w-6xl mx-auto px-4"
    >
      <div className="bg-background/80 backdrop-blur-md border border-border shadow-lg rounded-2xl px-4 py-2 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-14 gap-4">
          {/* Logo */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="bg-primary p-1.5 rounded-lg transition-transform group-hover:scale-110">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:block font-bold text-xl tracking-tight">
                StudySync
              </span>
            </Link>
          </div>

          {/* Center — nav links */}
          <div className="hidden md:flex justify-center items-center gap-8">
            {GUEST_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center justify-end gap-2 md:gap-3">
            <ModeToggle />
            <div className="h-8 w-px bg-border mx-1" />

            {session?.user ? (
              // Already signed in — send them to dashboard
              <Link
                href="/dashboard"
                className="hidden sm:block bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Open Vault
              </Link>
            ) : (
              <Link
                href="/auth/sign-in"
                className="hidden sm:block bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              aria-label="Toggle menu"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-6 space-y-2 border-t border-border mt-2 px-2">
            {GUEST_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block p-3 text-lg font-medium hover:bg-secondary rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              {session?.user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-primary text-primary-foreground py-3 rounded-xl font-bold"
                >
                  Open Vault
                </Link>
              ) : (
                <Link
                  href="/auth/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-primary text-primary-foreground py-3 rounded-xl font-bold"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
