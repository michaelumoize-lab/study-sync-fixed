"use client";
// components/Library/SemestersClient.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  CalendarDays,
  StickyNote,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { NotesHeader } from "@/components/Notes/NotesHeader";
import { DeleteModal } from "@/components/Notes/DeleteModal";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Semester {
  id: string;
  name: string;
  startDate: Date | string | null;
  endDate: Date | string | null;
  isActive: boolean | null;
  noteCount: number;
  createdAt: Date | string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: Date | string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toInputDate(date: Date | string | null) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

function getSemesterStatus(
  s: Semester,
): "active" | "upcoming" | "completed" | "no-dates" {
  if (s.isActive) return "active";
  if (!s.startDate && !s.endDate) return "no-dates";
  const now = Date.now();
  const start = s.startDate ? new Date(s.startDate).getTime() : null;
  const end = s.endDate ? new Date(s.endDate).getTime() : null;
  if (start && start > now) return "upcoming";
  if (end && end < now) return "completed";
  return "active";
}

// ---------------------------------------------------------------------------
// Semester form modal
// ---------------------------------------------------------------------------

function SemesterModal({
  semester,
  onClose,
  onSave,
}: {
  semester?: Semester | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  }) => Promise<void>;
}) {
  const [name, setName] = useState(semester?.name ?? "");
  const [startDate, setStartDate] = useState(
    toInputDate(semester?.startDate ?? null),
  );
  const [endDate, setEndDate] = useState(
    toInputDate(semester?.endDate ?? null),
  );
  const [isActive, setIsActive] = useState(semester?.isActive ?? false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error("Start date must be before end date");
      return;
    }
    setSaving(true);
    await onSave({ name, startDate, endDate, isActive: isActive ?? false });
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
            {semester ? "Edit Semester" : "New Semester"}
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
              placeholder="e.g. Fall 2025, Spring 2026..."
              className="w-full bg-secondary/50 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground font-semibold transition-all"
            />
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-secondary/50 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground transition-all text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-secondary/50 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground transition-all text-sm"
              />
            </div>
          </div>

          {/* Active toggle */}
          <button
            type="button"
            onClick={() => setIsActive((v) => !v)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all",
              isActive
                ? "bg-primary/10 border-primary/40 text-primary"
                : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/30",
            )}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-bold">Set as active semester</span>
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                isActive ? "bg-primary border-primary" : "border-border",
              )}
            >
              {isActive && (
                <Check className="w-3 h-3 text-primary-foreground stroke-[3px]" />
              )}
            </div>
          </button>
          {isActive && (
            <p className="text-[11px] text-muted-foreground -mt-2 ml-1">
              This will deactivate any currently active semester.
            </p>
          )}
        </div>

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
            {semester ? "Save Changes" : "Create Semester"}
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
// Semester card
// ---------------------------------------------------------------------------

function SemesterCard({
  semester,
  onEdit,
  onDelete,
  onSetActive,
}: {
  semester: Semester;
  onEdit: (s: Semester) => void;
  onDelete: (s: Semester) => void;
  onSetActive: (s: Semester) => void;
}) {
  const status = getSemesterStatus(semester);

  const statusConfig = {
    active: {
      label: "Active",
      className: "bg-primary/10 text-primary border-primary/30",
    },
    upcoming: {
      label: "Upcoming",
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    completed: {
      label: "Completed",
      className: "bg-secondary text-muted-foreground border-border",
    },
    "no-dates": {
      label: "No dates set",
      className: "bg-secondary text-muted-foreground border-border",
    },
  };

  const { label, className } = statusConfig[status];
  const start = formatDate(semester.startDate);
  const end = formatDate(semester.endDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative bg-card border rounded-3xl p-5 transition-all hover:border-primary/30",
        semester.isActive
          ? "border-primary/40 shadow-sm shadow-primary/10"
          : "border-border",
      )}
    >
      {/* Actions */}
      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(semester)}
          className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(semester)}
          className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Clickable body */}
      <Link
        href={`/dashboard/library/semesters/${semester.id}`}
        className="block"
      >
        {/* Icon */}
        <div
          className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center mb-4",
            semester.isActive ? "bg-primary/10" : "bg-secondary",
          )}
        >
          <GraduationCap
            className={cn(
              "w-5 h-5",
              semester.isActive ? "text-primary" : "text-muted-foreground",
            )}
          />
        </div>

        {/* Name + status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-base text-foreground tracking-tight leading-tight">
            {semester.name}
          </h3>
          <span
            className={cn(
              "shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border",
              className,
            )}
          >
            {label}
          </span>
        </div>

        {/* Date range */}
        {(start || end) && (
          <div className="flex items-center gap-1.5 mb-3 text-xs text-muted-foreground">
            <CalendarDays className="w-3.5 h-3.5 shrink-0" />
            <span>
              {start && end
                ? `${start} – ${end}`
                : start
                  ? `From ${start}`
                  : `Until ${end}`}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
            <StickyNote className="w-3 h-3" />
            {semester.noteCount} {semester.noteCount === 1 ? "note" : "notes"}
          </div>
          {!semester.isActive && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onSetActive(semester);
              }}
              className="text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              Set active
            </button>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main client
// ---------------------------------------------------------------------------

interface SemestersClientProps {
  initialSemesters: Semester[];
}

export function SemestersClient({ initialSemesters }: SemestersClientProps) {
  const [semestersList, setSemestersList] =
    useState<Semester[]>(initialSemesters);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Semester | null>(null);

  const displaySemesters = semestersList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeSemester = semestersList.find((s) => s.isActive);

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  const handleCreate = async (data: {
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  }) => {
    const t = toast.loading("Creating semester...");
    try {
      const res = await fetch("/api/semesters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const created: Semester = await res.json();
      setSemestersList((prev) => {
        const updated = data.isActive
          ? prev.map((s) => ({ ...s, isActive: false }))
          : prev;
        return [{ ...created, noteCount: 0 }, ...updated];
      });
      setModalOpen(false);
      toast.success("Semester created", { id: t });
    } catch {
      toast.error("Failed to create semester", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  const handleUpdate = async (data: {
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  }) => {
    if (!editingSemester) return;
    const t = toast.loading("Saving...");
    try {
      const res = await fetch(`/api/semesters/${editingSemester.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const updated: Semester = await res.json();
      setSemestersList((prev) => {
        const list = data.isActive
          ? prev.map((s) => ({ ...s, isActive: false }))
          : prev;
        return list.map((s) =>
          s.id === updated.id ? { ...updated, noteCount: s.noteCount } : s,
        );
      });
      setEditingSemester(null);
      toast.success("Semester updated", { id: t });
    } catch {
      toast.error("Failed to update semester", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Set active (quick action on card)
  // ---------------------------------------------------------------------------
  const handleSetActive = async (semester: Semester) => {
    const t = toast.loading("Setting active...");
    try {
      const res = await fetch(`/api/semesters/${semester.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });
      if (!res.ok) throw new Error();
      setSemestersList((prev) =>
        prev.map((s) => ({ ...s, isActive: s.id === semester.id })),
      );
      toast.success(`"${semester.name}" is now active`, { id: t });
    } catch {
      toast.error("Failed to set active", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const t = toast.loading("Deleting...");
    try {
      const res = await fetch(`/api/semesters/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setSemestersList((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Semester deleted", { id: t });
    } catch {
      toast.error("Failed to delete semester", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <NotesHeader
          title="Semesters"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 mt-1"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> New Semester
        </button>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 px-5 py-3 bg-secondary/30 rounded-2xl border border-border/50">
          <GraduationCap className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
            {semestersList.length}{" "}
            {semestersList.length === 1 ? "Semester" : "Semesters"}
          </span>
        </div>
        {activeSemester && (
          <div className="flex items-center gap-2 px-5 py-3 bg-primary/10 rounded-2xl border border-primary/30">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              Active: {activeSemester.name}
            </span>
          </div>
        )}
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {displaySemesters.length > 0 ? (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displaySemesters.map((semester) => (
              <SemesterCard
                key={semester.id}
                semester={semester}
                onEdit={(s) => setEditingSemester(s)}
                onDelete={(s) => setDeleteTarget(s)}
                onSetActive={handleSetActive}
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
              <GraduationCap className="w-12 h-12 text-primary opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {searchQuery
                ? "No semesters match your search."
                : "No semesters yet."}
            </h3>
            <p className="max-w-xs text-muted-foreground text-sm mb-6">
              {searchQuery
                ? "Try a different search term."
                : "Create semesters to organise your notes by academic period."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" /> Create your first semester
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create modal */}
      <AnimatePresence>
        {modalOpen && (
          <SemesterModal
            onClose={() => setModalOpen(false)}
            onSave={handleCreate}
          />
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editingSemester && (
          <SemesterModal
            semester={editingSemester}
            onClose={() => setEditingSemester(null)}
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
        description="This semester will be removed. Notes assigned to it will not be deleted but will lose their semester."
      />
    </div>
  );
}
