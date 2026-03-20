"use client";
// components/Notes/PdfUpload.tsx

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  Loader2,
  AlertCircle,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Note } from "@/types/note";

interface Subject {
  id: string;
  name: string;
  color?: string | null;
}
interface Semester {
  id: string;
  name: string;
}

interface PdfUploadProps {
  subjects?: Subject[];
  semesters?: Semester[];
  onUploaded: (note: Note) => void;
}

export function PdfUpload({
  subjects = [],
  semesters = [],
  onUploaded,
}: PdfUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<
    "idle" | "uploading" | "extracting" | "saving" | "done"
  >("idle");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File too large. Max 10MB.");
      return;
    }
    setFile(f);
    setProgress("idle");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile],
  );
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress("extracting");

    const toastId = toast.loading("Preparing PDF...");

    try {
      const { parsePDFFile } = await import("@/lib/pdf-client");

      toast.loading("Reading PDF content...", { id: toastId });
      const { fullText } = await parsePDFFile(file);

      setProgress("saving");
      toast.loading("Saving to Study-Sync vault...", { id: toastId });

      // Send everything to the server — let the server handle the blob upload
      const res = await fetch("/api/upload/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name.replace(/\.pdf$/i, ""),
          content: fullText,
          subjectId: selectedSubjectId || null,
          semesterId: selectedSemesterId || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save note to database");

      const data = await res.json();

      setProgress("done");
      toast.success("PDF synced successfully!", { id: toastId });

      window.dispatchEvent(new Event("vault-updated"));
      onUploaded(data.note);

      setFile(null);
      setProgress("idle");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(errorMessage, { id: toastId });
      setProgress("idle");
    } finally {
      setUploading(false);
    }
  };
  const progressLabel = {
    idle: "",
    uploading: "Uploading to storage...",
    extracting: "Extracting text from PDF...",
    saving: "Creating note...",
    done: "Done!",
  }[progress];

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !file && inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-8 text-center transition-all",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : file
              ? "border-primary/40 bg-primary/5 cursor-default"
              : "border-border hover:border-primary/40 hover:bg-secondary/30 cursor-pointer",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">Drop your PDF here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  or{" "}
                  <span className="text-primary font-bold">
                    click to browse
                  </span>{" "}
                  — max 10MB
                </p>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                PDF files only
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-bold text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatSize(file.size)}
                </p>
                {uploading && (
                  <p className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> {progressLabel}
                  </p>
                )}
              </div>
              {!uploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setProgress("idle");
                  }}
                  className="p-2 hover:bg-secondary rounded-xl transition-colors shrink-0"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subject / Semester (optional) */}
      {file && (subjects.length > 0 || semesters.length > 0) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-3"
        >
          {subjects.length > 0 && (
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                <BookOpen className="w-3 h-3" /> Assign to Subject (optional)
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
                        ? { backgroundColor: `${s.color}20`, color: s.color }
                        : {}
                    }
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {semesters.length > 0 && (
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                <GraduationCap className="w-3 h-3" /> Assign to Semester
                (optional)
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
        </motion.div>
      )}

      {/* Upload button */}
      {file && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleUpload}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 disabled:opacity-60 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> {progressLabel}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" /> Import PDF as Note
            </>
          )}
        </motion.button>
      )}

      {/* Info note */}
      <div className="flex items-start gap-2 px-4 py-3 bg-secondary/30 rounded-2xl border border-border/50">
        <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Text is extracted from the PDF and saved as a note. The original PDF
          is also stored and linked. Scanned PDFs (images) may not extract text.
        </p>
      </div>
    </div>
  );
}
