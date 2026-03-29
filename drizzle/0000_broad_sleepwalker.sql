CREATE TABLE `todos` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`position` integer DEFAULT 0,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`email_address` text NOT NULL,
	`password` text NOT NULL,
	`profile_picture` text,
	`date_of_birth` text,
	`address` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_address_unique` ON `users` (`email_address`);