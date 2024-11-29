ALTER TABLE "tags" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "updatedAt" timestamp DEFAULT now();