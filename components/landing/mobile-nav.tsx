"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Sparkles,
  Brain,
  Cpu,
  Layers,
  LayoutDashboard,
  ChevronRight,
  LogOut,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { useSignOut } from "@/hooks/use-sign-out";

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

export interface MobileNavProps {
  user?: User | null;
}

export const LANDING_NAV_ITEMS = [
  {
    href: "/#features",
    label: "Features",
    description: "Concept mastery & exam readiness",
    icon: Sparkles,
  },
  {
    href: "/#ai-tutor",
    label: "AI Tutor",
    description: "Answers grounded in your materials",
    icon: Brain,
  },
  {
    href: "/#adaptive-learning",
    label: "Adaptive Engine",
    description: "Personalized spaced review & priorities",
    icon: Cpu,
  },
  {
    href: "/#architecture",
    label: "Architecture",
    description: "Prisma, Vector RAG & FSRS system",
    icon: Layers,
  },
];

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const { signOut, isLoading: isSigningOut } = useSignOut();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 rounded-xl border border-border/50 hover:bg-accent/60 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex flex-col justify-between w-[320px] sm:w-[380px] p-6 border-l border-border bg-background/95 backdrop-blur-xl text-foreground shadow-2xl"
      >
        <div className="flex flex-col gap-6 overflow-y-auto pr-1">
          {/* Header with Logo */}
          <SheetHeader className="text-left pb-4 border-b border-border/60">
            <SheetTitle asChild>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="transition-opacity hover:opacity-90 inline-block"
              >
                <Logo size={22} />
              </Link>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Intelligent adaptive study platform
            </SheetDescription>
          </SheetHeader>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-2 pb-1">
              Explore StudySync
            </span>
            {LANDING_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border/60 hover:bg-accent/50 transition-all duration-200 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shrink-0">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground shrink-0" />
                </Link>
              );
            })}

            {user && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between p-3 mt-2 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0 shadow-xs">
                    <LayoutDashboard className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      Dashboard
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Access your notes, review & study plan
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </nav>
        </div>

        {/* Footer Area: Theme Toggle & User Info / Auth */}
        <div className="mt-auto pt-5 border-t border-border/60 flex flex-col gap-3.5">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-muted/40 border border-border/40">
            <span className="text-xs font-medium text-muted-foreground">
              Interface Theme
            </span>
            <ThemeToggle />
          </div>

          {/* User Profile / Auth Actions */}
          {user ? (
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <UserAvatar
                    user={user as any}
                    className="h-8 w-8 border border-border/60 shrink-0"
                  />
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-semibold truncate text-foreground">
                      {user.name || "Student"}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer shrink-0"
                  onClick={async () => {
                    setOpen(false);
                    await signOut();
                  }}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <LogOut className="h-3 w-3 mr-1" />
                  )}
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <Button
                asChild
                size="lg"
                className="w-full h-10 font-semibold rounded-xl shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link
                  href="/auth/sign-in"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
