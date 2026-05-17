import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { loadEnvFiles } from "../src/lib/load-env";
import { members, shows } from "../src/lib/db/schema";

loadEnvFiles();

const MAP_PATH = join("content", "image-blob-map.json");
const WP_HOST = "impram.net";

type UrlMap = Record<string, string>;

function loadMap(): UrlMap {
  if (!existsSync(MAP_PATH)) return {};
  return JSON.parse(readFileSync(MAP_PATH, "utf8")) as UrlMap;
}

function saveMap(map: UrlMap) {
  writeFileSync(MAP_PATH, JSON.stringify(map, null, 2));
}

function collectUrls(...values: (string | null | undefined)[]): string[] {
  const urls = new Set<string>();
  const pattern = new RegExp(
    `https?://(?:www\\.)?${WP_HOST.replace(".", "\\.")}/wp-content/[^"'\\s)]+`,
    "gi",
  );

  for (const value of values) {
    if (!value) continue;
    for (const match of value.matchAll(pattern)) {
      urls.add(match[0].replace(/&amp;/g, "&"));
    }
  }

  return [...urls];
}

function blobPath(sourceUrl: string): string {
  const pathname = new URL(sourceUrl).pathname;
  const name = pathname.split("/").pop() ?? "image";
  return `migrated${pathname.replace(/^\/wp-content\/uploads/, "")}`.replace(
    /\/+/g,
    "/",
  ) || `migrated/${name}`;
}

function contentTypeFromUrl(url: string): string {
  const lower = url.split("?")[0].toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  return "image/jpeg";
}

function replaceUrls(text: string, map: UrlMap): string {
  let next = text;
  for (const [from, to] of Object.entries(map)) {
    next = next.split(from).join(to);
    next = next.split(from.replace(/&/g, "&amp;")).join(to);
  }
  return next;
}

async function uploadOne(
  sourceUrl: string,
  map: UrlMap,
  index: number,
  total: number,
): Promise<string> {
  if (map[sourceUrl]) {
    console.log(`[${index}/${total}] skip (cached) ${sourceUrl}`);
    return map[sourceUrl];
  }

  console.log(`[${index}/${total}] download ${sourceUrl}`);
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to download ${sourceUrl}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const path = blobPath(sourceUrl);
  console.log(`[${index}/${total}] upload ${path} (${buffer.byteLength} bytes)`);

  const blob = await put(path, buffer, {
    access: "public",
    contentType: contentTypeFromUrl(sourceUrl),
    addRandomSuffix: false,
  });

  map[sourceUrl] = blob.url;
  saveMap(map);
  console.log(`[${index}/${total}] done -> ${blob.url}`);
  return blob.url;
}

function usesWordPressCdn(url: string | null | undefined) {
  return Boolean(url && url.includes(WP_HOST));
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required");
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.log("Skipping image migration: BLOB_READ_WRITE_TOKEN is not set.");
    return;
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema: { shows, members } });

  const allShows = await db.select().from(shows);
  const allMembers = await db.select().from(members);

  const needsMigration =
    allShows.some(
      (show) =>
        usesWordPressCdn(show.heroImageUrl) ||
        usesWordPressCdn(show.cardImageUrl) ||
        show.body.includes(WP_HOST),
    ) ||
    allMembers.some(
      (member) =>
        usesWordPressCdn(member.photoUrl) || member.bio.includes(WP_HOST),
    );

  if (!needsMigration) {
    console.log("No WordPress image URLs in the database; nothing to migrate.");
    return;
  }

  const urlSet = new Set<string>();
  for (const show of allShows) {
    for (const url of collectUrls(
      show.heroImageUrl,
      show.cardImageUrl,
      show.body,
    )) {
      urlSet.add(url);
    }
  }
  for (const member of allMembers) {
    for (const url of collectUrls(member.photoUrl, member.bio)) {
      urlSet.add(url);
    }
  }

  const urls = [...urlSet].sort();
  const map = loadMap();
  console.log(`Found ${urls.length} unique WordPress image URLs`);

  let i = 0;
  for (const url of urls) {
    i += 1;
    await uploadOne(url, map, i, urls.length);
  }

  console.log("Updating database rows…");
  for (const show of allShows) {
    const heroImageUrl = show.heroImageUrl
      ? map[show.heroImageUrl] ?? show.heroImageUrl
      : null;
    const cardImageUrl = show.cardImageUrl
      ? map[show.cardImageUrl] ?? show.cardImageUrl
      : heroImageUrl;
    const body = replaceUrls(show.body, map);

    if (
      heroImageUrl !== show.heroImageUrl ||
      cardImageUrl !== show.cardImageUrl ||
      body !== show.body
    ) {
      await db
        .update(shows)
        .set({ heroImageUrl, cardImageUrl, body })
        .where(eq(shows.id, show.id));
      console.log(`updated show ${show.slug}`);
    }
  }

  for (const member of allMembers) {
    const photoUrl = member.photoUrl
      ? map[member.photoUrl] ?? member.photoUrl
      : null;
    const bio = replaceUrls(member.bio, map);

    if (photoUrl !== member.photoUrl || bio !== member.bio) {
      await db
        .update(members)
        .set({ photoUrl, bio })
        .where(eq(members.id, member.id));
      console.log(`updated member ${member.slug}`);
    }
  }

  console.log(`Migration complete. Map saved to ${MAP_PATH}`);
}

main();
