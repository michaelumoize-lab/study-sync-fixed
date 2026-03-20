"use client";
// components/Library/FilteredNotesClient.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, SearchX, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Note } from "@/types/note";
import { NoteGrid } from "@/components/Notes/NoteGrid";
import { NoteDetailsModal } from "@/components/Notes/NoteDetailsModal";
import { EditNoteModal } from "@/components/Notes/EditNoteModal";
import { DeleteModal } from "@/components/Notes/DeleteModal";
import { useNotes } from "@/hooks/useNotes";
import { useUserSettings } from "@/hooks/useUserSettings";

interface FilteredNotesClientProps {
  initialNotes: Note[];
  heading: string;
  subheading?: string;
  accentColor?: string | null;
  backHref: string;
  backLabel: string;
}

export function FilteredNotesClient({
  initialNotes,
  heading,
  subheading,
  accentColor,
  backHref,
  backLabel,
}: FilteredNotesClientProps) {
  const { deleteNote, togglePin } = useNotes();

  const { settings } = useUserSettings();

  const [notesList, setNotesList] = useState<Note[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const displayNotes = notesList.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      (n.content?.replace(/<[^>]*>/g, "") ?? "").toLowerCase().includes(q)
    );
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteNote(deleteId);
    setNotesList((prev) => prev.filter((n) => n.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="space-y-8">
      {/* Back link + heading */}
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1
              className="text-4xl md:text-5xl font-black tracking-tight"
              style={{ color: accentColor ?? "var(--color-foreground)" }}
            >
              {heading}
            </h1>
            {subheading && (
              <p className="text-muted-foreground text-sm mt-1 font-medium">
                {subheading}
              </p>
            )}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72 group">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search these notes..."
              className="w-full pl-4 pr-4 py-3 bg-card border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Notes grid or empty state */}
      <AnimatePresence mode="popLayout">
        {displayNotes.length > 0 ? (
          <NoteGrid
            notes={displayNotes}
            loading={false}
            selectedIds={selectedIds}
            onNoteSelect={(id) =>
              setSelectedIds((prev) =>
                prev.includes(id)
                  ? prev.filter((i) => i !== id)
                  : [...prev, id],
              )
            }
            onNoteClick={setSelectedNote}
            onNoteEdit={setEditingNote}
            onNoteDelete={(note) => setDeleteId(note.id)}
            onNotePin={(note) => {
              togglePin(note.id, note.isPinned ?? false);
              setNotesList((prev) =>
                prev.map((n) =>
                  n.id === note.id
                    ? { ...n, isPinned: !(note.isPinned ?? false) }
                    : n,
                ),
              );
            }}
          />
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            {searchQuery ? (
              <>
                <SearchX className="w-12 h-12 mb-4 text-muted-foreground" />
                <p className="font-bold text-foreground">
                  No notes match your search.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-primary underline font-bold text-sm"
                >
                  Clear search
                </button>
              </>
            ) : (
              <div className="opacity-40">
                <Ghost className="w-12 h-12 mb-4 text-muted-foreground mx-auto" />
                <p className="text-foreground font-bold">No notes here yet.</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Assign notes to this {backLabel.slice(0, -1).toLowerCase()}{" "}
                  from the vault.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
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
        onPin={(note) => togglePin(note.id, note.isPinned ?? false)}
      />

      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onSaved={(updated) => {
            setNotesList((prev) =>
              prev.map((n) => (n.id === updated.id ? updated : n)),
            );
          }}
          autoSaveInterval={settings.autoSaveInterval}
        />
      )}

      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
