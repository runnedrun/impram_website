import slugify from "slugify";
import { isReservedSlug } from "./reserved-slugs";

export function toSlug(input: string): string {
  return slugify(input, { lower: true, strict: true });
}

export function resolveSlug(raw: string, fallback: string): string {
  const trimmed = raw.trim();
  const slug = trimmed ? toSlug(trimmed) : toSlug(fallback);
  assertValidSlug(slug);
  return slug;
}

export function assertValidSlug(slug: string): void {
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Invalid slug format");
  }
  if (isReservedSlug(slug)) {
    throw new Error(`Slug "${slug}" is reserved`);
  }
}
