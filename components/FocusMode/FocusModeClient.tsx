"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Save,
  X,
  ChevronDown,
  Music,
  Music2,
  Volume2,
  VolumeX,
  Timer,
  TimerOff,
  Check,
  Loader2,
  Moon,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { NoteEditor } from "@/components/Notes/NoteEditor";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { usePostHog } from "posthog-js/react";
import { apiFetch } from "@/lib/api";

interface NoteStub {
  id: string;
  title: string;
}

interface FocusModeClientProps {
  initialNotes: NoteStub[];
}

const TRACKS = [
  {
    id: "lofi",
    label: "Lo-Fi Beats",
    emoji: "🎵",
    url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1&playlist=jfKfPfyJRdk",
  },
  {
    id: "rain",
    label: "Rain & Thunder",
    emoji: "🌧️",
    url: "https://www.youtube.com/embed/mPZkdNFkNps?autoplay=1&loop=1&playlist=mPZkdNFkNps",
  },
  {
    id: "forest",
    label: "Forest Sounds",
    emoji: "🌿",
    url: "https://www.youtube.com/embed/xNN7iTA57jM?autoplay=1&loop=1&playlist=xNN7iTA57jM",
  },
  {
    id: "cafe",
    label: "Coffee Shop",
    emoji: "☕",
    url: "https://www.youtube.com/embed/lTRiuFIWV54?autoplay=1&loop=1&playlist=lTRiuFIWV54",
  },
  {
    id: "jazz",
    label: "Jazz Cafe",
    emoji: "🎷",
    url: "https://www.youtube.com/embed/Dx5qFachd3A?autoplay=1&loop=1&playlist=Dx5qFachd3A",
  },
  {
    id: "classical",
    label: "Classical Focus",
    emoji: "🎻",
    url: "https://www.youtube.com/embed/mUSZ9JGLNtA?autoplay=1&loop=1&playlist=mUSZ9JGLNtA",
  },
  {
    id: "deepfocus",
    label: "Deep Focus",
    emoji: "🧠",
    url: "https://www.youtube.com/embed/9YhFhsTzmJ8?autoplay=1&loop=1&playlist=9YhFhsTzmJ8",
  },
  {
    id: "nature",
    label: "Ocean Waves",
    emoji: "🌊",
    url: "https://www.youtube.com/embed/bn9F19Hi1Lk?autoplay=1&loop=1&playlist=bn9F19Hi1Lk",
  },
  {
    id: "piano",
    label: "Solo Piano",
    emoji: "🎹",
    url: "https://www.youtube.com/embed/4oStw0r33so?autoplay=1&loop=1&playlist=4oStw0r33so",
  },
  {
    id: "hiphop",
    label: "Study Hip-Hop",
    emoji: "🎧",
    url: "https://www.youtube.com/embed/n8X9_MgEdCg?autoplay=1&loop=1&playlist=n8X9_MgEdCg",
  },
];

export function FocusModeClient({ initialNotes }: FocusModeClientProps) {
  const posthog = usePostHog();

  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Music
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [loadingNote, setLoadingNote] = useState(false);

  // Auto-save refs
  const isDirtyRef = useRef(false);
  const titleRef = useRef(title);
  const contentRef = useRef(content);

  const posthogRef = useRef(posthog);
  const selectedPresetRef = useRef(selectedPreset);

  useEffect(() => {
    posthogRef.current = posthog;
  }, [posthog]);
  useEffect(() => {
    selectedPresetRef.current = selectedPreset;
  }, [selectedPreset]);

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    contentRef.current = content;
    isDirtyRef.current = true;
  }, [content]);

  // Load note when selected
  useEffect(() => {
    if (!selectedNoteId) {
      setTitle("");
      setContent("");
      return;
    }
    setLoadingNote(true);
    fetch(`/api/vault/${selectedNoteId}`)
      .then((r) => r.json())
      .then((data) => {
        const note = data.note ?? data;
        setTitle(note.title ?? "");
        setContent(note.content ?? "");
        isDirtyRef.current = false;
      })
      .catch(() => toast.error("Failed to load note"))
      .finally(() => setLoadingNote(false));
  }, [selectedNoteId]);

  // Timer countdown
  useEffect(() => {
    if (!timerRunning) return;

    timerRef.current = setInterval(() => {
      setTimerSeconds((s) => {
        if (s <= 1) {
          setTimerRunning(false);
          posthogRef.current.capture("focus_session_completed", {
            duration_seconds: selectedPresetRef.current ?? 25 * 60,
          });
          toast.success("⏰ Focus session complete!", { duration: 5000 });
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]); 

  // Sync isFullscreen with actual browser fullscreen state (e.g. Escape key exit)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Send mute/unMute command to YouTube player via postMessage
  // without touching the iframe src (which would cause a reload)
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !activeTrack) return;
    iframe.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: isMuted ? "mute" : "unMute",
        args: [],
      }),
      "*",
    );
  }, [isMuted, activeTrack]);

  const startTimer = (seconds: number) => {
    posthog.capture("focus_session_started", { duration_seconds: seconds });
    setTimerSeconds(seconds);
    setSelectedPreset(seconds);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    posthog.capture("focus_session_stopped", {
      seconds_remaining: timerSeconds,
      duration_seconds: selectedPreset ?? 25 * 60,
    });
    setTimerRunning(false);
    setTimerSeconds(0);
    setSelectedPreset(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // Auto-save every 30 s
  const autoSave = useCallback(async () => {
    if (!isDirtyRef.current || !selectedNoteId || !titleRef.current.trim())
      return;
    try {
      const res = await apiFetch(`/api/vault/${selectedNoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleRef.current,
          content: contentRef.current,
        }),
      });
      if (res.ok) {
        isDirtyRef.current = false;
        posthogRef.current.capture("note_saved", { method: "auto" });
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
      }
    } catch {}
  }, [selectedNoteId]);

  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  const handleSave = async () => {
    if (!selectedNoteId || !title.trim()) return;
    setIsSaving(true);
    try {
      const res = await apiFetch(`/api/vault/${selectedNoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        isDirtyRef.current = false;
        posthog.capture("note_saved", { method: "manual" });
        toast.success("Note saved");
      } else {
        toast.error("Save failed");
      }
    } catch {
      toast.error("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Stable iframe src — only changes when activeTrack changes, never on mute toggle.
  // &enablejsapi=1 is required for postMessage mute commands to work.
  const activeTrackSrc = activeTrack
    ? `${TRACKS.find((t) => t.id === activeTrack)!.url}&enablejsapi=1`
    : undefined;

  return (
    <div className="min-h-screen flex flex-col gap-6">
      {/* Hidden YouTube iframe for music */}
      {activeTrack && (
        <iframe
          ref={iframeRef}
          src={activeTrackSrc}
          className="hidden"
          allow="autoplay"
          title="Ambient music player"
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">Focus Mode</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Distraction-free writing for deep study sessions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {autoSaved && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-xs font-bold text-green-500"
              >
                <Check className="w-3.5 h-3.5" /> Auto-saved
              </motion.span>
            )}
          </AnimatePresence>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-all"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Note selector */}
        <div className="relative flex-1 min-w-[200px]">
          <select
            value={selectedNoteId}
            onChange={(e) => setSelectedNoteId(e.target.value)}
            className="w-full appearance-none bg-secondary border border-border rounded-2xl px-4 py-3 pr-10 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
          >
            <option value="">— New session / select note —</option>
            {initialNotes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.title}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Music button */}
        <button
          onClick={() => setShowMusic((v) => !v)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all border",
            activeTrack
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-secondary border-border text-muted-foreground hover:border-primary/30",
          )}
        >
          <Music className="w-4 h-4" />
          {activeTrack
            ? TRACKS.find((t) => t.id === activeTrack)?.label
            : "Ambient Music"}
        </button>

        {/* Mute toggle */}
        {activeTrack && (
          <button
            onClick={() => setIsMuted((v) => !v)}
            className="p-3 rounded-2xl bg-secondary border border-border hover:border-primary/30 transition-all"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Volume2 className="w-4 h-4 text-primary" />
            )}
          </button>
        )}

        {/* Timer button */}
        <button
          onClick={() => setShowTimer((v) => !v)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all border",
            timerRunning
              ? "bg-orange-500/10 border-orange-500/30 text-orange-500"
              : "bg-secondary border-border text-muted-foreground hover:border-primary/30",
          )}
        >
          <Timer className="w-4 h-4" />
          {timerRunning ? formatTime(timerSeconds) : "Focus Timer"}
        </button>

        {/* Save */}
        {selectedNoteId && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
        )}
      </div>

      {/* Music panel */}
      <AnimatePresence>
        {showMusic && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-secondary/50 border border-border rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Music2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                  Ambient Sounds
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRACKS.map((track) => (
                  <button
                    key={track.id}
                    onClick={() =>
                      setActiveTrack(activeTrack === track.id ? null : track.id)
                    }
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all border",
                      activeTrack === track.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/40 text-foreground",
                    )}
                  >
                    <span>{track.emoji}</span>
                    {track.label}
                    {activeTrack === track.id && (
                      <X
                        className="w-3 h-3 ml-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTrack(null);
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-3 font-bold uppercase tracking-widest">
                Powered by YouTube • Requires internet connection
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer panel */}
      <AnimatePresence>
        {showTimer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-secondary/50 border border-border rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                    Pomodoro Timer
                  </span>
                </div>
                {timerRunning && (
                  <span className="text-2xl font-black text-orange-500 tabular-nums">
                    {formatTime(timerSeconds)}
                  </span>
                )}
              </div>

              {!timerRunning && (
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-bold">
                      5 min
                    </span>
                    <span className="text-lg font-black text-foreground tabular-nums">
                      {formatTime(selectedPreset ?? 25 * 60)}
                    </span>
                    <span className="text-xs text-muted-foreground font-bold">
                      120 min
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5 * 60}
                    max={120 * 60}
                    step={5 * 60}
                    value={selectedPreset ?? 25 * 60}
                    onChange={(e) => setSelectedPreset(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary bg-secondary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest px-0.5">
                    <span>5</span>
                    <span>30</span>
                    <span>60</span>
                    <span>90</span>
                    <span>120</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {!timerRunning ? (
                  <button
                    onClick={() => {
                      startTimer(selectedPreset ?? 25 * 60);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all"
                  >
                    <Timer className="w-4 h-4" /> Start Focus Session
                  </button>
                ) : (
                  <>
                    <div className="flex-1 bg-secondary rounded-2xl overflow-hidden h-10">
                      <div
                        className="h-full bg-orange-500/30 transition-all duration-1000"
                        style={{
                          width: `${(timerSeconds / (selectedPreset ?? 25 * 60)) * 100}%`,
                        }}
                      />
                    </div>
                    <button
                      onClick={stopTimer}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white transition-all"
                    >
                      <TimerOff className="w-4 h-4" /> Stop
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <div className="bg-card border border-border rounded-[2rem] overflow-hidden flex-1 shadow-sm">
        <div className="p-6 border-b border-border">
          {loadingNote ? (
            <div className="h-8 w-64 bg-secondary animate-pulse rounded-xl" />
          ) : (
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                isDirtyRef.current = true;
              }}
              placeholder={
                selectedNoteId
                  ? "Note title..."
                  : "Start typing your thoughts..."
              }
              className="w-full bg-transparent text-2xl font-black text-foreground outline-none placeholder:text-muted-foreground/40"
            />
          )}
        </div>
        <div className="p-6">
          {loadingNote ? (
            <div className="space-y-3">
              <div className="h-4 w-full bg-secondary animate-pulse rounded-lg" />
              <div className="h-4 w-5/6 bg-secondary animate-pulse rounded-lg" />
              <div className="h-4 w-4/6 bg-secondary animate-pulse rounded-lg" />
              <div className="h-4 w-full bg-secondary animate-pulse rounded-lg" />
              <div className="h-4 w-3/6 bg-secondary animate-pulse rounded-lg" />
              <div className="h-4 w-5/6 bg-secondary animate-pulse rounded-lg" />
              <div className="h-4 w-full bg-secondary animate-pulse rounded-lg" />
              <div className="h-4 w-4/6 bg-secondary animate-pulse rounded-lg" />
            </div>
          ) : (
            <NoteEditor
              key={selectedNoteId || "empty"}
              content={content}
              onChange={(v) => {
                setContent(v);
                isDirtyRef.current = true;
              }}
              placeholder="Your focus session starts here..."
              minHeight="500px"
            />
          )}
        </div>
      </div>
    </div>
  );
}
