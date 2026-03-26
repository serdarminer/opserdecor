const router = require('express').Router();
const { readTable, writeTable } = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.get('/', (req, res) => { res.json(readTable('site_content')); });

router.get('/:key', (req, res) => {
  res.json(readTable('site_content').find(s => s.key === req.params.key) || null);
});

router.put('/:key', authMiddleware, (req, res) => {
  const rows = readTable('site_content');
  const idx = rows.findIndex(s => s.key === req.params.key);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  rows[idx] = { ...rows[idx], ...req.body, updated_at: new Date().toISOString() };
  writeTable('site_content', rows);
  res.json(rows[idx]);
});

module.exports = router;
