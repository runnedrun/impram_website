import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function databaseUrl() {
  return process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.POSTGRES_PRISMA_URL;
}

function createDb() {
  const url = databaseUrl();
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }
  return drizzle(neon(url), { schema });
}

const globalForDb = globalThis as unknown as {
  impramDb?: ReturnType<typeof createDb>;
};

export const db = globalForDb.impramDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.impramDb = db;
}

export function hasDatabaseConfig() {
  return Boolean(databaseUrl());
}
