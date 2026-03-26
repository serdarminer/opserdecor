const router = require('express').Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, (req, res) => {
  try {
    const products = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const decors = db.prepare('SELECT COUNT(*) as count FROM decors').get().count;
    const news = db.prepare('SELECT COUNT(*) as count FROM news').get().count;
    const messages = db.prepare('SELECT COUNT(*) as count FROM contact_messages').get().count;
    res.json({ products, decors, news, messages });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
