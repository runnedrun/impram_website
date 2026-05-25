import { createClient } from "@libsql/client";
import { neon } from "@neondatabase/serverless";
import { sql as dsql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadEnvFiles } from "../src/lib/load-env";
import { members, shows, sitePages } from "../src/lib/db/schema";
import { showInsertFromLegacyRow } from "../src/lib/seed-shows";

loadEnvFiles();

const SQLITE_PATH = "file:data/impram.db";
const SEED_PATH = join("content", "seed.json");

type SeedData = {
  shows: (typeof shows.$inferInsert & { body?: string })[];
  members: (typeof members.$inferInsert)[];
  sitePages: (typeof sitePages.$inferInsert)[];
};

function normalizeBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

async function loadFromSqlite(): Promise<SeedData> {
  const client = createClient({ url: SQLITE_PATH });
  const showRows = await client.execute("SELECT * FROM shows ORDER BY id");
  const memberRows = await client.execute("SELECT * FROM members ORDER BY id");
  const pageRows = await client.execute("SELECT * FROM site_pages ORDER BY id");

  return {
    shows: showRows.rows.map((row) =>
      showInsertFromLegacyRow({
        slug: String(row.slug),
        title: String(row.title),
        tagline: row.tagline != null ? String(row.tagline) : null,
        upcomingAt: row.upcoming_at != null ? String(row.upcoming_at) : null,
        homeTeaser: row.home_teaser != null ? String(row.home_teaser) : null,
        status: row.status as "current" | "archived",
        featuredOnHome: normalizeBoolean(row.featured_on_home),
        sortOrder: Number(row.sort_order),
        heroImageUrl: row.hero_image_url != null ? String(row.hero_image_url) : null,
        cardImageUrl: row.card_image_url != null ? String(row.card_image_url) : null,
        body: String(row.body ?? ""),
        price: row.price != null ? String(row.price) : null,
        duration: row.duration != null ? String(row.duration) : null,
        interval: row.interval != null ? String(row.interval) : null,
        venue: row.venue != null ? String(row.venue) : null,
        language: row.language != null ? String(row.language) : null,
        seatingNote: row.seating_note != null ? String(row.seating_note) : null,
        metaDescription:
          row.meta_description != null ? String(row.meta_description) : null,
        published: normalizeBoolean(row.published),
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
      }),
    ),
    members: memberRows.rows.map((row) => ({
      slug: String(row.slug),
      name: String(row.name),
      role: String(row.role ?? "Improviser"),
      photoUrl: row.photo_url != null ? String(row.photo_url) : null,
      bio: String(row.bio ?? ""),
      showCredits: JSON.parse(String(row.show_credits ?? "[]")),
      sortOrder: Number(row.sort_order),
      published: normalizeBoolean(row.published),
      metaDescription:
        row.meta_description != null ? String(row.meta_description) : null,
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    })),
    sitePages: pageRows.rows.map((row) => ({
      slug: String(row.slug),
      title: String(row.title),
      body: String(row.body ?? ""),
      metaDescription:
        row.meta_description != null ? String(row.meta_description) : null,
      updatedAt: String(row.updated_at),
    })),
  };
}

function loadFromJson(): SeedData {
  const raw = JSON.parse(readFileSync(SEED_PATH, "utf8")) as SeedData;
  return {
    shows: raw.shows.map((row) =>
      showInsertFromLegacyRow({
        ...row,
        featuredOnHome: normalizeBoolean(row.featuredOnHome),
        published: normalizeBoolean(row.published),
      }),
    ),
    members: raw.members.map((row) => ({
      ...row,
      published: normalizeBoolean(row.published),
      showCredits: row.showCredits ?? [],
    })),
    sitePages: raw.sitePages,
  };
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const source = existsSync("data/impram.db") ? "sqlite" : "json";
  const seed = source === "sqlite" ? await loadFromSqlite() : loadFromJson();

  console.log(`Seeding Neon from ${source} (${seed.shows.length} shows, ${seed.members.length} members, ${seed.sitePages.length} pages)`);

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema: { shows, members, sitePages } });

  const existing = await db.select({ id: shows.id }).from(shows).limit(1);
  if (existing.length > 0 && process.env.FORCE_SEED !== "1") {
    console.log("Neon already has data; skipping seed (set FORCE_SEED=1 to replace).");
    return;
  }

  await db.execute(dsql`TRUNCATE TABLE shows, members, site_pages RESTART IDENTITY CASCADE`);

  for (const row of seed.shows) {
    await db.insert(shows).values(row);
  }
  for (const row of seed.members) {
    await db.insert(members).values(row);
  }
  for (const row of seed.sitePages) {
    await db.insert(sitePages).values(row);
  }

  console.log("Neon database seeded.");
}

main();
