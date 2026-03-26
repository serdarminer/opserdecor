-- OPSERDECOR MySQL Schema
-- Run this in your MySQL database

CREATE DATABASE IF NOT EXISTS opserdecor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE opserdecor;

CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_tr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  usage_areas_tr TEXT,
  usage_areas_en TEXT,
  technical_specs_tr TEXT,
  technical_specs_en TEXT,
  image_url TEXT,
  category VARCHAR(50) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS decors (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) NOT NULL UNIQUE,
  description_tr TEXT,
  description_en TEXT,
  image_url TEXT NOT NULL,
  color_group VARCHAR(100),
  pattern_category VARCHAR(100),
  compatible_product_type VARCHAR(50) DEFAULT 'all',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
  id VARCHAR(36) PRIMARY KEY,
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_tr LONGTEXT NOT NULL,
  content_en LONGTEXT NOT NULL,
  cover_image_url TEXT,
  published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR(36) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_content (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `key` VARCHAR(100) NOT NULL UNIQUE,
  content_tr TEXT NOT NULL,
  content_en TEXT NOT NULL,
  image_url TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default admin user: admin / admin
INSERT IGNORE INTO admin_users (id, username, password_hash)
VALUES (UUID(), 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Default site content
INSERT IGNORE INTO site_content (id, `key`, content_tr, content_en)
VALUES 
  (UUID(), 'hero_title', 'OPSERDECOR', 'OPSERDECOR'),
  (UUID(), 'about_content', 'Opser, 1997 yılında kurulmuş Türkiye\'de Baskılı Dekoratif Kağıt ve Finiş Folyolarının lider üreticisidir.', 'Opser, founded in 1997, is a leading manufacturer of Printed Decorative Paper and Finish Foils in Turkey.');
