const net = require('node:net');

const DEFAULT_HOST = '16.171.56.189';
const DEFAULT_PORT = 5000;
const DEFAULT_TIMEOUT_MS = 2000;

function checkBotReachability({
  host = process.env.JURAA_BOT_HOST || DEFAULT_HOST,
  port = Number(process.env.JURAA_BOT_PORT) || DEFAULT_PORT,
  timeoutMs = Number(process.env.JURAA_BOT_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
} = {}) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    const finish = (reachable) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(reachable);
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, host);
  });
}

module.exports = checkBotReachability;
