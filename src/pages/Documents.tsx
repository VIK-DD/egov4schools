import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DOC_CATEGORIES, DOC_TYPES, DOCUMENTS, type MecDocument } from '../data/documents';
import { raionById } from '../data/sample';
import { useI18n } from '../i18n';
import { cn } from '../lib/cn';

const PAGE_SIZE = 8;
const SORTS = ['new', 'old', 'title'] as const;
type Sort = (typeof SORTS)[number];

/** Case- and diacritic-insensitive: "sedinta" matches "ședință". */
const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

const YEARS = [...new Set(DOCUMENTS.map((d) => Number(d.date.slice(0, 4))))].sort((a, b) => b - a);

function haystack(d: MecDocument): string {
  return fold([d.title, d.number ?? '', ...d.tags, raionById(d.raionId)?.name ?? ''].join(' '));
}

export default function Documents() {
  const { t, fmt, locale } = useI18n();
  const [params, setParams] = useSearchParams();

  // Every filter lives in the URL, so a filtered list can be shared.
  const q = params.get('q') ?? '';
  const type = DOC_TYPES.find((x) => x === params.get('tip')) ?? null;
  const category = DOC_CATEGORIES.find((x) => x === params.get('domeniu')) ?? null;
  const year = YEARS.find((y) => String(y) === params.get('an')) ?? null;
  const sort: Sort = SORTS.find((s) => s === params.get('sort')) ?? 'new';
  const requestedPage = Math.max(1, Number(params.get('p')) || 1);

  const set = (patch: Record<string, string | null>, keepPage = false) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(patch)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        if (!keepPage) next.delete('p');
        return next;
      },
      { replace: true },
    );

  const results = useMemo(() => {
    const needle = fold(q.trim());
    const list = DOCUMENTS.filter(
      (d) =>
        (!type || d.type === type) &&
        (!category || d.category === category) &&
        (!year || d.date.startsWith(String(year))) &&
        (!needle || haystack(d).includes(needle)),
    );
    return list.sort((a, b) =>
      sort === 'title'
        ? a.title.localeCompare(b.title, locale)
        : sort === 'old'
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date),
    );
  }, [q, type, category, year, sort, locale]);

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pages);
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = Boolean(q || type || category || year);

  return (
    <div className="space-y-6">
      <header className="pt-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t('docs.title')}</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">{t('docs.lead')}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside
          aria-label={t('docs.filters')}
          className="glass h-fit space-y-4 rounded-2xl p-4 lg:sticky lg:top-24"
        >
          <h2 className="text-sm font-semibold">{t('docs.filters')}</h2>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-2">{t('docs.type')}</span>
            <select
              className="field"
              value={type ?? ''}
              onChange={(e) => set({ tip: e.target.value })}
            >
              <option value="">{t('docs.any')}</option>
              {DOC_TYPES.map((x) => (
                <option key={x} value={x}>
                  {t(`doctype.${x}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-2">{t('docs.category')}</span>
            <select
              className="field"
              value={category ?? ''}
              onChange={(e) => set({ domeniu: e.target.value })}
            >
              <option value="">{t('docs.any')}</option>
              {DOC_CATEGORIES.map((x) => (
                <option key={x} value={x}>
                  {t(`cat.${x}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-2">{t('docs.year')}</span>
            <select
              className="field"
              value={year ?? ''}
              onChange={(e) => set({ an: e.target.value })}
            >
              <option value="">{t('docs.any')}</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={!hasFilters}
            onClick={() => set({ q: null, tip: null, domeniu: null, an: null })}
            className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm font-medium hover:bg-surface-3/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('docs.reset')}
          </button>
        </aside>

        <section className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1">
              <span className="sr-only">{t('docs.searchLabel')}</span>
              <input
                type="search"
                className="field"
                placeholder={t('docs.search')}
                value={q}
                onChange={(e) => set({ q: e.target.value })}
              />
            </label>
            <label className="sm:w-48">
              <span className="mb-1 block text-xs text-ink-2">{t('docs.sort')}</span>
              <select
                className="field"
                value={sort}
                onChange={(e) => set({ sort: e.target.value === 'new' ? null : e.target.value })}
              >
                {SORTS.map((s) => (
                  <option key={s} value={s}>
                    {t(`docs.sort.${s}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p aria-live="polite" className="text-sm text-ink-2">
            {t('docs.results', { n: results.length })}
          </p>

          {visible.length === 0 ? (
            <p className="panel rounded-2xl p-8 text-center text-sm text-ink-2">
              {t('docs.empty')}
            </p>
          ) : (
            <ul className="panel divide-y divide-line overflow-hidden rounded-2xl">
              {visible.map((d) => {
                const raion = raionById(d.raionId);
                return (
                  <li key={d.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
                    <span
                      aria-hidden
                      className="w-fit shrink-0 rounded bg-[#c62828] px-1.5 py-0.5 text-2xs font-bold text-white"
                    >
                      PDF
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium leading-snug">{d.title}</h3>
                      <p className="mt-1 text-xs text-ink-2">
                        {[
                          t(`doctype.${d.type}`),
                          d.number && t('docs.number', { n: d.number }),
                          fmt.date(d.date),
                          t('docs.pages', { n: d.pages }),
                          fmt.size(d.sizeKb),
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-1.5 text-2xs">
                        <li className="rounded-full bg-brand-soft px-2 py-0.5 font-medium text-brand-ink">
                          {t(`cat.${d.category}`)}
                        </li>
                        {raion && (
                          <li className="rounded-full border border-line px-2 py-0.5">
                            {raion.name}
                          </li>
                        )}
                        {d.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-line px-2 py-0.5 text-ink-2"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="button"
                      disabled
                      title={t('docs.demoFile')}
                      className="shrink-0 rounded-lg border border-line-strong px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t('docs.download')}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {pages > 1 && (
            <nav
              aria-label={t('docs.pagination')}
              className="flex flex-wrap items-center justify-center gap-1 text-sm"
            >
              <button
                type="button"
                disabled={page === 1}
                onClick={() => set({ p: String(page - 1) }, true)}
                className="rounded-lg px-3 py-1.5 hover:bg-surface-3/60 disabled:opacity-40"
              >
                ← {t('docs.prev')}
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={t('docs.page', { n })}
                  aria-current={n === page ? 'page' : undefined}
                  onClick={() => set({ p: n === 1 ? null : String(n) }, true)}
                  className={cn(
                    'min-w-9 rounded-lg px-3 py-1.5 tabular-nums',
                    n === page ? 'bg-brand text-white' : 'hover:bg-surface-3/60',
                  )}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={page === pages}
                onClick={() => set({ p: String(page + 1) }, true)}
                className="rounded-lg px-3 py-1.5 hover:bg-surface-3/60 disabled:opacity-40"
              >
                {t('docs.next')} →
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
