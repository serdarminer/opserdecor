const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
