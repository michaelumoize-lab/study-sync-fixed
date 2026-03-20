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
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = note ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [note]);

  if (!note) return null;

  const copied = copiedNoteId === note.id;

  const handleCopy = async () => {
    try {
      // Strip HTML tags to get plain text
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
    month: "long",
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
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            layoutId={`note-${note.id}`}
            className="relative bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-8 shadow-2xl z-[151] flex flex-col custom-scrollbar"
          >
            {/* Top right actions */}
            <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-all text-xs font-bold"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Copy</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
              <Calendar className="w-3 h-3" />
              <span>
                {formattedDate} · {formattedTime}
              </span>
            </div>

            {/* Subject + Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
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

            <h2 className="text-3xl font-black mb-6 text-foreground">
              {note.title}
            </h2>

            <div
              className="prose prose-sm dark:prose-invert mb-10 flex-grow"
              dangerouslySetInnerHTML={{ __html: note.content ?? "" }}
            />

            <div className="flex gap-3 border-t border-border pt-6 mt-auto">
              {onPublish && note.status === "draft" && (
                <button
                  onClick={() => {
                    onPublish(note);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  <Rocket className="w-4 h-4" /> Publish to Vault
                </button>
              )}
              {onPin && (
                <button
                  onClick={() => {
                    onPin(note);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold bg-secondary text-foreground hover:bg-secondary/80 transition-all"
                >
                  <Pin className="w-4 h-4" />
                  {note.isPinned ? "Unpin" : "Pin"}
                </button>
              )}
              <button
                onClick={() => {
                  onEdit(note);
                  onClose();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold bg-secondary text-foreground hover:bg-secondary/80 transition-all"
              >
                <Edit3 className="w-4 h-4" /> Edit Note
              </button>
              <button
                onClick={() => {
                  onDelete(note.id);
                  onClose();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
