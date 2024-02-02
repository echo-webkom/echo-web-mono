CREATE TABLE `access_request` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`reason` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `account` (
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `answer` (
	`user_id` text NOT NULL,
	`happening_id` text NOT NULL,
	`question_id` text NOT NULL,
	`answer` blob,
	PRIMARY KEY(`user_id`, `happening_id`, `question_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`happening_id`) REFERENCES `happening`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `comment` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`parent_comment_id` text,
	`user_id` text,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `degree` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `group` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `happenings_to_groups` (
	`happening_id` text NOT NULL,
	`group_id` text NOT NULL,
	PRIMARY KEY(`happening_id`, `group_id`),
	FOREIGN KEY (`happening_id`) REFERENCES `happening`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `happening` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`type` text DEFAULT 'event' NOT NULL,
	`date` integer,
	`registration_groups` blob,
	`registration_start_groups` integer,
	`registration_start` integer,
	`registration_end` integer
);
--> statement-breakpoint
CREATE TABLE `kv` (
	`key` text PRIMARY KEY NOT NULL,
	`value` blob,
	`ttl` integer
);
--> statement-breakpoint
CREATE TABLE `question` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`required` integer DEFAULT false NOT NULL,
	`type` text DEFAULT 'text' NOT NULL,
	`is_sensitive` integer DEFAULT false NOT NULL,
	`options` blob,
	`happening_id` text NOT NULL,
	FOREIGN KEY (`happening_id`) REFERENCES `happening`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reaction` (
	`react_to_key` text NOT NULL,
	`emoji_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`react_to_key`, `emoji_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `registration` (
	`user_id` text NOT NULL,
	`happening_id` text NOT NULL,
	`status` text DEFAULT 'waiting' NOT NULL,
	`unregister_reason` text,
	`created_at` integer NOT NULL,
	`prev_status` text,
	`changed_at` integer,
	`changed_by` text,
	PRIMARY KEY(`user_id`, `happening_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`happening_id`) REFERENCES `happening`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`session_token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `site_feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`message` text NOT NULL,
	`category` text NOT NULL,
	`is_read` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `spot_range` (
	`id` text PRIMARY KEY NOT NULL,
	`happening_id` text NOT NULL,
	`spots` integer NOT NULL,
	`min_year` integer NOT NULL,
	`max_year` integer NOT NULL,
	FOREIGN KEY (`happening_id`) REFERENCES `happening`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users_to_groups` (
	`user_id` text NOT NULL,
	`group_id` text NOT NULL,
	`is_leader` integer DEFAULT false NOT NULL,
	PRIMARY KEY(`user_id`, `group_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`email_verified` integer,
	`image` text,
	`alternative_email` text,
	`degree_id` text,
	`year` integer,
	`type` text DEFAULT 'student' NOT NULL,
	`is_banned` integer DEFAULT false NOT NULL,
	`banned_from_strike` integer,
	`last_sign_in_at` integer,
	`updated_at` integer,
	`created_at` integer,
	`has_read_terms` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`degree_id`) REFERENCES `degree`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `verification_token` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE TABLE `shopping_list_item` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users_to_shopping_list_items` (
	`user_id` text NOT NULL,
	`item_id` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `item_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `shopping_list_item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `whitelist` (
	`email` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`reason` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `strike` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`strike_info_id` text NOT NULL,
	`is_deleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`strike_info_id`) REFERENCES `strike_info`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `strike_info` (
	`id` text PRIMARY KEY NOT NULL,
	`happening_id` text NOT NULL,
	`issuer_id` text NOT NULL,
	`reason` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`happening_id`) REFERENCES `happening`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`issuer_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_request_email_unique` ON `access_request` (`email`);--> statement-breakpoint
CREATE INDEX `post_idx` ON `comment` (`post_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `happening_slug_unique` ON `happening` (`slug`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `happening` (`slug`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `strike` (`user_id`,`id`);