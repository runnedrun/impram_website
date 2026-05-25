import { neon } from "@neondatabase/serverless";
import { loadEnvFiles } from "../src/lib/load-env";

loadEnvFiles();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  const sql = neon(url);
  await sql`
    CREATE TABLE IF NOT EXISTS open_rehearsal_dates (
      id serial PRIMARY KEY NOT NULL,
      label text NOT NULL,
      sort_order integer DEFAULT 0 NOT NULL
    )
  `;
  console.log("Applied open_rehearsal_dates schema.");
}

main();
