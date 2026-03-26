const router = require('express').Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  try {
    let sql = 'SELECT * FROM news';
    const params = [];
    if (req.query.all !== 'true') {
      sql += ' WHERE status = "published"';
    }
    sql += ' ORDER BY published_date DESC';
    if (req.query.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(req.query.limit));
    }
    res.json(db.prepare(sql).all(...params));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id) || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', authMiddleware, (req, res) => {
  const id = uuidv4();
  const { title_tr, title_en, content_tr, content_en, cover_image_url, status, published_date } = req.body;
  try {
    db.prepare(`INSERT INTO news (id, title_tr, title_en, content_tr, content_en, cover_image_url, status, published_date)
      VALUES (?,?,?,?,?,?,?,?)`)
      .run(id, title_tr, title_en, content_tr, content_en, cover_image_url, status || 'draft', published_date || new Date().toISOString());
    res.status(201).json(db.prepare('SELECT * FROM news WHERE id = ?').get(id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', authMiddleware, (req, res) => {
  const { title_tr, title_en, content_tr, content_en, cover_image_url, status, published_date } = req.body;
  try {
    db.prepare(`UPDATE news SET title_tr=?, title_en=?, content_tr=?, content_en=?,
      cover_image_url=?, status=?, published_date=?, updated_at=datetime('now') WHERE id=?`)
      .run(title_tr, title_en, content_tr, content_en, cover_image_url, status, published_date, req.params.id);
    res.json(db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
