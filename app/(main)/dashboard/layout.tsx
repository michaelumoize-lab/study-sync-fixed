import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { AppSidebar } from "@/components/Shared/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import ScrollToTop from "@/components/Shared/ScrollToTop";

export const metadata: Metadata = {
  title: "Dashboard | StudySync",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <ScrollToTop />
        <AppSidebar user={session.user} />
        <SidebarInset className="flex h-screen flex-col overflow-hidden">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 sm:px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
              <h1 className="text-xs font-semibold truncate sm:text-sm">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
