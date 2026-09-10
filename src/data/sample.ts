/**
 * ILLUSTRATIVE SAMPLE DATA.
 *
 * Every number here is synthetic, generated deterministically so the UI can be
 * built and reviewed before the MEC/ANCE import exists. The UI shows a banner
 * saying so. Replace this module with the real API client; keep the shapes.
 */

export interface Raion {
  id: string;
  name: string;
  /** Shorter label for the tile map, where space is tight. */
  short?: string;
  /** Position on the schematic tile map (roughly north→south, west→east). */
  col: number;
  row: number;
}

export const RAIONS: readonly Raion[] = [
  { id: 'briceni', name: 'Briceni', col: 1, row: 0 },
  { id: 'ocnita', name: 'Ocnița', col: 2, row: 0 },
  { id: 'edinet', name: 'Edineț', col: 1, row: 1 },
  { id: 'donduseni', name: 'Dondușeni', col: 2, row: 1 },
  { id: 'soroca', name: 'Soroca', col: 3, row: 1 },
  { id: 'riscani', name: 'Rîșcani', col: 1, row: 2 },
  { id: 'drochia', name: 'Drochia', col: 2, row: 2 },
  { id: 'floresti', name: 'Florești', col: 3, row: 2 },
  { id: 'glodeni', name: 'Glodeni', col: 0, row: 3 },
  { id: 'balti', name: 'Bălți (mun.)', short: 'Bălți', col: 1, row: 3 },
  { id: 'singerei', name: 'Sîngerei', col: 2, row: 3 },
  { id: 'soldanesti', name: 'Șoldănești', col: 3, row: 3 },
  { id: 'rezina', name: 'Rezina', col: 4, row: 3 },
  { id: 'falesti', name: 'Fălești', col: 0, row: 4 },
  { id: 'ungheni', name: 'Ungheni', col: 1, row: 4 },
  { id: 'telenesti', name: 'Telenești', col: 2, row: 4 },
  { id: 'orhei', name: 'Orhei', col: 3, row: 4 },
  { id: 'nisporeni', name: 'Nisporeni', col: 0, row: 5 },
  { id: 'calarasi', name: 'Călărași', col: 1, row: 5 },
  { id: 'straseni', name: 'Strășeni', col: 2, row: 5 },
  { id: 'criuleni', name: 'Criuleni', col: 3, row: 5 },
  { id: 'dubasari', name: 'Dubăsari', col: 4, row: 5 },
  { id: 'hincesti', name: 'Hîncești', col: 1, row: 6 },
  { id: 'ialoveni', name: 'Ialoveni', col: 2, row: 6 },
  { id: 'chisinau', name: 'Chișinău (mun.)', short: 'Chișinău', col: 3, row: 6 },
  { id: 'anenii-noi', name: 'Anenii Noi', col: 4, row: 6 },
  { id: 'leova', name: 'Leova', col: 1, row: 7 },
  { id: 'cimislia', name: 'Cimișlia', col: 2, row: 7 },
  { id: 'causeni', name: 'Căușeni', col: 3, row: 7 },
  { id: 'stefan-voda', name: 'Ștefan Vodă', short: 'Șt. Vodă', col: 4, row: 7 },
  { id: 'cantemir', name: 'Cantemir', col: 0, row: 8 },
  { id: 'gagauzia', name: 'UTA Găgăuzia', short: 'Găgăuzia', col: 1, row: 8 },
  { id: 'basarabeasca', name: 'Basarabeasca', short: 'Basarab.', col: 2, row: 8 },
  { id: 'cahul', name: 'Cahul', col: 0, row: 9 },
  { id: 'taraclia', name: 'Taraclia', col: 1, row: 9 },
];

export const YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;
export type Year = (typeof YEARS)[number];
export const LATEST_YEAR: Year = 2026;

export function isYear(value: number): value is Year {
  return (YEARS as readonly number[]).includes(value);
}

/** School year label: BAC session 2026 belongs to school year 2025–2026. */
export function schoolYear(year: number): string {
  return `${year - 1}–${year}`;
}

export function raionById(id: string | null): Raion | undefined {
  return id ? RAIONS.find((r) => r.id === id) : undefined;
}

export interface Stats {
  schools: number;
  students: number;
  candidates: number;
  passRate: number;
  urbanPass: number;
  ruralPass: number;
  meanGrade: number;
}

/** Stable pseudo-random number in [0, 1) for a key (FNV-1a). */
function unit(key: string): number {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10000) / 10000;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round1 = (v: number) => Math.round(v * 10) / 10;
const round2 = (v: number) => Math.round(v * 100) / 100;

const BASE_PASS: Record<string, number> = { chisinau: 81, balti: 77 };
const BASE_SIZE: Record<string, number> = { chisinau: 226, balti: 41 };
const PER_SCHOOL: Record<string, number> = { chisinau: 440, balti: 360 };

export function raionStats(id: string, year: Year): Stats {
  const t = year - YEARS[0];
  const base = BASE_PASS[id] ?? 60 + unit(id) * 15;
  const pass = clamp(
    base + t * (0.4 + unit(`${id}:slope`)) + (unit(`${id}:${year}`) - 0.5) * 3,
    50,
    95,
  );
  const size = BASE_SIZE[id] ?? Math.round(20 + unit(`${id}:size`) * 28);
  const schools = size - Math.round(t * (id === 'chisinau' ? 2.4 : unit(`${id}:close`) * 0.9));
  const perSchool = PER_SCHOOL[id] ?? 190 + unit(`${id}:ps`) * 70;
  const students = Math.round(schools * perSchool * (1 - t * 0.012));
  return {
    schools,
    students,
    candidates: Math.round(students * 0.058),
    passRate: round1(pass),
    urbanPass: round1(clamp(pass + 3 + unit(`${id}:u`) * 3, 50, 98)),
    ruralPass: round1(clamp(pass - 4 - unit(`${id}:r`) * 4, 40, 95)),
    meanGrade: round2(5.7 + ((pass - 50) / 45) * 2.1),
  };
}

/** Stats for one raion, or the national aggregate when raionId is null. */
export function stats(year: Year, raionId: string | null): Stats {
  if (raionId) return raionStats(raionId, year);
  const all = RAIONS.map((r) => raionStats(r.id, year));
  const sum = (pick: (s: Stats) => number) => all.reduce((acc, s) => acc + pick(s), 0);
  const candidates = sum((s) => s.candidates);
  const weighted = (pick: (s: Stats) => number) => sum((s) => pick(s) * s.candidates) / candidates;
  return {
    schools: sum((s) => s.schools),
    students: sum((s) => s.students),
    candidates,
    passRate: round1(weighted((s) => s.passRate)),
    urbanPass: round1(weighted((s) => s.urbanPass)),
    ruralPass: round1(weighted((s) => s.ruralPass)),
    meanGrade: round2(weighted((s) => s.meanGrade)),
  };
}

export function history(raionId: string | null, upTo: Year = LATEST_YEAR) {
  return YEARS.filter((y) => y <= upTo).map((year) => ({ year, stats: stats(year, raionId) }));
}
