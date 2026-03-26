const router = require('express').Router();
const { readTable, writeTable } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.post('/', (req, res) => {
  const rows = readTable('contact_messages');
  const item = { id: uuidv4(), ...req.body, is_read: false, created_at: new Date().toISOString() };
  rows.push(item);
  writeTable('contact_messages', rows);
  res.status(201).json(item);
});

router.get('/', authMiddleware, (req, res) => {
  res.json(readTable('contact_messages').sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

router.patch('/:id/read', authMiddleware, (req, res) => {
  const rows = readTable('contact_messages');
  const idx = rows.findIndex(m => m.id === req.params.id);
  if (idx !== -1) { rows[idx].is_read = true; writeTable('contact_messages', rows); }
  res.json({ success: true });
});

router.delete('/:id', authMiddleware, (req, res) => {
  writeTable('contact_messages', readTable('contact_messages').filter(m => m.id !== req.params.id));
  res.json({ success: true });
});

module.exports = router;
