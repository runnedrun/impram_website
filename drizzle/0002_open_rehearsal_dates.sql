CREATE TABLE IF NOT EXISTS "open_rehearsal_dates" (
  "id" serial PRIMARY KEY NOT NULL,
  "label" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL
);
