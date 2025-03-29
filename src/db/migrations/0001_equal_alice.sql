CREATE TYPE "public"."log_status" AS ENUM('Info', 'Warning', 'Error', 'Critical', 'Debug');--> statement-breakpoint
CREATE TABLE "logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar(255),
	"title" varchar(255) NOT NULL,
	"message" varchar(255),
	"context" text,
	"ip_address " varchar(255),
	"request_url " varchar(255),
	"request_method " varchar(255),
	"log_status" "log_status",
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "is_favourite" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "storage" varchar(20);--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "max_team" integer DEFAULT 2;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" varchar;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "mobile" varchar(12);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "personalCode" varchar(12);--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_mobile_unique" UNIQUE("mobile");