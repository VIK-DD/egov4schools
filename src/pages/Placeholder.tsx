import { useI18n, type TKey } from '../i18n';

/** Stand-in for sections designed but not built yet. */
export default function Placeholder({ titleKey, leadKey }: { titleKey: TKey; leadKey: TKey }) {
  const { t } = useI18n();
  return (
    <section className="glass mx-auto mt-6 max-w-2xl rounded-2xl p-8 text-center">
      <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-ink">
        {t('stub.soon')}
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{t(titleKey)}</h1>
      <p className="mt-3 leading-relaxed text-ink-2">{t(leadKey)}</p>
    </section>
  );
}
