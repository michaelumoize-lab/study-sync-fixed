"use client";
// components/Notes/NoteCard.tsx

import { motion } from "framer-motion";
import {
  Edit3,
  Trash2,
  StickyNote,
  Calendar,
  Maximize2,
  Check,
  Pin,
} from "lucide-react";
import { Note } from "@/types/note";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onClick: (note: Note) => void;
  onPin?: (note: Note) => void;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  isSelectionMode?: boolean;
  /** Skip Framer Motion entry animation (avoids SSR/client markup drift on drafts). */
  skipEntryAnimation?: boolean;
}

export function NoteSkeleton() {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 flex flex-col h-full animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-secondary w-10 h-10 rounded-xl" />
        <div className="flex gap-1">
          <div className="w-8 h-8 bg-secondary rounded-lg" />
          <div className="w-8 h-8 bg-secondary rounded-lg" />
        </div>
      </div>
      <div className="h-6 bg-secondary rounded-md w-3/4 mb-3" />
      <div className="space-y-2 flex-grow">
        <div className="h-3 bg-secondary rounded w-full" />
        <div className="h-3 bg-secondary rounded w-full" />
        <div className="h-3 bg-secondary rounded w-2/3" />
      </div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="h-3 bg-secondary rounded w-1/3" />
      </div>
    </div>
  );
}

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onClick,
  onPin,
  selectedIds = [],
  onSelect,
  isSelectionMode,
  skipEntryAnimation,
}: NoteCardProps) {
  const isSelected = selectedIds.includes(note.id);
  const selectionActive = isSelectionMode || selectedIds.length > 0;

  const handleCardClick = (e: React.MouseEvent) => {
    if (selectionActive && onSelect) {
      onSelect(note.id);
    } else {
      onClick(note);
    }
  };

  return (
    <motion.div
      layoutId={`note-${note.id}`}
      initial={skipEntryAnimation ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, scale: isSelected ? 0.98 : 1 }}
      onClick={handleCardClick}
      className={cn(
        "group relative border rounded-3xl p-6 transition-all cursor-pointer flex flex-col h-full overflow-hidden",
        isSelected
          ? "bg-primary/5 border-primary shadow-lg shadow-primary/10"
          : "bg-card border-border hover:border-primary/40",
      )}
    >
      {/* Selection checkmark */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(note.id);
        }}
        className={cn(
          "absolute top-4 left-4 transition-all duration-300 z-50 w-7 h-7 rounded-full border-2 flex items-center justify-center",
          isSelected
            ? "bg-primary border-primary scale-100 opacity-100"
            : "bg-card/10 border-border opacity-100 lg:opacity-0 lg:group-hover:opacity-100",
        )}
      >
        {isSelected && (
          <Check className="w-4 h-4 text-primary-foreground stroke-[4px]" />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-start justify-end mb-4">
        <div
          className={cn(
            "flex gap-1 relative z-30 transition-opacity duration-200",
            selectionActive ? "opacity-0 pointer-events-none" : "opacity-100",
          )}
        >
          {onPin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPin(note);
              }}
              className={cn(
                "p-2 rounded-lg transition-colors",
                note.isPinned
                  ? "text-primary bg-primary/10"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              <Pin className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note);
            }}
            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Icon + Subject badge */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "p-2.5 rounded-xl transition-colors",
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary",
          )}
        >
          <StickyNote className="w-5 h-5" />
        </div>
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
        {note.isPinned && (
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-primary/10 text-primary">
            Pinned
          </span>
        )}
      </div>

      <h3
        className={cn(
          "font-bold text-xl line-clamp-1 transition-colors",
          isSelected ? "text-primary" : "text-foreground",
        )}
      >
        {note.title}
      </h3>
      <p className="text-muted-foreground text-sm line-clamp-3 mt-2 flex-grow">
        {note.content
          ? note.content
              .replace(/<[^>]*>/g, " ")
              .replace(/\s+/g, " ")
              .trim()
          : ""}
      </p>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {note.tags.slice(0, 3).map((tag) => (
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
          {note.tags.length > 3 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground/60">
          <Calendar className="w-3 h-3" />
          <span suppressHydrationWarning>
            {new Date(note.createdAt).toLocaleDateString()}
          </span>
        </div>
        {!selectionActive && (
          <div className="flex items-center gap-1 text-primary text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all">
            <Maximize2 className="w-3 h-3" />
            <span>Open</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
