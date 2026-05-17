import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import sanitizeHtml from "sanitize-html";
import { members, shows, sitePages } from "../src/lib/db/schema";

const WP = "https://impram.net/wp-json/wp/v2";
const DB_URL = process.env.DATABASE_URL ?? "file:data/impram.db";

type WpMediaEmbed = { source_url?: string };

type WpPortfolio = {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  _embedded?: { "wp:featuredmedia"?: WpMediaEmbed[] };
};

type WpPost = {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  categories: number[];
  _embedded?: { "wp:featuredmedia"?: WpMediaEmbed[] };
};

type WpPage = {
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
};

type WpMedia = {
  source_url: string;
};

async function wpFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${WP}${path}`);
  if (!res.ok) throw new Error(`WP fetch failed: ${path} ${res.status}`);
  return res.json() as Promise<T>;
}

function featuredImageFromEmbed(item: {
  featured_media: number;
  _embedded?: { "wp:featuredmedia"?: WpMediaEmbed[] };
}): string | null {
  const embedded = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  if (embedded) return embedded;
  return null;
}

async function wpFetchAll<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  const embed = path.includes("_embed") ? "" : `${path.includes("?") ? "&" : "?"}_embed`;
  while (true) {
    const res = await fetch(
      `${WP}${path}${embed}&per_page=100&page=${page}`.replace("?&", "?"),
    );
    if (!res.ok) break;
    const batch = (await res.json()) as T[];
    if (batch.length === 0) break;
    items.push(...batch);
    const totalPages = Number(res.headers.get("x-wp-totalpages") ?? "1");
    if (page >= totalPages) break;
    page++;
  }
  return items;
}

function stripHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "h4"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt"],
      a: ["href"],
    },
  });
}

function textFromHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getFeaturedImageUrl(
  item: { featured_media: number; _embedded?: { "wp:featuredmedia"?: WpMediaEmbed[] } },
): Promise<string | null> {
  const embedded = featuredImageFromEmbed(item);
  if (embedded) return embedded;
  if (!item.featured_media) return null;
  try {
    const media = await wpFetch<WpMedia>(`/media/${item.featured_media}`);
    return media.source_url ?? null;
  } catch {
    return null;
  }
}

async function getCurrentShowIds(): Promise<Set<number>> {
  const res = await fetch("https://impram.net/shows/");
  const html = await res.text();
  const ids = new Set<number>();

  const configMatch = html.match(/only_posts__in":"(\d+)"/);
  if (configMatch) {
    ids.add(Number(configMatch[1]));
  }

  const start = html.indexOf("Currently playing");
  const end = html.indexOf("Previous shows");
  const section =
    start >= 0 && end > start ? html.slice(start, end) : html.slice(0, Math.floor(html.length / 3));

  for (const m of section.matchAll(/post-(\d+)\s+portfolio/g)) {
    ids.add(Number(m[1]));
  }
  return ids;
}

async function getCastCategoryId(): Promise<number> {
  const cats = await wpFetch<{ id: number; slug: string }[]>("/categories?search=cast");
  const cast = cats.find((c) => c.slug === "cast");
  if (!cast) throw new Error("Cast category not found");
  return cast.id;
}

function now() {
  return new Date().toISOString();
}

async function main() {
  mkdirSync("data", { recursive: true });
  mkdirSync("content", { recursive: true });

  const client = createClient({ url: DB_URL });
  const db = drizzle(client, { schema: { shows, members, sitePages } });

  const [portfolio, posts, pages, castCategoryId, currentIds] = await Promise.all([
    wpFetchAll<WpPortfolio>("/portfolio"),
    wpFetchAll<WpPost>("/posts"),
    wpFetchAll<WpPage>("/pages"),
    getCastCategoryId(),
    getCurrentShowIds(),
  ]);

  const castPosts = posts.filter((p) => p.categories.includes(castCategoryId));
  const pageSlugs = new Set(["about-us", "join-us", "privacy-policy"]);
  const staticPages = pages.filter((p) => pageSlugs.has(p.slug));

  const showRows = [];
  let sortCurrent = 0;
  let sortArchived = 0;

  for (const item of portfolio) {
    const slugMatch = item.link.match(/\/shows\/([^/]+)\//);
    const slug = slugMatch?.[1] ?? item.slug;
    const isCurrent = currentIds.has(item.id);
    const imageUrl = await getFeaturedImageUrl(item);
    const body = stripHtml(item.content.rendered);
    const plain = textFromHtml(item.excerpt.rendered || item.content.rendered);

    showRows.push({
      slug,
      title: textFromHtml(item.title.rendered),
      tagline: null,
      upcomingAt: null,
      homeTeaser: null,
      status: isCurrent ? ("current" as const) : ("archived" as const),
      featuredOnHome: isCurrent,
      sortOrder: isCurrent ? sortCurrent++ : sortArchived++,
      heroImageUrl: imageUrl,
      cardImageUrl: imageUrl,
      body,
      price: null,
      duration: null,
      interval: null,
      venue: null,
      language: null,
      seatingNote: null,
      metaDescription: plain.slice(0, 160) || null,
      published: true,
      createdAt: now(),
      updatedAt: now(),
    });
  }

  const memberRows = [];
  let memberSort = 0;
  for (const post of castPosts) {
    const imageUrl = await getFeaturedImageUrl(post);
    const body = stripHtml(post.content.rendered);
    const plain = textFromHtml(body);

    memberRows.push({
      slug: post.slug,
      name: textFromHtml(post.title.rendered),
      role: "Improviser",
      photoUrl: imageUrl,
      bio: plain || "Bio coming soon!",
      showCredits: [] as { showSlug: string; credit: string }[],
      sortOrder: memberSort++,
      published: true,
      metaDescription: plain.slice(0, 160) || "Improviser",
      createdAt: now(),
      updatedAt: now(),
    });
  }

  const sitePageRows = staticPages.map((p) => ({
    slug: p.slug,
    title: textFromHtml(p.title.rendered),
    body: stripHtml(p.content.rendered),
    metaDescription: textFromHtml(p.excerpt.rendered).slice(0, 160) || null,
    updatedAt: now(),
  }));

  const seed = { shows: showRows, members: memberRows, sitePages: sitePageRows };
  writeFileSync(join("content", "seed.json"), JSON.stringify(seed, null, 2));

  await client.executeMultiple(`
    DROP TABLE IF EXISTS shows;
    DROP TABLE IF EXISTS members;
    DROP TABLE IF EXISTS site_pages;
  `);

  const { readFileSync } = await import("fs");
  const sql = readFileSync(join("drizzle", "0000_init.sql"), "utf8");
  await client.executeMultiple(sql);

  for (const row of showRows) {
    await db.insert(shows).values(row);
  }
  for (const row of memberRows) {
    await db.insert(members).values(row);
  }
  for (const row of sitePageRows) {
    await db.insert(sitePages).values(row);
  }

  console.log(
    `Migrated ${showRows.length} shows, ${memberRows.length} members, ${sitePageRows.length} pages`,
  );
  console.log(`Current shows: ${showRows.filter((s) => s.status === "current").length}`);
}

main();
