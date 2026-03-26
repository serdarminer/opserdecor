const router = require('express').Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.post('/', (req, res) => {
  const id = uuidv4();
  const { full_name, email, phone, subject, message } = req.body;
  try {
    db.prepare('INSERT INTO contact_messages (id, full_name, email, phone, subject, message) VALUES (?,?,?,?,?,?)')
      .run(id, full_name, email, phone, subject, message);
    res.status(201).json(db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/', authMiddleware, (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id/read', authMiddleware, (req, res) => {
  try {
    db.prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
