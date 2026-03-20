import { AuthView } from "@neondatabase/auth/react";
import { AuthPageClient } from "@/components/Auth/AuthPageClient";

export const dynamicParams = false;

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="container min-h-screen mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <AuthPageClient />
      <AuthView path={path} />
    </main>
  );
}
