-- This migration intentionally fails to test CI error detection
ALTER TABLE `bookmarks` DROP COLUMN `nonexistent_column`;
