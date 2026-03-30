"use client";
// components/Settings/SettingsClient.tsx
import dynamic from "next/dynamic";
import { useState, useRef } from "react";
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
  Camera,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

const DeleteAccountCard = dynamic(
  () => import("@neondatabase/auth/react").then((mod) => mod.DeleteAccountCard),
  { ssr: false },
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserSettingsData {
  userId: string;
  theme: string | null;
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
  userImage?: string | null;
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
// Option button
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
// Avatar uploader
// ---------------------------------------------------------------------------

function AvatarUploader({
  currentImage,
  initials,
  onUploaded,
}: {
  currentImage?: string | null;
  initials: string;
  onUploaded: (url: string | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // `displayImage` is the committed URL (either the initial one or the latest upload).
  // We never store object URLs in state — we swap straight to the real URL on success.
  const [displayImage, setDisplayImage] = useState<string | null>(
    currentImage ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const shownImage = imgError ? null : displayImage;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!ALLOWED.includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP or GIF allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5 MB.");
      return;
    }

    // Show a temporary preview while uploading, then replace with the real URL
    const objectUrl = URL.createObjectURL(file);
    setDisplayImage(objectUrl);
    setImgError(false);
    setUploading(true);
    const toastId = toast.loading("Uploading avatar...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      // NOTE: we no longer send oldUrl — the server looks it up from the DB

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Upload failed");
      }
      const { url } = await res.json();

      const { error: updateError } = await authClient.updateUser({
        image: url,
      });
      if (updateError) throw new Error(updateError.message);

      // Revoke the temporary object URL now that we have the real one
      URL.revokeObjectURL(objectUrl);

      setDisplayImage(url);
      onUploaded(url);
      toast.success("Avatar updated!", { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Avatar upload failed", {
        id: toastId,
      });
      // Revert preview back to whatever was showing before
      URL.revokeObjectURL(objectUrl);
      setDisplayImage(currentImage ?? null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    const toastId = toast.loading("Removing avatar...");
    try {
      // Server derives the blob URL from the DB — no URL sent from client
      const res = await fetch("/api/upload/avatar", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete avatar");

      // Pass null explicitly so Better Auth clears the field
      const { error } = await authClient.updateUser({ image: null });
      if (error) throw new Error(error.message);

      setDisplayImage(null);
      setImgError(false);
      onUploaded(null);
      toast.success("Avatar removed", { id: toastId });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not remove avatar",
        { id: toastId },
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black text-xl overflow-hidden">
          {shownImage ? (
            <Image
              src={shownImage}
              priority
              alt="Avatar"
              width={64}
              height={64}
              className="object-cover w-full h-full"
              onError={() => setImgError(true)}
            />
          ) : (
            initials
          )}
        </div>
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary border border-border hover:border-primary/30 text-sm font-bold transition-all disabled:opacity-50"
        >
          <Camera className="w-4 h-4" />
          {shownImage ? "Change photo" : "Upload photo"}
        </button>

        {shownImage && (
          <button
            onClick={handleRemove}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 text-destructive text-sm font-bold transition-all disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Remove photo
          </button>
        )}

        <p className="text-[10px] text-muted-foreground">
          JPEG, PNG, WebP or GIF · max 5 MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main SettingsClient
// ---------------------------------------------------------------------------

export function SettingsClient({
  initialSettings,
  userEmail,
  userName,
  userImage,
  stats,
}: SettingsClientProps) {
  const { setTheme } = useTheme();
  const router = useRouter();

  const [theme, setThemeLocal] = useState(initialSettings.theme ?? "system");
  const [autoSaveInterval, setAutoSaveInterval] = useState(
    initialSettings.autoSaveInterval ?? 30,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(userImage ?? null);

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
        body: JSON.stringify({ theme, autoSaveInterval }),
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
        {/* Avatar uploader */}
        <AvatarUploader
          currentImage={avatarUrl}
          initials={initials}
          onUploaded={(url) => setAvatarUrl(url)}
        />

        {/* Name / email summary */}
        <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl mt-4">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black text-base shrink-0 overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-foreground text-base truncate">
              {userName || "User"}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {userEmail}
            </p>
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
                <div className="w-7 h-5 rounded-lg bg-linear-to-r from-white to-zinc-900 border border-border shrink-0" />
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

      {/* Save button */}
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
