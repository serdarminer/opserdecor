const router = require('express').Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM products ORDER BY display_order ASC').all();
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(row || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', authMiddleware, (req, res) => {
  const id = uuidv4();
  const { name_tr, name_en, description_tr, description_en, usage_areas_tr, usage_areas_en,
    technical_specs_tr, technical_specs_en, image_url, category, display_order } = req.body;
  try {
    db.prepare(`INSERT INTO products (id, name_tr, name_en, description_tr, description_en,
      usage_areas_tr, usage_areas_en, technical_specs_tr, technical_specs_en,
      image_url, category, display_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(id, name_tr, name_en, description_tr, description_en,
        usage_areas_tr, usage_areas_en, technical_specs_tr, technical_specs_en,
        image_url, category, display_order || 0);
    res.status(201).json(db.prepare('SELECT * FROM products WHERE id = ?').get(id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name_tr, name_en, description_tr, description_en, usage_areas_tr, usage_areas_en,
    technical_specs_tr, technical_specs_en, image_url, category, display_order } = req.body;
  try {
    db.prepare(`UPDATE products SET name_tr=?, name_en=?, description_tr=?, description_en=?,
      usage_areas_tr=?, usage_areas_en=?, technical_specs_tr=?, technical_specs_en=?,
      image_url=?, category=?, display_order=?, updated_at=datetime('now') WHERE id=?`)
      .run(name_tr, name_en, description_tr, description_en,
        usage_areas_tr, usage_areas_en, technical_specs_tr, technical_specs_en,
        image_url, category, display_order, req.params.id);
    res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
