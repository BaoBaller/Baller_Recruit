import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { registerRoutes } from './routes';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const httpServer = createServer(app);

// Get correct dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== MIDDLEWARE ==========
app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

export function log(message: string, source = 'express') {
  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Log API responses
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let captured: any;

  const originalJson = res.json;
  res.json = function (body, ...args) {
    captured = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on('finish', () => {
    if (path.startsWith('/api')) {
      log(`${req.method} ${path} ${res.statusCode} (${Date.now() - start}ms)`);
    }
  });

  next();
});

// ========== API ROUTES ==========
(async () => {
  await registerRoutes(httpServer, app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
  });

  // ===========================
  // PRODUCTION: Serve frontend
  // ===========================
  if (process.env.NODE_ENV === 'production') {
    const clientDist = path.join(__dirname, '../client/dist');

    // Serve built static assets
    app.use(express.static(clientDist));

    // SPA fallback – always send index.html
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  // ===========================
  // DEVELOPMENT: Start Vite dev server
  // ===========================
  else {
    const { setupVite } = await import('./vite');
    await setupVite(httpServer, app);
  }

  // Start server
  const port = parseInt(process.env.PORT || '5000');
  httpServer.listen(port, '0.0.0.0', () => {
    log(`Server running on port ${port}`);
  });
})();
