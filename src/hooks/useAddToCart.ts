import { useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import type { ProductSummary } from '../types';

export function useAddToCart() {
  const { addItem } = useCart();
  const { notify } = useToast();
  return useCallback(
    (product: ProductSummary, quantity = 1) => {
      const result = addItem(product, quantity);
      if (result === 'added') notify('Added to your cart.');
      else if (result === 'limit') notify('You have reached the maximum quantity for this item.', 'warning');
      else notify('This product is out of stock.', 'error');
      return result;
    },
    [addItem, notify],
  );
}
