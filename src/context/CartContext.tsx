import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import type { CartItem, ProductSummary, Totals } from '../types';
import { useOwnedStorage } from '../hooks/useOwnedStorage';
import { calculateTotals, clampQuantity, maxQuantityFor, toCartItem } from '../utils/calculations';
import { isCartItemArray } from '../utils/guards';
import { KEYS } from '../utils/storage';
import { useAuth } from './AuthContext';

export type AddResult = 'added' | 'limit' | 'out-of-stock';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  totals: Totals;
  addItem: (product: ProductSummary, quantity?: number) => AddResult;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const EMPTY: CartItem[] = [];

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useOwnedStorage<CartItem[]>(KEYS.cart, user?.id ?? 'guest', EMPTY, isCartItemArray);

  const addItem = useCallback(
    (product: ProductSummary, quantity = 1): AddResult => {
      const max = maxQuantityFor(product.stock);
      if (max < 1) return 'out-of-stock';
      const existing = items.find((i) => i.productId === product.id);
      const desired = (existing?.quantity ?? 0) + Math.max(1, Math.floor(quantity));
      const next = Math.min(desired, max);
      setItems((prev) =>
        prev.some((i) => i.productId === product.id)
          ? prev.map((i) => (i.productId === product.id ? { ...toCartItem(product, next) } : i))
          : [...prev, toCartItem(product, next)],
      );
      return desired > max ? 'limit' : 'added';
    },
    [items, setItems],
  );

  const removeItem = useCallback(
    (productId: number) => setItems((prev) => prev.filter((i) => i.productId !== productId)),
    [setItems],
  );

  const setQuantity = useCallback(
    (productId: number, quantity: number) =>
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity: clampQuantity(quantity, i.stock) } : i)),
      ),
    [setItems],
  );

  const clear = useCallback(() => setItems(() => []), [setItems]);
  const totals = useMemo(() => calculateTotals(items), [items]);

  const value = useMemo(
    () => ({ items, itemCount: totals.itemCount, totals, addItem, removeItem, setQuantity, clear }),
    [items, totals, addItem, removeItem, setQuantity, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
