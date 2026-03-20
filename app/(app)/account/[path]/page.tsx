import { AccountView } from "@neondatabase/auth/react";
import { accountViewPaths } from "@neondatabase/auth/react/ui/server";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, Home } from "lucide-react";

export const dynamicParams = false;
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="container p-4 md:p-6">
      {/* Back nav */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </Link>

        <div className="h-4 w-px bg-border" />

        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          Home
        </Link>

        <Link
          href="/dashboard/vault"
          className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Vault
        </Link>
      </div>

      <AccountView path={path} />
    </main>
  );
}
