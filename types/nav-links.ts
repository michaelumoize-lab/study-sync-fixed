import { LayoutGrid, Clock, FileEdit, MessageSquare } from "lucide-react";

export const GUEST_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
];

export const AUTH_LINKS = [
  {
    label: "Vault",
    href: "/dashboard/vault",
    icon: LayoutGrid,
    color: "text-primary",
    countKey: "noteCount" as const,
  },
  {
    label: "Drafts",
    href: "/dashboard/drafts",
    icon: FileEdit,
    color: "text-orange-400",
    countKey: "draftCount" as const,
  },
  {
    label: "Recent",
    href: "/dashboard/recent",
    icon: Clock,
    color: "text-primary",
  },
  {
    label: "Study AI",
    href: "/dashboard/study",
    icon: MessageSquare,
    color: "text-primary",
  },
];

export type NavbarProps = {
  noteCount?: number;
  draftCount?: number;
  loading?: boolean;
  isCollapsed?: boolean;
};

export type CountKey = "noteCount" | "draftCount";
