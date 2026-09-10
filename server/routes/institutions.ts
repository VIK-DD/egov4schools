import { Router } from 'express';
import { z } from 'zod';
import {
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  SEARCH_LIMIT_DEFAULT,
  type DocumentItem,
  type InstitutionDocumentsResponse,
  type InstitutionRef,
  type InstitutionSearchResponse,
  type InstitutionSummary,
} from '../../shared/api';
import { db } from '../db';

const searchQuery = z.object({
  q: z.string().trim().max(100).default(''),
  limit: z.coerce.number().int().min(1).max(50).default(SEARCH_LIMIT_DEFAULT),
});

const idParam = z.object({ id: z.coerce.number().int().positive() });

const pageQuery = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(PAGE_SIZE_MAX).default(PAGE_SIZE_DEFAULT),
});

/** Escape LIKE wildcards so searching for "100%" or "a_b" matches literally. */
const likeEscape = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

/** Public, read-only data: let browsers and proxies reuse responses briefly. */
const CACHE_CONTROL = 'public, max-age=60, stale-while-revalidate=300';

export const institutionsRouter = Router();

/**
 * GET /api/institutions?q=lic&limit=20
 * Typeahead search for the institution selector. Capped at `limit` rows.
 */
institutionsRouter.get('/', async (req, res) => {
  const parsed = searchQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_query', issues: parsed.error.issues });
    return;
  }
  const { q, limit } = parsed.data;

  const rows: InstitutionSummary[] = await db('institutions as i')
    .select('i.id', 'i.name', 'i.type', 'i.raion_id as raionId', 'i.locality')
    // Counted per returned row only, straight from the documents index.
    .select(
      db.raw(
        '(SELECT count(*)::int FROM documents d WHERE d.institution_id = i.id) AS "documentCount"',
      ),
    )
    .modify((qb) => {
      if (q) qb.whereILike('i.name', `%${likeEscape(q)}%`);
    })
    .orderBy('i.name')
    .limit(limit);

  const body: InstitutionSearchResponse = { data: rows };
  res.set('Cache-Control', CACHE_CONTROL).json(body);
});

/**
 * GET /api/institutions/:id/documents?page=1&pageSize=12
 * One page of an institution's documents, newest first. Never returns more
 * than PAGE_SIZE_MAX rows, however many documents the institution has.
 */
institutionsRouter.get('/:id/documents', async (req, res) => {
  const params = idParam.safeParse(req.params);
  const query = pageQuery.safeParse(req.query);
  if (!params.success || !query.success) {
    res.status(400).json({ error: 'invalid_request' });
    return;
  }
  const { id } = params.data;
  const { page, pageSize } = query.data;

  const institution: InstitutionRef | undefined = await db('institutions')
    .select('id', 'name', 'locality')
    .where({ id })
    .first();
  if (!institution) {
    res.status(404).json({ error: 'institution_not_found' });
    return;
  }

  // The count and the page run concurrently. Both are answered from
  // documents_institution_published_idx: no sequential scan, no sort step.
  const [countRow, rows] = await Promise.all([
    db('documents').where({ institution_id: id }).first(db.raw('count(*)::int AS total')),
    db('documents')
      .where({ institution_id: id })
      .select(
        'id',
        'title',
        'doc_type as type',
        'category',
        'number',
        db.raw(`to_char(published_at, 'YYYY-MM-DD') AS "publishedAt"`),
        'pages',
        'size_kb as sizeKb',
        'file_url as fileUrl',
      )
      .orderBy([
        { column: 'published_at', order: 'desc' },
        { column: 'id', order: 'desc' },
      ])
      .limit(pageSize)
      .offset((page - 1) * pageSize),
  ]);

  const total: number = countRow?.total ?? 0;
  const body: InstitutionDocumentsResponse = {
    institution,
    data: rows as DocumentItem[],
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
  res.set('Cache-Control', CACHE_CONTROL).json(body);
});
