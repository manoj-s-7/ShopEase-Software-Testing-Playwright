import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import type { ProductSummary } from '../types';
import { useOwnedStorage } from '../hooks/useOwnedStorage';
import { isProductSummaryArray } from '../utils/guards';
import { KEYS } from '../utils/storage';
import { useAuth } from './AuthContext';

export type ToggleResult = 'added' | 'removed' | 'unauthenticated';

interface WishlistContextValue {
  items: ProductSummary[];
  has: (productId: number) => boolean;
  toggle: (product: ProductSummary) => ToggleResult;
  remove: (productId: number) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const EMPTY: ProductSummary[] = [];

/** Wishlists belong to signed-in accounts; guests see an empty list. */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [stored, setItems] = useOwnedStorage<ProductSummary[]>(
    KEYS.wishlist,
    user?.id ?? 'none',
    EMPTY,
    isProductSummaryArray,
  );
  const items = user ? stored : EMPTY;

  const has = useCallback((id: number) => items.some((i) => i.id === id), [items]);

  const toggle = useCallback(
    (product: ProductSummary): ToggleResult => {
      if (!user) return 'unauthenticated';
      const exists = items.some((i) => i.id === product.id);
      setItems((prev) =>
        prev.some((i) => i.id === product.id) ? prev.filter((i) => i.id !== product.id) : [...prev, product],
      );
      return exists ? 'removed' : 'added';
    },
    [user, items, setItems],
  );

  const remove = useCallback(
    (id: number) => setItems((prev) => prev.filter((i) => i.id !== id)),
    [setItems],
  );

  const value = useMemo(() => ({ items, has, toggle, remove }), [items, has, toggle, remove]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
