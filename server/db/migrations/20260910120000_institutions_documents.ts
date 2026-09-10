import type { Knex } from 'knex';

/**
 * Institutions 1 ── * Documents.
 *
 * Indexes are chosen for the two queries the API actually runs:
 *   1. typeahead:  WHERE name ILIKE '%term%'           → trigram GIN index
 *   2. listing:    WHERE institution_id = ?
 *                  ORDER BY published_at DESC, id DESC
 *                  LIMIT n OFFSET m                     → composite B-tree
 * The composite index leads with institution_id, so it also serves the
 * foreign-key lookups (and ON DELETE CASCADE) - no separate index needed.
 */
export async function up(knex: Knex): Promise<void> {
  // pg_trgm lets ILIKE '%…%' use an index instead of scanning every row.
  await knex.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm');

  await knex.schema.createTable('institutions', (t) => {
    t.increments('id').primary();
    t.string('name', 200).notNullable();
    t.string('slug', 200).notNullable().unique();
    t.string('type', 16).notNullable();
    // Matches the raion ids used by the frontend (src/data/sample.ts).
    t.string('raion_id', 32).notNullable();
    t.string('locality', 100).notNullable();
    t.timestamps(true, true);
  });
  await knex.raw(
    'CREATE INDEX institutions_name_trgm_idx ON institutions USING gin (name gin_trgm_ops)',
  );

  await knex.schema.createTable('documents', (t) => {
    t.increments('id').primary();
    t.integer('institution_id')
      .notNullable()
      .references('id')
      .inTable('institutions')
      .onDelete('CASCADE');
    t.string('title', 300).notNullable();
    t.string('doc_type', 16).notNullable();
    t.string('category', 16).notNullable();
    t.string('number', 50);
    t.date('published_at').notNullable();
    t.integer('pages').notNullable();
    t.integer('size_kb').notNullable();
    t.string('file_url', 500).notNullable();
    t.timestamps(true, true);
  });
  // The page query reads rows already in the requested order: no sort step,
  // and OFFSET/LIMIT stop early instead of materialising every document.
  await knex.raw(
    'CREATE INDEX documents_institution_published_idx ON documents (institution_id, published_at DESC, id DESC)',
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('documents');
  await knex.schema.dropTableIfExists('institutions');
  // pg_trgm is left installed: other schemas may rely on it.
}
