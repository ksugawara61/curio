CREATE TABLE `bookmark_relations` (
	`source_bookmark_id` text NOT NULL,
	`related_bookmark_id` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	PRIMARY KEY(`source_bookmark_id`, `related_bookmark_id`),
	FOREIGN KEY (`source_bookmark_id`) REFERENCES `bookmarks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`related_bookmark_id`) REFERENCES `bookmarks`(`id`) ON UPDATE no action ON DELETE cascade
);
