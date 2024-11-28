CREATE TABLE IF NOT EXISTS "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"storedTaskId" varchar(128) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"userId" integer,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "tasks_storedTaskId_unique" UNIQUE("storedTaskId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
