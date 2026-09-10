import compression from 'compression';
import express, { type ErrorRequestHandler } from 'express';
import { institutionsRouter } from './routes/institutions';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  // Compressed JSON: a page of documents shrinks several times on the wire.
  app.use(compression());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });
  app.use('/api/institutions', institutionsRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'not_found' });
  });

  // Express 5 forwards rejected async handlers here automatically.
  const onError: ErrorRequestHandler = (err, _req, res, next) => {
    // Once headers are out we cannot send JSON; let Express close the socket.
    if (res.headersSent) {
      next(err);
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  };
  app.use(onError);

  return app;
}
