const router = require('express').Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM site_content').all());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:key', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM site_content WHERE key = ?').get(req.params.key) || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:key', authMiddleware, (req, res) => {
  const { content_tr, content_en, image_url } = req.body;
  try {
    db.prepare("UPDATE site_content SET content_tr=?, content_en=?, image_url=?, updated_at=datetime('now') WHERE key=?")
      .run(content_tr, content_en, image_url, req.params.key);
    res.json(db.prepare('SELECT * FROM site_content WHERE key = ?').get(req.params.key));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
