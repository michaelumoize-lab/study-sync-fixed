"use client";
// components/Notes/VaultClient.tsx

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Ghost, SearchX, Check, Trash2, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { NoteGrid } from "@/components/Notes/NoteGrid";
import { StatsGrid } from "@/components/Notes/StatsGrid";
import { CreateNote } from "@/components/Notes/CreateNote";
import { DeleteModal } from "@/components/Notes/DeleteModal";
import { NotesHeader } from "@/components/Notes/NotesHeader";
import { NoteDetailsModal } from "@/components/Notes/NoteDetailsModal";
import { EditNoteModal } from "@/components/Notes/EditNoteModal";
import { PdfImportModal } from "@/components/Notes/PdfImportModal";

import { useNotes } from "@/hooks/useNotes";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Note, CreateNoteInput } from "@/types/note";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

interface Subject {
  id: string;
  name: string;
  color?: string | null;
}
interface TagOption {
  id: string;
  name: string;
  color?: string | null;
}
interface Semester {
  id: string;
  name: string;
}

interface VaultClientProps {
  initialNotes: Note[];
  subjects: Subject[];
  tags: TagOption[];
  semesters: Semester[];
}

export function VaultClient({
  initialNotes,
  subjects,
  tags,
  semesters,
}: VaultClientProps) {
  const router = useRouter();
  const {
    notes,
    loading,
    addNote,
    deleteNote,
    deleteMultipleNotes,
    togglePin,
    setNotes,
  } = useNotes(initialNotes);

  const { settings } = useUserSettings();
  const autoSaveInterval = settings?.autoSaveInterval ?? 30;

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pdfImportOpen, setPdfImportOpen] = useState(false);

  const displayNotes = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return notes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          (n.content?.toLowerCase() ?? "").includes(q),
      )
      .sort((a, b) => {
        const aPinned = a.isPinned ?? false;
        const bPinned = b.isPinned ?? false;
        if (aPinned !== bPinned) return aPinned ? -1 : 1;
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
  }, [notes, searchQuery]);

  const handleToggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === displayNotes.length && displayNotes.length > 0
        ? []
        : displayNotes.map((n) => n.id),
    );
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const confirmBulkDelete = async () => {
    const count = selectedIds.length;
    setIsBulkDeleteOpen(false);
    const loadingToast = toast.loading(`Moving ${count} notes to trash...`);
    const success = await deleteMultipleNotes(selectedIds);
    if (success) {
      setSelectedIds([]);
    } else {
      toast.error("Bulk delete failed", { id: loadingToast });
    }
  };

  const handleSaveDraft = async (input: CreateNoteInput): Promise<boolean> => {
    const t = toast.loading("Saving draft...");
    try {
      const res = await apiFetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, status: "draft" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Draft saved", { id: t });
      return true;
    } catch {
      toast.error("Failed to save draft", { id: t });
      return false;
    }
    // NOTE: intentionally does NOT call setNotes — drafts don't belong in vault
  };

  return (
    <div
      className={`space-y-8 ${selectedIds.length > 0 ? "pb-32 md:pb-0" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <NotesHeader
          title="Your Vault"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <button
          onClick={() => setPdfImportOpen(true)}
          className="shrink-0 flex items-center gap-2 px-4 py-3 bg-secondary text-foreground border border-border rounded-2xl font-bold hover:border-primary/30 hover:bg-secondary/80 transition-all mt-1 text-sm"
        >
          <FileText className="w-4 h-4 text-red-500" /> Import PDF
        </button>
      </div>

      {!searchQuery && (
        <StatsGrid
          notes={notes}
          loading={loading}
          onShowRecent={() => router.push("/dashboard/recent")}
        />
      )}

      {!searchQuery && (
        <CreateNote
          onAdd={addNote}
          onSaveDraft={handleSaveDraft}
          subjects={subjects}
          semesters={semesters}
          tags={tags}
        />
      )}

      {/* Bulk selection bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <>
            {/* Desktop version - appears at top */}
            <motion.div
              key="bulk-bar-desktop"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="hidden md:flex items-center justify-between gap-4 bg-primary/10 border border-primary/30 p-4 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={handleToggleSelectAll}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border hover:border-primary transition-all"
                >
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      selectedIds.length === displayNotes.length
                        ? "bg-primary border-primary"
                        : "border-border"
                    }`}
                  >
                    {selectedIds.length === displayNotes.length && (
                      <Check className="w-3 h-3 text-primary-foreground stroke-[4px]" />
                    )}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tight">
                    {selectedIds.length === displayNotes.length
                      ? "Deselect All"
                      : "Select All"}
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

            {/* Mobile version - fixed bottom bar */}
            <motion.div
              key="bulk-bar-mobile"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-primary/30 p-4 shadow-lg"
            >
              <div className="flex flex-col gap-3">
                {/* Selection info and select all */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleToggleSelectAll}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all active:scale-95"
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        selectedIds.length === displayNotes.length
                          ? "bg-primary border-primary"
                          : "border-border"
                      }`}
                    >
                      {selectedIds.length === displayNotes.length && (
                        <Check className="w-3 h-3 text-primary-foreground stroke-[4px]" />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {selectedIds.length === displayNotes.length
                        ? "Deselect All"
                        : "Select All"}
                    </span>
                  </button>

                  <span className="text-sm text-muted-foreground">
                    <strong className="text-primary text-base">
                      {selectedIds.length}
                    </strong>{" "}
                    selected
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedIds([])}
                    className="flex-1 py-3 text-sm font-medium border border-border rounded-xl hover:bg-secondary transition-colors active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsBulkDeleteOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-destructive text-destructive-foreground rounded-xl text-sm font-medium hover:bg-destructive/90 transition-all active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedIds.length})
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notes grid or empty state */}
      <AnimatePresence mode="popLayout">
        {loading || displayNotes.length > 0 ? (
          <NoteGrid
            notes={displayNotes}
            loading={loading}
            selectedIds={selectedIds}
            onNoteSelect={toggleSelect}
            onNoteClick={setSelectedNote}
            onNoteEdit={setEditingNote}
            onNoteDelete={(note) => setDeleteConfirmId(note.id)}
            onNotePin={(note) => togglePin(note.id, note.isPinned ?? false)}
            skeletonCount={8}
          />
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="py-20 text-center"
          >
            {searchQuery ? (
              <div className="flex flex-col items-center">
                <SearchX className="w-12 h-12 mb-4 text-muted-foreground" />
                <p className="font-bold text-foreground">No matches found.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-primary underline font-bold"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center opacity-40">
                <Ghost className="w-12 h-12 mb-4 text-muted-foreground" />
                <p className="text-foreground">Your vault is empty.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <DeleteModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={async () => {
          if (deleteConfirmId) {
            await deleteNote(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
      />

      <DeleteModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={confirmBulkDelete}
        title={`Move ${selectedIds.length} notes to trash?`}
        description="These notes will be moved to Recently Deleted and can be restored."
      />

      <NoteDetailsModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onEdit={(n) => {
          setEditingNote(n);
          setSelectedNote(null);
        }}
        onDelete={(id) => {
          setDeleteConfirmId(id);
          setSelectedNote(null);
        }}
        onPin={(note) => togglePin(note.id, note.isPinned ?? false)}
      />

      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onSaved={(updated) => {
            setNotes((prev) =>
              prev.map((n) => (n.id === updated.id ? updated : n)),
            );
          }}
          autoSaveInterval={autoSaveInterval}
        />
      )}

      <PdfImportModal
        isOpen={pdfImportOpen}
        onClose={() => setPdfImportOpen(false)}
        subjects={subjects}
        semesters={semesters}
        onImported={(note) => {
          setNotes((prev) => [note, ...prev]);
        }}
      />
    </div>
  );
}
