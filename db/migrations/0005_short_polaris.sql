CREATE TABLE IF NOT EXISTS "statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(60) NOT NULL,
	"userId" integer,
	CONSTRAINT "statuses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks_to_statuses" (
	"task_id" integer NOT NULL,
	"status_id" integer NOT NULL,
	CONSTRAINT "tasks_to_statuses_status_id_task_id_pk" PRIMARY KEY("status_id","task_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "statuses" ADD CONSTRAINT "statuses_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks_to_statuses" ADD CONSTRAINT "tasks_to_statuses_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks_to_statuses" ADD CONSTRAINT "tasks_to_statuses_status_id_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."statuses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
