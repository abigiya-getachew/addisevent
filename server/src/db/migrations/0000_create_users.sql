CREATE TYPE "user_role" AS ENUM ('attendee', 'organizer', 'admin');

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" varchar(255),
  "phone" varchar(20),
  "name" varchar(255),
  "password_hash" text,
  "role" "user_role" NOT NULL DEFAULT 'attendee',
  "locale" varchar(10) NOT NULL DEFAULT 'en',
  "email_verified" boolean NOT NULL DEFAULT false,
  "phone_verified" boolean NOT NULL DEFAULT false,
  "image" text,
  "avatar_url" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "users_email_unique" UNIQUE ("email"),
  CONSTRAINT "users_phone_unique" UNIQUE ("phone")
);

CREATE INDEX "users_role_idx" ON "users" ("role");

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
