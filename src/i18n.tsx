import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Lang = 'ro' | 'ru';

const ro = {
  'nav.dashboard': 'Panou',
  'nav.statistics': 'Statistici',
  'nav.documents': 'Documente MEC',
  'nav.schools': 'Școli',
  'nav.menu': 'Navigare principală',
  'nav.skip': 'Sari la conținut',
  'theme.toDark': 'Activează modul întunecat',
  'theme.toLight': 'Activează modul luminos',
  'lang.label': 'Limba interfeței',
  'demo.banner':
    'Date demonstrative: cifrele și documentele de pe acest site sunt exemple, nu date oficiale MEC/ANCE.',
  'home.title': 'Educația în Republica Moldova, în cifre',
  'home.lead':
    'Indicatori despre instituții, elevi și examenul de bacalaureat, alături de documentele oficiale ale Ministerului Educației și Cercetării.',
  'filter.label': 'Filtre pentru panou',
  'filter.year': 'An școlar',
  'filter.area': 'Zona',
  'filter.national': 'Toată țara',
  'filter.advanced': 'Analiză avansată',
  'kpi.label': 'Indicatori principali',
  'kpi.schools': 'Instituții de învățământ',
  'kpi.students': 'Elevi înmatriculați',
  'kpi.pass': 'Promovare BAC',
  'kpi.docs': 'Documente MEC publicate',
  'kpi.vsPrev': 'față de anul precedent',
  'kpi.thisYear': 'în acest an școlar',
  'map.title': 'Promovarea BAC pe raioane',
  'map.view': 'Mod de afișare',
  'map.map': 'Hartă',
  'map.table': 'Tabel',
  'map.hint':
    'Hartă schematică: fiecare pătrat este un raion, așezat aproximativ ca pe hartă. Alege un raion pentru detalii.',
  'map.legend': 'Rata de promovare',
  'table.rank': 'Loc',
  'table.raion': 'Raion',
  'table.schools': 'Instituții',
  'table.pass': 'Promovare',
  'table.mean': 'Media',
  'table.delta': 'Față de media națională',
  'detail.national': 'Media națională',
  'detail.top': 'Cele mai mari rate de promovare',
  'detail.back': 'Înapoi la nivel național',
  'detail.meanGrade': 'Media generală BAC',
  'detail.candidates': 'Candidați BAC',
  'detail.compare': 'Comparativ cu media națională',
  'detail.schoolsLink': 'Școlile din raion',
  'trend.title': 'Evoluția promovării BAC',
  'trend.urban': 'Urban',
  'trend.rural': 'Rural',
  'trend.showData': 'Vezi datele',
  'trend.year': 'An',
  'docs.recent': 'Documente MEC recente',
  'docs.all': 'Toate documentele',
  'docs.title': 'Documente MEC',
  'docs.lead':
    'Ordine, circulare, ghiduri și regulamente publicate de Ministerul Educației și Cercetării.',
  'docs.search': 'Caută după titlu, număr sau cuvânt-cheie',
  'docs.searchLabel': 'Caută documente',
  'docs.type': 'Tip document',
  'docs.category': 'Domeniu',
  'docs.year': 'An',
  'docs.any': 'Toate',
  'docs.sort': 'Sortare',
  'docs.sort.new': 'Cele mai noi',
  'docs.sort.old': 'Cele mai vechi',
  'docs.sort.title': 'Titlu (A–Z)',
  'docs.reset': 'Resetează filtrele',
  'docs.results': '{n} documente',
  'docs.empty': 'Niciun document nu corespunde filtrelor.',
  'docs.download': 'Descarcă PDF',
  'docs.pages': '{n} pagini',
  'docs.number': 'nr. {n}',
  'docs.demoFile': 'Fișier indisponibil în versiunea demonstrativă',
  'docs.filters': 'Filtre',
  'docs.pagination': 'Paginare',
  'docs.prev': 'Anterior',
  'docs.next': 'Următor',
  'docs.page': 'Pagina {n}',
  'doctype.ordin': 'Ordin',
  'doctype.circulara': 'Circulară',
  'doctype.ghid': 'Ghid metodologic',
  'doctype.regulament': 'Regulament',
  'doctype.plan': 'Plan-cadru',
  'cat.bac': 'Examene și BAC',
  'cat.curriculum': 'Curriculum',
  'cat.evaluare': 'Evaluare',
  'cat.management': 'Management școlar',
  'cat.incluziune': 'Educație incluzivă',
  'stub.soon': 'În lucru',
  'schools.title': 'Școli',
  'schools.lead':
    'Catalogul instituțiilor, cu profil, indicatori și documente pentru fiecare școală.',
  'stats.title': 'Statistici',
  'stats.lead':
    'Analiză detaliată cu filtre după an, raion, tip de instituție, limbă de instruire și mediu.',
  'footer.source':
    'Surse: Ministerul Educației și Cercetării, ANCE. Interfață construită pe Modelul Unitar de Design (MUD).',
  notFound: 'Pagina nu a fost găsită.',
  'notFound.home': 'Înapoi la panou',
};

type Key = keyof typeof ro;

const ru: Record<Key, string> = {
  'nav.dashboard': 'Панель',
  'nav.statistics': 'Статистика',
  'nav.documents': 'Документы МОИ',
  'nav.schools': 'Школы',
  'nav.menu': 'Основная навигация',
  'nav.skip': 'Перейти к содержанию',
  'theme.toDark': 'Включить тёмную тему',
  'theme.toLight': 'Включить светлую тему',
  'lang.label': 'Язык интерфейса',
  'demo.banner':
    'Демонстрационные данные: цифры и документы на этом сайте — примеры, а не официальные данные МОИ/ANCE.',
  'home.title': 'Образование в Республике Молдова в цифрах',
  'home.lead':
    'Показатели по учебным заведениям, ученикам и экзамену на степень бакалавра, а также официальные документы Министерства образования и исследований.',
  'filter.label': 'Фильтры панели',
  'filter.year': 'Учебный год',
  'filter.area': 'Территория',
  'filter.national': 'Вся страна',
  'filter.advanced': 'Расширенный анализ',
  'kpi.label': 'Основные показатели',
  'kpi.schools': 'Учебные заведения',
  'kpi.students': 'Зачисленные ученики',
  'kpi.pass': 'Сдали BAC',
  'kpi.docs': 'Опубликованные документы МОИ',
  'kpi.vsPrev': 'по сравнению с прошлым годом',
  'kpi.thisYear': 'в этом учебном году',
  'map.title': 'Сдача BAC по районам',
  'map.view': 'Вид',
  'map.map': 'Карта',
  'map.table': 'Таблица',
  'map.hint':
    'Схематическая карта: каждый квадрат — район, расположенный примерно как на карте. Выберите район для подробностей.',
  'map.legend': 'Доля сдавших',
  'table.rank': 'Место',
  'table.raion': 'Район',
  'table.schools': 'Заведения',
  'table.pass': 'Сдали',
  'table.mean': 'Средний балл',
  'table.delta': 'Отклонение от среднего по стране',
  'detail.national': 'Среднее по стране',
  'detail.top': 'Самая высокая доля сдавших',
  'detail.back': 'Вернуться к данным по стране',
  'detail.meanGrade': 'Средний балл BAC',
  'detail.candidates': 'Кандидаты BAC',
  'detail.compare': 'По сравнению со средним по стране',
  'detail.schoolsLink': 'Школы района',
  'trend.title': 'Динамика сдачи BAC',
  'trend.urban': 'Город',
  'trend.rural': 'Село',
  'trend.showData': 'Показать данные',
  'trend.year': 'Год',
  'docs.recent': 'Последние документы МОИ',
  'docs.all': 'Все документы',
  'docs.title': 'Документы МОИ',
  'docs.lead':
    'Приказы, циркуляры, методические пособия и положения Министерства образования и исследований.',
  'docs.search': 'Поиск по названию, номеру или ключевому слову',
  'docs.searchLabel': 'Поиск документов',
  'docs.type': 'Тип документа',
  'docs.category': 'Область',
  'docs.year': 'Год',
  'docs.any': 'Все',
  'docs.sort': 'Сортировка',
  'docs.sort.new': 'Сначала новые',
  'docs.sort.old': 'Сначала старые',
  'docs.sort.title': 'Название (А–Я)',
  'docs.reset': 'Сбросить фильтры',
  'docs.results': 'Документов: {n}',
  'docs.empty': 'Нет документов, соответствующих фильтрам.',
  'docs.download': 'Скачать PDF',
  'docs.pages': 'Страниц: {n}',
  'docs.number': '№ {n}',
  'docs.demoFile': 'Файл недоступен в демонстрационной версии',
  'docs.filters': 'Фильтры',
  'docs.pagination': 'Страницы',
  'docs.prev': 'Назад',
  'docs.next': 'Далее',
  'docs.page': 'Страница {n}',
  'doctype.ordin': 'Приказ',
  'doctype.circulara': 'Циркуляр',
  'doctype.ghid': 'Методическое пособие',
  'doctype.regulament': 'Положение',
  'doctype.plan': 'Базовый план',
  'cat.bac': 'Экзамены и BAC',
  'cat.curriculum': 'Куррикулум',
  'cat.evaluare': 'Оценивание',
  'cat.management': 'Управление школой',
  'cat.incluziune': 'Инклюзивное образование',
  'stub.soon': 'В разработке',
  'schools.title': 'Школы',
  'schools.lead': 'Каталог учебных заведений с профилем, показателями и документами каждой школы.',
  'stats.title': 'Статистика',
  'stats.lead':
    'Подробный анализ с фильтрами по году, району, типу заведения, языку обучения и среде.',
  'footer.source':
    'Источники: Министерство образования и исследований, ANCE. Интерфейс построен на Едином модуле дизайна (MUD).',
  notFound: 'Страница не найдена.',
  'notFound.home': 'Вернуться на панель',
};

const DICT: Record<Lang, Record<Key, string>> = { ro, ru };
const STORAGE_KEY = 'egov4schools.lang';

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ro' || stored === 'ru') return stored;
  } catch {
    // Storage blocked; default to Romanian.
  }
  return 'ro';
}

const sign = (n: number) => (n > 0 ? '+' : n < 0 ? '−' : '±');

function build(lang: Lang, setLang: (next: Lang) => void) {
  const locale = lang === 'ro' ? 'ro-MD' : 'ru-MD';
  const int = new Intl.NumberFormat(locale);
  const one = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const two = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const date = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return {
    lang,
    locale,
    setLang,
    t(key: Key, vars?: Record<string, string | number>): string {
      let text = DICT[lang][key];
      if (vars) {
        for (const [name, value] of Object.entries(vars))
          text = text.replace(`{${name}}`, String(value));
      }
      return text;
    },
    fmt: {
      int: (n: number) => int.format(n),
      pct: (n: number) => `${one.format(n)}%`,
      /** Percentage-point difference, e.g. "+2,1 pp". */
      pp: (n: number) => `${sign(n)}${one.format(Math.abs(n))} pp`,
      /** Relative change, e.g. "−1,8%". */
      change: (n: number) => `${sign(n)}${one.format(Math.abs(n))}%`,
      signedInt: (n: number) => `${sign(n)}${int.format(Math.abs(n))}`,
      dec2: (n: number) => two.format(n),
      date: (iso: string) => date.format(new Date(iso)),
      size: (kb: number) => (kb >= 1024 ? `${one.format(kb / 1024)} MB` : `${int.format(kb)} KB`),
    },
  };
}

type I18n = ReturnType<typeof build>;

const I18nContext = createContext<I18n | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Not persisted; the language still applies for this visit.
    }
  }, [lang]);

  const value = useMemo(() => build(lang, setLang), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <LangProvider>');
  return ctx;
}

export type TKey = Key;
