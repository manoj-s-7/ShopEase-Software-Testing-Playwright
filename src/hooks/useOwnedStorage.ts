import { useCallback, useState } from 'react';
import { ownedKey, readJSON, writeJSON } from '../utils/storage';

/**
 * State that is persisted to localStorage under `${baseKey}:${owner}`.
 * When `owner` changes (login / logout) the state is re-read for the new owner,
 * so carts and wishlists of different accounts never mix.
 */
export function useOwnedStorage<T>(
  baseKey: string,
  owner: string,
  fallback: T,
  validate: (value: unknown) => value is T,
) {
  const key = ownedKey(baseKey, owner);
  const [state, setState] = useState(() => ({ key, value: readJSON<T>(key, fallback, validate) }));

  let current = state;
  if (state.key !== key) {
    current = { key, value: readJSON<T>(key, fallback, validate) };
    setState(current);
  }

  const update = useCallback(
    (updater: (prev: T) => T) => {
      setState((prev) => {
        const base = prev.key === key ? prev.value : readJSON<T>(key, fallback, validate);
        const next = updater(base);
        writeJSON(key, next);
        return { key, value: next };
      });
    },
    // fallback/validate are stable module-level values at every call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [current.value, update] as const;
}
