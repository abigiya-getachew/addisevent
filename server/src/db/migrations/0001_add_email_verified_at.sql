ALTER TABLE "users"
  ADD COLUMN "email_verified_at" timestamp with time zone;

UPDATE "users"
SET "email_verified_at" = CURRENT_TIMESTAMP
WHERE "email_verified" IS TRUE;
