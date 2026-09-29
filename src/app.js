const express = require('express');
const checkBotReachability = require('./botStatus');

function createApp({ checkBot = checkBotReachability } = {}) {
  const app = express();
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ name: 'Cobalt API', status: 'running' });
  });

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/bot/status', async (_req, res) => {
    let online = false;
    try {
      online = await checkBot();
    } catch {
      online = false;
    }

    res.status(online ? 200 : 503).json({
      bot: 'Juraa',
      status: online ? 'online' : 'offline',
      signal: 'tcp_reachable',
      checkedAt: new Date().toISOString(),
    });
  });

  return app;
}

const app = createApp();
app.createApp = createApp;

module.exports = app;
