"use client";

import { useState, useEffect } from "react";
import { useRedirectToast } from "@/hooks/useRedirectToast";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type Step = "auth" | "verify";
type Mode = "sign-in" | "sign-up";

const RESEND_COOLDOWN = 60;

export function AuthPageClient() {
  useRedirectToast();

  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [step, setStep] = useState<Step>("auth");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Shared helper — sends a new OTP and jumps to the verify screen
  const goToVerify = async (emailToVerify: string) => {
    try {
      await authClient.sendVerificationEmail({
        email: emailToVerify,
        callbackURL: window.location.origin + "/welcome",
      });
    } catch {
      // ignore — the OTP screen will let them resend manually
    }
    setEmail(emailToVerify);
    setStep("verify");
    setResendCooldown(RESEND_COOLDOWN);
  };

  // ── Sign up ────────────────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: name || email.split("@")[0],
      });

      if (error) {
        // User signed up before but never verified — resend code and go to verify
        if (
          error.message?.toLowerCase().includes("already exists") ||
          error.message?.toLowerCase().includes("user already")
        ) {
          toast("Account exists but not verified — sending a new code.", {
            icon: "📧",
          });
          await goToVerify(email);
          return;
        }
        throw new Error(error.message);
      }

      if (data?.user && !data.user.emailVerified) {
        toast.success("Verification code sent to your email!");
        setStep("verify");
        setResendCooldown(RESEND_COOLDOWN);
      } else {
        router.push("/welcome");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Sign in ────────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        if (
          error.message?.toLowerCase().includes("not verified") ||
          error.message?.toLowerCase().includes("email not verified") ||
          error.message?.toLowerCase().includes("verify your email")
        ) {
          toast("Please verify your email first — sending a new code.", {
            icon: "📧",
          });
          await goToVerify(email);
          return;
        }
        throw new Error(error.message);
      }

      // Redirect regardless of what data contains
      router.push("/welcome");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP ─────────────────────────────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
      });

      if (error) throw new Error(error.message);

      toast.success("Email verified! Welcome to StudySync 🎉");
      router.push("/welcome");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: window.location.origin + "/welcome",
      });
      if (error) throw new Error(error.message);
      toast.success("New code sent! Check your inbox.");
      setResendCooldown(RESEND_COOLDOWN);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resend");
    }
  };

  // ── Google OAuth ───────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/welcome", // returning users go to dashboard
      newUserCallbackURL: "/welcome", // new users go to welcome splash
      errorCallbackURL: "/auth/sign-in",
    });
  };

  // ── OTP verification screen ────────────────────────────────────────────────
  if (step === "verify") {
    return (
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-4xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-black text-foreground">
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              We sent a verification code to{" "}
              <span className="font-bold text-foreground">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-center text-2xl font-black tracking-[0.5em] outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Verify Email
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?{" "}
              {resendCooldown > 0 ? (
                <span className="text-muted-foreground font-bold">
                  Resend in{" "}
                  <span className="text-primary tabular-nums">
                    {resendCooldown}s
                  </span>
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-primary font-bold hover:underline"
                >
                  Resend
                </button>
              )}
            </p>
            <button
              onClick={() => setStep("auth")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main auth screen ───────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md">
      <div className="bg-card border border-border rounded-4xl p-8 shadow-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="bg-primary p-1.5 rounded-lg transition-transform group-hover:scale-110">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              StudySync
            </span>
          </Link>
          <h1 className="text-2xl font-black text-foreground">
            {mode === "sign-in" ? "Welcome back" : "Create your vault"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "sign-in"
              ? "Sign in to access your notes"
              : "Start your academic journey"}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 bg-secondary border border-border rounded-2xl font-bold text-sm hover:border-primary/30 transition-all mb-6"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-xs text-muted-foreground font-bold uppercase tracking-widest">
              or
            </span>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={mode === "sign-in" ? handleSignIn : handleSignUp}
          className="space-y-4"
        >
          {mode === "sign-up" && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-base md:text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-base md:text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              {mode === "sign-in" && (
                <Link
                  href="/auth/forgot-password"
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 pr-11 text-base md:text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-primary/20 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "sign-in" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Toggle mode */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "sign-in" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setMode("sign-up")}
                className="text-primary font-bold hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("sign-in")}
                className="text-primary font-bold hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
