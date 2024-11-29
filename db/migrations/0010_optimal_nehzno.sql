ALTER TABLE "tasks" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "userId" SET NOT NULL;