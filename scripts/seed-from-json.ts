import { createClient } from "@libsql/client";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { drizzle } from "drizzle-orm/libsql";
import { members, shows, sitePages } from "../src/lib/db/schema";

const DB_URL = process.env.DATABASE_URL ?? "file:data/impram.db";

async function main() {
  const seedPath = join("content", "seed.json");
  if (!existsSync(seedPath)) {
    throw new Error("content/seed.json not found. Run npm run migrate:wp first.");
  }
  const seed = JSON.parse(readFileSync(seedPath, "utf8")) as {
    shows: (typeof shows.$inferInsert)[];
    members: (typeof members.$inferInsert)[];
    sitePages: (typeof sitePages.$inferInsert)[];
  };

  const client = createClient({ url: DB_URL });
  const db = drizzle(client, { schema: { shows, members, sitePages } });

  const sql = readFileSync(join("drizzle", "0000_init.sql"), "utf8");
  await client.executeMultiple(`
    DROP TABLE IF EXISTS shows;
    DROP TABLE IF EXISTS members;
    DROP TABLE IF EXISTS site_pages;
    ${sql}
  `);

  for (const row of seed.shows) await db.insert(shows).values(row);
  for (const row of seed.members) await db.insert(members).values(row);
  for (const row of seed.sitePages) await db.insert(sitePages).values(row);

  console.log("Seeded database from content/seed.json");
}

main();
