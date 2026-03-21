// lib/auth/session.ts
import { auth } from "@/lib/auth/server";

export async function getServerSession() {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthenticated");
  return session;
}
