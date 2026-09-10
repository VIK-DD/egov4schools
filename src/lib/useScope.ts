import { useSearchParams } from 'react-router-dom';
import { isYear, LATEST_YEAR, raionById, type Year } from '../data/sample';

/**
 * Dashboard scope (year + raion) lives in the URL - `/?an=2025&raion=cahul` -
 * so a filtered view can be bookmarked or shared. Defaults are omitted.
 */
export function useScope() {
  const [params, setParams] = useSearchParams();
  const yearParam = Number(params.get('an'));
  const year: Year = isYear(yearParam) ? yearParam : LATEST_YEAR;
  const raionId = raionById(params.get('raion'))?.id ?? null;

  const update = (patch: Record<string, string | null>) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(patch)) {
          if (value === null) next.delete(key);
          else next.set(key, value);
        }
        return next;
      },
      { replace: true },
    );

  return {
    year,
    raionId,
    setYear: (y: Year) => update({ an: y === LATEST_YEAR ? null : String(y) }),
    setRaion: (id: string | null) => update({ raion: id }),
  };
}
