CREATE TABLE `admin_sessions` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `expires_at` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_sessions_token_key` (`token`),
  KEY `admin_sessions_token_idx` (`token`),
  KEY `admin_sessions_user_id_idx` (`user_id`),
  CONSTRAINT `admin_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `admin_verification_codes` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `expires_at` datetime(3) NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `admin_verification_codes_user_id_code_idx` (`user_id`, `code`),
  CONSTRAINT `admin_verification_codes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
