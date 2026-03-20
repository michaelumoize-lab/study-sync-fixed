"use client";
// components/Flashcards/FlashcardsClient.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Pencil,
  Sparkles,
  BookOpen,
  X,
  Check,
  Loader2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Layers,
  Brain,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotesHeader } from "@/components/Notes/NotesHeader";
import { DeleteModal } from "@/components/Notes/DeleteModal";
import toast from "react-hot-toast";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CardStatus = "new" | "learning" | "review" | "mastered";
type Difficulty = "easy" | "medium" | "hard";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  status: CardStatus | null;
  difficulty: Difficulty | null;
}

interface Deck {
  id: string;
  name: string;
  description: string | null;
  noteId: string | null;
  cardCount: number;
  createdAt: Date | string;
}

interface UserNote {
  id: string;
  title: string;
  content: string | null;
}

// ---------------------------------------------------------------------------
// Create Deck Modal
// ---------------------------------------------------------------------------

function CreateDeckModal({
  onClose,
  userNotes,
  onCreate,
}: {
  onClose: () => void;
  userNotes: UserNote[];
  onCreate: (deck: Deck) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [cards, setCards] = useState([{ front: "", back: "" }]);
  const [selectedNote, setSelectedNote] = useState<UserNote | null>(null);
  const [aiCount, setAiCount] = useState(8);
  const [noteSearch, setNoteSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredNotes = userNotes.filter((n) =>
    n.title.toLowerCase().includes(noteSearch.toLowerCase()),
  );

  const addCard = () => setCards((p) => [...p, { front: "", back: "" }]);
  const removeCard = (i: number) =>
    setCards((p) => p.filter((_, idx) => idx !== i));
  const updateCard = (i: number, field: "front" | "back", val: string) =>
    setCards((p) =>
      p.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)),
    );

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (mode === "ai" && !selectedNote) {
      toast.error("Select a note to generate from");
      return;
    }
    if (
      mode === "manual" &&
      cards.some((c) => !c.front.trim() || !c.back.trim())
    ) {
      toast.error("All cards need a front and back");
      return;
    }

    setSaving(true);
    const t = toast.loading(
      mode === "ai" ? "Generating flashcards with AI..." : "Creating deck...",
    );
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          noteId: selectedNote?.id ?? null,
          cards: mode === "manual" ? cards : undefined,
          generateFromContent: mode === "ai",
          noteContent: selectedNote?.content ?? "",
          count: aiCount,
        }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      onCreate({
        ...created,
        cardCount: mode === "manual" ? cards.length : aiCount,
      });
      toast.success("Deck created!", { id: t });
      onClose();
    } catch {
      toast.error("Failed to create deck", { id: t });
    } finally {
      setSaving(false);
    }
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
        className="relative bg-card border border-border w-full max-w-lg rounded-[2rem] shadow-2xl z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border shrink-0">
          <h2 className="text-xl font-black text-foreground">New Deck</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="overflow-y-auto scrollbar-hide px-6 py-4 space-y-4 flex-1">
          {/* Name */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Deck Name *
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chapter 3 — Cell Biology"
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
              placeholder="Optional..."
              className="w-full bg-secondary/50 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground transition-all"
            />
          </div>

          {/* Mode toggle */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">
              Creation Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["manual", "ai"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-bold border transition-all",
                    mode === m
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/30",
                  )}
                >
                  {m === "ai" ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    <Pencil className="w-4 h-4" />
                  )}
                  {m === "ai" ? "AI Generate" : "Manual"}
                </button>
              ))}
            </div>
          </div>

          {/* Manual cards */}
          {mode === "manual" && (
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                Cards
              </label>
              {cards.map((card, i) => (
                <div
                  key={i}
                  className="bg-secondary/30 rounded-2xl p-3 space-y-2 relative group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Card {i + 1}
                    </span>
                    {cards.length > 1 && (
                      <button
                        onClick={() => removeCard(i)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <input
                    value={card.front}
                    onChange={(e) => updateCard(i, "front", e.target.value)}
                    placeholder="Front (question)"
                    className="w-full bg-card px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm text-foreground transition-all"
                  />
                  <input
                    value={card.back}
                    onChange={(e) => updateCard(i, "back", e.target.value)}
                    placeholder="Back (answer)"
                    className="w-full bg-card px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm text-foreground transition-all"
                  />
                </div>
              ))}
              <button
                onClick={addCard}
                className="w-full py-2.5 border border-dashed border-border hover:border-primary/40 rounded-2xl text-sm text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Card
              </button>
            </div>
          )}

          {/* AI generation */}
          {mode === "ai" && (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">
                  Select Note
                </label>
                <input
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  placeholder="Search your notes..."
                  className="w-full bg-secondary/50 px-3 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm text-foreground mb-2 transition-all"
                />
                <div className="max-h-36 overflow-y-auto scrollbar-hide space-y-0.5 bg-secondary/20 rounded-2xl p-1.5">
                  {filteredNotes.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-3">
                      No notes found
                    </p>
                  ) : (
                    filteredNotes.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => setSelectedNote(n)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm transition-all",
                          selectedNote?.id === n.id
                            ? "bg-primary/10 text-primary font-bold"
                            : "hover:bg-secondary text-foreground",
                        )}
                      >
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{n.title}</span>
                        {selectedNote?.id === n.id && (
                          <Check className="w-3.5 h-3.5 ml-auto shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  Number of Cards: {aiCount}
                </label>
                <input
                  type="range"
                  min={4}
                  max={20}
                  step={2}
                  value={aiCount}
                  onChange={(e) => setAiCount(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6 pt-3 border-t border-border shrink-0">
          <button
            onClick={handleCreate}
            disabled={saving || !name.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Create Deck
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
// Study Mode — Flip Card
// ---------------------------------------------------------------------------

function FlipStudyMode({
  cards,
  onClose,
  onUpdateStatus,
}: {
  cards: Flashcard[];
  onClose: () => void;
  onUpdateStatus: (id: string, status: CardStatus) => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  const card = cards[index];
  const progress = Math.round((completed.length / cards.length) * 100);

  const next = () => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => Math.min(i + 1, cards.length - 1)), 150);
  };
  const prev = () => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => Math.max(i - 1, 0)), 150);
  };

  const markStatus = (status: CardStatus) => {
    onUpdateStatus(card.id, status);
    if (!completed.includes(card.id)) setCompleted((p) => [...p, card.id]);
    if (index < cards.length - 1) next();
  };

  if (cards.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="w-full max-w-xl flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" /> Exit
        </button>
        <span className="text-sm font-bold text-muted-foreground">
          {index + 1} / {cards.length}
        </span>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {progress}%
          </span>
        </div>
      </div>

      {/* Flip card */}
      <div
        className="w-full max-w-xl cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            transformStyle: "preserve-3d",
            position: "relative",
            height: "260px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-card border border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
              Question
            </span>
            <p className="text-xl font-bold text-foreground leading-relaxed">
              {card.front}
            </p>
            <span className="text-xs text-muted-foreground/60 mt-6">
              Click to reveal answer
            </span>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">
              Answer
            </span>
            <p className="text-xl font-bold text-foreground leading-relaxed">
              {card.back}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={prev}
          disabled={index === 0}
          className="p-3 bg-secondary rounded-2xl disabled:opacity-40 hover:bg-secondary/80 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {flipped && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2"
            >
              <button
                onClick={() => markStatus("learning")}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-sm font-bold transition-all"
              >
                <ThumbsDown className="w-4 h-4" /> Hard
              </button>
              <button
                onClick={() => markStatus("review")}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded-2xl text-sm font-bold transition-all"
              >
                <Minus className="w-4 h-4" /> Okay
              </button>
              <button
                onClick={() => markStatus("mastered")}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-2xl text-sm font-bold transition-all"
              >
                <ThumbsUp className="w-4 h-4" /> Easy
              </button>
            </motion.div>
          </AnimatePresence>
        )}

        <button
          onClick={next}
          disabled={index === cards.length - 1}
          className="p-3 bg-secondary rounded-2xl disabled:opacity-40 hover:bg-secondary/80 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Study Mode — Swipe
// ---------------------------------------------------------------------------

function SwipeStudyMode({
  cards,
  onClose,
  onUpdateStatus,
}: {
  cards: Flashcard[];
  onClose: () => void;
  onUpdateStatus: (id: string, status: CardStatus) => void;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [exiting, setExiting] = useState<"left" | "right" | null>(null);
  const [done, setDone] = useState(false);

  const card = cards[index];

  const swipe = (dir: "left" | "right") => {
    const status: CardStatus = dir === "right" ? "mastered" : "learning";
    onUpdateStatus(card.id, status);
    setExiting(dir);
    setTimeout(() => {
      setExiting(null);
      setRevealed(false);
      if (index >= cards.length - 1) setDone(true);
      else setIndex((i) => i + 1);
    }, 300);
  };

  if (done) {
    return (
      <div className="fixed inset-0 z-[120] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
        <div className="bg-primary/10 p-6 rounded-full">
          <Brain className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-foreground">All done!</h2>
        <p className="text-muted-foreground">
          You&apos;ve reviewed all {cards.length} cards.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all"
        >
          Back to Deck
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm flex items-center justify-between mb-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" /> Exit
        </button>
        <span className="text-sm font-bold text-muted-foreground">
          {index + 1} / {cards.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{
            opacity: exiting ? 0 : 1,
            scale: exiting ? 0.8 : 1,
            x: exiting === "left" ? -200 : exiting === "right" ? 200 : 0,
            rotate: exiting === "left" ? -15 : exiting === "right" ? 15 : 0,
          }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-sm"
          onClick={() => !revealed && setRevealed(true)}
        >
          <div
            className={cn(
              "rounded-3xl p-8 min-h-[280px] flex flex-col items-center justify-center text-center cursor-pointer border transition-all",
              revealed
                ? "bg-primary/5 border-primary/20"
                : "bg-card border-border",
            )}
          >
            <span
              className={cn(
                "text-[10px] font-black uppercase tracking-widest mb-4",
                revealed ? "text-primary" : "text-muted-foreground",
              )}
            >
              {revealed ? "Answer" : "Question"}
            </span>
            <p className="text-lg font-bold text-foreground leading-relaxed">
              {revealed ? card.back : card.front}
            </p>
            {!revealed && (
              <span className="text-xs text-muted-foreground/60 mt-6">
                Tap to reveal
              </span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Swipe buttons */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-6 mt-8"
        >
          <button
            onClick={() => swipe("left")}
            className="flex flex-col items-center gap-2 w-20 h-20 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-3xl justify-center transition-all font-bold text-sm"
          >
            <ThumbsDown className="w-6 h-6" />
            Again
          </button>
          <button
            onClick={() => swipe("right")}
            className="flex flex-col items-center gap-2 w-20 h-20 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-3xl justify-center transition-all font-bold text-sm"
          >
            <ThumbsUp className="w-6 h-6" />
            Got it
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Deck Card
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<CardStatus, string> = {
  new: "bg-secondary text-muted-foreground",
  learning: "bg-red-500/10 text-red-500",
  review: "bg-yellow-500/10 text-yellow-500",
  mastered: "bg-primary/10 text-primary",
};

function DeckCard({
  deck,
  onStudyFlip,
  onStudySwipe,
  onDelete,
}: {
  deck: Deck;
  onStudyFlip: () => void;
  onStudySwipe: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-card border border-border rounded-3xl p-5 hover:border-primary/30 transition-all"
    >
      {/* Delete */}
      <button
        onClick={onDelete}
        className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all text-muted-foreground"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Icon */}
      <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Layers className="w-5 h-5 text-primary" />
      </div>

      <h3 className="font-bold text-base text-foreground mb-1 pr-6">
        {deck.name}
      </h3>
      {deck.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {deck.description}
        </p>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-border/50 mb-4">
        <span className="text-[11px] font-bold text-muted-foreground">
          {deck.cardCount} {deck.cardCount === 1 ? "card" : "cards"}
        </span>
      </div>

      {/* Study buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onStudyFlip}
          disabled={deck.cardCount === 0}
          className="flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground rounded-2xl text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Flip
        </button>
        <button
          onClick={onStudySwipe}
          disabled={deck.cardCount === 0}
          className="flex items-center justify-center gap-1.5 py-2 bg-secondary text-foreground rounded-2xl text-xs font-bold hover:bg-secondary/80 disabled:opacity-40 transition-all"
        >
          <Brain className="w-3.5 h-3.5" /> Swipe
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Client
// ---------------------------------------------------------------------------

interface FlashcardsClientProps {
  initialDecks: Deck[];
  userNotes: UserNote[];
}

export function FlashcardsClient({
  initialDecks,
  userNotes,
}: FlashcardsClientProps) {
  const [decks, setDecks] = useState<Deck[]>(initialDecks);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Deck | null>(null);
  const [studyDeck, setStudyDeck] = useState<{
    deck: Deck;
    cards: Flashcard[];
    mode: "flip" | "swipe";
  } | null>(null);
  const [loadingDeckId, setLoadingDeckId] = useState<string | null>(null);

  const displayDecks = decks.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const loadAndStudy = async (deck: Deck, mode: "flip" | "swipe") => {
    setLoadingDeckId(deck.id);
    try {
      const res = await fetch(`/api/flashcards/${deck.id}`);
      const data = await res.json();
      setStudyDeck({ deck, cards: data.cards ?? [], mode });
    } catch {
      toast.error("Failed to load cards");
    } finally {
      setLoadingDeckId(null);
    }
  };

  const updateCardStatus = async (cardId: string, status: CardStatus) => {
    await fetch(`/api/flashcards/cards/${cardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const t = toast.loading("Deleting deck...");
    try {
      await fetch(`/api/flashcards/${deleteTarget.id}`, { method: "DELETE" });
      setDecks((p) => p.filter((d) => d.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Deck deleted", { id: t });
    } catch {
      toast.error("Failed to delete", { id: t });
    }
  };

  // Total stats
  const totalCards = decks.reduce((acc, d) => acc + d.cardCount, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <NotesHeader
          title="Flashcards"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search decks..."
        />
        <button
          onClick={() => setCreateOpen(true)}
          className="shrink-0 flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 mt-1"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> New Deck
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-3 px-5 py-3 bg-secondary/30 rounded-2xl border border-border/50">
          <Layers className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
            {decks.length} {decks.length === 1 ? "Deck" : "Decks"} ·{" "}
            {totalCards} Cards
          </span>
        </div>
      </div>

      {/* Deck grid */}
      <AnimatePresence mode="popLayout">
        {displayDecks.length > 0 ? (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayDecks.map((deck) => (
              <div key={deck.id} className="relative">
                {loadingDeckId === deck.id && (
                  <div className="absolute inset-0 bg-background/60 rounded-3xl flex items-center justify-center z-10">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                )}
                <DeckCard
                  deck={deck}
                  onStudyFlip={() => loadAndStudy(deck, "flip")}
                  onStudySwipe={() => loadAndStudy(deck, "swipe")}
                  onDelete={() => setDeleteTarget(deck)}
                />
              </div>
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
              <Layers className="w-12 h-12 text-primary opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {searchQuery
                ? "No decks match your search."
                : "No flashcard decks yet."}
            </h3>
            <p className="max-w-xs text-muted-foreground text-sm mb-6">
              {!searchQuery &&
                "Create a deck manually or let AI generate cards from your notes."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" /> Create your first deck
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create modal */}
      <AnimatePresence>
        {createOpen && (
          <CreateDeckModal
            onClose={() => setCreateOpen(false)}
            userNotes={userNotes}
            onCreate={(deck) => setDecks((p) => [deck, ...p])}
          />
        )}
      </AnimatePresence>

      {/* Study modes */}
      {studyDeck?.mode === "flip" && (
        <FlipStudyMode
          cards={studyDeck.cards}
          onClose={() => setStudyDeck(null)}
          onUpdateStatus={updateCardStatus}
        />
      )}
      {studyDeck?.mode === "swipe" && (
        <SwipeStudyMode
          cards={studyDeck.cards}
          onClose={() => setStudyDeck(null)}
          onUpdateStatus={updateCardStatus}
        />
      )}

      {/* Delete confirm */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete "${deleteTarget?.name}"?`}
        description="All cards in this deck will be permanently deleted."
      />
    </div>
  );
}
