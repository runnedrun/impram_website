import { and, asc, desc, eq, ne, sql } from "drizzle-orm";
import { db } from "./index";
import { members, shows, sitePages, type Member, type Show } from "./schema";

export async function getPublishedShowsByStatus(status: "current" | "archived") {
  return db
    .select()
    .from(shows)
    .where(and(eq(shows.published, true), eq(shows.status, status)))
    .orderBy(asc(shows.sortOrder), desc(shows.updatedAt));
}

export async function getFeaturedShows() {
  return db
    .select()
    .from(shows)
    .where(and(eq(shows.published, true), eq(shows.featuredOnHome, true)))
    .orderBy(asc(shows.sortOrder), desc(shows.updatedAt));
}

export async function getUpcomingShow() {
  const featured = await db
    .select()
    .from(shows)
    .where(and(eq(shows.published, true), eq(shows.featuredOnHome, true)))
    .orderBy(
      sql`CASE WHEN ${shows.upcomingAt} IS NULL THEN 1 ELSE 0 END`,
      asc(shows.upcomingAt),
      asc(shows.sortOrder),
    )
    .limit(1);

  if (featured[0]) return featured[0];

  const current = await db
    .select()
    .from(shows)
    .where(and(eq(shows.published, true), eq(shows.status, "current")))
    .orderBy(
      sql`CASE WHEN ${shows.upcomingAt} IS NULL THEN 1 ELSE 0 END`,
      asc(shows.upcomingAt),
      asc(shows.sortOrder),
    )
    .limit(1);

  return current[0] ?? null;
}

export async function getShowBySlug(slug: string) {
  const rows = await db
    .select()
    .from(shows)
    .where(and(eq(shows.slug, slug), eq(shows.published, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getRelatedShows(show: Show, limit = 3) {
  return db
    .select()
    .from(shows)
    .where(
      and(
        eq(shows.published, true),
        eq(shows.status, show.status),
        ne(shows.slug, show.slug),
      ),
    )
    .orderBy(asc(shows.sortOrder))
    .limit(limit);
}

export async function getAllShowSlugs() {
  const rows = await db
    .select({ slug: shows.slug })
    .from(shows)
    .where(eq(shows.published, true));
  return rows.map((r) => r.slug);
}

export async function getPublishedMembers() {
  return db
    .select()
    .from(members)
    .where(eq(members.published, true))
    .orderBy(asc(members.sortOrder), asc(members.name));
}

export async function getMemberBySlug(slug: string) {
  const rows = await db
    .select()
    .from(members)
    .where(and(eq(members.slug, slug), eq(members.published, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getAllMemberSlugs() {
  const rows = await db
    .select({ slug: members.slug })
    .from(members)
    .where(eq(members.published, true));
  return rows.map((r) => r.slug);
}

export async function getSitePage(slug: string) {
  const rows = await db.select().from(sitePages).where(eq(sitePages.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getAllShowsAdmin() {
  return db.select().from(shows).orderBy(asc(shows.sortOrder), desc(shows.updatedAt));
}

export async function getAllMembersAdmin() {
  return db.select().from(members).orderBy(asc(members.sortOrder), asc(members.name));
}

export async function getShowBySlugAdmin(slug: string) {
  const rows = await db.select().from(shows).where(eq(shows.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getMemberBySlugAdmin(slug: string) {
  const rows = await db.select().from(members).where(eq(members.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getAllSitePageSlugs() {
  const rows = await db.select({ slug: sitePages.slug }).from(sitePages);
  return rows.map((r) => r.slug);
}

export type { Member, Show };
