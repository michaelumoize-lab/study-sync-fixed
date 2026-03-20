"use client";
// components/Notes/RecentClient.tsx

import { useState } from "react";
import { Clock, SearchX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { NoteGrid } from "@/components/Notes/NoteGrid";
import { NotesHeader } from "@/components/Notes/NotesHeader";
import { NoteDetailsModal } from "@/components/Notes/NoteDetailsModal";
import { EditNoteModal } from "@/components/Notes/EditNoteModal";
import { DeleteModal } from "@/components/Notes/DeleteModal";

import { useNotes } from "@/hooks/useNotes";
import { Note } from "@/types/note";
import { useUserSettings } from "@/hooks/useUserSettings";

interface RecentClientProps {
  initialNotes: Note[];
}

export function RecentClient({ initialNotes }: RecentClientProps) {
  const { deleteNote, togglePin, setNotes } = useNotes();

  const { settings } = useUserSettings();

  const [notesList, setNotesList] = useState<Note[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const displayNotes = notesList.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      (n.content?.replace(/<[^>]*>/g, "") ?? "").toLowerCase().includes(q)
    );
  });

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteNote(deleteConfirmId);
    setNotesList((prev) => prev.filter((n) => n.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-8">
      <NotesHeader
        title="Recently Updated"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search recent notes..."
      />

      <AnimatePresence mode="popLayout">
        {displayNotes.length > 0 ? (
          <NoteGrid
            notes={displayNotes}
            loading={false}
            skeletonCount={6}
            selectedIds={[]}
            onNoteSelect={() => {}}
            onNoteClick={setSelectedNote}
            onNoteEdit={setEditingNote}
            onNoteDelete={(note) => setDeleteConfirmId(note.id)}
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
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            {searchQuery ? (
              <>
                <SearchX className="w-12 h-12 mb-4 text-muted-foreground" />
                <p className="font-bold text-foreground">
                  No recent notes match your search.
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
                <Clock className="w-12 h-12 mb-4 text-muted-foreground mx-auto" />
                <p className="font-bold text-foreground">No recent notes.</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Notes you create or edit will appear here.
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
            setNotesList((prev) =>
              prev.map((n) => (n.id === updated.id ? updated : n)),
            );
            setEditingNote(null);
          }}
          autoSaveInterval={settings.autoSaveInterval}
        />
      )}

      <DeleteModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
