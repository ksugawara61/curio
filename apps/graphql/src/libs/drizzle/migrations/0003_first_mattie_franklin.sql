DROP INDEX `bookmarks_url_unique`;--> statement-breakpoint
ALTER TABLE `bookmarks` ADD `user_id` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `bookmarks_user_id_url_unique` ON `bookmarks` (`user_id`,`url`);--> statement-breakpoint
DROP INDEX `tags_name_unique`;--> statement-breakpoint
ALTER TABLE `tags` ADD `user_id` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `tags_user_id_name_unique` ON `tags` (`user_id`,`name`);