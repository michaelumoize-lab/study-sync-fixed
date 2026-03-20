"use client";
// components/Notes/NoteGrid.tsx

import { motion } from "framer-motion";
import { NoteCard, NoteSkeleton } from "./NoteCard";
import { Note } from "@/types/note";

interface NoteGridProps {
  notes: Note[];
  loading: boolean;
  skeletonCount?: number;
  onNoteClick: (note: Note) => void;
  onNoteEdit: (note: Note) => void;
  onNoteDelete: (note: Note) => void;
  onNotePin?: (note: Note) => void;
  selectedIds: string[];
  onNoteSelect: (id: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export function NoteGrid({
  notes,
  loading,
  skeletonCount = 6,
  onNoteClick,
  onNoteEdit,
  onNoteDelete,
  onNotePin,
  selectedIds,
  onNoteSelect,
}: NoteGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <NoteSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onClick={onNoteClick}
          onEdit={onNoteEdit}
          onDelete={onNoteDelete}
          onPin={onNotePin}
          selectedIds={selectedIds}
          onSelect={onNoteSelect}
          isSelectionMode={selectedIds.length > 0}
        />
      ))}
    </motion.div>
  );
}
