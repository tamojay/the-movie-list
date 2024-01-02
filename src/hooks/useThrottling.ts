import { useRef, useCallback } from "react";

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  const lastCall = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>): ReturnType<T> | undefined => {
      const now = new Date().getTime();
      if (now - lastCall.current < delay) {
        return;
      }
      lastCall.current = now;
      return callback(...args);
    },
    [callback, delay]
  );
}
