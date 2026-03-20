"use client";
// components/Notes/DraftsClient.tsx

import { useState } from "react";
import { FileEdit, Rocket, Trash2, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

import { NoteCard } from "@/components/Notes/NoteCard";
import { NotesHeader } from "@/components/Notes/NotesHeader";
import { NoteDetailsModal } from "@/components/Notes/NoteDetailsModal";
import { EditNoteModal } from "@/components/Notes/EditNoteModal";
import { DeleteModal } from "@/components/Notes/DeleteModal";
import { useUserSettings } from "@/hooks/useUserSettings";

import { Note, UpdateNoteInput } from "@/types/note";

interface DraftsClientProps {
  initialDrafts: Note[];
}

export function DraftsClient({ initialDrafts }: DraftsClientProps) {
  const [drafts, setDrafts] = useState<Note[]>(initialDrafts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const { settings } = useUserSettings();

  const displayDrafts = drafts.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      (d.content?.toLowerCase() ?? "").includes(q)
    );
  });

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const allDisplayedSelected =
    displayDrafts.length > 0 &&
    displayDrafts.every((d) => selectedIds.includes(d.id));

  const handleToggleSelectAll = () => {
    setSelectedIds(allDisplayedSelected ? [] : displayDrafts.map((n) => n.id));
  };

  // ---------------------------------------------------------------------------
  // Publish draft → moves to vault (status: active)
  // ---------------------------------------------------------------------------
  const publishDraft = async (draft: Note) => {
    const t = toast.loading("Publishing to vault...");
    try {
      const res = await fetch(`/api/vault/${draft.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });
      if (!res.ok) throw new Error();
      setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
      setSelectedNote(null);
      window.dispatchEvent(new Event("vault-updated"));
      toast.success("Draft published to vault!", { id: t, icon: "🚀" });
    } catch {
      toast.error("Publish failed", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Delete single draft
  // ---------------------------------------------------------------------------
  const deleteDraft = async (id: string) => {
    const t = toast.loading("Deleting draft...");
    try {
      const res = await fetch(`/api/vault/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      setDeleteId(null);
      setSelectedNote(null);
      window.dispatchEvent(new Event("vault-updated"));
      toast.success("Draft deleted", { id: t });
    } catch {
      toast.error("Delete failed", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Bulk delete
  // ---------------------------------------------------------------------------
  const confirmBulkDelete = async () => {
    const count = selectedIds.length;
    setIsBulkDeleteOpen(false);
    const t = toast.loading(`Deleting ${count} drafts...`);
    try {
      const results = await Promise.all(
        selectedIds.map(async (id) => {
          const res = await fetch(`/api/vault/${id}`, { method: "DELETE" });
          return { id, ok: res.ok };
        }),
      );
      const successIds = results.filter((r) => r.ok).map((r) => r.id);
      const failedCount = results.length - successIds.length;
      setDrafts((prev) => prev.filter((d) => !successIds.includes(d.id)));
      setSelectedIds((prev) => prev.filter((id) => !successIds.includes(id)));
      window.dispatchEvent(new Event("vault-updated"));
      if (failedCount > 0) {
        toast.error(`${failedCount} of ${count} drafts failed to delete`, {
          id: t,
        });
      } else {
        toast.success(`${count} drafts deleted`, { id: t });
      }
    } catch {
      toast.error("Bulk delete failed", { id: t });
    }
  };
  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-8">
      <NotesHeader
        title="Drafts"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Bulk selection bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-primary/10 border border-primary/30 p-4 rounded-2xl gap-3 sm:gap-0"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleSelectAll}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border hover:border-primary transition-all"
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                    allDisplayedSelected
                      ? "bg-primary border-primary"
                      : "border-border"
                  }`}
                >
                  {allDisplayedSelected && (
                    <Check className="w-3 h-3 text-primary-foreground stroke-[4px]" />
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-tight">
                  {allDisplayedSelected ? "Deselect All" : "Select All"}
                </span>
              </button>
              <span className="text-sm font-medium text-muted-foreground">
                <strong className="text-primary">{selectedIds.length}</strong>{" "}
                selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedIds([])}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-secondary rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsBulkDeleteOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-destructive/90 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {displayDrafts.length > 0 ? (
          <motion.div
            key="grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayDrafts.map((note) => (
              <div key={note.id} className="relative group/wrap">
                {/* Unsaved edit badge — top right so it doesn't clash with NoteCard's built-in checkbox */}
                {note.hasDraft && note.status === "active" && (
                  <div className="absolute top-5 left-15 z-20 flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-400/10 text-orange-400 text-[10px] font-black uppercase tracking-wider pointer-events-none">
                    <FileEdit className="w-3 h-3" /> Unsaved edit
                  </div>
                )}

                <NoteCard
                  note={note}
                  onClick={() => !selectedIds.length && setSelectedNote(note)}
                  onEdit={() => setEditingNote(note)}
                  onDelete={() => setDeleteId(note.id)}
                  selectedIds={selectedIds}
                  onSelect={toggleSelect}
                />

                {/* Publish button — only for real drafts */}
                {note.status === "draft" && (
                  <button
                    onClick={() => publishDraft(note)}
                    className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold opacity-0 group-hover/wrap:opacity-100 transition-all hover:opacity-90 shadow-lg shadow-primary/20 z-20"
                  >
                    <Rocket className="w-3.5 h-3.5" /> Publish
                  </button>
                )}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="bg-orange-500/10 p-6 rounded-full mb-6">
              <FileEdit className="w-12 h-12 text-orange-500 opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {searchQuery ? "No drafts match your search." : "No drafts yet."}
            </h3>
            <p className="max-w-xs text-muted-foreground text-sm">
              {searchQuery
                ? "Try a different search term."
                : "Notes saved as drafts will appear here. They stay private until you publish them to your vault."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note details */}
      <NoteDetailsModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onEdit={(n) => {
          setEditingNote(n);
          setSelectedNote(null);
        }}
        onDelete={(id) => {
          setDeleteId(id);
          setSelectedNote(null);
        }}
        onPublish={publishDraft}
        onPin={undefined}
      />

      {/* Edit draft */}
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onSaved={(updated) => {
            setDrafts((prev) =>
              prev.map((d) => (d.id === updated.id ? updated : d)),
            );
            setEditingNote(null);
          }}
          autoSaveInterval={settings.autoSaveInterval}
        />
      )}

      {/* Single delete confirm */}
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteDraft(deleteId)}
        title="Delete Draft?"
        description="This draft will be moved to Recently Deleted."
      />

      {/* Bulk delete confirm */}
      <DeleteModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={confirmBulkDelete}
        title={`Delete ${selectedIds.length} drafts?`}
        description="These drafts will be moved to Recently Deleted."
      />
    </div>
  );
}
