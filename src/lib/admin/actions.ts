"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { members, shows } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";
import { assertValidSlug, toSlug } from "@/lib/slug";
import { sanitizeContent } from "@/lib/sanitize";

function timestamp() {
  return new Date().toISOString();
}

async function setExclusiveHomepageShow(slug: string) {
  await db.update(shows).set({ featuredOnHome: false });
  await db.update(shows).set({ featuredOnHome: true }).where(eq(shows.slug, slug));
}

function readShowFields(formData: FormData) {
  const upcomingRaw = String(formData.get("upcomingAt") ?? "").trim();
  return {
    tagline: String(formData.get("tagline") ?? "") || null,
    upcomingAt: upcomingRaw || null,
    homeTeaser: String(formData.get("homeTeaser") ?? "") || null,
    status: (formData.get("status") as "current" | "archived") ?? "archived",
    featuredOnHome: formData.get("featuredOnHome") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    heroImageUrl: String(formData.get("heroImageUrl") ?? "") || null,
    cardImageUrl: String(formData.get("cardImageUrl") ?? "") || null,
    body: sanitizeContent(String(formData.get("body") ?? "")),
    price: String(formData.get("price") ?? "") || null,
    duration: String(formData.get("duration") ?? "") || null,
    interval: String(formData.get("interval") ?? "") || null,
    venue: String(formData.get("venue") ?? "") || null,
    language: String(formData.get("language") ?? "") || null,
    seatingNote: String(formData.get("seatingNote") ?? "") || null,
    metaDescription: String(formData.get("metaDescription") ?? "") || null,
    published: formData.get("published") !== "off",
  };
}

export async function createShow(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim() || toSlug(title);
  assertValidSlug(slug);

  const fields = readShowFields(formData);
  const now = timestamp();

  await db.insert(shows).values({
    slug,
    title,
    ...fields,
    featuredOnHome: false,
    createdAt: now,
    updatedAt: now,
  });

  if (fields.featuredOnHome) {
    await setExclusiveHomepageShow(slug);
  }

  revalidatePath("/");
  revalidatePath("/shows");
  revalidatePath(`/shows/${slug}`);
  redirect(`/admin/shows/${slug}/`);
}

export async function updateShow(slug: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const newSlug = String(formData.get("slug") ?? slug).trim();
  assertValidSlug(newSlug);

  const fields = readShowFields(formData);

  await db
    .update(shows)
    .set({
      slug: newSlug,
      title,
      ...fields,
      featuredOnHome: fields.featuredOnHome,
      updatedAt: timestamp(),
    })
    .where(eq(shows.slug, slug));

  if (fields.featuredOnHome) {
    await setExclusiveHomepageShow(newSlug);
  }

  revalidatePath("/");
  revalidatePath("/shows");
  revalidatePath(`/shows/${slug}`);
  revalidatePath(`/shows/${newSlug}`);
  redirect(`/admin/shows/${newSlug}/`);
}

export async function deleteShow(slug: string) {
  await requireAdmin();
  await db.delete(shows).where(eq(shows.slug, slug));
  revalidatePath("/");
  revalidatePath("/shows");
  redirect("/admin/shows/");
}

export async function createMember(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim() || toSlug(name);
  assertValidSlug(slug);

  const now = timestamp();
  await db.insert(members).values({
    slug,
    name,
    role: String(formData.get("role") ?? "Improviser"),
    photoUrl: String(formData.get("photoUrl") ?? "") || null,
    bio: String(formData.get("bio") ?? ""),
    showCredits: [],
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: formData.get("published") !== "off",
    metaDescription: String(formData.get("metaDescription") ?? "") || null,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/");
  revalidatePath("/cast");
  revalidatePath(`/${slug}`);
  redirect(`/admin/members/${slug}/`);
}

export async function updateMember(slug: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const newSlug = String(formData.get("slug") ?? slug).trim();
  assertValidSlug(newSlug);

  await db
    .update(members)
    .set({
      slug: newSlug,
      name,
      role: String(formData.get("role") ?? "Improviser"),
      photoUrl: String(formData.get("photoUrl") ?? "") || null,
      bio: String(formData.get("bio") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
      published: formData.get("published") !== "off",
      metaDescription: String(formData.get("metaDescription") ?? "") || null,
      updatedAt: timestamp(),
    })
    .where(eq(members.slug, slug));

  revalidatePath("/");
  revalidatePath("/cast");
  revalidatePath(`/${slug}`);
  revalidatePath(`/${newSlug}`);
  redirect(`/admin/members/${newSlug}/`);
}

export async function deleteMember(slug: string) {
  await requireAdmin();
  await db.delete(members).where(eq(members.slug, slug));
  revalidatePath("/");
  revalidatePath("/cast");
  redirect("/admin/members/");
}
