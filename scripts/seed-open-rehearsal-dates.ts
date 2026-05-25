import { loadEnvFiles } from "../src/lib/load-env";
import { db } from "../src/lib/db";
import { openRehearsalDates } from "../src/lib/db/schema";

loadEnvFiles();

const DEFAULT_DATES = ["Wednesday, February 25th", "Wednesday, March 25th"];

async function main() {
  const existing = await db.select().from(openRehearsalDates);
  if (existing.length > 0) {
    console.log(`open_rehearsal_dates already has ${existing.length} row(s); skipping.`);
    return;
  }

  for (let i = 0; i < DEFAULT_DATES.length; i++) {
    await db.insert(openRehearsalDates).values({
      label: DEFAULT_DATES[i],
      sortOrder: i,
    });
  }

  console.log(`Seeded ${DEFAULT_DATES.length} open rehearsal dates.`);
}

main();
