const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function getFilePath(table) {
  return path.join(DATA_DIR, `${table}.json`);
}

function readTable(table) {
  const fp = getFilePath(table);
  if (!fs.existsSync(fp)) return [];
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function writeTable(table, data) {
  fs.writeFileSync(getFilePath(table), JSON.stringify(data, null, 2));
}

// Seed admin user
const admins = readTable('admin_users');
if (!admins.find(u => u.username === 'admin')) {
  admins.push({
    id: uuidv4(),
    username: 'admin',
    password_hash: bcrypt.hashSync('admin', 10),
    created_at: new Date().toISOString()
  });
  writeTable('admin_users', admins);
  console.log('Admin user created: admin / admin');
}

// Seed site content
const sc = readTable('site_content');
if (!sc.find(s => s.key === 'hero_title')) {
  sc.push({ id: uuidv4(), key: 'hero_title', content_tr: 'OPSERDECOR', content_en: 'OPSERDECOR', image_url: null, updated_at: new Date().toISOString() });
  sc.push({ id: uuidv4(), key: 'about_content', content_tr: "Opser, 1997 yılında kurulmuş Türkiye'de Baskılı Dekoratif Kağıt ve Finiş Folyolarının lider üreticisidir.", content_en: 'Opser, founded in 1997, is a leading manufacturer of Printed Decorative Paper and Finish Foils in Turkey.', image_url: null, updated_at: new Date().toISOString() });
  writeTable('site_content', sc);
}

module.exports = { readTable, writeTable };
