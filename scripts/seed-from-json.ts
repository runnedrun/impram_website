import { neon } from "@neondatabase/serverless";
import { sql as dsql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadEnvFiles } from "../src/lib/load-env";
import { members, shows, sitePages } from "../src/lib/db/schema";
import { showInsertFromLegacyRow } from "../src/lib/seed-shows";

loadEnvFiles();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const seedPath = join("content", "seed.json");
  if (!existsSync(seedPath)) {
    throw new Error("content/seed.json not found. Run npm run migrate:wp first.");
  }

  const seed = JSON.parse(readFileSync(seedPath, "utf8")) as {
    shows: (typeof shows.$inferInsert & { body?: string })[];
    members: (typeof members.$inferInsert)[];
    sitePages: (typeof sitePages.$inferInsert)[];
  };

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema: { shows, members, sitePages } });

  await db.execute(dsql`TRUNCATE TABLE shows, members, site_pages RESTART IDENTITY CASCADE`);

  for (const row of seed.shows) {
    await db.insert(shows).values(
      showInsertFromLegacyRow({
        ...row,
        featuredOnHome: row.featuredOnHome === true || row.featuredOnHome === (1 as never),
        published: row.published === true || row.published === (1 as never),
      }),
    );
  }
  for (const row of seed.members) {
    await db.insert(members).values({
      ...row,
      published: row.published === true || row.published === (1 as never),
    });
  }
  for (const row of seed.sitePages) {
    await db.insert(sitePages).values(row);
  }

  console.log("Seeded database from content/seed.json");
}

main();
