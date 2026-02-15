const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'node-api-app';
const NODE_ENV = process.env.NODE_ENV || 'development';

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Node.js + Express',
    app: APP_NAME,
    env: NODE_ENV,
    status: 'ok',
    jwt_secret: process.env.JWT_SECRET || null,
    database_url: process.env.DATABASE_URL || null,
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
