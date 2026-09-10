import { Link, NavLink } from 'react-router-dom';
import { useI18n, type Lang, type TKey } from '../i18n';
import { cn } from '../lib/cn';
import { useTheme } from '../lib/theme';

const LINKS: { to: string; key: TKey }[] = [
  { to: '/', key: 'nav.dashboard' },
  { to: '/statistici', key: 'nav.statistics' },
  { to: '/documente', key: 'nav.documents' },
  { to: '/scoli', key: 'nav.schools' },
];

const LANGS: Lang[] = ['ro', 'ru'];

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const themeLabel = theme === 'dark' ? t('theme.toLight') : t('theme.toDark');

  return (
    <header className="sticky top-3 z-40 mx-auto w-full max-w-7xl px-4">
      <div className="glass flex items-center gap-2 rounded-2xl px-3 py-2 sm:gap-3 sm:px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-lg bg-brand text-2xs font-bold text-white"
          >
            e4S
          </span>
          <span className="hidden md:inline">eGov4Schools</span>
        </Link>

        <nav aria-label={t('nav.menu')} className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {LINKS.map(({ to, key }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-brand-soft font-medium text-brand-ink'
                    : 'text-ink-2 hover:bg-surface-3/60 hover:text-ink',
                )
              }
            >
              {t(key)}
            </NavLink>
          ))}
        </nav>

        <div
          role="group"
          aria-label={t('lang.label')}
          className="flex shrink-0 rounded-lg border border-line p-0.5 text-xs font-medium"
        >
          {LANGS.map((code) => (
            <button
              key={code}
              type="button"
              lang={code}
              aria-pressed={lang === code}
              onClick={() => setLang(code)}
              className={cn(
                'rounded-md px-2 py-1 uppercase',
                lang === code ? 'bg-brand text-white' : 'text-ink-2 hover:text-ink',
              )}
            >
              {code}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-label={themeLabel}
          title={themeLabel}
          className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-ink-2 hover:text-ink"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {theme === 'dark' ? (
              <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </>
            ) : (
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mx-auto w-full max-w-7xl px-4 pb-8">
      <div className="border-t border-line pt-6 text-xs leading-relaxed text-ink-2">
        <p>{t('footer.source')}</p>
        <p className="mt-1">eGov4Schools · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}

/** Decorative colour blobs behind the glass. Hidden from assistive tech. */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="blob"
        style={{
          top: '-14rem',
          left: '-10rem',
          width: '38rem',
          height: '38rem',
          background: 'var(--blob-1)',
        }}
      />
      <div
        className="blob"
        style={{
          top: '30%',
          right: '-12rem',
          width: '32rem',
          height: '32rem',
          background: 'var(--blob-2)',
        }}
      />
      <div
        className="blob"
        style={{
          bottom: '-12rem',
          left: '30%',
          width: '34rem',
          height: '34rem',
          background: 'var(--blob-3)',
        }}
      />
    </div>
  );
}

export function DemoBanner() {
  const { t } = useI18n();
  return (
    <p className="mb-6 flex items-start gap-2 rounded-xl border border-line bg-warn-soft px-4 py-2.5 text-sm text-warn-ink">
      <span aria-hidden>ⓘ</span>
      {t('demo.banner')}
    </p>
  );
}
