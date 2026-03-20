import { auth } from "@/lib/auth/server";
import { WelcomePageClient } from "@/components/Dashboard/WelcomePageClient";

export const dynamic = "force-dynamic";

export default async function NotesWelcomePage() {
  const { data: session } = await auth.getSession();

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return <WelcomePageClient firstName={firstName} />;
}
