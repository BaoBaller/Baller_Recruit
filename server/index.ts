import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express, { type Request, type Response, type NextFunction } from 'express';
import session from 'express-session';
import { registerRoutes } from './routes';
import { serveStatic } from './static';
import { createServer } from 'http';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './db';
import cors from 'cors';

const app = express();
app.set('trust proxy', 1);
const httpServer = createServer(app);

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Parse JSON (keep rawBody for things like webhooks)
app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  }),
);

app.use(
  cors({
    origin: ['https://ballerheadwearcareer.com', 'https://www.ballerheadwearcareer.com'],
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: false }));

// Session middleware
const PgSession = connectPgSimple(session);

app.use(
  session({
    name: 'recruitflow.sid',
    store: new PgSession({
      pool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true, // 🔥 HTTPS only
      sameSite: 'none', // 🔥 REQUIRED for production auth
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

// Simple logger
export function log(message: string, source = 'express') {
  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Log /api requests
app.use((req, res, next) => {
  const start = Date.now();
  let capturedJsonResponse: any;

  const originalJson = res.json.bind(res);

  (res as any).json = function (...args: any[]) {
    capturedJsonResponse = args[0];
    return (originalJson as any).apply(res, args);
  };

  res.on('finish', () => {
    if (req.path.startsWith('/api')) {
      log(`${req.method} ${req.path} ${res.statusCode} (${Date.now() - start}ms)`);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
  });

  // Production – serve built frontend
  if (process.env.NODE_ENV === 'production') {
    serveStatic(app);
  } else {
    // Local dev – enable Vite HMR
    const { setupVite } = await import('./vite');
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || '5000');
  httpServer.listen({ port, host: '0.0.0.0', reusePort: true }, () => log(`Server running on port ${port}`));
})();
