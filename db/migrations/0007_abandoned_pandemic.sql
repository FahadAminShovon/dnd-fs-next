ALTER TABLE "tasks_to_statuses" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "tasks_to_statuses" CASCADE;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "statusId" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_statusId_statuses_id_fk" FOREIGN KEY ("statusId") REFERENCES "public"."statuses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
