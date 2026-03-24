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
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/og-image.png"
  ) {
    return NextResponse.next();
  }

  // Handle access to /maintenance
  if (pathname === "/maintenance") {
    if (!maintenanceMode) {
      // Redirect to home when maintenance is OFF (not 404)
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // If maintenance is ON → redirect everything
  if (maintenanceMode) {
    const response = NextResponse.redirect(
      new URL("/maintenance", request.url),
    );

    // Prevent caching issues
    response.headers.set("Cache-Control", "no-store");

    return response;
  }

  // Define public routes (no authentication required)
  const publicRoutes = [
    "/", // Home/landing page
    "/auth/sign-in", // Sign in page
    "/auth/sign-up", // Sign up page (if you have one)
    "/privacy-policy",
    "/terms-of-service.pdf",
    "/data-security.pdf",
    "/sitemap.xml",
    "/robots.txt",
  ];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Allow public routes without auth
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For all other routes, run authentication middleware
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
