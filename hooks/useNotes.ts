"use client";
// hooks/useNotes.ts

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { usePostHog } from "posthog-js/react";
import { Note, CreateNoteInput, UpdateNoteInput } from "@/types/note";

export function useNotes(initialNotes: Note[] = []) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [loading, setLoading] = useState(initialNotes.length === 0);
  const posthog = usePostHog();

  // ---------------------------------------------------------------------------
  // FETCH
  // ---------------------------------------------------------------------------
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vault");
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load vault");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------
  const addNote = async (input: CreateNoteInput): Promise<boolean> => {
    if (!input.title?.trim()) {
      toast.error("Title is required");
      return false;
    }
    const loadingToast = toast.loading("Syncing to vault...");
    try {
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error();
      const note: Note = await res.json();
      if (note.status === "active") {
        await fetchNotes();
      }

      window.dispatchEvent(new Event("vault-updated"));
      posthog.capture("note_created", { title: input.title });
      toast.success(note.status === "draft" ? "Draft saved" : "Note captured", {
        id: loadingToast,
      });
      return true;
    } catch {
      toast.error("Failed to save note", { id: loadingToast });
      return false;
    }
  };

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------
  const updateNote = async (
    id: string,
    input: UpdateNoteInput,
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/vault/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error();
      const updated: Note = await res.json();
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                title: updated.title,
                content: updated.content,
                status: updated.status,
                isPinned: updated.isPinned,
                subjectId: updated.subjectId,
                semesterId: updated.semesterId,
                updatedAt: updated.updatedAt,
                hasDraft: updated.hasDraft,
                draftTitle: updated.draftTitle,
                draftContent: updated.draftContent,
              }
            : n,
        ),
      );
      toast.success("Sync complete");
      return true;
    } catch {
      toast.error("Update failed");
      return false;
    }
  };

  // ---------------------------------------------------------------------------
  // SOFT DELETE (moves to recently deleted)
  // ---------------------------------------------------------------------------
  const deleteNote = async (id: string): Promise<boolean> => {
    const t = toast.loading("Moving to Recently Deleted...");
    try {
      const res = await fetch(`/api/vault/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setNotes((prev) => prev.filter((n) => n.id !== id));
      window.dispatchEvent(new Event("vault-updated"));
      posthog.capture("note_deleted", { note_id: id });
      toast.success("Note moved to Recently Deleted", { id: t });
      return true;
    } catch {
      toast.error("Could not delete note", { id: t });
      return false;
    }
  };

  // ---------------------------------------------------------------------------
  // BULK SOFT DELETE
  // ---------------------------------------------------------------------------
  const deleteMultipleNotes = async (ids: string[]): Promise<boolean> => {
    try {
      const res = await fetch("/api/vault/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error();
      setNotes((prev) => prev.filter((n) => !ids.includes(n.id)));
      window.dispatchEvent(new Event("vault-updated"));
      posthog.capture("bulk_notes_deleted", { count: ids.length });
      toast.success(`${ids.length} notes moved to Recently Deleted`);
      return true;
    } catch {
      toast.error("Bulk delete failed");
      return false;
    }
  };

  // ---------------------------------------------------------------------------
  // PIN / UNPIN
  // ---------------------------------------------------------------------------
  const togglePin = async (id: string, isPinned: boolean): Promise<boolean> => {
    try {
      const res = await fetch(`/api/vault/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !isPinned }),
      });
      if (!res.ok) throw new Error();
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isPinned: !isPinned } : n)),
      );
      toast.success(isPinned ? "Unpinned" : "Pinned to top");
      return true;
    } catch {
      toast.error("Could not update pin");
      return false;
    }
  };

  return {
    notes,
    loading,
    fetchNotes,
    setNotes,
    addNote,
    updateNote,
    deleteNote,
    deleteMultipleNotes,
    togglePin,
  };
}
