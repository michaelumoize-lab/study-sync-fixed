// app/(app)/dashboard/page.tsx
import { getServerSession } from "@/lib/auth/session";
import { WelcomePageClient } from "@/components/Dashboard/WelcomePageClient";

export default async function NotesWelcomePage() {
  const session = await getServerSession();
  const { name, email } = session.user;

  return (
    <WelcomePageClient
      firstName={name?.split(" ")[0] ?? "there"}
      userEmail={email ?? ""}
      userName={name ?? ""}
    />
  );
}
