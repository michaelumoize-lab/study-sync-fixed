"use client";
// components/Notes/DeleteModal.tsx

import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Note?",
  description = "This action cannot be undone. This note will be moved to Recently Deleted.",
}: DeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center"
          >
            <div className="bg-destructive/10 text-destructive w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground text-sm">{description}</p>

            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-2xl font-bold bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 rounded-2xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all shadow-lg shadow-destructive/20"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
