/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, Dispatch, SetStateAction } from 'react';

const STORAGE_PREFIX = 'pulsefit:v1:';

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    // Storage blocked (private mode) or corrupted JSON: fall back to defaults
    return fallback;
  }
}

/**
 * Drop-in replacement for useState that saves the value to localStorage,
 * so it survives page refreshes.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const fallback =
      typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    return readStored(key, fallback);
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch {
      // Quota exceeded or storage unavailable: keep working in-memory
    }
  }, [key, value]);

  return [value, setValue];
}

/** Removes every saved PulseFit value (used by "Reset data"). */
export function clearPersistentState() {
  try {
    Object.keys(window.localStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX))
      .forEach(k => window.localStorage.removeItem(k));
  } catch {
    // Nothing to clear
  }
}
