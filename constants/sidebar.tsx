import {
  Home,
  LayoutGrid,
  FileEdit,
  Clock,
  Trash2,
  BookOpen,
  Tag,
  GraduationCap,
  MessageSquare,
  Layers,
  CalendarClock,
  Settings,
  FileText,
  Focus,
} from "lucide-react";
import type { SidebarLinkConfig, SidebarGroup } from "@/types/sidebar";

// ---------------------------------------------------------------------------
// Dashboard (ungrouped — always visible at top)
// ---------------------------------------------------------------------------
export const DASHBOARD_LINK: SidebarLinkConfig = {
  label: "Dashboard",
  href: "/dashboard",
  icon: <Home className="w-5 h-5" />,
  activeColor: "bg-primary",
};

// ---------------------------------------------------------------------------
// Grouped links
// ---------------------------------------------------------------------------
export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    section: "Notes",
    links: [
      {
        label: "Vault",
        href: "/dashboard/vault",
        icon: <LayoutGrid className="w-5 h-5" />,
        activeColor: "bg-primary",
        countKey: "noteCount",
      },
      {
        label: "Drafts",
        href: "/dashboard/drafts",
        icon: <FileEdit className="w-5 h-5" />,
        activeColor: "bg-orange-400",
        countKey: "draftCount",
        isDraft: true,
      },
      {
        label: "Recent",
        href: "/dashboard/recent",
        icon: <Clock className="w-5 h-5" />,
        activeColor: "bg-primary",
      },
      {
        label: "Recently Deleted",
        href: "/dashboard/recently-deleted",
        icon: <Trash2 className="w-5 h-5" />,
        activeColor: "bg-destructive",
        countKey: "deletedCount",
      },
    ],
  },
  {
    section: "Library",
    links: [
      {
        label: "Subjects",
        href: "/dashboard/library/subjects",
        icon: <BookOpen className="w-5 h-5" />,
        activeColor: "bg-primary",
      },
      {
        label: "Tags",
        href: "/dashboard/library/tags",
        icon: <Tag className="w-5 h-5" />,
        activeColor: "bg-primary",
      },
      {
        label: "Semesters",
        href: "/dashboard/library/semesters",
        icon: <GraduationCap className="w-5 h-5" />,
        activeColor: "bg-primary",
      },
    ],
  },
  {
    section: "Study",
    links: [
      {
        label: "Study AI",
        href: "/dashboard/study",
        icon: <MessageSquare className="w-5 h-5" />,
        activeColor: "bg-primary",
        checkType: "startsWith",
      },
      {
        label: "Focus Mode",
        href: "/dashboard/focus-mode",
        icon: <Focus className="w-5 h-5" />,
        activeColor: "bg-primary",
      },
      {
        label: "Flashcards",
        href: "/dashboard/flashcards",
        icon: <Layers className="w-5 h-5" />,
        activeColor: "bg-primary",
      },
      {
        label: "Schedule",
        href: "/dashboard/schedule",
        icon: <CalendarClock className="w-5 h-5" />,
        activeColor: "bg-primary",
      },
    ],
  },
  {
    section: "Account",
    links: [
      {
        label: "Templates",
        href: "/dashboard/templates",
        icon: <FileText className="w-5 h-5" />,
        activeColor: "bg-primary",
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: <Settings className="w-5 h-5" />,
        activeColor: "bg-primary",
      },
    ],
  },
];
