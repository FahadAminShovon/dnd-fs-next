ALTER TABLE "statuses" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "statuses" ADD COLUMN "updatedAt" timestamp DEFAULT now();