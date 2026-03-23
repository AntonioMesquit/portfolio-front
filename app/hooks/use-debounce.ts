"use client";

import { useState, useEffect } from "react";

/**
 * Retorna um valor com delay (debounce).
 * Útil para campos de busca que disparam requisições.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
