// app/api/auth/delete-user/route.ts
import { auth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/ratelimit";

export async function POST() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success, limit, remaining, reset } = await ratelimit.limit(`delete_user_write:${session.user.id}`);
  if (!success)
    return NextResponse.json(
      { error: "Too many requests, slow down" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      },
    );

  const { NEON_PROJECT_ID, NEON_BRANCH_ID, NEON_API_KEY } = process.env;
  if (!NEON_PROJECT_ID || !NEON_BRANCH_ID || !NEON_API_KEY) {
    console.error(
      "delete-user: missing env var(s):",
      !NEON_PROJECT_ID && "NEON_PROJECT_ID",
      !NEON_BRANCH_ID && "NEON_BRANCH_ID",
      !NEON_API_KEY && "NEON_API_KEY",
    );
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  let response: Response;
  try {
    response = await fetch(
      `https://console.neon.tech/api/v2/projects/${NEON_PROJECT_ID}/branches/${NEON_BRANCH_ID}/auth/users/${session.user.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${NEON_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    console.error("delete-user: network error contacting Neon API:", err);
    return NextResponse.json(
      { error: "Failed to reach identity provider" },
      { status: 502 },
    );
  }

  if (!response.ok && response.status !== 204) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: response.status },
    );
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("better-auth.session_token", "", { maxAge: 0 });
  res.cookies.set("better-auth.session_data", "", { maxAge: 0 });

  return res;
}
