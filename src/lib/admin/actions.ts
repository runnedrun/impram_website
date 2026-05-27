"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { members, openRehearsalDates, shows } from "@/lib/db/schema";
import type { ShowCastCredit } from "@/lib/show-content";
import { requireAdmin } from "@/lib/session";
import { assertValidSlug, toSlug } from "@/lib/slug";

function timestamp() {
  return new Date().toISOString();
}

async function setExclusiveHomepageShow(slug: string) {
  await db.update(shows).set({ featuredOnHome: false });
  await db.update(shows).set({ featuredOnHome: true }).where(eq(shows.slug, slug));
}

function parseCastCredits(formData: FormData): ShowCastCredit[] {
  const raw = String(formData.get("castCredits") ?? "[]");
  return JSON.parse(raw) as ShowCastCredit[];
}

function readShowFields(formData: FormData) {
  const upcomingRaw = String(formData.get("upcomingAt") ?? "").trim();
  return {
    tagline: String(formData.get("tagline") ?? "") || null,
    upcomingAt: upcomingRaw || null,
    homeTeaser: String(formData.get("homeTeaser") ?? "") || null,
    status: (formData.get("status") as "current" | "archived") ?? "archived",
    featuredOnHome: formData.get("featuredOnHome") === "on",
    heroImageUrl: String(formData.get("heroImageUrl") ?? "") || null,
    cardImageUrl: String(formData.get("cardImageUrl") ?? "") || null,
    aboutText: String(formData.get("aboutText") ?? "").trim(),
    ticketUrl: String(formData.get("ticketUrl") ?? "").trim() || null,
    performanceSummary:
      String(formData.get("performanceSummary") ?? "").trim() || null,
    eventNotes: String(formData.get("eventNotes") ?? "").trim() || null,
    castCredits: parseCastCredits(formData),
    price: String(formData.get("price") ?? "").trim() || null,
    duration: String(formData.get("duration") ?? "").trim() || null,
    interval: String(formData.get("interval") ?? "").trim() || null,
    venue: String(formData.get("venue") ?? "").trim() || null,
    language: String(formData.get("language") ?? "").trim() || null,
    seatingNote: String(formData.get("seatingNote") ?? "").trim() || null,
    metaDescription: String(formData.get("metaDescription") ?? "").trim() || null,
    published: formData.get("published") !== "off",
  };
}

async function nextShowSortOrder() {
  const rows = await db.select({ sortOrder: shows.sortOrder }).from(shows);
  return rows.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;
}

async function nextMemberSortOrder() {
  const rows = await db.select({ sortOrder: members.sortOrder }).from(members);
  return rows.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;
}

export async function reorderShows(orderedSlugs: string[]) {
  await requireAdmin();
  for (let i = 0; i < orderedSlugs.length; i++) {
    await db
      .update(shows)
      .set({ sortOrder: i, updatedAt: timestamp() })
      .where(eq(shows.slug, orderedSlugs[i]));
  }
  revalidatePath("/admin/shows");
  revalidatePath("/shows");
  revalidatePath("/");
}

export async function reorderMembers(orderedSlugs: string[]) {
  await requireAdmin();
  for (let i = 0; i < orderedSlugs.length; i++) {
    await db
      .update(members)
      .set({ sortOrder: i, updatedAt: timestamp() })
      .where(eq(members.slug, orderedSlugs[i]));
  }
  revalidatePath("/admin/members");
  revalidatePath("/cast");
}

export async function createShow(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim() || toSlug(title);
  assertValidSlug(slug);

  const fields = readShowFields(formData);
  const now = timestamp();
  const sortOrder = await nextShowSortOrder();

  await db.insert(shows).values({
    slug,
    title,
    ...fields,
    sortOrder,
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
  redirect(`/admin/shows/${newSlug}/?saved=1`);
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
    photoUrl: String(formData.get("photoUrl") ?? "").trim() || null,
    bio: String(formData.get("bio") ?? "").trim(),
    showCredits: [],
    sortOrder: await nextMemberSortOrder(),
    published: formData.get("published") !== "off",
    metaDescription: String(formData.get("metaDescription") ?? "") || null,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/");
  revalidatePath("/cast");
  revalidatePath(`/${slug}`);
  redirect(`/admin/members/${slug}/?saved=1`);
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
      photoUrl: String(formData.get("photoUrl") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim(),
      published: formData.get("published") !== "off",
      metaDescription: String(formData.get("metaDescription") ?? "") || null,
      updatedAt: timestamp(),
    })
    .where(eq(members.slug, slug));

  revalidatePath("/");
  revalidatePath("/cast");
  revalidatePath(`/${slug}`);
  revalidatePath(`/${newSlug}`);
  redirect(`/admin/members/${newSlug}/?saved=1`);
}

export async function deleteMember(slug: string) {
  await requireAdmin();
  await db.delete(members).where(eq(members.slug, slug));
  revalidatePath("/");
  revalidatePath("/cast");
  redirect("/admin/members/");
}

export async function saveOpenRehearsalDates(formData: FormData) {
  await requireAdmin();
  const raw = String(formData.get("dates") ?? "[]");
  const labels = (JSON.parse(raw) as string[])
    .map((label) => label.trim())
    .filter(Boolean);

  await db.delete(openRehearsalDates);
  for (let i = 0; i < labels.length; i++) {
    await db.insert(openRehearsalDates).values({
      label: labels[i],
      sortOrder: i,
    });
  }

  revalidatePath("/join-us");
  revalidatePath("/admin/join-us");
}
