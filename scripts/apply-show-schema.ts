import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { loadEnvFiles } from "../src/lib/load-env";
import { shows } from "../src/lib/db/schema";
import { migrateLegacyShowBody } from "../src/lib/show-content";

loadEnvFiles();

type LegacyShowRow = {
  id: number;
  slug: string;
  body: string;
  price: string | null;
  duration: string | null;
  language: string | null;
  venue: string | null;
};

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required");

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema: { shows } });

  await sql`
    ALTER TABLE shows
    ADD COLUMN IF NOT EXISTS about_text text NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS ticket_url text,
    ADD COLUMN IF NOT EXISTS performance_summary text,
    ADD COLUMN IF NOT EXISTS event_notes text,
    ADD COLUMN IF NOT EXISTS cast_credits jsonb NOT NULL DEFAULT '[]'::jsonb
  `;

  const legacyRows = (await sql`
    SELECT id, slug, body, price, duration, language, venue
    FROM shows
    WHERE body IS NOT NULL AND trim(body) <> ''
  `) as LegacyShowRow[];

  for (const row of legacyRows) {
    const migrated = migrateLegacyShowBody(row.body);

    await db
      .update(shows)
      .set({
        aboutText: migrated.aboutText,
        ticketUrl: migrated.ticketUrl,
        performanceSummary: migrated.performanceSummary,
        eventNotes: migrated.eventNotes,
        castCredits: migrated.castCredits,
        price: migrated.price ?? row.price,
        duration: migrated.duration ?? row.duration,
        language: migrated.language ?? row.language,
        venue: migrated.venue ?? row.venue,
        interval: migrated.interval,
        seatingNote: migrated.seatingNote,
      })
      .where(eq(shows.id, row.id));

    console.log(`migrated ${row.slug}`);
  }

  await sql`ALTER TABLE shows DROP COLUMN IF EXISTS body`;

  console.log(`Done (${legacyRows.length} shows migrated, body column dropped).`);
}

main();
