import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const shows = sqliteTable("shows", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline"),
  upcomingAt: text("upcoming_at"),
  homeTeaser: text("home_teaser"),
  status: text("status", { enum: ["current", "archived"] })
    .notNull()
    .default("archived"),
  featuredOnHome: integer("featured_on_home", { mode: "boolean" })
    .notNull()
    .default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  heroImageUrl: text("hero_image_url"),
  cardImageUrl: text("card_image_url"),
  body: text("body").notNull().default(""),
  price: text("price"),
  duration: text("duration"),
  interval: text("interval"),
  venue: text("venue"),
  language: text("language"),
  seatingNote: text("seating_note"),
  metaDescription: text("meta_description"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("Improviser"),
  photoUrl: text("photo_url"),
  bio: text("bio").notNull().default(""),
  showCredits: text("show_credits", { mode: "json" })
    .$type<{ showSlug: string; credit: string }[]>()
    .notNull()
    .default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  metaDescription: text("meta_description"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const sitePages = sqliteTable("site_pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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
