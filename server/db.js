const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'opserdecor.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_tr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  usage_areas_tr TEXT,
  usage_areas_en TEXT,
  technical_specs_tr TEXT,
  technical_specs_en TEXT,
  image_url TEXT,
  category TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS decors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description_tr TEXT,
  description_en TEXT,
  image_url TEXT NOT NULL,
  color_group TEXT,
  pattern_category TEXT,
  compatible_product_type TEXT DEFAULT 'all',
  display_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_tr TEXT NOT NULL,
  content_en TEXT NOT NULL,
  cover_image_url TEXT,
  published_date TEXT DEFAULT (datetime('now')),
  status TEXT DEFAULT 'draft',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  content_tr TEXT NOT NULL,
  content_en TEXT NOT NULL,
  image_url TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);
`);

// Seed admin user if not exists
const adminExists = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
if (!adminExists) {
  const hash = bcrypt.hashSync('admin', 10);
  const { v4: uuidv4 } = require('uuid');
  db.prepare('INSERT INTO admin_users (id, username, password_hash) VALUES (?, ?, ?)').run(uuidv4(), 'admin', hash);
  console.log('Admin user created: admin / admin');
}

// Seed default site content
const heroExists = db.prepare("SELECT id FROM site_content WHERE key = 'hero_title'").get();
if (!heroExists) {
  const { v4: uuidv4 } = require('uuid');
  db.prepare('INSERT INTO site_content (id, key, content_tr, content_en) VALUES (?, ?, ?, ?)').run(
    uuidv4(), 'hero_title', 'OPSERDECOR', 'OPSERDECOR'
  );
  db.prepare('INSERT INTO site_content (id, key, content_tr, content_en) VALUES (?, ?, ?, ?)').run(
    uuidv4(), 'about_content',
    "Opser, 1997 yılında kurulmuş Türkiye'de Baskılı Dekoratif Kağıt ve Finiş Folyolarının lider üreticisidir.",
    "Opser, founded in 1997, is a leading manufacturer of Printed Decorative Paper and Finish Foils in Turkey."
  );
}

module.exports = db;
