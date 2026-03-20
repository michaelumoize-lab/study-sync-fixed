"use client";
// components/Notes/CreateNote.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FileEdit,
  ChevronDown,
  Tag,
  BookOpen,
  GraduationCap,
  X,
} from "lucide-react";
import { NoteEditor } from "./NoteEditor";
import { CreateNoteInput } from "@/types/note";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
  color?: string | null;
}
interface Semester {
  id: string;
  name: string;
}
interface TagOption {
  id: string;
  name: string;
  color?: string | null;
}

interface CreateNoteProps {
  onAdd: (input: CreateNoteInput) => Promise<boolean>;
  onSaveDraft: (input: CreateNoteInput) => Promise<boolean>;
  subjects?: Subject[];
  semesters?: Semester[];
  tags?: TagOption[];
}

export function CreateNote({
  onAdd,
  onSaveDraft,
  subjects = [],
  semesters = [],
  tags = [],
}: CreateNoteProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showMeta, setShowMeta] = useState(false);
  // Incrementing this forces TipTap to remount and clear its content
  const [editorResetKey, setEditorResetKey] = useState(0);

  const isEmpty = !title.trim() && (!content || content === "<p></p>");

  const reset = () => {
    setTitle("");
    setContent("");
    setSelectedSubjectId("");
    setSelectedSemesterId("");
    setSelectedTagIds([]);
    setShowMeta(false);
    setEditorResetKey((k) => k + 1); // clears TipTap editor
  };

  const buildInput = (status: "active" | "draft"): CreateNoteInput => ({
    title: title.trim(),
    content,
    status,
    subjectId: selectedSubjectId || undefined,
    semesterId: selectedSemesterId || undefined,
    tagIds: selectedTagIds,
  });

  const handleAdd = async () => {
    if (isEmpty) return;
    const success = await onAdd(buildInput("active"));
    if (success) {
      reset();
      window.dispatchEvent(new Event("vault-updated"));
    }
  };

  const handleSaveDraft = async () => {
    if (isEmpty) return;
    const success = await onSaveDraft(buildInput("draft"));
    if (success) {
      reset();
      window.dispatchEvent(new Event("vault-updated"));
    }
  };

  const toggleTag = (id: string) =>
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );

  const hasMetaOptions =
    subjects.length > 0 || semesters.length > 0 || tags.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border-2 border-dashed border-border hover:border-primary/40 rounded-[2.5rem] p-8 mb-10 transition-all"
    >
      {/* Title */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className="w-full text-2xl font-black bg-transparent outline-none mb-4 text-foreground placeholder:text-muted-foreground/30"
      />

      {/* TipTap editor — resetKey forces a clean remount after submit */}
      <NoteEditor
        content={content}
        onChange={setContent}
        placeholder="Capture your thoughts..."
        minHeight="120px"
        resetKey={editorResetKey}
      />

      {/* Optional metadata */}
      {hasMetaOptions && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowMeta((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform",
                showMeta && "rotate-180",
              )}
            />
            {showMeta ? "Hide options" : "Add subject, semester & tags"}
          </button>

          <AnimatePresence>
            {showMeta && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4">
                  {/* Subject selector */}
                  {subjects.length > 0 && (
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        <BookOpen className="w-3 h-3" /> Subject
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() =>
                              setSelectedSubjectId(
                                selectedSubjectId === s.id ? "" : s.id,
                              )
                            }
                            className={cn(
                              "px-3 py-1 rounded-xl text-xs font-bold transition-all",
                              selectedSubjectId === s.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                            )}
                            style={
                              s.color && selectedSubjectId !== s.id
                                ? {
                                    backgroundColor: `${s.color}20`,
                                    color: s.color,
                                  }
                                : {}
                            }
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Semester selector */}
                  {semesters.length > 0 && (
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        <GraduationCap className="w-3 h-3" /> Semester
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {semesters.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() =>
                              setSelectedSemesterId(
                                selectedSemesterId === s.id ? "" : s.id,
                              )
                            }
                            className={cn(
                              "px-3 py-1 rounded-xl text-xs font-bold transition-all",
                              selectedSemesterId === s.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                            )}
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tag selector */}
                  {tags.length > 0 && (
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        <Tag className="w-3 h-3" /> Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleTag(t.id)}
                            className={cn(
                              "flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all",
                              selectedTagIds.includes(t.id)
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                            )}
                          >
                            #{t.name}
                            {selectedTagIds.includes(t.id) && (
                              <X className="w-3 h-3" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-6 pt-4 border-t border-border/50 gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleSaveDraft}
            disabled={isEmpty}
            className="flex-1 md:flex-none bg-orange-500/10 text-orange-500 px-6 py-3 rounded-2xl font-black hover:bg-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <FileEdit className="w-4 h-4" /> Save Draft
          </button>

          <button
            onClick={handleAdd}
            disabled={isEmpty}
            className="flex-1 md:flex-none bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed px-8 py-3 rounded-2xl font-black hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5 stroke-[3px]" /> Add Note
          </button>
        </div>
      </div>
    </motion.div>
  );
}
