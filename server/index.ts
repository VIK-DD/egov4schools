import { createApp } from './app';
import { db } from './db';
import { env } from './env';

const server = createApp().listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});

function shutdown() {
  server.close(() => {
    void db.destroy().finally(() => process.exit(0));
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
