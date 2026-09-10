/**
 * ILLUSTRATIVE SAMPLE DOCUMENTS - not real MEC acts. Titles, numbers and dates
 * are invented so the repository UI can be built before the document store
 * exists. The UI labels every page as demonstrative.
 */

export type DocType = 'ordin' | 'circulara' | 'ghid' | 'regulament' | 'plan';
export type DocCategory = 'bac' | 'curriculum' | 'evaluare' | 'management' | 'incluziune';

export const DOC_TYPES: readonly DocType[] = ['ordin', 'circulara', 'ghid', 'regulament', 'plan'];
export const DOC_CATEGORIES: readonly DocCategory[] = [
  'bac',
  'curriculum',
  'evaluare',
  'management',
  'incluziune',
];

export interface MecDocument {
  id: string;
  title: string;
  type: DocType;
  category: DocCategory;
  number: string | null;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  pages: number;
  sizeKb: number;
  /** Set when the document targets one raion; null for national acts. */
  raionId: string | null;
  tags: string[];
}

export const DOCUMENTS: readonly MecDocument[] = [
  {
    id: 'd01',
    title: 'Cu privire la organizarea examenului de bacalaureat în anul 2027',
    type: 'ordin',
    category: 'bac',
    number: '812',
    date: '2026-09-08',
    pages: 14,
    sizeKb: 612,
    raionId: null,
    tags: ['bacalaureat', 'calendar'],
  },
  {
    id: 'd02',
    title: 'Începutul anului școlar 2026–2027: recomandări pentru instituții',
    type: 'circulara',
    category: 'management',
    number: '04/1-09/3120',
    date: '2026-09-01',
    pages: 6,
    sizeKb: 240,
    raionId: null,
    tags: ['an școlar'],
  },
  {
    id: 'd03',
    title: 'Planul-cadru pentru învățământul primar, gimnazial și liceal, 2026–2027',
    type: 'plan',
    category: 'curriculum',
    number: '735',
    date: '2026-08-28',
    pages: 62,
    sizeKb: 2480,
    raionId: null,
    tags: ['plan-cadru', 'ore'],
  },
  {
    id: 'd04',
    title: 'Ghid metodologic privind evaluarea criterială prin descriptori',
    type: 'ghid',
    category: 'evaluare',
    number: null,
    date: '2026-08-21',
    pages: 48,
    sizeKb: 3120,
    raionId: null,
    tags: ['evaluare criterială', 'clasele primare'],
  },
  {
    id: 'd05',
    title: 'Rezultatele sesiunii de bacalaureat 2026: raport de analiză',
    type: 'circulara',
    category: 'bac',
    number: '04/2-07/2210',
    date: '2026-07-30',
    pages: 36,
    sizeKb: 1850,
    raionId: null,
    tags: ['bacalaureat', 'rezultate'],
  },
  {
    id: 'd06',
    title: 'Regulamentul de organizare a examenelor de absolvire a gimnaziului',
    type: 'regulament',
    category: 'evaluare',
    number: '640',
    date: '2026-06-12',
    pages: 22,
    sizeKb: 980,
    raionId: null,
    tags: ['gimnaziu', 'examene'],
  },
  {
    id: 'd07',
    title: 'Repartizarea centrelor de bacalaureat în municipiul Chișinău',
    type: 'ordin',
    category: 'bac',
    number: 'DGETS-45',
    date: '2026-05-20',
    pages: 9,
    sizeKb: 410,
    raionId: 'chisinau',
    tags: ['centre de examen'],
  },
  {
    id: 'd08',
    title: 'Ghid pentru elaborarea planului educațional individualizat',
    type: 'ghid',
    category: 'incluziune',
    number: null,
    date: '2026-04-15',
    pages: 40,
    sizeKb: 1760,
    raionId: null,
    tags: ['PEI', 'cerințe educaționale speciale'],
  },
  {
    id: 'd09',
    title: 'Regulamentul-tip de organizare și funcționare a instituțiilor de învățământ general',
    type: 'regulament',
    category: 'management',
    number: '235',
    date: '2026-03-02',
    pages: 31,
    sizeKb: 1340,
    raionId: null,
    tags: ['ROF', 'instituții'],
  },
  {
    id: 'd10',
    title: 'Curriculum la disciplina Informatică, clasele X–XII (versiune actualizată)',
    type: 'ghid',
    category: 'curriculum',
    number: null,
    date: '2026-02-10',
    pages: 74,
    sizeKb: 4020,
    raionId: null,
    tags: ['informatică', 'liceu'],
  },
  {
    id: 'd11',
    title: 'Organizarea simulării examenului de bacalaureat în municipiul Bălți',
    type: 'circulara',
    category: 'bac',
    number: 'DÎ-12',
    date: '2026-01-26',
    pages: 4,
    sizeKb: 160,
    raionId: 'balti',
    tags: ['simulare'],
  },
  {
    id: 'd12',
    title: 'Cu privire la aprobarea calendarului evaluărilor naționale 2026',
    type: 'ordin',
    category: 'evaluare',
    number: '1104',
    date: '2025-11-18',
    pages: 8,
    sizeKb: 330,
    raionId: null,
    tags: ['calendar', 'evaluări naționale'],
  },
  {
    id: 'd13',
    title: 'Metodologia de raportare a datelor statistice de către instituții',
    type: 'ghid',
    category: 'management',
    number: null,
    date: '2025-10-07',
    pages: 27,
    sizeKb: 1210,
    raionId: null,
    tags: ['statistică', 'SIME'],
  },
  {
    id: 'd14',
    title: 'Începutul anului școlar 2025–2026: recomandări pentru instituții',
    type: 'circulara',
    category: 'management',
    number: '04/1-09/2980',
    date: '2025-09-01',
    pages: 6,
    sizeKb: 230,
    raionId: null,
    tags: ['an școlar'],
  },
  {
    id: 'd15',
    title: 'Planul-cadru pentru învățământul primar, gimnazial și liceal, 2025–2026',
    type: 'plan',
    category: 'curriculum',
    number: '698',
    date: '2025-08-26',
    pages: 60,
    sizeKb: 2390,
    raionId: null,
    tags: ['plan-cadru', 'ore'],
  },
  {
    id: 'd16',
    title: 'Rezultatele sesiunii de bacalaureat 2025: raport de analiză',
    type: 'circulara',
    category: 'bac',
    number: '04/2-07/2105',
    date: '2025-07-29',
    pages: 34,
    sizeKb: 1790,
    raionId: null,
    tags: ['bacalaureat', 'rezultate'],
  },
  {
    id: 'd17',
    title: 'Suport pentru elevii cu dizabilități la examenele de absolvire',
    type: 'ordin',
    category: 'incluziune',
    number: '512',
    date: '2025-05-14',
    pages: 11,
    sizeKb: 470,
    raionId: null,
    tags: ['acomodări', 'examene'],
  },
  {
    id: 'd18',
    title: 'Optimizarea rețelei școlare în raionul Cahul',
    type: 'ordin',
    category: 'management',
    number: 'DE-31',
    date: '2025-03-19',
    pages: 7,
    sizeKb: 290,
    raionId: 'cahul',
    tags: ['rețea școlară'],
  },
  {
    id: 'd19',
    title: 'Ghid privind siguranța online a elevilor',
    type: 'ghid',
    category: 'management',
    number: null,
    date: '2024-12-03',
    pages: 24,
    sizeKb: 1480,
    raionId: null,
    tags: ['siguranță online'],
  },
  {
    id: 'd20',
    title: 'Cu privire la organizarea examenului de bacalaureat în anul 2025',
    type: 'ordin',
    category: 'bac',
    number: '790',
    date: '2024-09-10',
    pages: 13,
    sizeKb: 590,
    raionId: null,
    tags: ['bacalaureat', 'calendar'],
  },
  {
    id: 'd21',
    title: 'Instruirea cadrelor didactice din raionul Ungheni în evaluarea criterială',
    type: 'circulara',
    category: 'evaluare',
    number: 'DE-08',
    date: '2024-10-22',
    pages: 3,
    sizeKb: 120,
    raionId: 'ungheni',
    tags: ['formare continuă'],
  },
  {
    id: 'd22',
    title: 'Regulamentul privind organizarea educației incluzive în învățământul general',
    type: 'regulament',
    category: 'incluziune',
    number: '418',
    date: '2024-11-12',
    pages: 29,
    sizeKb: 1260,
    raionId: null,
    tags: ['incluziune'],
  },
];

/** A document's BAC year: acts from September onward belong to the next session. */
export function docSchoolYear(doc: MecDocument): number {
  const year = Number(doc.date.slice(0, 4));
  const month = Number(doc.date.slice(5, 7));
  return month >= 9 ? year + 1 : year;
}

/** National acts plus, when a raion is selected, the acts for that raion. Newest first. */
export function documentsForScope(raionId: string | null): MecDocument[] {
  return DOCUMENTS.filter((d) => d.raionId === null || d.raionId === raionId).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}
