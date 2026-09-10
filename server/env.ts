// Load .env when present (Node >= 20.12). Variables already set in the
// process environment are not overwritten.
try {
  process.loadEnvFile();
} catch {
  // No .env file: rely on the process environment and the defaults below.
}

export const env = {
  /** Defaults match docker-compose.yml, so `npm run db:up` just works. */
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://egov:egov@localhost:5433/egov4schools',
  port: Number(process.env.API_PORT ?? 3001),
};
