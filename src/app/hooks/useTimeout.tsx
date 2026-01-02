import { useCallback, useRef } from 'react';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTimeout<T extends (...args: any[]) => unknown>(callback: T, interval: number): T {
  const timeout = useRef<NodeJS.Timeout>(null);

  const handler = useCallback((...args: unknown[]) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      callback(...args);
    }, interval);

  }, [interval, callback]);

  return handler as unknown as T;
};
