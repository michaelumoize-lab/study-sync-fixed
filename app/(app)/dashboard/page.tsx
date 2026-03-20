import { auth } from "@/lib/auth/server";
import { WelcomePageClient } from "@/components/Dashboard/WelcomePageClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NotesWelcomePage() {
  const { data: session } = await auth.getSession();

  if (!session?.user) redirect("/auth/login");

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <WelcomePageClient
      firstName={firstName}
      userId={session.user.id}
      email={session.user.email ?? ""}
    />
  );
}