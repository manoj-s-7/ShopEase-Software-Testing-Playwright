import type { CartItem, ProductSummary, Totals } from '../types';

export const MAX_QUANTITY = 10;
export const FREE_SHIPPING_THRESHOLD = 100;
export const FLAT_SHIPPING = 9.99;

const toCents = (n: number) => Math.round(n * 100);

/** Unit price after discount, rounded to the nearest cent. */
export function discountedUnitPrice(price: number, discountPercentage: number): number {
  const pct = Math.min(Math.max(discountPercentage || 0, 0), 100);
  return Math.round(price * 100 * (1 - pct / 100)) / 100;
}

/** Highest quantity a shopper can add for a product (stock-aware, capped). */
export function maxQuantityFor(stock: number): number {
  return Math.max(0, Math.min(MAX_QUANTITY, Math.floor(stock)));
}

export function clampQuantity(quantity: number, stock: number): number {
  const max = Math.max(1, maxQuantityFor(stock));
  const q = Number.isFinite(quantity) ? Math.floor(quantity) : 1;
  return Math.min(Math.max(1, q), max);
}

type Priced = Pick<CartItem, 'price' | 'discountPercentage' | 'quantity'>;

/**
 * All money maths is done in integer cents to avoid floating point drift.
 * Shipping is free when the discounted items total is at least FREE_SHIPPING_THRESHOLD.
 */
export function calculateTotals(items: Priced[]): Totals {
  let subtotalC = 0;
  let finalC = 0;
  let itemCount = 0;
  for (const item of items) {
    subtotalC += toCents(item.price) * item.quantity;
    finalC += toCents(discountedUnitPrice(item.price, item.discountPercentage)) * item.quantity;
    itemCount += item.quantity;
  }
  const shippingC =
    items.length === 0 || finalC >= toCents(FREE_SHIPPING_THRESHOLD) ? 0 : toCents(FLAT_SHIPPING);
  return {
    itemCount,
    subtotal: subtotalC / 100,
    discount: (subtotalC - finalC) / 100,
    shipping: shippingC / 100,
    total: (finalC + shippingC) / 100,
  };
}

export function lineTotal(item: Priced): number {
  return Math.round(toCents(discountedUnitPrice(item.price, item.discountPercentage)) * item.quantity) / 100;
}

export function toCartItem(product: ProductSummary, quantity: number): CartItem {
  return {
    productId: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    quantity,
    stock: product.stock,
    category: product.category,
    brand: product.brand,
  };
}

/** Remaining spend needed to unlock free shipping (0 when already free). */
export function amountToFreeShipping(items: Priced[]): number {
  if (items.length === 0) return 0;
  const finalC = items.reduce(
    (sum, i) => sum + toCents(discountedUnitPrice(i.price, i.discountPercentage)) * i.quantity,
    0,
  );
  return Math.max(0, toCents(FREE_SHIPPING_THRESHOLD) - finalC) / 100;
}
