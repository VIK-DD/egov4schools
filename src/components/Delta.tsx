import { cn } from '../lib/cn';

/**
 * A change marker. Direction is carried by the arrow and the signed text, so
 * the colour is never the only signal.
 */
export function Delta({ value, text }: { value: number; text: string }) {
  const dir = value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
  return (
    <span
      className={cn(
        'font-medium tabular-nums',
        dir === 'up' && 'text-positive',
        dir === 'down' && 'text-danger-ink',
        dir === 'flat' && 'text-ink-2',
      )}
    >
      <span aria-hidden>{dir === 'up' ? '▲' : dir === 'down' ? '▼' : '■'}</span> {text}
    </span>
  );
}
