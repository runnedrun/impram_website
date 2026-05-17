export const RESERVED_SLUGS = new Set([
  "about-us",
  "cast",
  "shows",
  "join-us",
  "privacy-policy",
  "join-us-obsolete",
  "shows-obsolete-2",
  "admin",
  "api",
  "feed",
  "comments",
  "author",
  "wp-admin",
  "wp-content",
  "wp-json",
  "sitemap",
  "sitemap.xml",
  "robots.txt",
  "favicon.ico",
  "_next",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
