"use client";
// components/Templates/TemplatesClient.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Check,
  Loader2,
  Pencil,
  Trash2,
  FileText,
  Copy,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotesHeader } from "@/components/Notes/NotesHeader";
import { DeleteModal } from "@/components/Notes/DeleteModal";
import { NoteEditor } from "@/components/Notes/NoteEditor";
import toast from "react-hot-toast";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Template {
  id: string;
  name: string;
  description: string | null;
  content: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ---------------------------------------------------------------------------
// Starter templates offered on empty state
// ---------------------------------------------------------------------------

const STARTER_TEMPLATES = [
  {
    name: "Lecture Notes",
    description: "Structured notes for a lecture or class",
    content: `<h2>Lecture Notes</h2><p><strong>Subject:</strong> </p><p><strong>Date:</strong> </p><p><strong>Topic:</strong> </p><h3>Key Points</h3><ul><li></li><li></li><li></li></ul><h3>Details</h3><p></p><h3>Questions / Follow-up</h3><ul><li></li></ul><h3>Summary</h3><p></p>`,
  },
  {
    name: "Study Plan",
    description: "Plan your study sessions and goals",
    content: `<h2>Study Plan</h2><p><strong>Subject:</strong> </p><p><strong>Exam Date:</strong> </p><h3>Goals</h3><ul><li></li><li></li></ul><h3>Topics to Cover</h3><ol><li></li><li></li><li></li></ol><h3>Schedule</h3><p></p><h3>Resources</h3><ul><li></li></ul>`,
  },
  {
    name: "Book Summary",
    description: "Summarize key takeaways from a book",
    content: `<h2>Book Summary</h2><p><strong>Title:</strong> </p><p><strong>Author:</strong> </p><p><strong>Date Read:</strong> </p><h3>Main Idea</h3><p></p><h3>Key Concepts</h3><ul><li></li><li></li></ul><h3>Notable Quotes</h3><blockquote></blockquote><h3>My Takeaways</h3><p></p>`,
  },
  {
    name: "Meeting Notes",
    description: "Track decisions and action items",
    content: `<h2>Meeting Notes</h2><p><strong>Date:</strong> </p><p><strong>Attendees:</strong> </p><h3>Agenda</h3><ol><li></li><li></li></ol><h3>Discussion</h3><p></p><h3>Decisions Made</h3><ul><li></li></ul><h3>Action Items</h3><ul><li></li></ul>`,
  },
  {
    name: "Flashcard Prep",
    description: "Organize concepts before turning them into cards",
    content: `<h2>Flashcard Prep</h2><p><strong>Topic:</strong> </p><h3>Concept & Definition</h3><ul><li><strong>Term:</strong> [Definition/Answer]</li><li><strong>Term:</strong> [Definition/Answer]</li></ul><h3>Mnemonics/Tricks</h3><p></p><h3>Visual Aids needed?</h3><ul><li></li></ul>`,
  },
  {
    name: "Lab Report",
    description: "Document scientific experiments and results",
    content: `<h2>Lab Report</h2><p><strong>Experiment:</strong> </p><p><strong>Date:</strong> </p><h3>Objective</h3><p></p><h3>Hypothesis</h3><p></p><h3>Materials & Methods</h3><ul><li></li></ul><h3>Results/Data</h3><p></p><h3>Conclusion</h3><p></p>`,
  },
  {
    name: "Project Brainstorm",
    description: "Initial ideas and scope for a new project",
    content: `<h2>Project Brainstorm</h2><p><strong>Goal:</strong> </p><h3>The "Why"</h3><p></p><h3>Core Features</h3><ul><li></li><li></li></ul><h3>Potential Obstacles</h3><ul><li></li></ul><h3>Next Steps</h3><ol><li></li></ol>`,
  },
  {
    name: "Language Learning",
    description: "Track new vocabulary and grammar rules",
    content: `<h2>Language Learning</h2><p><strong>Target Language:</strong> </p><h3>New Vocabulary</h3><ul><li><strong>Word:</strong> [Meaning] (Example sentence)</li></ul><h3>Grammar Focus</h3><p></p><h3>Idioms/Slang</h3><ul><li></li></ul><h3>Practice Goals</h3><p></p>`,
  },
  {
    name: "Active Recall Session",
    description: "Test yourself on a specific subject",
    content: `<h2>Active Recall: [Subject]</h2><p><strong>Confidence Level:</strong> Low / Med / High</p><h3>Questions for Self-Testing</h3><ul><li>Question 1?</li></ul><h3>The Answers (Hidden/Below)</h3><p></p><h3>Gaps in Knowledge</h3><ul><li></li></ul>`,
  },
];

// ---------------------------------------------------------------------------
// Template modal (create / edit)
// ---------------------------------------------------------------------------

function TemplateModal({
  template,
  onClose,
  onSave,
}: {
  template?: Template | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string;
    content: string;
  }) => Promise<void>;
}) {
  const [name, setName] = useState(template?.name ?? "");
  const [description, setDescription] = useState(template?.description ?? "");
  const [content, setContent] = useState(template?.content ?? "");
  const [editorKey, setEditorKey] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    await onSave({ name, description, content });
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
        className="relative bg-card border border-border w-full max-w-2xl rounded-[2rem] shadow-2xl z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-border shrink-0">
          <h2 className="text-xl font-black text-foreground">
            {template ? "Edit Template" : "New Template"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-7 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Template Name *
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lecture Notes, Study Plan..."
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
              placeholder="What is this template for?"
              className="w-full bg-secondary/50 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground transition-all"
            />
          </div>

          {/* Content editor */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Template Content
            </label>
            <div className="border border-border rounded-2xl p-4 bg-secondary/20">
              <NoteEditor
                key={editorKey}
                content={content}
                onChange={setContent}
                placeholder="Build your template structure here..."
                minHeight="200px"
                resetKey={editorKey}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-7 pb-6 pt-3 border-t border-border shrink-0">
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
            {template ? "Save Changes" : "Create Template"}
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
// Template card
// ---------------------------------------------------------------------------

function TemplateCard({
  template,
  onEdit,
  onDelete,
  onUse,
}: {
  template: Template;
  onEdit: () => void;
  onDelete: () => void;
  onUse: () => void;
}) {
  const wordCount = (template.content ?? "")
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const updatedAt = new Date(template.updatedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-card border border-border rounded-3xl p-5 hover:border-primary/30 transition-all flex flex-col"
    >
      {/* Actions */}
      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Icon */}
      <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 shrink-0">
        <FileText className="w-5 h-5 text-primary" />
      </div>

      {/* Name + description */}
      <h3 className="font-bold text-base text-foreground tracking-tight mb-1 pr-14">
        {template.name}
      </h3>
      {template.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {template.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-auto pt-3 border-t border-border/50">
        <div className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          <span>{wordCount} words</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{updatedAt}</span>
        </div>
      </div>

      {/* Use button */}
      <button
        onClick={onUse}
        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-2xl text-xs font-bold transition-all"
      >
        <Copy className="w-3.5 h-3.5" /> Use Template
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main client
// ---------------------------------------------------------------------------

interface TemplatesClientProps {
  initialTemplates: Template[];
}

export function TemplatesClient({ initialTemplates }: TemplatesClientProps) {
  const [templatesList, setTemplatesList] =
    useState<Template[]>(initialTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const displayTemplates = templatesList.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()),
  );

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  const handleCreate = async (data: {
    name: string;
    description: string;
    content: string;
  }) => {
    const t = toast.loading("Creating template...");
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const created: Template = await res.json();
      setTemplatesList((prev) => [...prev, created]);
      setModalOpen(false);
      toast.success("Template created", { id: t });
    } catch {
      toast.error("Failed to create template", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Create from starter
  // ---------------------------------------------------------------------------
  const handleCreateStarter = async (
    starter: (typeof STARTER_TEMPLATES)[0],
  ) => {
    const t = toast.loading("Creating template...");
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(starter),
      });
      if (!res.ok) throw new Error();
      const created: Template = await res.json();
      setTemplatesList((prev) => [...prev, created]);
      toast.success(`"${starter.name}" added`, { id: t });
    } catch {
      toast.error("Failed to add template", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  const handleUpdate = async (data: {
    name: string;
    description: string;
    content: string;
  }) => {
    if (!editingTemplate) return;
    const t = toast.loading("Saving...");
    try {
      const res = await fetch(`/api/templates/${editingTemplate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const updated: Template = await res.json();
      setTemplatesList((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
      setEditingTemplate(null);
      toast.success("Template updated", { id: t });
    } catch {
      toast.error("Failed to update template", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const t = toast.loading("Deleting...");
    try {
      await fetch(`/api/templates/${deleteTarget.id}`, { method: "DELETE" });
      setTemplatesList((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Template deleted", { id: t });
    } catch {
      toast.error("Failed to delete template", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Use template — copy content to clipboard and open vault
  // ---------------------------------------------------------------------------
  const handleUse = (template: Template) => {
    const plain = (template.content ?? "").replace(/<[^>]*>/g, "\n").trim();
    navigator.clipboard.writeText(plain).then(() => {
      toast.success("Template copied to clipboard — paste it in your note");
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <NotesHeader
          title="Templates"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search templates..."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 mt-1"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> New Template
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 px-5 py-3 bg-secondary/30 rounded-2xl border border-border/50 w-fit">
        <FileText className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
          {templatesList.length}{" "}
          {templatesList.length === 1 ? "Template" : "Templates"}
        </span>
      </div>

      {/* Starter templates — always show ones not yet added */}
      {!searchQuery &&
        STARTER_TEMPLATES.some(
          (s) => !templatesList.find((t) => t.name === s.name),
        ) && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-muted-foreground">
              {templatesList.length === 0
                ? "Get started with a starter template:"
                : "Add more starters:"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STARTER_TEMPLATES.filter(
                (s) => !templatesList.find((t) => t.name === s.name),
              ).map((starter) => (
                <button
                  key={starter.name}
                  onClick={() => handleCreateStarter(starter)}
                  className="flex items-start gap-3 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 text-left transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {starter.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {starter.description}
                    </p>
                  </div>
                  <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto shrink-0 mt-0.5 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

      {/* Templates grid */}
      <AnimatePresence mode="popLayout">
        {displayTemplates.length > 0 ? (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={() => setEditingTemplate(template)}
                onDelete={() => setDeleteTarget(template)}
                onUse={() => handleUse(template)}
              />
            ))}
          </motion.div>
        ) : searchQuery ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center opacity-40"
          >
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="font-bold text-foreground">
              No templates match your search.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Create modal */}
      <AnimatePresence>
        {modalOpen && (
          <TemplateModal
            onClose={() => setModalOpen(false)}
            onSave={handleCreate}
          />
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editingTemplate && (
          <TemplateModal
            template={editingTemplate}
            onClose={() => setEditingTemplate(null)}
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
        description="This template will be permanently deleted."
      />
    </div>
  );
}
