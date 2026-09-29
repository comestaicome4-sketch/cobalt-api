const test = require('node:test');
const assert = require('node:assert/strict');
const net = require('node:net');
const appModule = require('../src/app');
const app = appModule;
const createApp = appModule.createApp;
const checkBotReachability = require('../src/botStatus');

async function withServer(appToServe, callback) {
  const server = appToServe.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    await callback(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test('GET / returns the Cobalt API service status', async () => {
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { name: 'Cobalt API', status: 'running' });
  });
});

test('GET /health returns a healthy status', async () => {
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
  });
});

test('GET /bot/status reports online when the bot service is reachable', async () => {
  const testApp = createApp({ checkBot: async () => true });
  await withServer(testApp, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/bot/status`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.bot, 'Juraa');
    assert.equal(body.status, 'online');
    assert.equal(body.signal, 'tcp_reachable');
    assert.ok(Number.isFinite(Date.parse(body.checkedAt)));
  });
});

test('GET /bot/status reports offline when the bot service is unreachable', async () => {
  const testApp = createApp({ checkBot: async () => false });
  await withServer(testApp, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/bot/status`);
    const body = await response.json();
    assert.equal(response.status, 503);
    assert.equal(body.bot, 'Juraa');
    assert.equal(body.status, 'offline');
    assert.equal(body.signal, 'tcp_reachable');
    assert.ok(Number.isFinite(Date.parse(body.checkedAt)));
  });
});

test('TCP probe detects a reachable local listener', async () => {
  const target = net.createServer((socket) => socket.end());
  target.listen(0, '127.0.0.1');
  await new Promise((resolve) => target.once('listening', resolve));
  try {
    assert.equal(await checkBotReachability({
      host: '127.0.0.1',
      port: target.address().port,
      timeoutMs: 500,
    }), true);
  } finally {
    await new Promise((resolve, reject) => target.close((error) => error ? reject(error) : resolve()));
  }
});

test('TCP probe reports an unreachable local port as offline', async () => {
  const target = net.createServer();
  target.listen(0, '127.0.0.1');
  await new Promise((resolve) => target.once('listening', resolve));
  const port = target.address().port;
  await new Promise((resolve, reject) => target.close((error) => error ? reject(error) : resolve()));

  assert.equal(await checkBotReachability({ host: '127.0.0.1', port, timeoutMs: 500 }), false);
});
