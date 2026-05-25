import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";

export const shows = pgTable("shows", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline"),
  upcomingAt: text("upcoming_at"),
  homeTeaser: text("home_teaser"),
  status: text("status", { enum: ["current", "archived"] })
    .notNull()
    .default("archived"),
  featuredOnHome: boolean("featured_on_home").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  heroImageUrl: text("hero_image_url"),
  cardImageUrl: text("card_image_url"),
  aboutText: text("about_text").notNull().default(""),
  ticketUrl: text("ticket_url"),
  performanceSummary: text("performance_summary"),
  eventNotes: text("event_notes"),
  castCredits: jsonb("cast_credits")
    .$type<{ memberSlug: string; role?: string | null }[]>()
    .notNull()
    .default([]),
  price: text("price"),
  duration: text("duration"),
  interval: text("interval"),
  venue: text("venue"),
  language: text("language"),
  seatingNote: text("seating_note"),
  metaDescription: text("meta_description"),
  published: boolean("published").notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("Improviser"),
  photoUrl: text("photo_url"),
  bio: text("bio").notNull().default(""),
  showCredits: jsonb("show_credits")
    .$type<{ showSlug: string; credit: string }[]>()
    .notNull()
    .default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  metaDescription: text("meta_description"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const openRehearsalDates = pgTable("open_rehearsal_dates", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const sitePages = pgTable("site_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  metaDescription: text("meta_description"),
  updatedAt: text("updated_at").notNull(),
});

export type Show = typeof shows.$inferSelect;
export type NewShow = typeof shows.$inferInsert;
export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type SitePage = typeof sitePages.$inferSelect;
export type OpenRehearsalDate = typeof openRehearsalDates.$inferSelect;
