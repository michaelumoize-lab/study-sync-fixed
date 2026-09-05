"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
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
  ChevronRight,
  BookOpen,
  Settings,
  LogOut,
  Loader2,
  LucideIcon,
  Zap,
} from "lucide-react";
import { useSignOut } from "@/hooks/use-sign-out";
import { useVaultCounts } from "@/hooks/useVaultCounts";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "@/components/user-avatar";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";

interface AppSidebarProps extends React.ComponentProps<typeof ShadcnSidebar> {
  user?: any;
  isCollapsed?: boolean;
  setIsCollapsed?: (val: boolean) => void;
  isMobileOpen?: boolean;
}

interface SubNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  countKey?: "noteCount" | "draftCount" | "deletedCount";
  exact?: boolean;
  subItems?: SubNavItem[];
}

export function AppSidebar({ user: userProp, className, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const { signOut, isLoading } = useSignOut();
  const { data: session } = authClient.useSession();
  const { vaultCount, draftCount, deletedCount } = useVaultCounts();

  const [commandOpen, setCommandOpen] = React.useState(false);

  // Auto-open Study sub-menu if current route is within Study or Flashcards
  const isStudyActive =
    pathname.startsWith("/dashboard/study") ||
    pathname.startsWith("/dashboard/flashcards");
  const [studyOpen, setStudyOpen] = React.useState(true);

  React.useEffect(() => {
    if (isStudyActive) {
      setStudyOpen(true);
    }
  }, [isStudyActive]);

  // Global ⌘K / Ctrl+K keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const user = userProp || session?.user;

  const counts: Record<string, number> = {
    noteCount: vaultCount,
    draftCount,
    deletedCount,
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleCommandSelect = (href: string) => {
    setCommandOpen(false);
    handleNavClick();
    router.push(href);
  };

  const isItemActive = (href: string, exact: boolean = false) => {
    if (exact || href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // 1. Primary "Study System" Navigation
  const primaryNavItems: NavItem[] = [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
      exact: true,
    },
    {
      title: "My Courses",
      href: "/dashboard/courses",
      icon: GraduationCap,
    },
    {
      title: "Vault",
      href: "/dashboard/vault",
      icon: FolderArchive,
      countKey: "noteCount",
    },
  ];

  // 2. Study Sub-items
  const studySubItems: SubNavItem[] = [
    {
      title: "AI Tutor",
      href: "/dashboard/study",
      icon: Bot,
      exact: true,
    },
    {
      title: "Quizzes",
      href: "/dashboard/study/quizzes",
      icon: HelpCircle,
    },
    {
      title: "Flashcards",
      href: "/dashboard/flashcards",
      icon: Layers,
    },
    {
      title: "Practice",
      href: "/dashboard/study/practice",
      icon: Brain,
    },
  ];

  // 3. Review & Progress
  const learningEngineItems: NavItem[] = [
    {
      title: "Review",
      href: "/dashboard/review",
      icon: RotateCcw,
    },
    {
      title: "Progress",
      href: "/dashboard/progress",
      icon: BarChart3,
    },
  ];

  // 4. Secondary Navigation
  const secondaryNavItems: NavItem[] = [
    {
      title: "Workspace",
      href: "/dashboard/workspace",
      icon: PenLine,
      countKey: "draftCount",
    },
    {
      title: "Recent",
      href: "/dashboard/recent",
      icon: Clock,
    },
    {
      title: "Recently Deleted",
      href: "/dashboard/recently-deleted",
      icon: Trash2,
      countKey: "deletedCount",
    },
  ];

  return (
    <>
      <ShadcnSidebar collapsible="icon" className={className} {...props}>
        {/* Sticky Header with Logo */}
        <SidebarHeader className="shrink-0 border-b border-sidebar-border gap-2 p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/" onClick={handleNavClick}>
                  <div className="flex items-center gap-2.5">
                    <div className="bg-primary p-1.5 rounded-xl shrink-0 flex items-center justify-center text-primary-foreground shadow-xs">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                      <span className="font-black text-base tracking-tight text-foreground whitespace-nowrap">
                        StudySync
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Smart Study System
                      </span>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Search / ⌘K Button */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setCommandOpen(true)}
                tooltip="Search StudySync (⌘K)"
                className="w-full bg-sidebar-accent/50 border border-sidebar-border hover:bg-sidebar-accent transition-colors rounded-xl h-9 px-2.5 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center"
              >
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium truncate flex-1 text-left group-data-[collapsible=icon]:hidden">
                  Search StudySync...
                </span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-sidebar-border bg-background/80 px-1.5 font-mono text-[10px] font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden sm:inline-flex">
                  <span className="text-[10px]">⌘</span>K
                </kbd>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Navigation Content */}
        <SidebarContent className="flex-1 overflow-y-auto px-2 py-2 gap-1">
          {/* Main Study System Group */}
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 px-2 mb-1">
              Study System
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Home, Courses, Vault */}
                {primaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item.href, item.exact);
                  const count = item.countKey ? counts[item.countKey] : undefined;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className="rounded-xl font-medium"
                      >
                        <Link href={item.href} onClick={handleNavClick}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {count !== undefined && count > 0 && (
                            <SidebarMenuBadge>{count}</SidebarMenuBadge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                {/* Collapsible Study Node */}
                <Collapsible
                  open={studyOpen}
                  onOpenChange={setStudyOpen}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={isStudyActive}
                        tooltip="Study"
                        className="rounded-xl font-medium w-full"
                      >
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>Study</span>
                        <ChevronRight className="ml-auto h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden text-muted-foreground" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="my-1 ml-4 border-l border-sidebar-border/70 pl-2">
                        {studySubItems.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = isItemActive(
                            subItem.href,
                            subItem.exact,
                          );

                          return (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isSubActive}
                                className="rounded-lg text-xs font-medium h-8"
                              >
                                <Link
                                  href={subItem.href}
                                  onClick={handleNavClick}
                                >
                                  <SubIcon className="h-3.5 w-3.5" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Review & Progress */}
                {learningEngineItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item.href, item.exact);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className="rounded-xl font-medium"
                      >
                        <Link href={item.href} onClick={handleNavClick}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Separator between Core and Secondary */}
          <div className="py-2 px-2">
            <SidebarSeparator className="bg-sidebar-border/60" />
          </div>

          {/* Secondary Group: Workspace, Recent, Recently Deleted */}
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 px-2 mb-1">
              Workspace & History
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item.href, item.exact);
                  const count = item.countKey ? counts[item.countKey] : undefined;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className="rounded-xl font-medium"
                      >
                        <Link href={item.href} onClick={handleNavClick}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {count !== undefined && count > 0 && (
                            <SidebarMenuBadge>{count}</SidebarMenuBadge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sticky Footer with User Avatar, Settings & Logout */}
        <SidebarFooter className="shrink-0 border-t border-sidebar-border p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-2 p-1 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                <UserAvatar user={(user as any) ?? undefined} className="h-8 w-8 shrink-0 rounded-lg" />
                <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden min-w-0">
                  <span className="truncate font-semibold text-foreground">
                    {user?.name || user?.email || "Student"}
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {user?.email || "Signed In"}
                  </span>
                </div>
                <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                  <SidebarMenuButton
                    size="sm"
                    asChild
                    tooltip="Settings"
                    className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Link href="/dashboard/settings" onClick={handleNavClick}>
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuButton
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-destructive cursor-pointer"
                    onClick={handleLogout}
                    disabled={isLoading}
                    tooltip="Logout"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    <span className="sr-only">Logout</span>
                  </SidebarMenuButton>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </ShadcnSidebar>

      {/* Global ⌘K Command Dialog */}
      <CommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        title="Global Search"
        description="Search across courses, materials, concepts and actions"
      >
        <CommandInput placeholder="Search StudySync or type a command..." />
        <CommandList className="max-h-[350px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* AI Shortcuts */}
          <CommandGroup heading="AI Intelligence">
            <CommandItem
              onSelect={() => handleCommandSelect("/dashboard/study")}
              className="cursor-pointer gap-2.5"
            >
              <Bot className="h-4 w-4 text-primary" />
              <span>Ask StudySync AI</span>
              <CommandShortcut>AI</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => handleCommandSelect("/dashboard/study")}
              className="cursor-pointer gap-2.5"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Explain a Concept</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* Quick Learning Actions */}
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => handleCommandSelect("/dashboard/review")}
              className="cursor-pointer gap-2.5"
            >
              <RotateCcw className="h-4 w-4 text-amber-500" />
              <span>Start Today&apos;s Review</span>
              <CommandShortcut>Due</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => handleCommandSelect("/dashboard/study/quizzes")}
              className="cursor-pointer gap-2.5"
            >
              <HelpCircle className="h-4 w-4 text-blue-500" />
              <span>Take Adaptive Quiz</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleCommandSelect("/dashboard/flashcards")}
              className="cursor-pointer gap-2.5"
            >
              <Layers className="h-4 w-4 text-emerald-500" />
              <span>Review Flashcards</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleCommandSelect("/dashboard/vault")}
              className="cursor-pointer gap-2.5"
            >
              <FolderArchive className="h-4 w-4 text-indigo-500" />
              <span>Open Knowledge Vault</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* Navigation Destination */}
          <CommandGroup heading="Navigate">
            <CommandItem
              onSelect={() => handleCommandSelect("/dashboard")}
              className="cursor-pointer gap-2.5"
            >
              <Home className="h-4 w-4" />
              <span>Home Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleCommandSelect("/dashboard/courses")}
              className="cursor-pointer gap-2.5"
            >
              <GraduationCap className="h-4 w-4" />
              <span>My Courses</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleCommandSelect("/dashboard/vault")}
              className="cursor-pointer gap-2.5"
            >
              <FolderArchive className="h-4 w-4" />
              <span>Vault</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleCommandSelect("/dashboard/progress")}
              className="cursor-pointer gap-2.5"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Learning Progress & Mastery</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleCommandSelect("/dashboard/workspace")}
              className="cursor-pointer gap-2.5"
            >
              <PenLine className="h-4 w-4" />
              <span>Workspace</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleCommandSelect("/dashboard/recent")}
              className="cursor-pointer gap-2.5"
            >
              <Clock className="h-4 w-4" />
              <span>Recent Materials</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleCommandSelect("/dashboard/settings")}
              className="cursor-pointer gap-2.5"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

// Re-export for compatibility
export { AppSidebar as Sidebar };
