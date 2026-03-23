"use client";
// components/Notes/NoteDetailsModal.tsx

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Edit3,
  Trash2,
  Calendar,
  Pin,
  Rocket,
  Copy,
  Check,
} from "lucide-react";
import { Note } from "@/types/note";

interface NoteDetailsModalProps {
  note: Note | null;
  onClose: () => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onPin?: (note: Note) => void;
  onPublish?: (note: Note) => void;
}

export function NoteDetailsModal({
  note,
  onClose,
  onEdit,
  onDelete,
  onPin,
  onPublish,
}: NoteDetailsModalProps) {
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = note ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [note]);

  // Close on Escape key
  useEffect(() => {
    if (!note) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [note, onClose]);

  if (!note) return null;

  const copied = copiedNoteId === note.id;

  const handleCopy = async () => {
    try {
      const plainText = (note.content ?? "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      await navigator.clipboard.writeText(`${note.title}\n\n${plainText}`);
      setCopiedNoteId(note.id);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopiedNoteId(null), 2000);
    } catch (error) {
      console.error("Failed to copy note:", error);
      setCopiedNoteId(null);
    }
  };

  const formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = new Date(note.createdAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <AnimatePresence>
      {note && (
        // Full-viewport overlay — flex column so the modal card can be
        // pinned to the bottom on mobile (sheet-style) and centred on desktop
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal card */}
          <motion.div
            layoutId={`note-${note.id}`}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className={[
              // Base
              "relative bg-card border border-border shadow-2xl z-[151]",
              "flex flex-col overflow-hidden",
              // Mobile: full-width bottom sheet, max 92dvh tall, rounded top corners only
              "w-full max-h-[92dvh] rounded-t-[2rem]",
              // ≥sm: centred dialog, max 2xl wide, fully rounded
              "sm:w-full sm:max-w-2xl sm:max-h-[90vh] sm:rounded-[2rem]",
            ].join(" ")}
          >
            {/* ── Mobile drag handle ── */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* ── Sticky header ── */}
            <div className="shrink-0 px-5 pt-4 pb-3 sm:px-8 sm:pt-6 sm:pb-4 border-b border-border/60">
              {/* Top row: meta + actions */}
              <div className="flex items-start justify-between gap-3 mb-3">
                {/* Date / time */}
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary min-w-0">
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {formattedDate} · {formattedTime}
                  </span>
                </div>

                {/* Action buttons — always visible, no overlap */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-all text-xs font-bold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-green-500 hidden xs:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground hidden xs:inline">Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-secondary rounded-xl transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Subject + Tags */}
              {(note.subject || (note.tags && note.tags.length > 0)) && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {note.subject && (
                    <span
                      className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-secondary text-muted-foreground"
                      style={
                        note.subject.color
                          ? {
                              backgroundColor: `${note.subject.color}20`,
                              color: note.subject.color,
                            }
                          : {}
                      }
                    >
                      {note.subject.name}
                    </span>
                  )}
                  {note.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                      style={
                        tag.color
                          ? { backgroundColor: `${tag.color}20`, color: tag.color }
                          : {}
                      }
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h2 className="text-xl sm:text-3xl font-black text-foreground leading-tight line-clamp-3 sm:line-clamp-none">
                {note.title}
              </h2>
            </div>

            {/* ── Scrollable content body ── */}
            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-8 sm:py-6 custom-scrollbar min-h-0">
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: note.content ?? "" }}
              />
            </div>

            {/* ── Sticky footer actions ── */}
            <div className="shrink-0 border-t border-border px-4 py-3 sm:px-8 sm:py-5">
              {/* Two rows on very small screens; one row on sm+ */}
              <div className="flex flex-wrap gap-2">
                {onPublish && (note.status === "draft" || note.hasDraft) && (
                  <button
                    onClick={() => {
                      onPublish(note);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
                  >
                    <Rocket className="w-4 h-4 shrink-0" />
                    <span>Publish to Vault</span>
                  </button>
                )}

                {onPin && (
                  <button
                    onClick={() => {
                      onPin(note);
                      onClose();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-sm bg-secondary text-foreground hover:bg-secondary/80 transition-all whitespace-nowrap"
                  >
                    <Pin className="w-4 h-4 shrink-0" />
                    <span>{note.isPinned ? "Unpin" : "Pin"}</span>
                  </button>
                )}

                {/* Edit — grows to fill remaining space */}
                <button
                  onClick={() => {
                    onEdit(note);
                    onClose();
                  }}
                  className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl font-bold text-sm bg-secondary text-foreground hover:bg-secondary/80 transition-all min-w-[100px] whitespace-nowrap"
                >
                  <Edit3 className="w-4 h-4 shrink-0" />
                  <span>Edit</span>
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    onDelete(note.id);
                    onClose();
                  }}
                  className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl font-bold text-sm bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all min-w-[100px] whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}