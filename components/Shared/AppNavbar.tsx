"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { Clock, Shield, Menu } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { ModeToggle } from "@/components/Shared/ModeToggle";
import { SignOutButton } from "@/components/Shared/SignOutButton";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

function getInitials(name?: string | null, email?: string | null) {
  const str = name || email || "";
  return str
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Renders a profile picture if available, falls back to initials avatar
function Avatar({
  name,
  email,
  image,
  size = 36,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  size?: number;
}) {
  const [imgError, setImgError] = useState(false);

  const classes =
    "rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm transition-transform hover:scale-105 overflow-hidden shrink-0";
  const style = { width: size, height: size };

  if (image && !imgError) {
    return (
      <div className={classes} style={style}>
        <Image
          src={image}
          alt={name ?? "User avatar"}
          width={size}
          height={size}
          className="object-cover w-full h-full"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={classes} style={style}>
      {getInitials(name, email)}
    </div>
  );
}

function VaultStatus() {
  const isClient = useIsClient();
  if (!isClient) return null;

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 bg-secondary/30 rounded-2xl border border-border/50 max-w-fit">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
        <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-widest text-foreground/70">
          Vault Live
        </span>
      </div>
      <div className="hidden sm:block h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
        <Clock className="w-3.5 h-3.5 shrink-0" />
        <span
          suppressHydrationWarning
          className="text-xs font-bold font-mono min-w-[45px]"
        >
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

function UserMenu({
  name,
  email,
  image,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  return (
    <div className="relative group hidden sm:block">
      <button className="focus:outline-none">
        <Avatar name={name} email={email} image={image} />
      </button>
      <div className="absolute top-full right-0 mt-2 min-w-[200px] bg-card border border-border rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-secondary/30">
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
            Account
          </p>
          <p className="text-sm font-bold text-primary truncate">
            {name || "User"}
          </p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}

interface AppNavbarProps {
  isCollapsed?: boolean;
  onMobileSidebarToggle?: () => void;
}

export default function AppNavbar({
  isCollapsed = false,
  onMobileSidebarToggle,
}: AppNavbarProps) {
  const { data: session } = authClient.useSession();
  const isClient = useIsClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  return (
    <motion.header
      initial={false}
      animate={{
        left:
          isClient && window.innerWidth >= 768
            ? isCollapsed
              ? "80px"
              : "288px"
            : "0px",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 right-0 z-40 h-16 border-b border-border bg-sidebar/80 backdrop-blur-md flex items-center px-4 sm:px-6 gap-3 left-0 ${
        isCollapsed ? "md:left-[80px]" : "md:left-[288px]"
      }`}
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={onMobileSidebarToggle}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-sidebar shadow-sm hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground shrink-0"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Left — vault status */}
      <div className="flex-1">
        <VaultStatus />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ModeToggle />
        <div className="h-6 w-px bg-border" />

        {/* Desktop user dropdown */}
        {isClient && session?.user && (
          <UserMenu
            name={session.user.name}
            email={session.user.email}
            image={session.user.image}
          />
        )}

        {/* Mobile avatar dropdown */}
        {isClient && session?.user && (
          <div ref={dropdownRef} className="relative sm:hidden">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="focus:outline-none"
            >
              <Avatar
                name={session.user.name}
                email={session.user.email}
                image={session.user.image}
              />
            </button>

            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-52 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-border bg-secondary/30">
                    <p className="text-sm font-bold text-foreground truncate">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <SignOutButton />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.header>
  );
}