"use client";
// components/Notes/PdfImportModal.tsx

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText } from "lucide-react";
import { PdfUpload } from "@/components/Notes/PdfUpload";
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

interface PdfImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImported: (note: Note) => void;
  subjects?: Subject[];
  semesters?: Semester[];
}

export function PdfImportModal({
  isOpen,
  onClose,
  onImported,
  subjects = [],
  semesters = [],
}: PdfImportModalProps) {
  const handleImported = (note: Note) => {
    onImported(note);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
        >
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
            className="relative bg-card border border-border w-full max-w-lg rounded-[2rem] p-7 shadow-2xl z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="importPdfTitle"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 id="importPdfTitle" className="text-xl font-black text-foreground">
                    Import PDF
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Converts to a searchable note
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-xl transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <PdfUpload
              subjects={subjects}
              semesters={semesters}
              onUploaded={handleImported}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
