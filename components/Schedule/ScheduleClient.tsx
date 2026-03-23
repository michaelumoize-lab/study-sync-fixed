"use client";
// components/Schedule/ScheduleClient.tsx

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  Trash2,
  Pencil,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { DeleteModal } from "@/components/Notes/DeleteModal";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ScheduleEvent {
  id: string;
  title: string;
  description: string | null;
  subjectId: string | null;
  subjectName: string | null;
  subjectColor: string | null;
  startsAt: Date | string;
  endsAt: Date | string | null;
  isCompleted: boolean | null;
  createdAt: Date | string;
}

interface Subject {
  id: string;
  name: string;
  color: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function toInputDatetime(date: Date | string | null) {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ---------------------------------------------------------------------------
// Event Form Modal
// ---------------------------------------------------------------------------

function EventModal({
  event,
  subjects,
  onClose,
  onSave,
}: {
  event?: ScheduleEvent | null;
  subjects: Subject[];
  onClose: () => void;
  onSave: (data: Partial<ScheduleEvent>) => Promise<void>;
}) {
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [subjectId, setSubjectId] = useState(event?.subjectId ?? "");
  const [startsAt, setStartsAt] = useState(
    toInputDatetime(event?.startsAt ?? new Date()),
  );
  const [endsAt, setEndsAt] = useState(toInputDatetime(event?.endsAt ?? null));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!startsAt) {
      toast.error("Start time is required");
      return;
    }
    setSaving(true);
    await onSave({
      title,
      description,
      subjectId: subjectId || null,
      startsAt,
      endsAt: endsAt || null,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
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
        className="relative bg-card border border-border w-full max-w-md rounded-4xl p-7 shadow-2xl z-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-foreground">
            {event ? "Edit Event" : "New Event"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Title *
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Study session, Exam, Assignment due..."
              className="w-full bg-secondary/50 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground text-base md:text-sm font-semibold transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={2}
              className="w-full bg-secondary/50 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground text-base md:text-sm resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Starts *
              </label>
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full bg-secondary/50 px-3 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground text-base md:text-sm transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Ends
              </label>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full bg-secondary/50 px-3 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground text-base md:text-sm transition-all"
              />
            </div>
          </div>

          {subjects.length > 0 && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Subject
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSubjectId("")}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                    !subjectId
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                  )}
                >
                  None
                </button>
                {subjects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSubjectId(s.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                      subjectId === s.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                    )}
                    style={
                      s.color && subjectId !== s.id
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
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {event ? "Save Changes" : "Create Event"}
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
// Event pill (used in calendar cells and list)
// ---------------------------------------------------------------------------

function EventPill({
  event,
  onClick,
}: {
  event: ScheduleEvent;
  onClick: () => void;
}) {
  const color = event.subjectColor;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // prevent triggering the parent day button
        onClick();
      }}
      role="button"
      className={cn(
        "w-full text-left px-2 py-1 rounded-lg text-[11px] font-bold truncate transition-all hover:opacity-80 cursor-pointer",
        event.isCompleted ? "opacity-50 line-through" : "",
      )}
      style={{
        backgroundColor: color ? `${color}25` : "var(--color-primary)/10",
        color: color ?? "var(--color-primary)",
      }}
    >
      {formatTime(event.startsAt)} {event.title}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main ScheduleClient
// ---------------------------------------------------------------------------

interface ScheduleClientProps {
  initialEvents: ScheduleEvent[];
  subjects: Subject[];
}

export function ScheduleClient({
  initialEvents,
  subjects,
}: ScheduleClientProps) {
  const [events, setEvents] = useState<ScheduleEvent[]>(initialEvents);
  const [today] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ScheduleEvent | null>(null);
  const [view, setView] = useState<"month" | "list">("month");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    return days;
  }, [year, month]);

  const eventsOnDay = (day: Date) =>
    events.filter((e) => isSameDay(new Date(e.startsAt), day));

  const selectedDayEvents = eventsOnDay(selectedDay).sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((e) => new Date(e.startsAt) >= today)
        .sort(
          (a, b) =>
            new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
        )
        .slice(0, 20),
    [events, today],
  );

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  const handleCreate = async (data: Partial<ScheduleEvent>) => {
    const t = toast.loading("Creating event...");
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          startsAt: data.startsAt
            ? new Date(data.startsAt as string).toISOString()
            : new Date(selectedDay.setHours(9, 0, 0, 0)).toISOString(),
        }),
      });
      if (!res.ok) throw new Error();
      const created: ScheduleEvent = await res.json();
      // Attach subject info
      const sub = subjects.find((s) => s.id === created.subjectId);
      setEvents((p) => [
        ...p,
        {
          ...created,
          subjectName: sub?.name ?? null,
          subjectColor: sub?.color ?? null,
        },
      ]);
      setModalOpen(false);
      toast.success("Event created", { id: t });
    } catch {
      toast.error("Failed to create event", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  const handleUpdate = async (data: Partial<ScheduleEvent>) => {
    if (!editingEvent) return;
    const t = toast.loading("Saving...");
    try {
      const res = await fetch(`/api/schedule/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const updated: ScheduleEvent = await res.json();
      const sub = subjects.find((s) => s.id === updated.subjectId);
      setEvents((p) =>
        p.map((e) =>
          e.id === updated.id
            ? {
                ...updated,
                subjectName: sub?.name ?? null,
                subjectColor: sub?.color ?? null,
              }
            : e,
        ),
      );
      setEditingEvent(null);
      toast.success("Event updated", { id: t });
    } catch {
      toast.error("Failed to update", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Toggle complete
  // ---------------------------------------------------------------------------
  const toggleComplete = async (event: ScheduleEvent) => {
    try {
      await fetch(`/api/schedule/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !event.isCompleted }),
      });
      setEvents((p) =>
        p.map((e) =>
          e.id === event.id ? { ...e, isCompleted: !e.isCompleted } : e,
        ),
      );
    } catch {
      toast.error("Failed to update");
    }
  };

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const t = toast.loading("Deleting...");
    try {
      await fetch(`/api/schedule/${deleteTarget.id}`, { method: "DELETE" });
      setEvents((p) => p.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Event deleted", { id: t });
    } catch {
      toast.error("Failed to delete", { id: t });
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Schedule
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {today.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-secondary/50 rounded-2xl p-1">
            {(["month", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-4 py-1.5 rounded-xl text-xs font-bold transition-all capitalize",
                  view === v
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4 stroke-[3px]" /> New Event
          </button>
        </div>
      </div>

      {/* Month view */}
      {view === "month" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-5">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-foreground">
                {MONTHS[month]} {year}
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  className="p-2 hover:bg-secondary rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1.5 text-xs font-bold bg-secondary hover:bg-secondary/80 rounded-xl transition-colors text-foreground"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  className="p-2 hover:bg-secondary rounded-xl transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-black uppercase tracking-wider text-muted-foreground py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const dayEvents = eventsOnDay(day);
                const isToday = isSameDay(day, today);
                const isSelected = isSameDay(day, selectedDay);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "relative flex flex-col min-h-16 p-1.5 rounded-2xl text-left transition-all",
                      isSelected
                        ? "bg-primary/10 ring-2 ring-primary/30"
                        : "hover:bg-secondary/50",
                      isToday && !isSelected && "ring-2 ring-primary/20",
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-bold mb-1 w-6 h-6 flex items-center justify-center rounded-full",
                        isToday
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground",
                      )}
                    >
                      {day.getDate()}
                    </span>
                    <div className="flex flex-col gap-0.5 w-full">
                      {dayEvents.slice(0, 2).map((e) => (
                        <EventPill
                          key={e.id}
                          event={e}
                          onClick={() => {
                            setSelectedDay(day);
                            setEditingEvent(e);
                          }}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[9px] text-muted-foreground font-bold">
                          +{dayEvents.length - 2}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day events */}
          <div className="bg-card border border-border rounded-3xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-foreground">
                  {selectedDay.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedDayEvents.length}{" "}
                  {selectedDayEvents.length === 1 ? "event" : "events"}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="p-2 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
              {selectedDayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10 opacity-40">
                  <CalendarDays className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No events</p>
                </div>
              ) : (
                selectedDayEvents.map((event) => (
                  <EventListItem
                    key={event.id}
                    event={event}
                    onToggle={() => toggleComplete(event)}
                    onEdit={() => setEditingEvent(event)}
                    onDelete={() => setDeleteTarget(event)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="space-y-6">
          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-40 text-center">
              <CalendarDays className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="font-bold text-foreground">No upcoming events.</p>
            </div>
          ) : (
            Object.entries(
              upcomingEvents.reduce<Record<string, ScheduleEvent[]>>(
                (acc, e) => {
                  const key = formatDate(e.startsAt);
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(e);
                  return acc;
                },
                {},
              ),
            ).map(([dateLabel, dayEvents]) => (
              <div key={dateLabel}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                  {dateLabel}
                </h3>
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <EventListItem
                      key={event.id}
                      event={event}
                      onToggle={() => toggleComplete(event)}
                      onEdit={() => setEditingEvent(event)}
                      onDelete={() => setDeleteTarget(event)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modalOpen && (
          <EventModal
            subjects={subjects}
            onClose={() => setModalOpen(false)}
            onSave={handleCreate}
          />
        )}
        {editingEvent && (
          <EventModal
            event={editingEvent}
            subjects={subjects}
            onClose={() => setEditingEvent(null)}
            onSave={handleUpdate}
          />
        )}
      </AnimatePresence>

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This event will be permanently removed from your schedule."
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Event list item
// ---------------------------------------------------------------------------

function EventListItem({
  event,
  onToggle,
  onEdit,
  onDelete,
}: {
  event: ScheduleEvent;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group flex items-start gap-3 bg-card border rounded-2xl px-4 py-3 transition-all hover:border-primary/20",
        event.isCompleted ? "opacity-60 border-border" : "border-border",
      )}
    >
      {/* Complete toggle */}
      <button onClick={onToggle} className="mt-0.5 shrink-0">
        {event.isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-primary" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "font-bold text-sm text-foreground",
              event.isCompleted && "line-through text-muted-foreground",
            )}
          >
            {event.title}
          </span>
          {event.subjectName && (
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={
                event.subjectColor
                  ? {
                      backgroundColor: `${event.subjectColor}20`,
                      color: event.subjectColor,
                    }
                  : {
                      backgroundColor: "var(--color-secondary)",
                      color: "var(--color-muted-foreground)",
                    }
              }
            >
              {event.subjectName}
            </span>
          )}
        </div>
        {event.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {event.description}
          </p>
        )}
        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-muted-foreground/70">
          <Clock className="w-3 h-3" />
          <span>{formatTime(event.startsAt)}</span>
          {event.endsAt && <span>– {formatTime(event.endsAt)}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
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
    </motion.div>
  );
}
