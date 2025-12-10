import express, { type Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

export function serveStatic(app: Express) {
  // Resolve current file path (because ES modules don't have __dirname)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Build output is located at: dist/public
  const clientDist = path.join(__dirname, '..', 'dist', 'public');

  app.use(express.static(clientDist));

  // For any unknown route, return index.html (SPA fallback)
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}
