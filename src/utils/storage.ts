/** Thin, defensive wrapper around localStorage / sessionStorage. Never throws. */
export const KEYS = {
  users: 'shopease:users',
  session: 'shopease:session',
  cart: 'shopease:cart',
  wishlist: 'shopease:wishlist',
  orders: 'shopease:orders',
  newsletter: 'shopease:newsletter',
} as const;

const PREFIX = 'shopease:';

export type StorageArea = 'local' | 'session';

function area(kind: StorageArea): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export const ownedKey = (base: string, owner: string) => `${base}:${owner}`;

export function readJSON<T>(
  key: string,
  fallback: T,
  validate?: (value: unknown) => value is T,
  kind: StorageArea = 'local',
): T {
  const store = area(kind);
  if (!store) return fallback;
  try {
    const raw = store.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (validate && !validate(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown, kind: StorageArea = 'local'): boolean {
  try {
    const store = area(kind);
    if (!store) return false;
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string, kind: StorageArea = 'local'): void {
  try {
    area(kind)?.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Remove every ShopEase key from both local and session storage. */
export function clearAppData(): void {
  (['local', 'session'] as const).forEach((kind) => {
    const store = area(kind);
    if (!store) return;
    const doomed: string[] = [];
    for (let i = 0; i < store.length; i += 1) {
      const k = store.key(i);
      if (k && k.startsWith(PREFIX)) doomed.push(k);
    }
    doomed.forEach((k) => store.removeItem(k));
  });
}
