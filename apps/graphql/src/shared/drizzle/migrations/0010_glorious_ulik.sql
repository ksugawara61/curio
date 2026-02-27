CREATE TABLE `scrap_bookmarks` (
	`scrap_id` text NOT NULL,
	`bookmark_id` text NOT NULL,
	PRIMARY KEY(`scrap_id`, `bookmark_id`),
	FOREIGN KEY (`scrap_id`) REFERENCES `scraps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`bookmark_id`) REFERENCES `bookmarks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `scraps` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
