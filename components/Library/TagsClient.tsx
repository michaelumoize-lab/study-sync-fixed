"use client";
// components/Library/TagsClient.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePostHog } from "posthog-js/react";
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { NotesHeader } from "@/components/Notes/NotesHeader";
import { DeleteModal } from "@/components/Notes/DeleteModal";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TagItem {
  id: string;
  name: string;
  color: string | null;
  noteCount: number;
  createdAt: Date | string;
}

// ---------------------------------------------------------------------------
// Color palette
// ---------------------------------------------------------------------------

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
  "#aff33e",
];

// ---------------------------------------------------------------------------
// Tag form modal
// ---------------------------------------------------------------------------

function TagModal({
  tag,
  onClose,
  onSave,
}: {
  tag?: TagItem | null;
  onClose: () => void;
  onSave: (data: { name: string; color: string | null }) => Promise<void>;
}) {
  const [name, setName] = useState(tag?.name ?? "");
  const [color, setColor] = useState<string | null>(tag?.color ?? null);
  const [saving, setSaving] = useState(false);

  const slugified = name.trim().toLowerCase().replace(/\s+/g, "-");

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    await onSave({ name, color });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="relative bg-card border border-border w-full max-w-sm rounded-[2rem] p-7 shadow-2xl z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-foreground tracking-tight">
            {tag ? "Edit Tag" : "New Tag"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Tag Name *
            </label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="e.g. important, exam, revision..."
                className="w-full bg-secondary/50 pl-9 pr-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground font-semibold transition-all"
              />
            </div>
            {name.trim() && name.trim() !== slugified && (
              <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                Saved as:{" "}
                <span className="font-bold text-foreground">#{slugified}</span>
              </p>
            )}
          </div>

          {/* Color picker */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(color === c ? null : c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: c }}
                >
                  {color === c && (
                    <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                  )}
                </button>
              ))}
              {color && (
                <button
                  type="button"
                  onClick={() => setColor(null)}
                  className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-destructive/10 transition-colors"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preview pill */}
        {name.trim() && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Preview:
            </span>
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
              style={
                color
                  ? { backgroundColor: `${color}20`, color }
                  : {
                      backgroundColor: "var(--color-secondary)",
                      color: "var(--color-muted-foreground)",
                    }
              }
            >
              #{slugified}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {tag ? "Save Changes" : "Create Tag"}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-3 bg-secondary text-foreground rounded-2xl font-bold hover:bg-secondary/80 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tag pill card
// ---------------------------------------------------------------------------

function TagCard({
  tag,
  onEdit,
  onDelete,
}: {
  tag: TagItem;
  onEdit: (t: TagItem) => void;
  onDelete: (t: TagItem) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group flex items-center justify-between gap-3 bg-card border border-border rounded-2xl px-4 py-3 hover:border-primary/30 transition-all"
    >
      <Link
        href={`/dashboard/library/tags/${tag.id}`}
        className="flex items-center gap-3 min-w-0 flex-1"
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: tag.color
              ? `${tag.color}20`
              : "var(--color-secondary)",
          }}
        >
          <Hash
            className="w-4 h-4"
            style={{ color: tag.color ?? "var(--color-muted-foreground)" }}
          />
        </div>
        <div className="min-w-0">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
            style={
              tag.color
                ? { backgroundColor: `${tag.color}20`, color: tag.color }
                : {
                    backgroundColor: "var(--color-secondary)",
                    color: "var(--color-muted-foreground)",
                  }
            }
          >
            #{tag.name}
          </span>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {tag.noteCount} {tag.noteCount === 1 ? "note" : "notes"}
          </p>
        </div>
      </Link>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(tag)}
          className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(tag)}
          className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main client
// ---------------------------------------------------------------------------

interface TagsClientProps {
  initialTags: TagItem[];
}

export function TagsClient({ initialTags }: TagsClientProps) {
  const posthog = usePostHog();
  const [tagsList, setTagsList] = useState<TagItem[]>(initialTags);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TagItem | null>(null);

  const displayTags = tagsList.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  const handleCreate = async (data: { name: string; color: string | null }) => {
    const t = toast.loading("Creating tag...");
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const created: TagItem = await res.json();
      setTagsList((prev) =>
        [...prev, { ...created, noteCount: 0 }].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      setModalOpen(false);
      posthog.capture("tag_created", { name: data.name });
      toast.success("Tag created", { id: t });
    } catch {
      toast.error("Failed to create tag", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  const handleUpdate = async (data: { name: string; color: string | null }) => {
    if (!editingTag) return;
    const t = toast.loading("Saving...");
    try {
      const res = await fetch(`/api/tags/${editingTag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const updated: TagItem = await res.json();
      setTagsList((prev) =>
        prev.map((tg) =>
          tg.id === updated.id ? { ...updated, noteCount: tg.noteCount } : tg,
        ),
      );
      setEditingTag(null);
      toast.success("Tag updated", { id: t });
    } catch {
      toast.error("Failed to update tag", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const t = toast.loading("Deleting...");
    try {
      const res = await fetch(`/api/tags/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setTagsList((prev) => prev.filter((tg) => tg.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Tag deleted", { id: t });
    } catch {
      toast.error("Failed to delete tag", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <NotesHeader
          title="Tags"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 mt-1"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> New Tag
        </button>
      </div>

      {/* Stats pill */}
      <div className="flex items-center gap-3 px-5 py-3 bg-secondary/30 rounded-2xl border border-border/50 w-fit">
        <Tag className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
          {tagsList.length} {tagsList.length === 1 ? "Tag" : "Tags"}
        </span>
      </div>

      {/* Tags list */}
      <AnimatePresence mode="popLayout">
        {displayTags.length > 0 ? (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayTags.map((tag) => (
              <TagCard
                key={tag.id}
                tag={tag}
                onEdit={(tg) => setEditingTag(tg)}
                onDelete={(tg) => setDeleteTarget(tg)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="bg-primary/10 p-6 rounded-full mb-6">
              <Tag className="w-12 h-12 text-primary opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {searchQuery ? "No tags match your search." : "No tags yet."}
            </h3>
            <p className="max-w-xs text-muted-foreground text-sm mb-6">
              {searchQuery
                ? "Try a different search term."
                : "Tags help you label and filter notes across subjects."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" /> Create your first tag
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create modal */}
      <AnimatePresence>
        {modalOpen && (
          <TagModal onClose={() => setModalOpen(false)} onSave={handleCreate} />
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editingTag && (
          <TagModal
            tag={editingTag}
            onClose={() => setEditingTag(null)}
            onSave={handleUpdate}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete "#${deleteTarget?.name}"?`}
        description="This tag will be removed from all notes that use it."
      />
    </div>
  );
}
