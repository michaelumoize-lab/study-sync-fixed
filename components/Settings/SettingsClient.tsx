"use client";
// components/Settings/SettingsClient.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Palette,
  StickyNote,
  BookOpen,
  Tag,
  Layers,
  CalendarDays,
  Save,
  Loader2,
  LogOut,
  Shield,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { DeleteAccountCard } from "@neondatabase/auth/react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserSettingsData {
  userId: string;
  theme: string | null;
  editorFont: string | null;
  autoSaveInterval: number | null;
  studyStreakCount: number | null;
  lastActiveAt: Date | string | null;
}

interface Stats {
  noteCount: number;
  subjectCount: number;
  tagCount: number;
  deckCount: number;
  eventCount: number;
}

interface SettingsClientProps {
  initialSettings: UserSettingsData;
  userEmail: string;
  userName: string;
  stats: Stats;
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-3xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-black text-foreground">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Option button (used for theme, font, view selectors)
// ---------------------------------------------------------------------------

function OptionButton({
  label,
  description,
  selected,
  onClick,
  preview,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  preview?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-3 w-full px-4 py-3 rounded-2xl border text-left transition-all",
        selected
          ? "bg-primary/10 border-primary/40 text-primary"
          : "bg-secondary/30 border-border hover:border-primary/20 text-foreground",
      )}
    >
      <div className="flex items-center gap-3">
        {preview}
        <div>
          <p
            className={cn(
              "text-sm font-bold",
              selected ? "text-primary" : "text-foreground",
            )}
          >
            {label}
          </p>
          {description && (
            <p className="text-[11px] text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {selected && <Check className="w-4 h-4 text-primary shrink-0" />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main SettingsClient
// ---------------------------------------------------------------------------

export function SettingsClient({
  initialSettings,
  userEmail,
  userName,
  stats,
}: SettingsClientProps) {
  const { setTheme, theme: currentTheme } = useTheme();
  const router = useRouter();

  const [theme, setThemeLocal] = useState(initialSettings.theme ?? "system");
  const [editorFont, setEditorFont] = useState(
    initialSettings.editorFont ?? "outfit",
  );
  const [autoSaveInterval, setAutoSaveInterval] = useState(
    initialSettings.autoSaveInterval ?? 30,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const applyTheme = (t: string) => {
    setThemeLocal(t);
    setTheme(t);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          editorFont,
          autoSaveInterval,
        }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/sign-in");
  };

  const initials =
    userName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || userEmail[0]?.toUpperCase();

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Page header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <Section title="Profile" icon={User}>
        <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black text-xl shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-bold text-foreground text-base">
              {userName || "User"}
            </p>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </div>

        {/* Account stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {[
            { label: "Notes", value: stats.noteCount, icon: StickyNote },
            { label: "Subjects", value: stats.subjectCount, icon: BookOpen },
            { label: "Tags", value: stats.tagCount, icon: Tag },
            { label: "Decks", value: stats.deckCount, icon: Layers },
            { label: "Events", value: stats.eventCount, icon: CalendarDays },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-3 bg-secondary/30 rounded-2xl"
            >
              <Icon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-base font-black text-foreground leading-none">
                  {value}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon={Palette}>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
            Theme
          </label>
          {[
            {
              value: "light",
              label: "Light",
              description: "Clean white interface",
              preview: (
                <div className="w-7 h-5 rounded-lg bg-white border border-border shrink-0" />
              ),
            },
            {
              value: "dark",
              label: "Dark",
              description: "Easy on the eyes",
              preview: (
                <div className="w-7 h-5 rounded-lg bg-zinc-900 border border-zinc-700 shrink-0" />
              ),
            },
            {
              value: "system",
              label: "System",
              description: "Follows your OS preference",
              preview: (
                <div className="w-7 h-5 rounded-lg bg-gradient-to-r from-white to-zinc-900 border border-border shrink-0" />
              ),
            },
          ].map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={theme === opt.value}
              onClick={() => applyTheme(opt.value)}
              preview={opt.preview}
            />
          ))}
        </div>
      </Section>

      {/* Editor Preferences */}
      <Section title="Editor" icon={StickyNote}>
        <div className="space-y-5">
          {/* Auto-save interval */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
              Auto-save Interval —{" "}
              <span className="text-primary">
                {autoSaveInterval === 0
                  ? "disabled"
                  : `every ${autoSaveInterval}s`}
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={120}
              step={10}
              value={autoSaveInterval}
              onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Off</span>
              <span>120s (slower)</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Account actions */}
      <Section title="Account" icon={Shield}>
        <div className="space-y-3">
          <Link
            href="/account/security"
            className="flex items-center justify-between px-4 py-3 bg-secondary/30 rounded-2xl border border-border hover:border-primary/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <div>
                <p className="text-sm font-bold text-foreground">Security</p>
                <p className="text-[11px] text-muted-foreground">
                  Change password, manage sessions
                </p>
              </div>
            </div>
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 bg-destructive/5 border border-destructive/20 rounded-2xl hover:bg-destructive/10 transition-all group"
          >
            <LogOut className="w-4 h-4 text-destructive" />
            <div className="text-left">
              <p className="text-sm font-bold text-destructive">Sign Out</p>
              <p className="text-[11px] text-muted-foreground">
                Sign out of your account
              </p>
            </div>
          </button>

          <DeleteAccountCard />
        </div>
      </Section>

      {/* Save button — sticky at bottom */}
      <div className="sticky bottom-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 disabled:opacity-60 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
