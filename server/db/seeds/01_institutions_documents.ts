import type { Knex } from 'knex';

/**
 * Test data: 10 fictional institutions with 5-10 PDFs each (72 documents).
 *
 * Names say "de test" so they can never be mistaken for real schools, and file
 * URLs point at example.org (reserved for documentation). Deterministic:
 * re-running the seed rebuilds exactly the same rows and ids.
 */
const INSTITUTIONS = [
  { name: 'Liceul Teoretic de test nr. 1', type: 'liceu', raion_id: 'chisinau', locality: 'Chișinău' },
  { name: 'Liceul Teoretic de test nr. 2', type: 'liceu', raion_id: 'chisinau', locality: 'Chișinău' },
  { name: 'Liceul Teoretic de test nr. 3', type: 'liceu', raion_id: 'balti', locality: 'Bălți' },
  { name: 'Gimnaziul de test nr. 4', type: 'gimnaziu', raion_id: 'cahul', locality: 'Cahul' },
  { name: 'Liceul Teoretic de test nr. 5', type: 'liceu', raion_id: 'ungheni', locality: 'Ungheni' },
  { name: 'Gimnaziul de test nr. 6', type: 'gimnaziu', raion_id: 'orhei', locality: 'Orhei' },
  { name: 'Școala primară de test nr. 7', type: 'scoala', raion_id: 'soroca', locality: 'Soroca' },
  { name: 'Liceul Teoretic de test nr. 8', type: 'liceu', raion_id: 'gagauzia', locality: 'Comrat' },
  { name: 'Gimnaziul de test nr. 9', type: 'gimnaziu', raion_id: 'hincesti', locality: 'Hîncești' },
  { name: 'Liceul Teoretic de test nr. 10', type: 'liceu', raion_id: 'edinet', locality: 'Edineț' },
];

/** Documents per institution, in the same order as INSTITUTIONS. */
const DOC_COUNTS = [7, 5, 9, 6, 10, 8, 5, 7, 9, 6];

const TEMPLATES = [
  { doc_type: 'ordin', category: 'management', title: 'Ordin privind organizarea procesului educațional' },
  { doc_type: 'plan', category: 'curriculum', title: 'Planul de învățământ al instituției' },
  { doc_type: 'circulara', category: 'bac', title: 'Graficul simulării examenului de bacalaureat' },
  { doc_type: 'regulament', category: 'management', title: 'Regulamentul intern de funcționare' },
  { doc_type: 'ghid', category: 'evaluare', title: 'Ghid intern de evaluare criterială' },
  { doc_type: 'ordin', category: 'incluziune', title: 'Ordin privind Comisia multidisciplinară intrașcolară' },
  { doc_type: 'circulara', category: 'management', title: 'Raportul anual de activitate' },
  { doc_type: 'plan', category: 'curriculum', title: 'Oferta de discipline opționale' },
  { doc_type: 'ghid', category: 'incluziune', title: 'Procedura de sprijin pentru elevii cu CES' },
  { doc_type: 'regulament', category: 'evaluare', title: 'Regulamentul olimpiadelor școlare' },
];

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function isoDaysBefore(anchor: string, days: number): string {
  const d = new Date(`${anchor}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

/** From September on, a date belongs to the next school year. */
function schoolYear(iso: string): string {
  const year = Number(iso.slice(0, 4));
  const end = Number(iso.slice(5, 7)) >= 9 ? year + 1 : year;
  return `${end - 1}–${end}`;
}

export async function seed(knex: Knex): Promise<void> {
  await knex.raw('TRUNCATE documents, institutions RESTART IDENTITY CASCADE');

  const inserted: { id: number; slug: string }[] = await knex('institutions')
    .insert(INSTITUTIONS.map((i) => ({ ...i, slug: slugify(i.name) })))
    .returning(['id', 'slug']);

  const documents = inserted.flatMap(({ id, slug }, i) =>
    Array.from({ length: DOC_COUNTS[i] ?? 5 }, (_, j) => {
      // (i + j) % 10 with j < 10 → no repeated template within one institution.
      const tpl = TEMPLATES[(i + j) % TEMPLATES.length]!;
      const publishedAt = isoDaysBefore('2026-09-01', j * 47 + i * 13);
      return {
        institution_id: id,
        title: `${tpl.title}, ${schoolYear(publishedAt)}`,
        doc_type: tpl.doc_type,
        category: tpl.category,
        number: tpl.doc_type === 'ordin' ? String(100 + i * 10 + j) : null,
        published_at: publishedAt,
        pages: 2 + ((i * 7 + j * 5) % 30),
        size_kb: 90 + ((i * 131 + j * 97) % 2400),
        file_url: `https://example.org/egov4schools/demo/${slug}/${String(j + 1).padStart(2, '0')}.pdf`,
      };
    }),
  );

  await knex.batchInsert('documents', documents, 500);
}
