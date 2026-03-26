const router = require('express').Router();
const { readTable, writeTable } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  const rows = readTable('products').sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = readTable('products').find(p => p.id === req.params.id);
  res.json(row || null);
});

router.post('/', authMiddleware, (req, res) => {
  const rows = readTable('products');
  const item = { id: uuidv4(), ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  rows.push(item);
  writeTable('products', rows);
  res.status(201).json(item);
});

router.put('/:id', authMiddleware, (req, res) => {
  const rows = readTable('products');
  const idx = rows.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  rows[idx] = { ...rows[idx], ...req.body, updated_at: new Date().toISOString() };
  writeTable('products', rows);
  res.json(rows[idx]);
});

router.delete('/:id', authMiddleware, (req, res) => {
  let rows = readTable('products');
  rows = rows.filter(p => p.id !== req.params.id);
  writeTable('products', rows);
  res.json({ success: true });
});

module.exports = router;
