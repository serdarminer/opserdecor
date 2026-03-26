const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/decors', require('./routes/decors'));
app.use('/api/news', require('./routes/news'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/site-content', require('./routes/site-content'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/stats', require('./routes/stats'));

// Serve React build in production
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
