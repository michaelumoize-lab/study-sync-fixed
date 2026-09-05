"use client";

import { createContext, useContext } from "react";
import { useSidebar as useShadcnSidebar } from "@/components/ui/sidebar";

type SidebarContextType = {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
};

export const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  try {
    const shadcn = useShadcnSidebar();
    if (shadcn) {
      return {
        ...shadcn,
        isCollapsed: shadcn.state === "collapsed",
        setIsCollapsed: (v: boolean) => shadcn.setOpen(!v),
      };
    }
  } catch {
    // Fallback if not within SidebarProvider
  }

  const ctx = useContext(SidebarContext);
  if (ctx) return ctx;

  return {
    isCollapsed: false,
    setIsCollapsed: () => {},
  };
}
