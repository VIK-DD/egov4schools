/**
 * Database tasks, run through tsx so migrations and seeds can be TypeScript:
 *   npm run db:migrate | db:rollback | db:seed | db:reset
 */
import { db } from './index';

async function main(command: string | undefined) {
  switch (command) {
    case 'migrate': {
      const [, applied] = await db.migrate.latest();
      console.log(applied.length ? `Applied: ${applied.join(', ')}` : 'Already up to date.');
      break;
    }
    case 'rollback':
      await db.migrate.rollback(undefined, true);
      console.log('Rolled back all migrations.');
      break;
    case 'seed': {
      const [files] = await db.seed.run();
      console.log(`Seeded: ${files.join(', ')}`);
      break;
    }
    case 'reset':
      await db.migrate.rollback(undefined, true);
      await db.migrate.latest();
      await db.seed.run();
      console.log('Database rebuilt and seeded.');
      break;
    default:
      console.error('Usage: tsx server/db/cli.ts <migrate|rollback|seed|reset>');
      process.exitCode = 1;
  }
}

main(process.argv[2])
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.destroy());
