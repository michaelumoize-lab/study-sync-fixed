"use client";
// components/Library/SubjectsClient.tsx

import { useState } from "react";
import { usePostHog } from "posthog-js/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  StickyNote,
  Loader2,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { NotesHeader } from "@/components/Notes/NotesHeader";
import { DeleteModal } from "@/components/Notes/DeleteModal";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Subject {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  noteCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
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
// Subject form modal
// ---------------------------------------------------------------------------

function SubjectModal({
  subject,
  onClose,
  onSave,
}: {
  subject?: Subject | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string;
    color: string | null;
  }) => Promise<void>;
}) {
  const [name, setName] = useState(subject?.name ?? "");
  const [description, setDescription] = useState(subject?.description ?? "");
  const [color, setColor] = useState<string | null>(subject?.color ?? null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    await onSave({ name, description, color });
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
        className="relative bg-card border border-border w-full max-w-md rounded-[2rem] p-7 shadow-2xl z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-foreground tracking-tight">
            {subject ? "Edit Subject" : "New Subject"}
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
              Name *
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Biology, History..."
              className="w-full bg-secondary/50 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground font-semibold transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              className="w-full bg-secondary/50 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground transition-all"
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
              <Palette className="w-3 h-3" /> Color
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
              {/* Clear */}
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

        {/* Preview */}
        {name.trim() && (
          <div className="mt-4 px-4 py-3 rounded-2xl bg-secondary/30 border border-border/50 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: color ? `${color}25` : undefined }}
            >
              <BookOpen
                className="w-4 h-4"
                style={{ color: color ?? "currentColor" }}
              />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{name}</p>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            {color && (
              <div
                className="ml-auto w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
            )}
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
            {subject ? "Save Changes" : "Create Subject"}
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
// Subject card
// ---------------------------------------------------------------------------

function SubjectCard({
  subject,
  onEdit,
  onDelete,
}: {
  subject: Subject;
  onEdit: (s: Subject) => void;
  onDelete: (s: Subject) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-card border border-border rounded-3xl p-5 hover:border-primary/30 transition-all"
    >
      {/* Actions */}
      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => onEdit(subject)}
          className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(subject)}
          className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Clickable area */}
      <Link
        href={`/dashboard/library/subjects/${subject.id}`}
        className="block"
      >
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
          style={{
            backgroundColor: subject.color ? `${subject.color}20` : undefined,
          }}
        >
          <BookOpen
            className="w-5 h-5"
            style={{ color: subject.color ?? "var(--color-primary)" }}
          />
        </div>

        <h3 className="font-bold text-base text-foreground tracking-tight mb-1">
          {subject.name}
        </h3>

        {subject.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {subject.description}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/50">
          <StickyNote className="w-3 h-3 text-muted-foreground/60" />
          <span className="text-[11px] font-bold text-muted-foreground">
            {subject.noteCount} {subject.noteCount === 1 ? "note" : "notes"}
          </span>
          {subject.color && (
            <div
              className="ml-auto w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: subject.color }}
            />
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main client
// ---------------------------------------------------------------------------

interface SubjectsClientProps {
  initialSubjects: Subject[];
}

export function SubjectsClient({ initialSubjects }: SubjectsClientProps) {
  const posthog = usePostHog();
  const [subjectsList, setSubjectsList] = useState<Subject[]>(initialSubjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);

  const displaySubjects = subjectsList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()),
  );

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  const handleCreate = async (data: {
    name: string;
    description: string;
    color: string | null;
  }) => {
    const t = toast.loading("Creating subject...");
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const created: Subject = await res.json();
      setSubjectsList((prev) =>
        [...prev, { ...created, noteCount: 0 }].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      setModalOpen(false);
      posthog.capture("subject_created", { name: data.name });
      toast.success("Subject created", { id: t });
    } catch {
      toast.error("Failed to create subject", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  const handleUpdate = async (data: {
    name: string;
    description: string;
    color: string | null;
  }) => {
    if (!editingSubject) return;
    const t = toast.loading("Saving...");
    try {
      const res = await fetch(`/api/subjects/${editingSubject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const updated: Subject = await res.json();
      setSubjectsList((prev) =>
        prev.map((s) =>
          s.id === updated.id ? { ...updated, noteCount: s.noteCount } : s,
        ),
      );
      setEditingSubject(null);
      toast.success("Subject updated", { id: t });
    } catch {
      toast.error("Failed to update subject", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const t = toast.loading("Deleting...");
    try {
      const res = await fetch(`/api/subjects/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setSubjectsList((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Subject deleted", { id: t });
    } catch {
      toast.error("Failed to delete subject", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <NotesHeader
          title="Subjects"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 mt-1"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> New Subject
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 px-5 py-3 bg-secondary/30 rounded-2xl border border-border/50 w-fit">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
          {subjectsList.length}{" "}
          {subjectsList.length === 1 ? "Subject" : "Subjects"}
        </span>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {displaySubjects.length > 0 ? (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displaySubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onEdit={(s) => setEditingSubject(s)}
                onDelete={(s) => setDeleteTarget(s)}
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
              <BookOpen className="w-12 h-12 text-primary opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {searchQuery
                ? "No subjects match your search."
                : "No subjects yet."}
            </h3>
            <p className="max-w-xs text-muted-foreground text-sm mb-6">
              {searchQuery
                ? "Try a different search term."
                : "Create subjects to organise your notes by course or topic."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" /> Create your first subject
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create modal */}
      <AnimatePresence>
        {modalOpen && (
          <SubjectModal
            onClose={() => setModalOpen(false)}
            onSave={handleCreate}
          />
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editingSubject && (
          <SubjectModal
            subject={editingSubject}
            onClose={() => setEditingSubject(null)}
            onSave={handleUpdate}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This subject will be removed. Notes assigned to it will not be deleted but will lose their subject."
      />
    </div>
  );
}
