// lib/schema.ts
import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
  pgEnum,
  index,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const noteStatusEnum = pgEnum("note_status", [
  "active",
  "draft",
  "deleted",
]);

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const flashcardStatusEnum = pgEnum("flashcard_status", [
  "new",
  "learning",
  "review",
  "mastered",
]);

// ---------------------------------------------------------------------------
// Subjects
// ---------------------------------------------------------------------------

export const subjects = pgTable("subjects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color"),
  icon: text("icon"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (t) => [
  index("subjects_user_id_idx").on(t.userId),
  uniqueIndex("subjects_name_user_idx").on(t.userId, t.name)
]);

// ---------------------------------------------------------------------------
// Semesters
// ---------------------------------------------------------------------------

export const semesters = pgTable("semesters", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (t) => [
  index("semesters_user_id_idx").on(t.userId),
  uniqueIndex("semesters_name_user_idx").on(t.userId, t.name)
]);

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export const tags = pgTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  color: text("color"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (t) => [
  index("tags_user_id_idx").on(t.userId),
  uniqueIndex("tags_name_user_idx").on(t.userId, t.name)
]);

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

export const notes = pgTable("notes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: uuid("user_id").notNull(),
  subjectId: text("subject_id").references(() => subjects.id, {
    onDelete: "set null",
  }),
  semesterId: text("semester_id").references(() => semesters.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  content: text("content"),
  pdfUrl: text("pdf_url"),

  // Draft auto-save columns
  draftTitle: text("draft_title"),
  draftContent: text("draft_content"),
  hasDraft: boolean("has_draft").default(false).notNull(),

  status: noteStatusEnum("status").default("active").notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (t) => [
  index("notes_user_id_idx").on(t.userId),
  index("notes_subject_id_idx").on(t.subjectId),
  index("notes_semester_id_idx").on(t.semesterId)
]);

// ---------------------------------------------------------------------------
// Note Tags
// ---------------------------------------------------------------------------

export const noteTags = pgTable("note_tags", {
  noteId: text("note_id")
    .notNull()
    .references(() => notes.id, { onDelete: "cascade" }),
  tagId: text("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
}, (t) => [
  primaryKey({ columns: [t.noteId, t.tagId] }),
  index("note_tags_note_tag_idx").on(t.noteId, t.tagId)
]);

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export const templates = pgTable("templates", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (t) => [
  index("templates_user_id_idx").on(t.userId),
  uniqueIndex("templates_name_user_idx").on(t.userId, t.name)
]);

// ---------------------------------------------------------------------------
// Flashcard Decks
// ---------------------------------------------------------------------------

export const flashcardDecks = pgTable("flashcard_decks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: uuid("user_id").notNull(),
  noteId: text("note_id").references(() => notes.id, { onDelete: "set null" }),
  subjectId: text("subject_id").references(() => subjects.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (t) => [
  index("flashcard_decks_user_id_idx").on(t.userId),
  index("flashcard_decks_note_id_idx").on(t.noteId),
  index("flashcard_decks_subject_id_idx").on(t.subjectId),
  uniqueIndex("flashcard_decks_name_user_idx").on(t.userId, t.name)
]);

// ---------------------------------------------------------------------------
// Flashcards
// ---------------------------------------------------------------------------

export const flashcards = pgTable("flashcards", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  deckId: text("deck_id")
    .notNull()
    .references(() => flashcardDecks.id, { onDelete: "cascade" }),
  front: text("front").notNull(),
  back: text("back").notNull(),
  difficulty: difficultyEnum("difficulty").default("medium"),
  status: flashcardStatusEnum("status").default("new"),
  nextReviewAt: timestamp("next_review_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (t) => [
  index("flashcards_deck_id_idx").on(t.deckId)
]);

// ---------------------------------------------------------------------------
// Study Sessions
// ---------------------------------------------------------------------------

export const studySessions = pgTable("study_sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: uuid("user_id").notNull(),
  noteId: text("note_id").references(() => notes.id, { onDelete: "set null" }),
  title: text("title"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (t) => [
  index("study_sessions_user_id_idx").on(t.userId),
  index("study_sessions_note_id_idx").on(t.noteId)
]);

export const studyMessages = pgTable("study_messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sessionId: text("session_id")
    .notNull()
    .references(() => studySessions.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (t) => [
  index("study_messages_session_id_idx").on(t.sessionId)
]);

// ---------------------------------------------------------------------------
// Schedule Events
// ---------------------------------------------------------------------------

export const scheduleEvents = pgTable("schedule_events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: uuid("user_id").notNull(),
  subjectId: text("subject_id").references(() => subjects.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  description: text("description"),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (t) => [
  index("schedule_events_user_id_idx").on(t.userId),
  index("schedule_events_subject_id_idx").on(t.subjectId)
]);

// ---------------------------------------------------------------------------
// User Settings
// ---------------------------------------------------------------------------

export const userSettings = pgTable("user_settings", {
  userId: uuid("user_id").primaryKey(),
  theme: text("theme").default("system"),
  defaultView: text("default_view").default("vault"),
  editorFont: text("editor_font").default("outfit"),
  autoSaveInterval: integer("auto_save_interval").default(30),
  studyStreakCount: integer("study_streak_count").default(0),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const subjectsRelations = relations(subjects, ({ many }) => ({
  notes: many(notes),
  flashcardDecks: many(flashcardDecks),
  scheduleEvents: many(scheduleEvents),
}));

export const semestersRelations = relations(semesters, ({ many }) => ({
  notes: many(notes),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  noteTags: many(noteTags),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [notes.subjectId],
    references: [subjects.id],
  }),
  semester: one(semesters, {
    fields: [notes.semesterId],
    references: [semesters.id],
  }),
  noteTags: many(noteTags),
  flashcardDecks: many(flashcardDecks),
  studySessions: many(studySessions),
}));

export const noteTagsRelations = relations(noteTags, ({ one }) => ({
  note: one(notes, { fields: [noteTags.noteId], references: [notes.id] }),
  tag: one(tags, { fields: [noteTags.tagId], references: [tags.id] }),
}));

export const flashcardDecksRelations = relations(
  flashcardDecks,
  ({ one, many }) => ({
    note: one(notes, {
      fields: [flashcardDecks.noteId],
      references: [notes.id],
    }),
    subject: one(subjects, {
      fields: [flashcardDecks.subjectId],
      references: [subjects.id],
    }),
    flashcards: many(flashcards),
  }),
);

export const flashcardsRelations = relations(flashcards, ({ one }) => ({
  deck: one(flashcardDecks, {
    fields: [flashcards.deckId],
    references: [flashcardDecks.id],
  }),
}));

export const studySessionsRelations = relations(
  studySessions,
  ({ one, many }) => ({
    note: one(notes, {
      fields: [studySessions.noteId],
      references: [notes.id],
    }),
    messages: many(studyMessages),
  }),
);

export const studyMessagesRelations = relations(studyMessages, ({ one }) => ({
  session: one(studySessions, {
    fields: [studyMessages.sessionId],
    references: [studySessions.id],
  }),
}));

export const scheduleEventsRelations = relations(scheduleEvents, ({ one }) => ({
  subject: one(subjects, {
    fields: [scheduleEvents.subjectId],
    references: [subjects.id],
  }),
}));
