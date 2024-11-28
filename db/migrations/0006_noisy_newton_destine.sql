ALTER TABLE "user" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_username_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "statuses" DROP CONSTRAINT "statuses_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "tags" DROP CONSTRAINT "tags_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "statuses" ADD CONSTRAINT "statuses_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");