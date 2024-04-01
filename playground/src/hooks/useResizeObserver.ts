import { useLatest } from "ahooks";
import { useEffect, useRef } from "react";

export function useResizeObserver<T extends HTMLElement>(
  callback: ResizeObserverCallback,
  options?: ResizeObserverOptions,
): React.RefObject<T> {
  const ref = useRef<T>(null);
  const callbackRef = useLatest(callback);

  useEffect(() => {
    const { current } = ref;

    if (!current) {
      return;
    }

    const cb: ResizeObserverCallback = (entries, observer) => {
      return callbackRef.current(entries, observer);
    };

    const observer = new ResizeObserver(cb);
    observer.observe(current, options);

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [options]);

  return ref;
}
