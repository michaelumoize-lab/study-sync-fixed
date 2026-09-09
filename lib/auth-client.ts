import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";
import {
  inferAdditionalFields,
  adminClient,
  multiSessionClient,
  emailOTPClient,
  lastLoginMethodClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
    multiSessionClient(),
    emailOTPClient(),
    lastLoginMethodClient(),
  ],
});

export type AuthClient = typeof authClient;

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  changeEmail,
  sendVerificationEmail,
  emailOtp,
} = authClient;

export type SessionData = Awaited<ReturnType<typeof useSession>>["data"];

