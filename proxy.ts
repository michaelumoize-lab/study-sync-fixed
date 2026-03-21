import { auth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authMiddleware = auth.middleware({
  loginUrl: "/auth/sign-in",
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";

  // Ignore static files, Next internals, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Handle access to /maintenance
  if (pathname === "/maintenance") {
    if (!maintenanceMode) {
      // Return 404 when maintenance is OFF
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
    return NextResponse.next();
  }

  // If maintenance is ON → redirect everything
  if (maintenanceMode) {
    const response = NextResponse.redirect(
      new URL("/maintenance", request.url)
    );

    // Prevent caching issues
    response.headers.set("Cache-Control", "no-store");

    return response;
  }

  // Normal authentication flow
  return authMiddleware(request);
}

export const config = {
  matcher: [
    /*
      Apply middleware to all routes except:
      - static files
      - images
      - favicon
    */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
