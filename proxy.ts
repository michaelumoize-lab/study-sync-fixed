// middleware.ts (or proxy.ts)
import { auth } from "@/lib/auth/server";

export default auth.middleware({
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/welcome", 
    "/account/:path*",
    "/auth/:path*",
  ],
};
