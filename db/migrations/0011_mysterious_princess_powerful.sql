ALTER TABLE "statuses" DROP CONSTRAINT "statuses_name_unique";--> statement-breakpoint
ALTER TABLE "statuses" ADD CONSTRAINT "statuses_name_userId_unique" UNIQUE("name","userId");