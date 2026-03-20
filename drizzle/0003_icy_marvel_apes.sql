
--> statement-breakpoint
ALTER TABLE "note_tags" ADD CONSTRAINT "note_tags_note_id_tag_id_pk" PRIMARY KEY("note_id","tag_id");--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "default_view" text DEFAULT 'vault';--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "editor_font" text DEFAULT 'outfit';--> statement-breakpoint
ALTER TABLE "flashcard_decks" ADD CONSTRAINT "flashcard_decks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_events" ADD CONSTRAINT "schedule_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "semesters" ADD CONSTRAINT "semesters_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "flashcard_decks_user_id_idx" ON "flashcard_decks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "flashcard_decks_note_id_idx" ON "flashcard_decks" USING btree ("note_id");--> statement-breakpoint
CREATE INDEX "flashcard_decks_subject_id_idx" ON "flashcard_decks" USING btree ("subject_id");--> statement-breakpoint
CREATE UNIQUE INDEX "flashcard_decks_name_user_idx" ON "flashcard_decks" USING btree ("user_id","name");--> statement-breakpoint
CREATE INDEX "flashcards_deck_id_idx" ON "flashcards" USING btree ("deck_id");--> statement-breakpoint
CREATE INDEX "note_tags_note_tag_idx" ON "note_tags" USING btree ("note_id","tag_id");--> statement-breakpoint
CREATE INDEX "notes_user_id_idx" ON "notes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notes_subject_id_idx" ON "notes" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "notes_semester_id_idx" ON "notes" USING btree ("semester_id");--> statement-breakpoint
CREATE INDEX "schedule_events_user_id_idx" ON "schedule_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "schedule_events_subject_id_idx" ON "schedule_events" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "semesters_user_id_idx" ON "semesters" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "semesters_name_user_idx" ON "semesters" USING btree ("user_id","name");--> statement-breakpoint
CREATE INDEX "study_messages_session_id_idx" ON "study_messages" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "study_sessions_user_id_idx" ON "study_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "study_sessions_note_id_idx" ON "study_sessions" USING btree ("note_id");--> statement-breakpoint
CREATE INDEX "subjects_user_id_idx" ON "subjects" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "subjects_name_user_idx" ON "subjects" USING btree ("user_id","name");--> statement-breakpoint
CREATE INDEX "tags_user_id_idx" ON "tags" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_name_user_idx" ON "tags" USING btree ("user_id","name");--> statement-breakpoint
CREATE INDEX "templates_user_id_idx" ON "templates" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "templates_name_user_idx" ON "templates" USING btree ("user_id","name");