import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { loadEnvFiles } from "../src/lib/load-env";
import { shows } from "../src/lib/db/schema";
import { showInsertFromLegacyRow } from "../src/lib/seed-shows";

loadEnvFiles();

const SEED_PATH = join("content", "seed.json");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required");

  const seed = JSON.parse(readFileSync(SEED_PATH, "utf8")) as {
    shows: Parameters<typeof showInsertFromLegacyRow>[0][];
    members: unknown[];
    sitePages: unknown[];
  };

  const migratedShows = seed.shows.map((row) => showInsertFromLegacyRow(row));

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema: { shows } });

  for (const row of migratedShows) {
    await db
      .update(shows)
      .set({
        aboutText: row.aboutText,
        ticketUrl: row.ticketUrl,
        performanceSummary: row.performanceSummary,
        eventNotes: row.eventNotes,
        castCredits: row.castCredits,
        price: row.price,
        duration: row.duration,
        interval: row.interval,
        language: row.language,
        venue: row.venue,
        seatingNote: row.seatingNote,
      })
      .where(eq(shows.slug, row.slug));

    console.log(`updated ${row.slug}`);
  }

  writeFileSync(
    SEED_PATH,
    JSON.stringify(
      {
        ...seed,
        shows: migratedShows,
      },
      null,
      2,
    ) + "\n",
  );

  console.log(`Refreshed ${migratedShows.length} shows in DB and ${SEED_PATH}`);
}

main();
