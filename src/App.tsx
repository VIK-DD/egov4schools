import { Link, Route, Routes } from 'react-router-dom';
import { Backdrop, DemoBanner, Footer, Header } from './components/Layout';
import { LangProvider, useI18n } from './i18n';
import Documents from './pages/Documents';
import Home from './pages/Home';
import Placeholder from './pages/Placeholder';

export default function App() {
  return (
    <LangProvider>
      <Shell />
    </LangProvider>
  );
}

function Shell() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col">
      <Backdrop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2"
      >
        {t('nav.skip')}
      </a>
      <Header />
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-6">
        <DemoBanner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/documente" element={<Documents />} />
          <Route
            path="/statistici"
            element={<Placeholder titleKey="stats.title" leadKey="stats.lead" />}
          />
          <Route
            path="/scoli"
            element={<Placeholder titleKey="schools.title" leadKey="schools.lead" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  const { t } = useI18n();
  return (
    <section className="glass mx-auto mt-6 max-w-xl rounded-2xl p-8 text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="mt-2 text-ink-2">{t('notFound')}</p>
      <Link to="/" className="mt-4 inline-block text-sm font-medium text-brand-ink hover:underline">
        {t('notFound.home')}
      </Link>
    </section>
  );
}
