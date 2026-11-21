/** Simulated "backend" on top of localStorage: users, sessions, orders, newsletter. */
import type { CartItem, Order, OrderStatus, StoredUser } from '../types';
import { clampQuantity } from '../utils/calculations';
import {
  isCartItemArray,
  isOrderArray,
  isSession,
  isStoredUserArray,
  isStringArray,
} from '../utils/guards';
import { KEYS, clearAppData, ownedKey, readJSON, removeKey, writeJSON } from '../utils/storage';

export const DEMO_USER = {
  email: 'demo@shopease.test',
  password: 'Demo@1234',
  name: 'Demo Shopper',
} as const;

/** Demo-only hashing (cyrb53 + salt). NOT secure - this app has no real backend. */
export function hashPassword(password: string): string {
  const str = `shopease::${password}`;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i += 1) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

/* ------------------------------- users --------------------------------- */

export const getUsers = (): StoredUser[] => readJSON<StoredUser[]>(KEYS.users, [], isStoredUserArray);
export const saveUsers = (users: StoredUser[]) => writeJSON(KEYS.users, users);

export function seedDemoUsers(): void {
  const existing = readJSON<StoredUser[] | null>(KEYS.users, null, isStoredUserArray);
  if (existing !== null) return;
  writeJSON(KEYS.users, [
    {
      id: 'u_demo',
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      phone: '',
      address: '',
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(DEMO_USER.password),
    } satisfies StoredUser,
  ]);
}

export function resetDemoData(): void {
  clearAppData();
  seedDemoUsers();
}

export const newId = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* ------------------------------- session ------------------------------- */

export function getSessionUserId(): string | null {
  const fromSession = readJSON<{ userId: string } | null>(KEYS.session, null, isSession, 'session');
  if (fromSession) return fromSession.userId;
  const fromLocal = readJSON<{ userId: string } | null>(KEYS.session, null, isSession, 'local');
  return fromLocal?.userId ?? null;
}

/** "Remember me" keeps the session in localStorage; otherwise it lives for the browser session only. */
export function setSession(userId: string, remember: boolean): void {
  clearSession();
  writeJSON(KEYS.session, { userId }, remember ? 'local' : 'session');
}

export function clearSession(): void {
  removeKey(KEYS.session, 'local');
  removeKey(KEYS.session, 'session');
}

/* ------------------------------- cart merge ---------------------------- */

/** When a guest signs in, fold their guest cart into the account's cart. */
export function mergeGuestCart(userId: string): void {
  const guestKey = ownedKey(KEYS.cart, 'guest');
  const guest = readJSON<CartItem[]>(guestKey, [], isCartItemArray);
  if (guest.length === 0) {
    removeKey(guestKey);
    return;
  }
  const userKey = ownedKey(KEYS.cart, userId);
  const merged = [...readJSON<CartItem[]>(userKey, [], isCartItemArray)];
  for (const g of guest) {
    const idx = merged.findIndex((m) => m.productId === g.productId);
    if (idx >= 0) {
      merged[idx] = { ...merged[idx], quantity: clampQuantity(merged[idx].quantity + g.quantity, g.stock) };
    } else {
      merged.push(g);
    }
  }
  writeJSON(userKey, merged);
  removeKey(guestKey);
}

/* ------------------------------- orders -------------------------------- */

export function getOrders(userId: string): Order[] {
  return readJSON<Order[]>(ownedKey(KEYS.orders, userId), [], isOrderArray)
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const getOrder = (userId: string, orderId: string): Order | undefined =>
  getOrders(userId).find((o) => o.id === orderId);

export function generateOrderId(existing: string[]): string {
  for (let i = 0; i < 20; i += 1) {
    const id = `SE-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296)
      .toString(36)
      .toUpperCase()
      .padStart(2, '0')}`;
    if (!existing.includes(id)) return id;
  }
  return `SE-${Date.now().toString(36).toUpperCase()}X${existing.length}`;
}

export function saveOrder(order: Order): boolean {
  const key = ownedKey(KEYS.orders, order.userId);
  const list = readJSON<Order[]>(key, [], isOrderArray);
  return writeJSON(key, [order, ...list]);
}

export function updateOrderStatus(userId: string, orderId: string, status: OrderStatus): void {
  const key = ownedKey(KEYS.orders, userId);
  const list = readJSON<Order[]>(key, [], isOrderArray);
  writeJSON(
    key,
    list.map((o) => (o.id === orderId ? { ...o, status } : o)),
  );
}

/* ------------------------------- newsletter ---------------------------- */

export function subscribeNewsletter(email: string): 'subscribed' | 'already' {
  const normalized = email.trim().toLowerCase();
  const list = readJSON<string[]>(KEYS.newsletter, [], isStringArray);
  if (list.includes(normalized)) return 'already';
  writeJSON(KEYS.newsletter, [...list, normalized]);
  return 'subscribed';
}
