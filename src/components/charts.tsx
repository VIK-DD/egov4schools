import { useRef, useState, type PointerEvent } from 'react';
import { useI18n } from '../i18n';

/** Tiny trend line for a stat tile. Decorative: the tile states the number. */
export function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${26 - ((v - min) / span) * 22}`)
    .join(' ');
  return (
    <svg
      viewBox="0 0 100 28"
      preserveAspectRatio="none"
      className="mt-3 block h-7 w-full"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--chart-1)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export interface Series {
  key: string;
  label: string;
  color: string;
  values: number[];
}

const W = 640;
const H = 240;
const PAD = { top: 16, right: 96, bottom: 30, left: 40 };

/**
 * Multi-series line chart: 2px lines, recessive grid, direct end labels,
 * crosshair + tooltip on hover, and a data table for keyboard/screen readers.
 */
export function TrendChart({
  labels,
  series,
  format,
  title,
}: {
  labels: string[];
  series: Series[];
  format: (n: number) => string;
  title: string;
}) {
  const { t } = useI18n();
  const [active, setActive] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const all = series.flatMap((s) => s.values);
  const lo = Math.max(0, Math.floor((Math.min(...all) - 4) / 10) * 10);
  const hi = Math.min(100, Math.ceil((Math.max(...all) + 4) / 10) * 10);
  const last = labels.length - 1;
  const step = (W - PAD.left - PAD.right) / Math.max(1, last);
  const x = (i: number) => PAD.left + i * step;
  const y = (v: number) => PAD.top + ((hi - v) / (hi - lo)) * (H - PAD.top - PAD.bottom);
  const ticks: number[] = [];
  for (let v = lo; v <= hi; v += 10) ticks.push(v);

  // Direct labels at the line ends, nudged apart when they would collide.
  const ends = series.map((s) => ({ s, y: y(s.values[last] ?? lo) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) {
    const prev = ends[i - 1]!;
    const cur = ends[i]!;
    if (cur.y - prev.y < 16) cur.y = prev.y + 16;
  }

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * W;
    setActive(Math.min(last, Math.max(0, Math.round((px - PAD.left) / step))));
  };

  const tipLeft = active === null ? 0 : Math.min(85, Math.max(15, (x(active) / W) * 100));

  return (
    <figure className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full touch-none select-none"
        role="img"
        aria-label={title}
        onPointerMove={onMove}
        onPointerLeave={() => setActive(null)}
      >
        {ticks.map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="var(--color-line)" />
            <text
              x={PAD.left - 8}
              y={y(v)}
              dy="0.32em"
              textAnchor="end"
              fontSize={11}
              fill="var(--color-ink-3)"
            >
              {v}%
            </text>
          </g>
        ))}
        {labels.map((label, i) => (
          <text
            key={label}
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            fontSize={11}
            fill="var(--color-ink-3)"
          >
            {label}
          </text>
        ))}
        {active !== null && (
          <line
            x1={x(active)}
            x2={x(active)}
            y1={PAD.top}
            y2={H - PAD.bottom}
            stroke="var(--color-ink-3)"
            strokeDasharray="3 3"
          />
        )}
        {series.map((s) => (
          <polyline
            key={s.key}
            points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        {active !== null &&
          series.map((s) => {
            const v = s.values[active];
            return v === undefined ? null : (
              <circle
                key={s.key}
                cx={x(active)}
                cy={y(v)}
                r={4.5}
                fill={s.color}
                stroke="var(--color-surface)"
                strokeWidth={2}
              />
            );
          })}
        {ends.map(({ s, y: ly }) => (
          <text
            key={s.key}
            x={x(last) + 10}
            y={ly}
            dy="0.32em"
            fontSize={12}
            fill="var(--color-ink-2)"
          >
            <tspan fontWeight={600} fill="var(--color-ink)">
              {format(s.values[last] ?? 0)}
            </tspan>{' '}
            {s.label}
          </text>
        ))}
      </svg>

      {active !== null && (
        <div
          aria-hidden
          className="glass pointer-events-none absolute top-1 z-10 min-w-36 -translate-x-1/2 rounded-lg px-3 py-2 text-xs"
          style={{ left: `${tipLeft}%` }}
        >
          <div className="mb-1 font-semibold">{labels[active]}</div>
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <span className="h-0.5 w-3 rounded" style={{ background: s.color }} />
              <span className="text-ink-2">{s.label}</span>
              <span className="ml-auto font-medium tabular-nums">
                {format(s.values[active] ?? 0)}
              </span>
            </div>
          ))}
        </div>
      )}

      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-brand-ink">{t('trend.showData')}</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left tabular-nums">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="border-b border-line text-xs text-ink-2">
                <th scope="col" className="py-1.5 pr-4 font-medium">
                  {t('trend.year')}
                </th>
                {series.map((s) => (
                  <th key={s.key} scope="col" className="py-1.5 pr-4 font-medium">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {labels.map((label, i) => (
                <tr key={label} className="border-b border-line last:border-0">
                  <th scope="row" className="py-1.5 pr-4 font-normal">
                    {label}
                  </th>
                  {series.map((s) => (
                    <td key={s.key} className="py-1.5 pr-4">
                      {format(s.values[i] ?? 0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
