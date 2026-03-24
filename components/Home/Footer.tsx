"use client";

import Link from "next/link";
import { BookOpen, Github, Twitter, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* BRAND COLUMN */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-primary p-1.5 rounded-lg transition-transform group-hover:scale-110 shadow-sm">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                StudySync
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              The private vault for your academic journey. Built for focus,
              designed for students, and synced across all your devices.
            </p>
            <div className="flex items-center gap-4">
              <Link
                aria-label="Twitter"
                href="#"
                className="p-2 bg-secondary/50 rounded-xl text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                aria-label="Github"
                href="#"
                className="p-2 bg-secondary/50 rounded-xl text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                aria-label="Linkedin"
                href="#"
                className="p-2 bg-secondary/50 rounded-xl text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* LINKS COLUMN 1 */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground dark:text-primary">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/vault"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  The Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* LINKS COLUMN 2 - Support */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground dark:text-primary">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@mail.studysync.website"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  support@mail.studysync.website
                </a>
              </li>
            </ul>
          </div>

          {/* LINKS COLUMN 3 */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground dark:text-primary">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/data-security"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Data Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} StudySync. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <span>Developed with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
            <Link
              href="https://michaelfolio-dev.vercel.app"
              className="text-foreground font-bold hover:text-primary transition-colors cursor-default"
            >
              Michael Umoize
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
