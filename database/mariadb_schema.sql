-- MariaDB Database Schema for Attendance System
-- Compatible with phpMyAdmin

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Create database (optional - you can create this manually in phpMyAdmin)
-- CREATE DATABASE IF NOT EXISTS `attendance_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `attendance_system`;

-- Table: academic_years
CREATE TABLE `academic_years` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `year` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: positions
CREATE TABLE `positions` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: locations
CREATE TABLE `locations` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `radius` int DEFAULT 50,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: users (replacing auth.users functionality)
CREATE TABLE `users` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email_verified` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: profiles
CREATE TABLE `profiles` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` enum('admin','teacher') DEFAULT 'teacher',
  `status` enum('active','inactive') DEFAULT 'active',
  `employee_code` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_place` varchar(255) DEFAULT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `position_id` char(36) DEFAULT NULL,
  `location_id` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_id` (`user_id`),
  KEY `fk_profiles_position` (`position_id`),
  KEY `fk_profiles_location` (`location_id`),
  CONSTRAINT `fk_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_profiles_position` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_profiles_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: schedules
CREATE TABLE `schedules` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `teacher_id` char(36) NOT NULL,
  `academic_year_id` char(36) DEFAULT NULL,
  `location_id` char(36) DEFAULT NULL,
  `day_of_week` int NOT NULL COMMENT '0=Sunday, 1=Monday, ..., 6=Saturday',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_schedules_teacher` (`teacher_id`),
  KEY `fk_schedules_academic_year` (`academic_year_id`),
  KEY `fk_schedules_location` (`location_id`),
  CONSTRAINT `fk_schedules_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_schedules_academic_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_schedules_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: attendance
CREATE TABLE `attendance` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `teacher_id` char(36) NOT NULL,
  `location_id` char(36) DEFAULT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `type` enum('check_in','check_out') NOT NULL,
  `status` enum('present','late','absent') NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_attendance_teacher` (`teacher_id`),
  KEY `fk_attendance_location` (`location_id`),
  KEY `idx_attendance_date` (`date`),
  KEY `idx_attendance_teacher_date` (`teacher_id`, `date`),
  CONSTRAINT `fk_attendance_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_attendance_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: settings
CREATE TABLE `settings` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `school_name` varchar(255) DEFAULT 'Nama Sekolah',
  `school_address` text DEFAULT NULL,
  `school_phone` varchar(20) DEFAULT NULL,
  `school_email` varchar(255) DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `default_latitude` decimal(10,8) DEFAULT NULL,
  `default_longitude` decimal(11,8) DEFAULT NULL,
  `default_radius` int DEFAULT 50,
  `attendance_start_time` time DEFAULT '06:00:00',
  `attendance_end_time` time DEFAULT '08:00:00',
  `late_tolerance_minutes` int DEFAULT 15,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings
INSERT INTO `settings` (`id`, `school_name`, `attendance_start_time`, `attendance_end_time`, `late_tolerance_minutes`, `default_radius`) 
VALUES (UUID(), 'Nama Sekolah', '06:00:00', '08:00:00', 15, 50);

-- Insert default positions
INSERT INTO `positions` (`id`, `name`, `description`) VALUES
(UUID(), 'Guru Kelas', 'Guru yang mengajar di kelas tertentu'),
(UUID(), 'Guru Mata Pelajaran', 'Guru yang mengajar mata pelajaran khusus'),
(UUID(), 'Kepala Sekolah', 'Pimpinan sekolah'),
(UUID(), 'Wakil Kepala Sekolah', 'Wakil pimpinan sekolah');

-- Insert default academic year
INSERT INTO `academic_years` (`id`, `year`, `start_date`, `end_date`, `is_active`) VALUES
(UUID(), '2024/2025', '2024-07-01', '2025-06-30', 1);

COMMIT;

-- Additional Notes:
-- 1. You'll need to implement authentication manually (login/logout system)
-- 2. Replace Supabase auth.uid() with session-based user management
-- 3. Implement role-based access control in your application logic
-- 4. Use password hashing (bcrypt/argon2) for user passwords
-- 5. Consider using JWT tokens for session management