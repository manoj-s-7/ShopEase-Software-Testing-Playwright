import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AuthResult, StoredUser, User } from '../types';
import {
  clearSession,
  getSessionUserId,
  getUsers,
  hashPassword,
  mergeGuestCart,
  newId,
  saveUsers,
  seedDemoUsers,
  setSession,
} from '../services/db';
import { MESSAGES } from '../utils/validation';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  register: (input: RegisterInput) => AuthResult;
  login: (email: string, password: string, remember: boolean) => AuthResult;
  logout: () => void;
  updateProfile: (patch: { name: string; phone: string; address: string }) => AuthResult;
  changePassword: (current: string, next: string) => AuthResult;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toPublic(stored: StoredUser): User {
  const { passwordHash: _hash, ...user } = stored;
  return user;
}

function loadSessionUser(): User | null {
  seedDemoUsers();
  const id = getSessionUserId();
  if (!id) return null;
  const found = getUsers().find((u) => u.id === id);
  if (!found) {
    clearSession();
    return null;
  }
  return toPublic(found);
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSessionUser);

  const register = useCallback((input: RegisterInput): AuthResult => {
    const email = normalizeEmail(input.email);
    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: MESSAGES.duplicateEmail, field: 'email' };
    }
    const created: StoredUser = {
      id: newId('u'),
      name: input.name.trim(),
      email,
      phone: '',
      address: '',
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(input.password),
    };
    saveUsers([...users, created]);
    return { ok: true };
  }, []);

  const login = useCallback((emailInput: string, password: string, remember: boolean): AuthResult => {
    const email = normalizeEmail(emailInput);
    const found = getUsers().find((u) => u.email === email);
    if (!found || found.passwordHash !== hashPassword(password)) {
      return { ok: false, error: MESSAGES.invalidCredentials };
    }
    mergeGuestCart(found.id);
    setSession(found.id, remember);
    setUser(toPublic(found));
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (patch: { name: string; phone: string; address: string }): AuthResult => {
      if (!user) return { ok: false, error: 'You are not signed in.' };
      const users = getUsers();
      const next = users.map((u) =>
        u.id === user.id
          ? { ...u, name: patch.name.trim(), phone: patch.phone.trim(), address: patch.address.trim() }
          : u,
      );
      saveUsers(next);
      const updated = next.find((u) => u.id === user.id);
      if (updated) setUser(toPublic(updated));
      return { ok: true };
    },
    [user],
  );

  const changePassword = useCallback(
    (current: string, nextPassword: string): AuthResult => {
      if (!user) return { ok: false, error: 'You are not signed in.' };
      const users = getUsers();
      const me = users.find((u) => u.id === user.id);
      if (!me || me.passwordHash !== hashPassword(current)) {
        return { ok: false, error: MESSAGES.wrongCurrentPassword, field: 'currentPassword' };
      }
      saveUsers(users.map((u) => (u.id === me.id ? { ...u, passwordHash: hashPassword(nextPassword) } : u)));
      return { ok: true };
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, register, login, logout, updateProfile, changePassword }),
    [user, register, login, logout, updateProfile, changePassword],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
