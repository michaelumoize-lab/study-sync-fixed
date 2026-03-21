"use client";
// components/Notes/RecentlyDeletedClient.tsx

import { useState, useMemo } from "react";
import { usePostHog } from "posthog-js/react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RotateCcw, Ghost, Check, AlertTriangle } from "lucide-react";
import { Note } from "@/types/note";
import { NotesHeader } from "@/components/Notes/NotesHeader";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface RecentlyDeletedClientProps {
  initialNotes: Note[];
}

// ---------------------------------------------------------------------------
// Confirm Modal
// ---------------------------------------------------------------------------

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  variant = "danger",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  variant?: "danger" | "warning";
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center"
          >
            <div
              className={cn(
                "w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6",
                variant === "danger"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-orange-500/10 text-orange-500",
              )}
            >
              {variant === "danger" ? (
                <Trash2 className="w-8 h-8" />
              ) : (
                <AlertTriangle className="w-8 h-8" />
              )}
            </div>
            <h2 className="text-2xl font-black text-foreground mb-2">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm">{description}</p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-2xl font-bold bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={cn(
                  "flex-1 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg",
                  variant === "danger"
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20"
                    : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20",
                )}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Deleted Note Card
// ---------------------------------------------------------------------------

function DeletedNoteCard({
  note,
  isSelected,
  onSelect,
  onRestore,
  onPermanentDelete,
}: {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
}) {
  const deletedAt = note.deletedAt
    ? new Date(note.deletedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const plainContent = note.content
    ? note.content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onSelect(note.id)}
      className={cn(
        "group relative flex flex-col p-5 rounded-3xl border transition-all",
        isSelected
          ? "bg-primary/5 border-primary"
          : "bg-card border-border hover:border-border/80",
      )}
    >
      {/* FIX: stopPropagation so clicking the checkbox doesn't also fire the
          parent motion.div's onSelect. The explicit onSelect call here was
          already redundant with the parent — keeping just stopPropagation
          is sufficient since the parent onClick handles selection. */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(note.id);
        }}
        className={cn(
          "absolute top-4 left-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
          isSelected
            ? "bg-primary border-primary"
            : "bg-card border-border opacity-0 group-hover:opacity-100",
        )}
      >
        {isSelected && (
          <Check className="w-4 h-4 text-primary-foreground stroke-[4px]" />
        )}
      </button>

      {/* Actions */}
      <div className="flex justify-end gap-1 mb-3">
        {/* FIX: stopPropagation so Restore doesn't also toggle selection */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRestore(note.id);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-bold transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restore
        </button>
        {/* FIX: stopPropagation so Delete doesn't also toggle selection */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPermanentDelete(note.id);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs font-bold transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>

      <h3 className="font-bold text-base text-foreground line-clamp-1 mb-1">
        {note.title}
      </h3>
      <p className="text-muted-foreground text-sm line-clamp-2 flex-1">
        {plainContent}
      </p>

      {deletedAt && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/50">
          <Trash2 className="w-3 h-3 text-muted-foreground/50" />
          <span className="text-[10px] font-medium text-muted-foreground/60">
            Deleted {deletedAt}
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main client component
// ---------------------------------------------------------------------------

export function RecentlyDeletedClient({
  initialNotes,
}: RecentlyDeletedClientProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: "restore" | "delete" | "restoreAll" | "deleteAll" | null;
    noteId?: string;
  }>({ open: false, type: null });
  const posthog = usePostHog();

  const displayNotes = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        (n.content?.toLowerCase() ?? "").includes(q),
    );
  }, [notes, searchQuery]);

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const toggleSelectAll = () =>
    setSelectedIds(
      selectedIds.length === displayNotes.length
        ? []
        : displayNotes.map((n) => n.id),
    );

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const restoreNote = async (id: string) => {
    const t = toast.loading("Restoring...");
    try {
      const res = await fetch(`/api/vault/deleted/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      posthog.capture("note_restored", { note_id: id });
      toast.success("Note restored to vault", { id: t });
      window.dispatchEvent(new Event("vault-updated"));
    } catch {
      toast.error("Restore failed", { id: t });
    }
  };

  const permanentDelete = async (id: string) => {
    const t = toast.loading("Deleting permanently...");
    try {
      const res = await fetch(`/api/vault/deleted/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      posthog.capture("note_permanently_deleted", { note_id: id });
      toast.success("Note permanently deleted", { id: t });
      window.dispatchEvent(new Event("vault-updated")); // ← add this
    } catch {
      toast.error("Delete failed", { id: t });
    }
  };

  const bulkRestore = async () => {
    const t = toast.loading(`Restoring ${selectedIds.length} notes...`);
    try {
      const res = await fetch("/api/vault/deleted/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!res.ok) throw new Error();
      setNotes((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
      posthog.capture("bulk_notes_restored", { count: selectedIds.length });
      toast.success(`${selectedIds.length} notes restored`, { id: t });
      setSelectedIds([]);
      window.dispatchEvent(new Event("vault-updated"));
    } catch {
      toast.error("Bulk restore failed", { id: t });
    }
  };

  const bulkDelete = async () => {
    const t = toast.loading(`Deleting ${selectedIds.length} notes...`);
    try {
      const res = await fetch("/api/vault/deleted/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!res.ok) throw new Error();
      setNotes((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
      posthog.capture("bulk_notes_deleted", { count: selectedIds.length });
      toast.success(`${selectedIds.length} notes permanently deleted`, {
        id: t,
      });
      setSelectedIds([]);
      window.dispatchEvent(new Event("vault-updated")); // ← add this
    } catch {
      toast.error("Bulk delete failed", { id: t });
    }
  };

  const handleConfirm = async () => {
    const { type, noteId } = confirmModal;
    setConfirmModal({ open: false, type: null });
    if (type === "restore" && noteId) await restoreNote(noteId);
    if (type === "delete" && noteId) await permanentDelete(noteId);
    if (type === "restoreAll") await bulkRestore();
    if (type === "deleteAll") await bulkDelete();
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-8">
      <NotesHeader
        title="Recently Deleted"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Info banner */}
      <div className="flex items-center gap-3 px-5 py-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
        <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
        <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
          Notes here are permanently deleted after 30 days. Restore them to your
          vault to keep them.
        </p>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {displayNotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary/40 border border-border rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border hover:border-primary transition-all"
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-md border flex items-center justify-center",
                    selectedIds.length === displayNotes.length &&
                      displayNotes.length > 0
                      ? "bg-primary border-primary"
                      : "border-border",
                  )}
                >
                  {selectedIds.length === displayNotes.length &&
                    displayNotes.length > 0 && (
                      <Check className="w-3 h-3 text-primary-foreground stroke-[4px]" />
                    )}
                </div>
                <span className="text-xs font-bold uppercase tracking-tight">
                  {selectedIds.length === displayNotes.length &&
                  displayNotes.length > 0
                    ? "Deselect All"
                    : "Select All"}
                </span>
              </button>
              {selectedIds.length > 0 && (
                <span className="text-sm text-muted-foreground font-medium">
                  <strong className="text-primary">{selectedIds.length}</strong>{" "}
                  selected
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {selectedIds.length > 0 ? (
                <>
                  <button
                    onClick={() =>
                      setConfirmModal({ open: true, type: "restoreAll" })
                    }
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-bold transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restore Selected
                  </button>
                  <button
                    onClick={() =>
                      setConfirmModal({ open: true, type: "deleteAll" })
                    }
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs font-bold transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                  </button>
                </>
              ) : (
                <button
                  onClick={() =>
                    setConfirmModal({ open: true, type: "deleteAll" })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs font-bold transition-all"
                  disabled={displayNotes.length === 0}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Empty Trash
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes grid or empty state */}
      <AnimatePresence mode="popLayout">
        {displayNotes.length > 0 ? (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayNotes.map((note) => (
              <DeletedNoteCard
                key={note.id}
                note={note}
                isSelected={selectedIds.includes(note.id)}
                onSelect={toggleSelect}
                onRestore={(id) =>
                  setConfirmModal({ open: true, type: "restore", noteId: id })
                }
                onPermanentDelete={(id) =>
                  setConfirmModal({ open: true, type: "delete", noteId: id })
                }
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center"
          >
            <div className="flex flex-col items-center opacity-40">
              <Ghost className="w-12 h-12 mb-4 text-muted-foreground" />
              <p className="font-bold text-foreground">
                {searchQuery ? "No matching deleted notes." : "Trash is empty."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, type: null })}
        onConfirm={handleConfirm}
        title={
          confirmModal.type === "restore"
            ? "Restore Note?"
            : confirmModal.type === "restoreAll"
              ? `Restore ${selectedIds.length} Notes?`
              : confirmModal.type === "deleteAll" && selectedIds.length === 0
                ? "Empty Trash?"
                : confirmModal.type === "deleteAll"
                  ? `Delete ${selectedIds.length} Notes?`
                  : "Delete Permanently?"
        }
        description={
          confirmModal.type === "restore" || confirmModal.type === "restoreAll"
            ? "This note will be moved back to your vault."
            : "This action cannot be undone. These notes will be gone forever."
        }
        confirmLabel={
          confirmModal.type === "restore" || confirmModal.type === "restoreAll"
            ? "Restore"
            : "Delete Forever"
        }
        variant={
          confirmModal.type === "restore" || confirmModal.type === "restoreAll"
            ? "warning"
            : "danger"
        }
      />
    </div>
  );
}
