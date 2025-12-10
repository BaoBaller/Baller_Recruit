import express, { type Express } from 'express';
import path from 'path';

// esbuild automatically injects __dirname for CJS bundles.
// NO import.meta or fileURLToPath is needed.
export function serveStatic(app: Express) {
  // dist/public is inside the server bundle dir
  const clientDist = path.resolve(__dirname, 'public');

  app.use(express.static(clientDist));

  // SPA fallback
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}
