"use client";
// components/Study/StudyClient.tsx

import { useState, useRef, useEffect, useCallback } from "react";
import { usePostHog } from "posthog-js/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Plus,
  Trash2,
  MessageSquare,
  Paperclip,
  X,
  Sparkles,
  BookOpen,
  Zap,
  Brain,
  HelpCircle,
  FileText,
  ChevronLeft,
  Loader2,
  Bot,
  User,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatSession {
  id: string;
  title: string | null;
  noteId: string | null;
  noteTitle: string | null;
  messageCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date | string;
}

interface UserNote {
  id: string;
  title: string;
}

interface StudyClientProps {
  initialSessions: ChatSession[];
  userNotes: UserNote[];
  sidebarCollapsed?: boolean;
}

// ---------------------------------------------------------------------------
// Quick prompts
// ---------------------------------------------------------------------------

const QUICK_PROMPTS = [
  {
    icon: FileText,
    label: "Summarize note",
    prompt: "Please summarize this note in a clear and concise way.",
    requiresNote: true,
  },
  {
    icon: Brain,
    label: "Generate flashcards",
    prompt:
      "Generate 8 flashcard pairs from this note. Format each as: **Front:** [question] | **Back:** [answer]",
    requiresNote: true,
  },
  {
    icon: HelpCircle,
    label: "Quiz me",
    prompt:
      "Quiz me on this note. Ask me one question at a time and wait for my answer before moving on.",
    requiresNote: true,
  },
  {
    icon: Zap,
    label: "Explain concepts",
    prompt:
      "Explain the key concepts from this note in simple terms, as if I'm hearing them for the first time.",
    requiresNote: true,
  },
  {
    icon: BookOpen,
    label: "Study tips",
    prompt:
      "Based on this note's content, what are the most important things I should focus on for studying?",
    requiresNote: false,
  },
  {
    icon: MessageSquare,
    label: "Key takeaways",
    prompt: "What are the 5 most important key takeaways from this note?",
    requiresNote: true,
  },
  {
    icon: Sparkles,
    label: "Simplify for me",
    prompt:
      "Rewrite this note in the simplest possible language, as if explaining to a complete beginner.",
    requiresNote: true,
  },
  {
    icon: PenLine,
    label: "Essay outline",
    prompt:
      "Create a structured essay outline based on the topics covered in this note.",
    requiresNote: true,
  },
];

// ---------------------------------------------------------------------------
// Message bubble
// ---------------------------------------------------------------------------

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-card border border-border rounded-tl-sm",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        ) : (
          <div
            className={cn(
              "prose prose-sm max-w-none text-foreground",
              "[&_h1]:text-foreground [&_h1]:font-black [&_h1]:text-lg [&_h1]:mt-4 [&_h1]:mb-2",
              "[&_h2]:text-foreground [&_h2]:font-bold [&_h2]:text-base [&_h2]:mt-4 [&_h2]:mb-2",
              "[&_h3]:text-foreground [&_h3]:font-bold [&_h3]:text-sm [&_h3]:mt-3 [&_h3]:mb-1.5",
              "[&_p]:text-foreground [&_p]:leading-relaxed [&_p]:mb-3 [&_p]:last:mb-0",
              "[&_strong]:text-foreground [&_strong]:font-bold",
              "[&_em]:text-foreground [&_em]:italic",
              "[&_ul]:my-3 [&_ul]:pl-5 [&_ul]:space-y-1",
              "[&_ol]:my-3 [&_ol]:pl-5 [&_ol]:space-y-1",
              "[&_li]:text-foreground [&_li]:leading-relaxed",
              "[&_li>p]:mb-0",
              "[&_code]:text-primary [&_code]:bg-primary/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-xs [&_code]:font-mono",
              "[&_pre]:bg-secondary [&_pre]:rounded-xl [&_pre]:p-3 [&_pre]:my-3 [&_pre]:overflow-x-auto",
              "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-foreground",
              "[&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_blockquote]:my-3",
              "[&_hr]:border-border [&_hr]:my-4",
            )}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Typing indicator
// ---------------------------------------------------------------------------

function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Session list item
// ---------------------------------------------------------------------------

function SessionItem({
  session,
  isActive,
  onClick,
  onDelete,
}: {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex items-start gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all",
        isActive
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-secondary/60",
      )}
    >
      <MessageSquare
        className={cn(
          "w-4 h-4 mt-0.5 shrink-0",
          isActive ? "text-primary" : "text-muted-foreground",
        )}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-semibold truncate",
            isActive ? "text-primary" : "text-foreground",
          )}
        >
          {session.title || "New Chat"}
        </p>
        {session.noteTitle && (
          <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
            <Paperclip className="w-2.5 h-2.5" /> {session.noteTitle}
          </p>
        )}
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
          {session.messageCount}{" "}
          {session.messageCount === 1 ? "message" : "messages"}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="shrink-0 p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main StudyClient
// ---------------------------------------------------------------------------

export function StudyClient({
  initialSessions,
  userNotes,
  sidebarCollapsed = false,
}: StudyClientProps) {
  const posthog = usePostHog();
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [attachedNote, setAttachedNote] = useState<UserNote | null>(null);
  const [showNotesPicker, setShowNotesPicker] = useState(false);
  const [noteSearch, setNoteSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(!sidebarCollapsed);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!isStreaming) {
      inputRef.current?.focus();
    }
  }, [isStreaming]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ---------------------------------------------------------------------------
  // Load session messages
  // ---------------------------------------------------------------------------
  const loadSession = async (sessionId: string) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    setIsLoadingSession(true);
    setActiveSessionId(sessionId);
    try {
      const res = await fetch(`/api/study/sessions/${sessionId}`);
      const msgs = await res.json();
      setMessages(msgs);
    } catch {
      toast.error("Failed to load session");
    } finally {
      setIsLoadingSession(false);
    }
  };

  // ---------------------------------------------------------------------------
  // New chat
  // ---------------------------------------------------------------------------
  const startNewChat = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    setActiveSessionId(null);
    setMessages([]);
    setAttachedNote(null);
    setInput("");
  };

  // ---------------------------------------------------------------------------
  // Delete session
  // ---------------------------------------------------------------------------
  const deleteSession = async (sessionId: string) => {
    try {
      await fetch(`/api/study/sessions/${sessionId}`, { method: "DELETE" });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) startNewChat();
      toast.success("Session deleted");
    } catch {
      toast.error("Failed to delete session");
    }
  };

  // ---------------------------------------------------------------------------
  // Send message
  // ---------------------------------------------------------------------------
  const sendMessage = async (messageText?: string) => {
    const text = messageText ?? input.trim();
    if (!text || isStreaming) return;

    const currentSessionId = activeSessionId;

    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    let assistantContent = "";
    const assistantMsg: Message = { role: "assistant", content: "" };

    try {
      const res = await fetch("/api/study/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: activeSessionId,
          noteId: attachedNote?.id ?? null,
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Failed to get response");

      posthog.capture("ai_chat_message_sent", { message_length: text.length });
      setMessages((prev) => [...prev, assistantMsg]);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);

            if (parsed.sessionId && !activeSessionId) {
              const newId = parsed.sessionId;
              setActiveSessionId(newId);
              setSessions((prev) => [
                {
                  id: newId,
                  title: text.slice(0, 60),
                  noteId: attachedNote?.id ?? null,
                  noteTitle: attachedNote?.title ?? null,
                  messageCount: 2,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                ...prev,
              ]);
            }

            if (parsed.delta) {
              assistantContent += parsed.delta;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch {
            // ignore parse errors
          }
        }
      }

      if (currentSessionId) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentSessionId
              ? {
                  ...s,
                  messageCount: s.messageCount + 2,
                  updatedAt: new Date(),
                }
              : s,
          ),
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        toast.error("Something went wrong. Try again.");
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredNotes = userNotes.filter((n) =>
    n.title.toLowerCase().includes(noteSearch.toLowerCase()),
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div
      className="flex overflow-hidden bg-background -mx-6 md:-mx-10 -mt-6 md:-mt-0"
      style={{ height: "calc(100vh - 6rem)" }}
    >
      <div
        className="flex w-full h-full overflow-hidden mx-4 my-3 rounded-2xl border border-border shadow-sm"
        style={{ maxHeight: "calc(100vh - 7rem)" }}
      >
        {/* ── Sidebar ── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute md:relative z-20 h-full w-full sm:w-[320px] md:w-64 shrink-0 flex flex-col bg-sidebar border-r border-border overflow-hidden shadow-xl md:shadow-none"
            >
              {/* Sidebar header */}
              <div className="px-4 pt-4 pb-3 border-b border-border shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-black text-foreground">
                      Study AI
                    </span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <button
                  onClick={startNewChat}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" /> New Chat
                </button>
              </div>

              {/* Session list */}
              <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-0.5">
                {sessions.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8 px-4">
                    No chats yet. Start a conversation!
                  </p>
                ) : (
                  sessions.map((s) => (
                    <SessionItem
                      key={s.id}
                      session={s}
                      isActive={s.id === activeSessionId}
                      onClick={() => loadSession(s.id)}
                      onDelete={() => deleteSession(s.id)}
                    />
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Chat area ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-sidebar/50 shrink-0">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors shrink-0"
              >
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span className="font-bold text-sm text-foreground truncate">
                {activeSessionId
                  ? sessions.find((s) => s.id === activeSessionId)?.title ||
                    "Chat"
                  : "New Chat"}
              </span>
            </div>

            {/* Attached note badge */}
            {attachedNote && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary shrink-0">
                <Paperclip className="w-3 h-3" />
                <span className="max-w-[120px] truncate">
                  {attachedNote.title}
                </span>
                <button onClick={() => setAttachedNote(null)}>
                  <X className="w-3 h-3 hover:text-destructive transition-colors" />
                </button>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6 space-y-5 min-h-0">
            {isLoadingSession ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              // ── Empty state — no logo, just heading + prompts ──
              <div className="flex flex-col items-center gap-6 text-center pt-8">
                <div>
                  <h2 className="text-2xl font-black text-foreground mb-2">
                    Study AI
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Ask me anything, attach a note for context, or use a quick
                    action.
                  </p>
                </div>

                {/* Quick prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full max-w-2xl">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.label}
                      onClick={() => {
                        if (prompt.requiresNote && !attachedNote) {
                          toast.error("Please attach a note first");
                          setPendingPrompt(prompt.prompt);
                          setShowNotesPicker(true);
                          return;
                        }
                        setInput(prompt.prompt);
                        setTimeout(() => inputRef.current?.focus(), 50);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl border bg-card border-border hover:border-primary/30 hover:bg-secondary/40 text-left transition-all hover:-translate-y-0.5"
                    >
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <prompt.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground leading-tight">
                          {prompt.label}
                        </p>
                        {prompt.requiresNote && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Requires note
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg} />
                ))}
                {isStreaming &&
                  messages[messages.length - 1]?.role === "user" && (
                    <TypingIndicator />
                  )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Note picker */}
          <AnimatePresence>
            {showNotesPicker && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mx-4 mb-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden shrink-0"
              >
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Attach a note
                  </span>
                  <button
                    onClick={() => {
                      setShowNotesPicker(false);
                      setPendingPrompt(null);
                    }}
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </div>
                <div className="p-3">
                  <input
                    autoFocus
                    value={noteSearch}
                    onChange={(e) => setNoteSearch(e.target.value)}
                    placeholder="Search notes..."
                    className="w-full px-3 py-2 text-sm bg-secondary/50 rounded-xl outline-none focus:ring-2 focus:ring-primary mb-2 text-foreground"
                  />
                  <div className="max-h-44 overflow-y-auto scrollbar-hide space-y-0.5">
                    {filteredNotes.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-3">
                        No notes found
                      </p>
                    ) : (
                      filteredNotes.map((note) => (
                        <button
                          key={note.id}
                          onClick={() => {
                            setAttachedNote(note);
                            setShowNotesPicker(false);
                            setNoteSearch("");
                            if (pendingPrompt) {
                              setInput(pendingPrompt);
                              setPendingPrompt(null);
                              setTimeout(() => inputRef.current?.focus(), 50);
                            }
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary text-left transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="text-sm font-medium text-foreground truncate">
                            {note.title}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="px-4 pb-4 pt-3 border-t border-border bg-sidebar/30 shrink-0">
            <div className="flex items-end gap-2 bg-card border border-border rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-primary transition-all">
              <button
                onClick={() => setShowNotesPicker((v) => !v)}
                className={cn(
                  "p-1.5 rounded-lg transition-all shrink-0 mb-0.5",
                  attachedNote
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
                title="Attach a note"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData("text/plain");
                  const start = e.currentTarget.selectionStart;
                  const end = e.currentTarget.selectionEnd;
                  const current = input;
                  const newValue =
                    current.slice(0, start) + text + current.slice(end);
                  setInput(newValue);
                  setTimeout(() => {
                    if (inputRef.current) {
                      const pos = start + text.length;
                      inputRef.current.selectionStart = pos;
                      inputRef.current.selectionEnd = pos;
                      inputRef.current.style.height = "auto";
                      inputRef.current.style.height =
                        Math.min(inputRef.current.scrollHeight, 120) + "px";
                    }
                  }, 0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  attachedNote
                    ? `Ask about "${attachedNote.title}"...`
                    : "Ask anything..."
                }
                disabled={isStreaming}
                rows={1}
                className="flex-1 bg-transparent outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50 py-1.5 max-h-[120px] scrollbar-hide"
              />

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isStreaming}
                className="p-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-40 active:scale-95 transition-all shrink-0 mb-0.5"
              >
                {isStreaming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground/60 text-center mt-2">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}