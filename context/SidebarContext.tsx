// context/SidebarContext.tsx
"use client";
import { createContext, useContext } from "react";

type SidebarContextType = {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
};

export const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within DashboardLayout");
  return ctx;
}
