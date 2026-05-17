CREATE TABLE `shows` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`tagline` text,
	`upcoming_at` text,
	`home_teaser` text,
	`status` text DEFAULT 'archived' NOT NULL,
	`featured_on_home` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`hero_image_url` text,
	`card_image_url` text,
	`body` text DEFAULT '' NOT NULL,
	`price` text,
	`duration` text,
	`interval` text,
	`venue` text,
	`language` text,
	`seating_note` text,
	`meta_description` text,
	`published` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
CREATE UNIQUE INDEX `shows_slug_unique` ON `shows` (`slug`);
CREATE TABLE `members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'Improviser' NOT NULL,
	`photo_url` text,
	`bio` text DEFAULT '' NOT NULL,
	`show_credits` text DEFAULT '[]' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`meta_description` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
CREATE UNIQUE INDEX `members_slug_unique` ON `members` (`slug`);
CREATE TABLE `site_pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`meta_description` text,
	`updated_at` text NOT NULL
);
CREATE UNIQUE INDEX `site_pages_slug_unique` ON `site_pages` (`slug`);
