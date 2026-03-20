"use client";

import { Sidebar } from "@/components/Shared/Sidebar";
import AppNavbar from "@/components/Shared/AppNavbar";
import ScrollToTop from "@/components/Shared/ScrollToTop";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsMobileOpen(false);
    setIsCollapsed(pathname === "/dashboard");
  }

  useEffect(() => {
    setMounted(true);
    setIsCollapsed(pathname === "/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ScrollToTop />
      <div className="flex min-h-screen bg-sidebar font-outfit overflow-x-hidden">
        {/* Mobile backdrop */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
        />

        {/* Navbar — hamburger lives here, wired to open sidebar */}
        <AppNavbar
          isCollapsed={isCollapsed}
          onMobileSidebarToggle={() => setIsMobileOpen(true)}
        />

        {/* Main content */}
        <motion.main
          initial={false}
          animate={{
            marginLeft:
              mounted && window.innerWidth >= 768
                ? isCollapsed
                  ? "80px"
                  : "288px"
                : "0px",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex-1 min-w-0 w-full"
        >
          <div className="max-w-5xl mx-auto px-6 md:px-10 pt-24 pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>
      </div>
    </>
  );
}
