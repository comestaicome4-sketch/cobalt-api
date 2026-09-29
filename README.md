# Cobalt API

A small Node.js/Express API that can be deployed from GitHub to Railway. It includes a root service route, a health check, and a status endpoint for the Juraa bot service on EC2.

## Routes

- `GET /` — returns `{ "name": "Cobalt API", "status": "running" }`
- `GET /health` — returns `{ "status": "ok" }` for Cobalt API health checks
- `GET /bot/status` — checks whether the Juraa service accepts a TCP connection and returns its status. Returns HTTP `200` when reachable and HTTP `503` when unreachable.

Example response when reachable:

```json
{
  "bot": "Juraa",
  "status": "online",
  "signal": "tcp_reachable",
  "checkedAt": "2026-09-29T20:00:00.000Z"
}
```

**Status meaning:** this is a lightweight TCP reachability check for the bot's EC2 service port. It confirms the service is reachable, but cannot prove the bot is connected to Discord; the bot currently does not expose a dedicated readiness API.

## Configuration

Defaults target the current EC2 host and port. Override these in Railway if the host or port changes:

- `JURAA_BOT_HOST` (default `16.171.56.189`)
- `JURAA_BOT_PORT` (default `5000`)
- `JURAA_BOT_TIMEOUT_MS` (default `2000`)

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm test
npm start
```

The API listens on `PORT` when supplied, otherwise port `3000`.

## Deploy on Railway

1. Select the GitHub repository `comestaicome4-sketch/cobalt-api` as the service source.
2. Railway runs `npm start` and can redeploy automatically after changes reach the connected branch.
3. Verify the API at `https://<your-domain>/health` and the bot signal at `https://<your-domain>/bot/status`.
