"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Hook to persist state in localStorage.
 *
 * - Returns the initial value during SSR / first render.
 * - Reads the stored value from localStorage on mount.
 * - Writes back to localStorage whenever the state changes.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        setValue(JSON.parse(item) as T);
      }
    } catch {
      console.error(`Failed to read localStorage key "${key}".`);
    }
  }, [key]);

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof newValue === "function" ? (newValue as (prev: T) => T)(prev) : newValue;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          console.error(`Failed to write localStorage key "${key}".`);
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, setStoredValue] as const;
}
