const router = require('express').Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  try {
    let sql = 'SELECT * FROM decors WHERE 1=1';
    const params = [];

    if (req.query.productType && req.query.productType !== 'all') {
      sql += ' AND (compatible_product_type = ? OR compatible_product_type = "all")';
      params.push(req.query.productType);
    }
    if (req.query.colorGroup) {
      sql += ' AND color_group = ?';
      params.push(req.query.colorGroup);
    }
    if (req.query.patternCategory) {
      sql += ' AND pattern_category = ?';
      params.push(req.query.patternCategory);
    }
    if (req.query.search) {
      sql += ' AND (name LIKE ? OR code LIKE ?)';
      params.push(`%${req.query.search}%`, `%${req.query.search}%`);
    }
    sql += ' ORDER BY display_order ASC';

    res.json(db.prepare(sql).all(...params));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM decors WHERE id = ?').get(req.params.id) || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', authMiddleware, (req, res) => {
  const id = uuidv4();
  const { name, code, description_tr, description_en, image_url, color_group, pattern_category, compatible_product_type, display_order } = req.body;
  try {
    db.prepare(`INSERT INTO decors (id, name, code, description_tr, description_en, image_url, color_group, pattern_category, compatible_product_type, display_order)
      VALUES (?,?,?,?,?,?,?,?,?,?)`)
      .run(id, name, code, description_tr, description_en, image_url, color_group, pattern_category, compatible_product_type || 'all', display_order || 0);
    res.status(201).json(db.prepare('SELECT * FROM decors WHERE id = ?').get(id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name, code, description_tr, description_en, image_url, color_group, pattern_category, compatible_product_type, display_order } = req.body;
  try {
    db.prepare(`UPDATE decors SET name=?, code=?, description_tr=?, description_en=?, image_url=?,
      color_group=?, pattern_category=?, compatible_product_type=?, display_order=?, updated_at=datetime('now') WHERE id=?`)
      .run(name, code, description_tr, description_en, image_url, color_group, pattern_category, compatible_product_type, display_order, req.params.id);
    res.json(db.prepare('SELECT * FROM decors WHERE id = ?').get(req.params.id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM decors WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
