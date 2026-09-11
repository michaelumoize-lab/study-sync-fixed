"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  Brain,
  Cpu,
  Layers,
  LogOut,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { MobileNav } from "@/components/landing/mobile-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/hooks/use-sign-out";
import { cn } from "@/lib/utils";

export const NAVBAR_LINKS = [
  { label: "Features", href: "/#features", icon: Sparkles },
  { label: "AI Tutor", href: "/#ai-tutor", icon: Brain },
  { label: "Adaptive Learning", href: "/#adaptive-learning", icon: Cpu },
  { label: "Architecture", href: "/#architecture", icon: Layers },
];

export interface NavbarProps {
  session?: {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    } | null;
  } | null;
}

export function Navbar({ session }: NavbarProps = {}) {
  const user = session?.user;
  const { signOut, isLoading: isSigningOut } = useSignOut();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4">
        <nav
          className={cn(
            "pointer-events-auto flex items-center justify-between h-14 sm:h-16 px-4 sm:px-5 rounded-2xl transition-all duration-300",
            "bg-background/80 dark:bg-zinc-950/75 backdrop-blur-xl border border-border/50 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/25",
            isScrolled && "border-primary/20 shadow-xl shadow-primary/5 bg-background/90 dark:bg-zinc-950/85"
          )}
        >
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-label="StudySync Home"
            >
              <Logo size={20} />
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAVBAR_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <div className="hidden sm:block h-4 w-px bg-border/60" />

            {/* Auth Controls - Rendered immediately from server session */}
            {user ? (
              <div className="hidden sm:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="group relative flex items-center justify-center rounded-full p-0.5 ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-200 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label="Open user menu"
                    >
                      <UserAvatar
                        user={user as any}
                        className="size-8 cursor-pointer transition-transform duration-200 group-hover:scale-105"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl">
                    <DropdownMenuLabel className="font-normal px-2.5 py-2">
                      <div className="flex flex-col space-y-1 overflow-hidden">
                        <p className="text-sm font-semibold leading-none text-foreground truncate">
                          {user.name || "Student"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-xl text-sm font-medium text-foreground hover:bg-accent transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-xl text-sm font-medium text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors"
                      onClick={async () => {
                        await signOut();
                      }}
                      disabled={isSigningOut}
                    >
                      {isSigningOut ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex items-center gap-1.5 font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Link href="/auth/sign-in" className="group">
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            )}

            {/* Mobile Navigation Drawer */}
            <MobileNav user={user} />
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
