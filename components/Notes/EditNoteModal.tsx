"use client";
// components/Notes/EditNoteModal.tsx

import { useState, useEffect, useRef, useCallback } from "react";
import { Note, UpdateNoteInput } from "@/types/note";
import { useNotes } from "@/hooks/useNotes";
import {
  X,
  Loader2,
  Save,
  Check,
  ChevronDown,
  BookOpen,
  GraduationCap,
  Tag as TagIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NoteEditor } from "./NoteEditor";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

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

interface EditNoteModalProps {
  note: Note;
  onClose: () => void;
  onSaved?: (note: Note) => void;
  autoSaveInterval?: number;
}

export function EditNoteModal({
  note,
  onClose,
  onSaved,
  autoSaveInterval = 30,
}: EditNoteModalProps) {
  const { updateNote } = useNotes();

  // Restore from draft if one exists
  const [title, setTitle] = useState(note.draftTitle ?? note.title);
  const [content, setContent] = useState(
    note.draftContent ?? note.content ?? "",
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    note.subjectId ?? "",
  );
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>(
    note.semesterId ?? "",
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    note.tags?.map((t) => t.id) ?? [],
  );
  const [showMeta, setShowMeta] = useState(
    !!(note.subjectId || note.semesterId || note.tags?.length),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [tags, setTags] = useState<TagOption[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const isDirtyRef = useRef(false);
  const titleRef = useRef(title);
  const contentRef = useRef(content);

  // Keep refs in sync
  useEffect(() => {
    titleRef.current = title;
    contentRef.current = content;
    isDirtyRef.current = true;
  }, [title, content]);

  // Fetch subjects, semesters, tags
  useEffect(() => {
    const controller = new AbortController();
    const fetchJson = async (url: string) => {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) return [];
      return res.json();
    };
    Promise.all([
      fetchJson("/api/subjects"),
      fetchJson("/api/semesters"),
      fetchJson("/api/tags"),
    ])
      .then(([s, sem, t]) => {
        setSubjects(Array.isArray(s) ? s : []);
        setSemesters(Array.isArray(sem) ? sem : []);
        setTags(Array.isArray(t) ? t : []);
      })
      .catch(() => {})
      .finally(() => setLoadingMeta(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Auto-save draft
  const autoSave = useCallback(async () => {
    if (!isDirtyRef.current || !titleRef.current.trim()) return;
    try {
      const res = await fetch(`/api/notes/${note.id}/draft`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleRef.current.trim(),
          content: contentRef.current,
        }),
      });
      if (res.ok) {
        isDirtyRef.current = false;
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
        window.dispatchEvent(new Event("draft-updated"));
        toast.success("Draft auto-saved", {
          id: "autosave",
          icon: "📝",
          duration: 2000,
        });
      }
    } catch {
      // silent fail on auto-save
    }
  }, [note.id]);

  useEffect(() => {
    if (!autoSaveInterval || autoSaveInterval <= 0) return;
    const interval = setInterval(autoSave, autoSaveInterval * 1000);
    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval]);

  const toggleTag = (id: string) =>
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );

  // Save changes (promotes draft → real content)
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    setIsSaving(true);
    try {
      const input: UpdateNoteInput = {
        title: title.trim(),
        content,
        subjectId: selectedSubjectId || null,
        semesterId: selectedSemesterId || null,
        tagIds: selectedTagIds,
      };
      const success = await updateNote(note.id, input);
      if (success) {
        const updatedSubject = subjects.find((s) => s.id === selectedSubjectId);
        const updatedSemester = semesters.find((s) => s.id === selectedSemesterId);
        onSaved?.({
          ...note,
          title: title.trim(),
          content,
          draftTitle: null,
          draftContent: null,
          hasDraft: false,
          subjectId: selectedSubjectId || null,
          semesterId: selectedSemesterId || null,
          semester: updatedSemester
            ? {
                id: updatedSemester.id,
                name: updatedSemester.name,
              }
            : null,
          subject: updatedSubject
            ? {
                id: updatedSubject.id,
                name: updatedSubject.name,
                color: updatedSubject.color ?? null,
              }
            : null,
          tags: tags
            .filter((t) => selectedTagIds.includes(t.id))
            .map((t) => ({ id: t.id, name: t.name, color: t.color ?? null })),
        });
        onClose();
      } else {
        toast.error("Failed to save note");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const hasMetaOptions =
    subjects.length > 0 || semesters.length > 0 || tags.length > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isSaving ? onClose : undefined}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="relative bg-card border border-border w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-7 pb-4 shrink-0">
            <div>
              <h2 className="text-2xl font-black text-foreground tracking-tight">
                Edit Note
              </h2>
              <AnimatePresence>
                {autoSaved && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11px] text-primary font-semibold flex items-center gap-1 mt-0.5"
                  >
                    <Check className="w-3 h-3" /> Draft saved
                  </motion.p>
                )}
                {!autoSaved && note.hasDraft && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-orange-400 font-semibold mt-0.5"
                  >
                    Unsaved draft restored
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-2 hover:bg-secondary rounded-xl transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-8 pb-2 space-y-4 custom-scrollbar">
            {/* Title */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1 block ml-1">
                Title
              </label>
              <input
                className="w-full bg-secondary/50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-lg text-foreground transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                disabled={isSaving}
              />
            </div>

            {/* Content */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1 block ml-1">
                Content
              </label>
              <div className="bg-secondary/50 p-4 rounded-2xl focus-within:ring-2 focus-within:ring-primary transition-all">
                <NoteEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Study notes..."
                  minHeight="180px"
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Subject / Semester / Tags */}
            {!loadingMeta && hasMetaOptions && (
              <div>
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
                  {showMeta ? "Hide options" : "Subject, semester & tags"}
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
                        {/* Subject */}
                        {subjects.length > 0 && (
                          <div>
                            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                              <BookOpen className="w-3 h-3" /> Subject
                            </label>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedSubjectId("")}
                                className={cn(
                                  "px-3 py-1 rounded-xl text-xs font-bold transition-all",
                                  !selectedSubjectId
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                                )}
                              >
                                None
                              </button>
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

                        {/* Semester */}
                        {semesters.length > 0 && (
                          <div>
                            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                              <GraduationCap className="w-3 h-3" /> Semester
                            </label>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedSemesterId("")}
                                className={cn(
                                  "px-3 py-1 rounded-xl text-xs font-bold transition-all",
                                  !selectedSemesterId
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                                )}
                              >
                                None
                              </button>
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

                        {/* Tags */}
                        {tags.length > 0 && (
                          <div>
                            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                              <TagIcon className="w-3 h-3" /> Tags
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
                                  style={
                                    t.color && !selectedTagIds.includes(t.id)
                                      ? {
                                          backgroundColor: `${t.color}20`,
                                          color: t.color,
                                        }
                                      : {}
                                  }
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

            {loadingMeta && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" /> Loading options...
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-8 py-6 border-t border-border shrink-0">
            <button
              onClick={handleSave}
              disabled={isSaving || !title.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Changes
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-4 bg-secondary text-foreground rounded-2xl font-bold hover:bg-secondary/80 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
