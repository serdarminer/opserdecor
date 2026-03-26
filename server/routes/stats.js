const router = require('express').Router();
const { readTable } = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, (req, res) => {
  res.json({
    products: readTable('products').length,
    decors: readTable('decors').length,
    news: readTable('news').length,
    messages: readTable('contact_messages').length,
  });
});

module.exports = router;
