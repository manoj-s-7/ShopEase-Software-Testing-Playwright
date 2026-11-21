import type { CartItem, Order, ProductSummary, Session, StoredUser } from '../types';

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export function isCartItem(v: unknown): v is CartItem {
  return (
    isRecord(v) &&
    isNum(v.productId) &&
    isStr(v.title) &&
    isStr(v.thumbnail) &&
    isNum(v.price) &&
    isNum(v.discountPercentage) &&
    isNum(v.quantity) &&
    v.quantity >= 1 &&
    isNum(v.stock) &&
    isStr(v.category)
  );
}
export const isCartItemArray = (v: unknown): v is CartItem[] => Array.isArray(v) && v.every(isCartItem);

export function isProductSummary(v: unknown): v is ProductSummary {
  return (
    isRecord(v) &&
    isNum(v.id) &&
    isStr(v.title) &&
    isStr(v.thumbnail) &&
    isNum(v.price) &&
    isNum(v.discountPercentage) &&
    isNum(v.rating) &&
    isNum(v.stock) &&
    isStr(v.category)
  );
}
export const isProductSummaryArray = (v: unknown): v is ProductSummary[] =>
  Array.isArray(v) && v.every(isProductSummary);

export function isStoredUser(v: unknown): v is StoredUser {
  return (
    isRecord(v) &&
    isStr(v.id) &&
    isStr(v.name) &&
    isStr(v.email) &&
    isStr(v.passwordHash) &&
    isStr(v.createdAt) &&
    isStr(v.phone) &&
    isStr(v.address)
  );
}
export const isStoredUserArray = (v: unknown): v is StoredUser[] => Array.isArray(v) && v.every(isStoredUser);

export const isSession = (v: unknown): v is Session => isRecord(v) && isStr(v.userId);

export function isOrder(v: unknown): v is Order {
  return (
    isRecord(v) &&
    isStr(v.id) &&
    isStr(v.userId) &&
    isStr(v.createdAt) &&
    (v.status === 'Processing' || v.status === 'Shipped' || v.status === 'Delivered') &&
    (v.paymentMethod === 'cod' || v.paymentMethod === 'card') &&
    isCartItemArray(v.items) &&
    isRecord(v.delivery) &&
    isRecord(v.totals) &&
    isNum(v.totals.total)
  );
}
export const isOrderArray = (v: unknown): v is Order[] => Array.isArray(v) && v.every(isOrder);

export const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);
