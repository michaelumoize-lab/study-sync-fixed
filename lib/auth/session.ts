// lib/auth/session.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getServerSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthenticated");
  return session;
}
