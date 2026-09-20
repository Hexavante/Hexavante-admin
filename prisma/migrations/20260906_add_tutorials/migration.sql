-- CreateTable
CREATE TABLE `tutorials` (
    `id` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `video_url` VARCHAR(191) NULL,
    `thumbnail_url` VARCHAR(191) NULL,
    `duration` INTEGER NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `view_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tutorials_slug_key`(`slug`),
    INDEX `tutorials_author_id_idx`(`author_id`),
    INDEX `tutorials_category_id_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tutorial_tags` (
    `tutorial_id` VARCHAR(191) NOT NULL,
    `tag_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tutorial_tags_tutorial_id_tag_id_key`(`tutorial_id`, `tag_id`),
    INDEX `tutorial_tags_tag_id_idx`(`tag_id`),
    PRIMARY KEY (`tutorial_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tutorials` ADD CONSTRAINT `tutorials_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tutorials` ADD CONSTRAINT `tutorials_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tutorial_tags` ADD CONSTRAINT `tutorial_tags_tutorial_id_fkey` FOREIGN KEY (`tutorial_id`) REFERENCES `tutorials`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tutorial_tags` ADD CONSTRAINT `tutorial_tags_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
