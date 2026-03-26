const router = require('express').Router();
const { readTable, writeTable } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  let rows = readTable('news').sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
  if (req.query.all !== 'true') rows = rows.filter(n => n.status === 'published');
  if (req.query.limit) rows = rows.slice(0, parseInt(req.query.limit));
  res.json(rows);
});

router.get('/:id', (req, res) => {
  res.json(readTable('news').find(n => n.id === req.params.id) || null);
});

router.post('/', authMiddleware, (req, res) => {
  const rows = readTable('news');
  const item = { id: uuidv4(), ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  rows.push(item);
  writeTable('news', rows);
  res.status(201).json(item);
});

router.put('/:id', authMiddleware, (req, res) => {
  const rows = readTable('news');
  const idx = rows.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  rows[idx] = { ...rows[idx], ...req.body, updated_at: new Date().toISOString() };
  writeTable('news', rows);
  res.json(rows[idx]);
});

router.delete('/:id', authMiddleware, (req, res) => {
  writeTable('news', readTable('news').filter(n => n.id !== req.params.id));
  res.json({ success: true });
});

module.exports = router;
