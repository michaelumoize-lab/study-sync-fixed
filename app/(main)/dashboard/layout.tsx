"use client";

import { Sidebar } from "@/components/Shared/Sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AppNavbar from "@/components/Shared/AppNavbar";
import ScrollToTop from "@/components/Shared/ScrollToTop";
import { SidebarContext } from "@/context/SidebarContext";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Initialize based on current pathname
    return (
      pathname === "/dashboard" ||
      pathname === "/dashboard/study" ||
      pathname === "/dashboard/focus-mode"
    );
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // false on server + first client paint — matches marginLeft 0px; effect sets real value after mount.
  const [isDesktop, setIsDesktop] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);

  // Handle pathname changes - use useEffect with proper cleanup
  useEffect(() => {
    if (pathname !== previousPathname) {
      //eslint-disable-next-line react-hooks/exhaustive-deps
      setPreviousPathname(pathname);
      setIsMobileOpen(false);
      setIsCollapsed(
        pathname === "/dashboard" ||
          pathname === "/dashboard/study" ||
          pathname === "/dashboard/focus-mode",
      );
    }
  }, [pathname, previousPathname]);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <>
        <ScrollToTop />
        <div
          className="flex min-h-screen bg-sidebar font-outfit overflow-x-hidden"
          style={
            {
              "--sidebar-width": isCollapsed ? "80px" : "288px",
            } as React.CSSProperties
          }
        >
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

          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isMobileOpen={isMobileOpen}
          />

          <AppNavbar
            isCollapsed={isCollapsed}
            onMobileSidebarToggle={() => setIsMobileOpen(true)}
          />

          <motion.main
            initial={false}
            animate={{
              marginLeft: isDesktop
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
    </SidebarContext.Provider>
  );
}
