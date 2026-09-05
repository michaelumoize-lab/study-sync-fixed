import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { admin, multiSession, emailOTP, lastLoginMethod } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import * as React from "react";
import { render } from "@react-email/render";
import { sendEmail } from "@/lib/email";
import { ResetPasswordEmail } from "@/components/auth/email/reset-password";
import { EmailVerificationEmail } from "@/components/auth/email/email-verification";
import { ChangeEmailConfirmationEmail } from "@/components/auth/email/change-email-confirmation";
import { OtpEmail } from "@/components/auth/email/otp-email";

const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000";

if (!BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET environment variable is required");
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: BETTER_AUTH_SECRET,
  baseURL: APP_URL,

  plugins: [
    admin({
      defaultRole: "USER",
      adminRole: "ADMIN",
    }),
    multiSession(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        let subject = "Your verification code";
        if (type === "email-verification") {
          subject = "Verify your email address";
        } else if (type === "change-email") {
          subject = "Verify your new email address";
        } else if (type === "forget-password") {
          subject = "Reset your password code";
        } else if (type === "sign-in") {
          subject = "Sign in verification code";
        }

        const html = await render(
          React.createElement(OtpEmail, {
            verificationCode: otp,
            email,
            appName: "StudySync",
            expirationMinutes: 10,
          })
        );

        await sendEmail({
          to: email,
          subject,
          text: `Your verification code is: ${otp}`,
          html,
        });
      },
      sendVerificationOnSignUp: true,
    }) as any,
    lastLoginMethod(),
    nextCookies(),
  ],

  trustedOrigins: [APP_URL],

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
      try {
        const html = await render(
          React.createElement(ResetPasswordEmail, {
            url,
            email: user.email,
            appName: "StudySync",
            expirationMinutes: 60,
          })
        );
        await sendEmail({
          to: user.email,
          subject: "Reset your password",
          text: `Reset your password: ${url}`,
          html,
        });
      } catch (error) {
        console.error("Failed to send reset password email", error);
      }
    },
    revokeSessionsOnPasswordReset: true,
  },

  emailVerification: {
    enabled: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
      try {
        const html = await render(
          React.createElement(EmailVerificationEmail, {
            url,
            email: user.email,
            appName: "StudySync",
            expirationMinutes: 60,
          })
        );
        await sendEmail({
          to: user.email,
          subject: "Verify your email address",
          text: `Verify your email: ${url}`,
          html,
        });
      } catch (error) {
        console.error("Failed to send verification email", error);
      }
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({
        user,
        newEmail,
        url,
      }: {
        user: { email: string };
        newEmail: string;
        url: string;
      }) => {
        try {
          const html = await render(
            React.createElement(ChangeEmailConfirmationEmail, {
              url,
              currentEmail: user.email,
              newEmail,
              appName: "StudySync",
              expirationMinutes: 60,
            })
          );
          await sendEmail({
            to: newEmail,
            subject: "Verify your new email address",
            text: `Click the link to verify your new email: ${url}`,
            html,
          });
        } catch (error) {
          console.error("Failed to send change email verification email", error);
        }
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({
        user,
        url,
      }: {
        user: { email: string };
        url: string;
      }) => {
        try {
          await sendEmail({
            to: user.email,
            subject: "Confirm account deletion",
            text: `Click the link to confirm deleting your account: ${url}`,
          });
        } catch (error) {
          console.error("Failed to send account deletion email", error);
        }
      },
    },
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },

  advanced: {
    disableErrorPage: true,
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
    onAPIError: {
      disableErrorPage: true,
    },
  },
});

// TypeScript exports for frontend and backend use
export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
