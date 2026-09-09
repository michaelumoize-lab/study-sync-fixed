import {
  Home,
  GraduationCap,
  FolderArchive,
  Sparkles,
  Bot,
  HelpCircle,
  Layers,
  Brain,
  RotateCcw,
  BarChart3,
  PenLine,
  Clock,
  Trash2,
} from "lucide-react";
import type { SidebarLinkConfig, SidebarGroup } from "@/types/sidebar";

export const HOME_LINK: SidebarLinkConfig = {
  label: "Home",
  href: "/dashboard",
  icon: <Home className="w-4 h-4" />,
  checkType: "exact",
};

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    section: "Study System",
    links: [
      {
        label: "Home",
        href: "/dashboard",
        icon: <Home className="w-4 h-4" />,
        checkType: "exact",
      },
      {
        label: "My Courses",
        href: "/dashboard/courses",
        icon: <GraduationCap className="w-4 h-4" />,
      },
      {
        label: "Vault",
        href: "/dashboard/vault",
        icon: <FolderArchive className="w-4 h-4" />,
        countKey: "noteCount",
      },
      {
        label: "Study",
        href: "/dashboard/study",
        icon: <Sparkles className="w-4 h-4" />,
        subItems: [
          {
            label: "AI Tutor",
            href: "/dashboard/study",
            icon: <Bot className="w-3.5 h-3.5" />,
            checkType: "exact",
          },
          {
            label: "Quizzes",
            href: "/dashboard/study/quizzes",
            icon: <HelpCircle className="w-3.5 h-3.5" />,
          },
          {
            label: "Flashcards",
            href: "/dashboard/flashcards",
            icon: <Layers className="w-3.5 h-3.5" />,
          },
          {
            label: "Practice",
            href: "/dashboard/study/practice",
            icon: <Brain className="w-3.5 h-3.5" />,
          },
        ],
      },
      {
        label: "Review",
        href: "/dashboard/review",
        icon: <RotateCcw className="w-4 h-4" />,
      },
      {
        label: "Progress",
        href: "/dashboard/progress",
        icon: <BarChart3 className="w-4 h-4" />,
      },
    ],
  },
  {
    section: "Workspace & History",
    links: [
      {
        label: "Workspace",
        href: "/dashboard/workspace",
        icon: <PenLine className="w-4 h-4" />,
        countKey: "draftCount",
      },
      {
        label: "Recent",
        href: "/dashboard/recent",
        icon: <Clock className="w-4 h-4" />,
      },
      {
        label: "Recently Deleted",
        href: "/dashboard/recently-deleted",
        icon: <Trash2 className="w-4 h-4" />,
        countKey: "deletedCount",
      },
    ],
  },
];
