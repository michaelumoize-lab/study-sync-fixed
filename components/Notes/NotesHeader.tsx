"use client";
// components/Notes/NotesHeader.tsx

import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotesHeaderProps {
  title: string;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export function NotesHeader({
  title,
  searchQuery,
  onSearchChange,
  showSearch = true,
  searchPlaceholder = "Search...",
}: NotesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
        {title}
      </h1>

      {showSearch && (
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-12 pr-12 py-3.5 bg-card border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm text-foreground placeholder:text-muted-foreground"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => onSearchChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
