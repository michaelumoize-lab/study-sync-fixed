ALTER TABLE "flashcard_decks" DROP CONSTRAINT "flashcard_decks_user_id_users_sync_id_fk";
--> statement-breakpoint
ALTER TABLE "notes" DROP CONSTRAINT "notes_user_id_users_sync_id_fk";
--> statement-breakpoint
ALTER TABLE "schedule_events" DROP CONSTRAINT "schedule_events_user_id_users_sync_id_fk";
--> statement-breakpoint
ALTER TABLE "semesters" DROP CONSTRAINT "semesters_user_id_users_sync_id_fk";
--> statement-breakpoint
ALTER TABLE "study_sessions" DROP CONSTRAINT "study_sessions_user_id_users_sync_id_fk";
--> statement-breakpoint
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_user_id_users_sync_id_fk";
--> statement-breakpoint
ALTER TABLE "tags" DROP CONSTRAINT "tags_user_id_users_sync_id_fk";
--> statement-breakpoint
ALTER TABLE "templates" DROP CONSTRAINT "templates_user_id_users_sync_id_fk";
--> statement-breakpoint
ALTER TABLE "user_settings" DROP CONSTRAINT "user_settings_user_id_users_sync_id_fk";
--> statement-breakpoint
ALTER TABLE "flashcard_decks" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
UPDATE "notes" SET "is_pinned" = false WHERE "is_pinned" IS NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "is_pinned" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "schedule_events" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "semesters" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "study_sessions" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "subjects" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "templates" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "user_settings" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "pdf_url" text;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "draft_title" text;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "draft_content" text;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "has_draft" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user_settings" DROP COLUMN "default_view";--> statement-breakpoint
ALTER TABLE "user_settings" DROP COLUMN "editor_font";--> statement-breakpoint
ALTER TABLE "flashcard_decks" ADD CONSTRAINT "flashcard_decks_user_id_users_sync_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("sync_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_sync_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("sync_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_events" ADD CONSTRAINT "schedule_events_user_id_users_sync_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("sync_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "semesters" ADD CONSTRAINT "semesters_user_id_users_sync_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("sync_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_user_id_users_sync_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("sync_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_user_id_users_sync_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("sync_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_users_sync_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("sync_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_user_id_users_sync_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("sync_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_sync_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("sync_id") ON DELETE cascade ON UPDATE no action;