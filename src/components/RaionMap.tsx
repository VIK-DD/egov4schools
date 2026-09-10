import { Link } from 'react-router-dom';
import { RAIONS, raionById, raionStats, stats, type Year } from '../data/sample';
import { useI18n } from '../i18n';
import { cn } from '../lib/cn';
import { Delta } from './Delta';

/** Sequential scale: one hue (chart-1), light → dark, five bins. */
const THRESHOLDS = [65, 70, 75, 80];
const MIX = [14, 32, 52, 74, 100];
const BIN_LABELS = ['< 65%', '65–70%', '70–75%', '75–80%', '≥ 80%'];

function passBin(rate: number): number {
  let i = 0;
  while (i < THRESHOLDS.length && rate >= THRESHOLDS[i]!) i++;
  return i;
}

const binColor = (bin: number) =>
  `color-mix(in oklab, var(--chart-1) ${MIX[bin]}%, var(--color-surface))`;

interface Props {
  year: Year;
  selected: string | null;
  onSelect: (id: string | null) => void;
}

/**
 * Schematic tile map: one square per raion, placed roughly where it sits on
 * the real map. Tiles are buttons, so the map works with a keyboard; the
 * table view carries the same data for screen readers.
 */
export function RaionTileMap({ year, selected, onSelect }: Props) {
  const { t, fmt } = useI18n();
  return (
    <div>
      <div
        role="group"
        aria-label={t('map.title')}
        className="mx-auto grid max-w-md grid-cols-5 gap-1.5"
      >
        {RAIONS.map((r) => {
          const s = raionStats(r.id, year);
          const bin = passBin(s.passRate);
          const isSelected = selected === r.id;
          const label = `${r.name}: ${fmt.pct(s.passRate)}`;
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={isSelected}
              aria-label={label}
              title={label}
              onClick={() => onSelect(isSelected ? null : r.id)}
              className={cn(
                'flex aspect-[4/3] min-w-0 flex-col justify-between rounded-md p-1.5 text-left transition-transform hover:scale-[1.05] focus-visible:z-10',
                isSelected && 'z-10 ring-2 ring-ink ring-offset-2 ring-offset-surface',
              )}
              style={{
                gridColumn: r.col + 1,
                gridRow: r.row + 1,
                background: binColor(bin),
                color: bin >= 3 ? '#fff' : 'var(--color-ink)',
              }}
            >
              <span className="truncate text-2xs leading-tight">{r.short ?? r.name}</span>
              <span className="text-sm font-semibold tabular-nums">{Math.round(s.passRate)}%</span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-5 max-w-md">
        <p className="mb-1.5 text-xs text-ink-2">{t('map.legend')}</p>
        <ul className="flex gap-0.5 text-2xs text-ink-2">
          {BIN_LABELS.map((label, bin) => (
            <li key={label} className="flex-1">
              <span className="block h-2.5 rounded-sm" style={{ background: binColor(bin) }} />
              <span className="mt-1 block">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function RaionTable({ year, selected, onSelect }: Props) {
  const { t, fmt } = useI18n();
  const national = stats(year, null);
  const rows = RAIONS.map((r) => ({ r, s: raionStats(r.id, year) })).sort(
    (a, b) => b.s.passRate - a.s.passRate,
  );

  return (
    <div className="max-h-[28rem] overflow-auto">
      <table className="w-full text-sm tabular-nums">
        <caption className="sr-only">{t('map.title')}</caption>
        <thead className="sticky top-0 bg-surface text-xs text-ink-2">
          <tr className="border-b border-line">
            <th scope="col" className="px-3 py-2 text-left font-medium">
              {t('table.rank')}
            </th>
            <th scope="col" className="px-3 py-2 text-left font-medium">
              {t('table.raion')}
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              {t('table.schools')}
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              {t('table.pass')}
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              {t('table.mean')}
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              {t('table.delta')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ r, s }, i) => (
            <tr
              key={r.id}
              className={cn(
                'border-b border-line last:border-0',
                selected === r.id && 'bg-brand-soft',
              )}
            >
              <td className="px-3 py-2 text-ink-2">{i + 1}</td>
              <th scope="row" className="px-3 py-2 text-left font-normal">
                <button
                  type="button"
                  onClick={() => onSelect(r.id)}
                  className="text-left text-brand-ink hover:underline"
                >
                  {r.name}
                </button>
              </th>
              <td className="px-3 py-2 text-right">{fmt.int(s.schools)}</td>
              <td className="px-3 py-2 text-right font-medium">{fmt.pct(s.passRate)}</td>
              <td className="px-3 py-2 text-right">{fmt.dec2(s.meanGrade)}</td>
              <td className="px-3 py-2 text-right">
                <Delta
                  value={s.passRate - national.passRate}
                  text={fmt.pp(s.passRate - national.passRate)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Bar({ value, color = 'var(--chart-1)' }: { value: number; color?: string }) {
  return (
    <span className="mt-1 block h-2 rounded-full bg-surface-3">
      <span
        className="block h-full rounded-full"
        style={{ width: `${value}%`, background: color }}
      />
    </span>
  );
}

/** Right-hand panel: national top list, or the selected raion's figures. */
export function RaionPanel({ year, selected, onSelect }: Props) {
  const { t, fmt } = useI18n();
  const national = stats(year, null);
  const raion = raionById(selected);

  if (!raion) {
    const top = RAIONS.map((r) => ({ r, s: raionStats(r.id, year) }))
      .sort((a, b) => b.s.passRate - a.s.passRate)
      .slice(0, 6);
    return (
      <div>
        <h3 className="text-base font-semibold">{t('detail.top')}</h3>
        <ol className="mt-4 space-y-3">
          {top.map(({ r, s }) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onSelect(r.id)}
                className="group block w-full text-left"
              >
                <span className="flex justify-between text-sm">
                  <span className="group-hover:underline">{r.name}</span>
                  <span className="font-medium tabular-nums">{fmt.pct(s.passRate)}</span>
                </span>
                <Bar value={s.passRate} />
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-5 border-t border-line pt-4 text-sm text-ink-2">
          {t('detail.national')}:{' '}
          <strong className="text-ink tabular-nums">{fmt.pct(national.passRate)}</strong>
        </p>
      </div>
    );
  }

  const s = raionStats(raion.id, year);
  const items = [
    { label: t('table.pass'), value: fmt.pct(s.passRate) },
    { label: t('detail.meanGrade'), value: fmt.dec2(s.meanGrade) },
    { label: t('table.schools'), value: fmt.int(s.schools) },
    { label: t('detail.candidates'), value: fmt.int(s.candidates) },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl font-semibold">{raion.name}</h3>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="text-xs text-brand-ink hover:underline"
        >
          ← {t('detail.back')}
        </button>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-2.5">
        {items.map((item) => (
          <div key={item.label} className="panel rounded-xl p-3">
            <dt className="text-xs text-ink-2">{item.label}</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
      <h4 className="mt-5 text-sm font-semibold">{t('detail.compare')}</h4>
      <div className="mt-2 space-y-2.5 text-sm">
        <div>
          <span className="flex justify-between">
            <span>{raion.short ?? raion.name}</span>
            <span className="font-medium tabular-nums">{fmt.pct(s.passRate)}</span>
          </span>
          <Bar value={s.passRate} />
        </div>
        <div>
          <span className="flex justify-between text-ink-2">
            <span>{t('detail.national')}</span>
            <span className="tabular-nums">{fmt.pct(national.passRate)}</span>
          </span>
          <Bar value={national.passRate} color="var(--color-ink-3)" />
        </div>
        <p>
          <Delta
            value={s.passRate - national.passRate}
            text={fmt.pp(s.passRate - national.passRate)}
          />
        </p>
      </div>
      <Link
        to={`/scoli?raion=${raion.id}`}
        className="mt-5 inline-block text-sm font-medium text-brand-ink hover:underline"
      >
        {t('detail.schoolsLink')} →
      </Link>
    </div>
  );
}
