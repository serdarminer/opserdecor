const router = require('express').Router();
const { readTable, writeTable } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  let rows = readTable('decors').sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  if (req.query.productType && req.query.productType !== 'all') {
    rows = rows.filter(d => d.compatible_product_type === req.query.productType || d.compatible_product_type === 'all');
  }
  if (req.query.colorGroup) rows = rows.filter(d => d.color_group === req.query.colorGroup);
  if (req.query.patternCategory) rows = rows.filter(d => d.pattern_category === req.query.patternCategory);
  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    rows = rows.filter(d => d.name.toLowerCase().includes(s) || d.code.toLowerCase().includes(s));
  }
  res.json(rows);
});

router.get('/:id', (req, res) => {
  res.json(readTable('decors').find(d => d.id === req.params.id) || null);
});

router.post('/', authMiddleware, (req, res) => {
  const rows = readTable('decors');
  const item = { id: uuidv4(), ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  rows.push(item);
  writeTable('decors', rows);
  res.status(201).json(item);
});

router.put('/:id', authMiddleware, (req, res) => {
  const rows = readTable('decors');
  const idx = rows.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  rows[idx] = { ...rows[idx], ...req.body, updated_at: new Date().toISOString() };
  writeTable('decors', rows);
  res.json(rows[idx]);
});

router.delete('/:id', authMiddleware, (req, res) => {
  writeTable('decors', readTable('decors').filter(d => d.id !== req.params.id));
  res.json({ success: true });
});

module.exports = router;
