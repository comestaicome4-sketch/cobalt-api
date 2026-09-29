# Cobalt API

A small Node.js/Express starter API that can be deployed from GitHub to Railway. This initial scaffold provides a root status route and a health-check endpoint; add the Cobalt-specific API behavior as needed.

## Routes

- `GET /` — returns `{ "name": "Cobalt API", "status": "running" }`
- `GET /health` — returns `{ "status": "ok" }` for health checks

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm test
npm start
```

The service listens on `PORT` when supplied, otherwise port `3000`.

## Deploy on Railway

1. In Railway, create a project and choose **Deploy from GitHub repo** (or add a service from a repository).
2. Connect GitHub if prompted, then select `comestaicome4-sketch/cobalt-api`.
3. Railway detects the Node.js app and runs `npm start`.
4. Generate a public domain in the service's **Networking** settings.
5. Verify the deployment at `https://<your-domain>/health`.

No secrets or environment variables are required for this starter.
