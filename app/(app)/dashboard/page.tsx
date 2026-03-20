// app/(app)/dashboard/page.tsx
import { auth } from "@/lib/auth/server";
import { WelcomePageClient } from "@/components/Dashboard/WelcomePageClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NotesWelcomePage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <WelcomePageClient
      firstName={firstName}
      userEmail={session.user.email ?? ""}
      userName={session.user.name ?? ""}
      userCreatedAt={new Date(session.user.createdAt).toISOString()}
    />
  );
}