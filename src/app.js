const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ name: 'Cobalt API', status: 'running' });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
