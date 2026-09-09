import { useEffect, useRef } from 'react';

/**
 * React 19 forwards props to custom elements, but it does not bind custom
 * events — there is no `onMudChange` prop. This attaches the listener
 * imperatively and returns a ref to put on the element.
 *
 *   const ref = useCustomEvent<HTMLMudInputElement, { value: string }>(
 *     'mudChange',
 *     (detail) => setValue(detail.value),
 *   );
 *   return <mud-input ref={ref} />;
 *
 * The handler is held in a ref so that passing an inline arrow function does
 * not detach and re-attach the listener on every render.
 */
export function useCustomEvent<E extends EventTarget, D = unknown>(
  eventName: string,
  handler: (detail: D, event: CustomEvent<D>) => void,
) {
  const ref = useRef<E>(null);
  const saved = useRef(handler);

  useEffect(() => {
    saved.current = handler;
  }, [handler]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const listener = (event: Event) => {
      const custom = event as CustomEvent<D>;
      saved.current(custom.detail, custom);
    };
    node.addEventListener(eventName, listener);
    return () => node.removeEventListener(eventName, listener);
  }, [eventName]);

  return ref;
}
