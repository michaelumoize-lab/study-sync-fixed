"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type {
  SidebarProps,
  SidebarLinkProps,
  SidebarLinkConfig,
} from "@/types/sidebar";
import { DASHBOARD_LINK, SIDEBAR_GROUPS } from "@/constants/sidebar";
import { useVaultCounts } from "@/hooks/useVaultCounts";

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Notes: true,
    Library: true,
    Study: true,
    Account: true,
  });

  const { vaultCount, draftCount, deletedCount, loading } = useVaultCounts();

  const counts: Record<string, number> = {
    noteCount: vaultCount,
    draftCount,
    deletedCount,
  };

  useEffect(() => {
    //eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
  }, []);

  const toggleGroup = (section: string) => {
    if (collapsed) return;
    setOpenGroups((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!mounted) return null;

  const checkActive = (href: string, type?: SidebarLinkConfig["checkType"]) =>
    type === "startsWith" ? pathname.startsWith(href) : pathname === href;

  const collapsed = isCollapsed && !isMobileOpen;

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 288,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition duration-300",
          // Mobile: slide in/out via Tailwind translate
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible, override the mobile translate
          "md:translate-x-0",
          isMobileOpen ? "shadow-2xl" : "md:shadow-none",
        )}
      >
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-[72px] z-30 bg-card border border-border rounded-full p-1 shadow-md hover:scale-110 transition-transform"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Header */}
        <div
          className={cn(
            "shrink-0 px-6 pt-6 pb-3",
            collapsed && "flex flex-col items-center px-0",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2.5 mb-4",
              collapsed && "justify-center",
            )}
          >
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-primary p-1.5 rounded-lg shrink-0">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>

              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-black text-lg tracking-tight text-foreground whitespace-nowrap"
                >
                  StudySync
                </motion.span>
              )}
            </Link>
          </div>
          <div
            className={cn("h-px bg-border/60", collapsed ? "w-8" : "w-full")}
          />
        </div>

        {/* Scrollable nav */}
        <div
          className={cn(
            "flex-1 overflow-y-auto px-4 py-2 custom-scrollbar",
            collapsed && "flex flex-col items-center px-2",
          )}
        >
          <div className="mb-3 w-full">
            <SidebarLink
              href={DASHBOARD_LINK.href}
              icon={DASHBOARD_LINK.icon}
              label={DASHBOARD_LINK.label}
              active={checkActive(DASHBOARD_LINK.href)}
              activeColor={DASHBOARD_LINK.activeColor}
              isCollapsed={collapsed}
              loading={false}
            />
          </div>

          <div className="w-full space-y-1">
            {SIDEBAR_GROUPS.map((group) => {
              const isOpen = openGroups[group.section] ?? true;
              const hasActiveLink = group.links.some((link) =>
                checkActive(link.href, link.checkType),
              );

              return (
                <div key={group.section} className="mb-1">
                  {!collapsed ? (
                    <button
                      onClick={() => toggleGroup(group.section)}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1.5 rounded-xl transition-colors",
                        hasActiveLink
                          ? "text-foreground"
                          : "text-muted-foreground/50 hover:text-muted-foreground",
                      )}
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                        {group.section}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 0 : -90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={12} className="opacity-60" />
                      </motion.div>
                    </button>
                  ) : (
                    <div className="h-px bg-border/40 my-2 mx-1" />
                  )}

                  <AnimatePresence initial={false}>
                    {(isOpen || collapsed) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 pt-0.5 pb-1">
                          {group.links.map((link) => (
                            <SidebarLink
                              key={link.href}
                              href={link.href}
                              icon={link.icon}
                              label={link.label}
                              active={checkActive(link.href, link.checkType)}
                              activeColor={link.activeColor}
                              isCollapsed={collapsed}
                              loading={loading}
                              isDraft={link.isDraft}
                              count={
                                link.countKey
                                  ? counts[link.countKey]
                                  : undefined
                              }
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 pb-6 pt-2">
          <div
            className={cn(
              "p-3 rounded-2xl bg-card border border-border flex items-center transition-all",
              collapsed ? "justify-center" : "gap-3",
            )}
          >
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="text-[10px] font-black text-foreground uppercase tracking-wider whitespace-nowrap">
                  Vault Synced
                </span>
                <span className="text-[9px] text-muted-foreground font-medium whitespace-nowrap">
                  Protected
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  count,
  active,
  activeColor,
  isDraft,
  loading,
  isCollapsed,
}: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center w-full p-3 rounded-2xl font-bold transition-all",
        active
          ? "text-primary-foreground"
          : "text-muted-foreground hover:bg-card",
        isCollapsed ? "justify-center" : "justify-between",
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebarTab"
          className={cn(
            "absolute inset-0 rounded-2xl shadow-xl shadow-black/5",
            activeColor,
          )}
        />
      )}

      <div className="relative z-10 flex items-center gap-3">
        <span className="shrink-0">{icon}</span>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="whitespace-nowrap text-sm"
          >
            {label}
          </motion.span>
        )}
      </div>

      {!isCollapsed && count !== undefined && (
        <div className="relative z-10">
          {loading ? (
            <div className="w-6 h-5 bg-primary/20 rounded-lg animate-pulse" />
          ) : (
            (count > 0 || !isDraft) && (
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-lg",
                  active
                    ? "bg-primary-foreground/10"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {count}
              </span>
            )
          )}
        </div>
      )}
    </Link>
  );
}
