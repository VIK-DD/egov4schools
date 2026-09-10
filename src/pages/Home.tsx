import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Sparkline, TrendChart } from '../components/charts';
import { Delta } from '../components/Delta';
import { RaionPanel, RaionTable, RaionTileMap } from '../components/RaionMap';
import { docSchoolYear, documentsForScope } from '../data/documents';
import { history, RAIONS, schoolYear, YEARS, type Year } from '../data/sample';
import { useI18n } from '../i18n';
import { cn } from '../lib/cn';
import { useScope } from '../lib/useScope';

const RAIONS_BY_NAME = [...RAIONS].sort((a, b) => a.name.localeCompare(b.name, 'ro'));

function KpiCard({
  label,
  value,
  detail,
  spark,
}: {
  label: string;
  value: string;
  detail: ReactNode;
  spark: number[];
}) {
  return (
    <article className="glass rounded-2xl p-4">
      <h2 className="text-xs font-medium text-ink-2">{label}</h2>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-ink-2">{detail}</p>
      <Sparkline values={spark} />
    </article>
  );
}

export default function Home() {
  const { t, fmt } = useI18n();
  const { year, raionId, setYear, setRaion } = useScope();
  const [view, setView] = useState<'map' | 'table'>('map');

  const hist = history(raionId, year);
  const now = hist[hist.length - 1]!.stats;
  const prev = hist.length > 1 ? hist[hist.length - 2]!.stats : null;

  const docs = documentsForScope(raionId).filter((d) => docSchoolYear(d) <= year);
  const docsThisYear = docs.filter((d) => docSchoolYear(d) === year).length;
  const recent = docs.slice(0, 5);

  const vsPrev = (node: ReactNode) =>
    prev ? (
      <>
        {node} {t('kpi.vsPrev')}
      </>
    ) : (
      schoolYear(year)
    );

  return (
    <div className="space-y-6">
      {/* Hero + global filter bar: scopes every section below. */}
      <section className="pt-2">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {t('home.title')}
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">{t('home.lead')}</p>

        <div
          role="group"
          aria-label={t('filter.label')}
          className="glass mt-6 flex flex-wrap items-end gap-3 rounded-2xl p-3"
        >
          <label className="w-full sm:w-44">
            <span className="mb-1 block text-xs text-ink-2">{t('filter.year')}</span>
            <select
              className="field"
              value={year}
              onChange={(e) => setYear(Number(e.target.value) as Year)}
            >
              {[...YEARS].reverse().map((y) => (
                <option key={y} value={y}>
                  {schoolYear(y)}
                </option>
              ))}
            </select>
          </label>
          <label className="w-full sm:w-56">
            <span className="mb-1 block text-xs text-ink-2">{t('filter.area')}</span>
            <select
              className="field"
              value={raionId ?? ''}
              onChange={(e) => setRaion(e.target.value || null)}
            >
              <option value="">{t('filter.national')}</option>
              {RAIONS_BY_NAME.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <Link
            to="/statistici"
            className="ml-auto self-center text-sm font-medium text-brand-ink hover:underline"
          >
            {t('filter.advanced')} →
          </Link>
        </div>
      </section>

      {/* KPI band */}
      <section
        aria-label={t('kpi.label')}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <KpiCard
          label={t('kpi.schools')}
          value={fmt.int(now.schools)}
          spark={hist.map((h) => h.stats.schools)}
          detail={vsPrev(
            prev && (
              <Delta
                value={now.schools - prev.schools}
                text={fmt.signedInt(now.schools - prev.schools)}
              />
            ),
          )}
        />
        <KpiCard
          label={t('kpi.students')}
          value={fmt.int(now.students)}
          spark={hist.map((h) => h.stats.students)}
          detail={vsPrev(
            prev && (
              <Delta
                value={now.students - prev.students}
                text={fmt.change(((now.students - prev.students) / prev.students) * 100)}
              />
            ),
          )}
        />
        <KpiCard
          label={t('kpi.pass')}
          value={fmt.pct(now.passRate)}
          spark={hist.map((h) => h.stats.passRate)}
          detail={vsPrev(
            prev && (
              <Delta
                value={now.passRate - prev.passRate}
                text={fmt.pp(now.passRate - prev.passRate)}
              />
            ),
          )}
        />
        <KpiCard
          label={t('kpi.docs')}
          value={fmt.int(docs.length)}
          spark={hist.map(
            (h) => documentsForScope(raionId).filter((d) => docSchoolYear(d) <= h.year).length,
          )}
          detail={
            <>
              <Delta value={docsThisYear} text={fmt.signedInt(docsThisYear)} /> {t('kpi.thisYear')}
            </>
          }
        />
      </section>

      {/* Raion map / table + detail panel */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="glass rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              {t('map.title')} · {schoolYear(year)}
            </h2>
            <div
              role="group"
              aria-label={t('map.view')}
              className="flex rounded-lg border border-line p-0.5 text-sm"
            >
              {(['map', 'table'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    'rounded-md px-3 py-1',
                    view === v ? 'bg-brand text-white' : 'text-ink-2 hover:text-ink',
                  )}
                >
                  {t(v === 'map' ? 'map.map' : 'map.table')}
                </button>
              ))}
            </div>
          </div>
          <p className="mb-5 mt-1 text-xs text-ink-2">{t('map.hint')}</p>
          {view === 'map' ? (
            <RaionTileMap year={year} selected={raionId} onSelect={setRaion} />
          ) : (
            <div className="panel overflow-hidden rounded-xl">
              <RaionTable year={year} selected={raionId} onSelect={setRaion} />
            </div>
          )}
        </div>
        <div className="glass rounded-2xl p-5">
          <RaionPanel year={year} selected={raionId} onSelect={setRaion} />
        </div>
      </section>

      {/* Trend + recent documents */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="glass rounded-2xl p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{t('trend.title')}</h2>
            <ul className="flex gap-4 text-xs text-ink-2">
              {[
                { label: t('trend.urban'), color: 'var(--chart-1)' },
                { label: t('trend.rural'), color: 'var(--chart-2)' },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded" style={{ background: item.color }} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
          <TrendChart
            title={t('trend.title')}
            labels={hist.map((h) => String(h.year))}
            format={fmt.pct}
            series={[
              {
                key: 'urban',
                label: t('trend.urban'),
                color: 'var(--chart-1)',
                values: hist.map((h) => h.stats.urbanPass),
              },
              {
                key: 'rural',
                label: t('trend.rural'),
                color: 'var(--chart-2)',
                values: hist.map((h) => h.stats.ruralPass),
              },
            ]}
          />
        </div>

        <div className="panel rounded-2xl p-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{t('docs.recent')}</h2>
            <Link to="/documente" className="text-sm text-brand-ink hover:underline">
              {t('docs.all')} →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="py-6 text-sm text-ink-2">{t('docs.empty')}</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((d) => (
                <li key={d.id} className="flex items-start gap-3 py-3">
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 rounded bg-[#c62828] px-1.5 py-0.5 text-2xs font-bold text-white"
                  >
                    PDF
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug">{d.title}</p>
                    <p className="mt-0.5 text-xs text-ink-2">
                      {t(`doctype.${d.type}`)} · {fmt.date(d.date)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
