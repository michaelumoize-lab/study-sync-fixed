import { Dispatch, ReactNode, SetStateAction } from "react";

export interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  isMobileOpen?: boolean;
}

export interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  count?: number;
  active: boolean;
  activeColor: string;
  isDraft?: boolean;
  loading?: boolean;
  isCollapsed: boolean;
}

export interface SidebarLinkConfig {
  label: string;
  href: string;
  icon: ReactNode;
  activeColor?: string;
  countKey?: "noteCount" | "draftCount" | "deletedCount";
  isDraft?: boolean;
  checkType?: "startsWith" | "exact";
  subItems?: SidebarLinkConfig[];
}

export interface SidebarGroup {
  section: "Study System" | "Workspace & History" | "Notes" | "Library" | "Study" | "Account";
  links: SidebarLinkConfig[];
}
