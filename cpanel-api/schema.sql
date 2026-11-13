-- Mondal Export Import — MySQL Schema for cPanel (MySQL 5.7+ / 8.0 / MariaDB)

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `short_name` VARCHAR(60) NOT NULL,
  `description` TEXT NOT NULL,
  `cover_image` VARCHAR(255) NOT NULL DEFAULT '',
  `sort_order` INT NOT NULL DEFAULT 10,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `products` (
  `slug` VARCHAR(120) NOT NULL,
  `name` VARCHAR(160) NOT NULL,
  `category_id` VARCHAR(64) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `gallery_json` JSON NULL,
  `short_description` VARCHAR(280) NOT NULL DEFAULT '',
  `description` TEXT NOT NULL,
  `origin` VARCHAR(160) NOT NULL DEFAULT 'India',
  `packaging` VARCHAR(200) NOT NULL DEFAULT 'TBC',
  `moq` VARCHAR(160) NOT NULL DEFAULT 'TBC',
  `private_label` TINYINT(1) NOT NULL DEFAULT 1,
  `incoterms` VARCHAR(160) NOT NULL DEFAULT 'FOB / CIF (TBC)',
  `certifications_json` JSON NULL,
  `needs_unique_image` TINYINT(1) NOT NULL DEFAULT 0,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `seo_title` VARCHAR(180) NOT NULL DEFAULT '',
  `seo_description` VARCHAR(300) NOT NULL DEFAULT '',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`slug`),
  KEY `idx_products_category` (`category_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` VARCHAR(64) NOT NULL,
  `reference_id` VARCHAR(32) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `company` VARCHAR(160) NOT NULL DEFAULT '',
  `email` VARCHAR(160) NOT NULL,
  `phone` VARCHAR(48) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `products_json` JSON NULL,
  `quantity` VARCHAR(120) NOT NULL DEFAULT '',
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'quoted', 'closed') NOT NULL DEFAULT 'new',
  `admin_notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enquiries_status` (`status`),
  KEY `idx_enquiries_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(160) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(32) NOT NULL DEFAULT 'admin',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
