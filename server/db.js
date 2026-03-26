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

// Seed products
const products = readTable('products');
if (products.length === 0) {
  const now = new Date().toISOString();
  products.push({
    id: uuidv4(),
    name_tr: 'Finish Folyo',
    name_en: 'Finish Foil',
    description_tr: 'Yüksek kaliteli finish folyo ürünlerimiz, mobilya ve panel kaplamalarında mükemmel yüzey bitişi sağlar. Dayanıklı ve estetik görünümü ile ürünlerinize değer katar. Çeşitli panel baskı, MDF, kontrplak, vb. Laminasyon ve profil sarmaya uygun, lakçe ve kire dayanıklı, baskılı dayanıklı kol işleri yapılmaz gibi olacak. Ön emprenye edilmiş yüzey oluşturmak için basılan yüksek renk özel kağıtlardır.',
    description_en: 'Our high-quality finish foil products provide excellent surface finish for furniture and panel coatings. It adds value to your products with its durable and aesthetic appearance.',
    usage_areas_tr: 'Mobilya, Kapı, MDF Panel Kaplaması, Mobilya Profili',
    usage_areas_en: 'Furniture, Door, MDF Panel Coating, Furniture Profile',
    technical_specs_tr: 'Yüksek dayanıklılık, UV koruma, Çizilme direnci',
    technical_specs_en: 'High durability, UV protection, Scratch resistance',
    image_url: '/images/photos/ffoil.jpg',
    category: 'finish_foil',
    display_order: 1,
    created_at: now,
    updated_at: now
  });
  products.push({
    id: uuidv4(),
    name_tr: 'Dekor Kağıdı',
    name_en: 'Decorative Paper',
    description_tr: 'Geniş desen ve renk seçenekleri ile dekor kağıtlarımız, her türlü tasarım ihtiyacınıza cevap verir. Yüksek baskı kalitesi ve renk canlılığı ile öne çıkar. Opser dekoratif kağıtları mobilyalardan zemine, mutfaklardan iç mekan kaplamalarına kadar geniş bir yelpazede yüzeyleri kapsayacak şekilde üretilmektedir.',
    description_en: 'Our decorative papers meet all your design needs with a wide range of patterns and color options. They stand out with high print quality and color vibrancy.',
    usage_areas_tr: 'Mobilya, Kapı, Parke, Süpürgelik',
    usage_areas_en: 'Furniture, Door, Parquet, Baseboard',
    technical_specs_tr: 'Dekor ve renkler, çevre dostu baskı mürekkepleri',
    technical_specs_en: 'Decor designs and colors are gravure-printed with eco-friendly inks',
    image_url: '/images/photos/decor1.jpg',
    category: 'decorative_paper',
    display_order: 2,
    created_at: now,
    updated_at: now
  });
  products.push({
    id: uuidv4(),
    name_tr: 'PP Folyo',
    name_en: 'PP Foil',
    description_tr: 'Polipropilen bazlı PP folyo ürünlerimiz, üstün dayanıklılık ve esneklik sunar. Nem direnci ve uzun ömürlü kullanım için ideal çözümdür. Opserdecor PP Folyo ürünleri, mobilya sektöründe yüksek performanslı bir yüzey çözümüdür.',
    description_en: 'Our polypropylene-based PP foil products offer superior durability and flexibility. It is an ideal solution for moisture resistance and long-lasting use.',
    usage_areas_tr: 'Mobilya, Kapı, MDF Panel',
    usage_areas_en: 'Furniture, Door, MDF Panel',
    technical_specs_tr: 'Nem direnci, Esneklik, Uzun ömür',
    technical_specs_en: 'Moisture resistance, Flexibility, Long life',
    image_url: '/images/photos/ppfoil.jpg',
    category: 'pp_foil',
    display_order: 3,
    created_at: now,
    updated_at: now
  });
  writeTable('products', products);
  console.log('Seed products created');
}

module.exports = { readTable, writeTable };
