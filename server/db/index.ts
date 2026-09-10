// knex is CommonJS: Node's ESM loader exposes it only as the default export.
import knex from 'knex';
import { fileURLToPath } from 'node:url';
import { env } from '../env';

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export const db = knex({
  client: 'pg',
  connection: env.databaseUrl,
  // min 0: no idle connections held open in dev; max 10 is plenty for one API process.
  pool: { min: 0, max: 10 },
  migrations: { directory: here('./migrations'), loadExtensions: ['.ts'] },
  seeds: { directory: here('./seeds'), loadExtensions: ['.ts'] },
});
